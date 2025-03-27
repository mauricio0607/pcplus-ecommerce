import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerShippingRoutes } from "./shipping";
import { registerAdminRoutes } from "./admin";
import { 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertUserSchema, 
  insertAddressSchema, 
  insertReviewSchema, 
  insertWishlistItemSchema 
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Initialize Mercado Pago SDK
import mercadopago from "mercadopago";

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
if (MERCADO_PAGO_ACCESS_TOKEN) {
  // Using any para evitar erros de tipagem com a API do Mercado Pago
  const mpInstance: any = mercadopago;
  mpInstance.configure({
    access_token: MERCADO_PAGO_ACCESS_TOKEN
  });
}

// JWT secret (in a real app, use an environment variable for this)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-here";

// Authentication middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    // Verify token by checking in the storage
    const session = await storage.getSessionByToken(token);
    if (!session || session.expiresAt < new Date()) {
      if (session) {
        // Token expired, delete it
        await storage.deleteSession(token);
      }
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Add user to request
    const user = await storage.getUser(session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints

  // Auth routes
  
  // Register a new user
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name, phone, document } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "E-mail já está em uso" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        document: document || null,
        role: "customer"
      });
      
      // Create session token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days token
      
      await storage.createSession({
        userId: user.id,
        token,
        expiresAt,
        userAgent: req.headers["user-agent"] || null,
        ipAddress: req.ip || null
      });
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Error registering user:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Falha ao registrar usuário" });
    }
  });
  
  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Credenciais inválidas" });
      }
      
      // Check password - for development only
      let isMatch = false;
      
      // Check if the password is in the SHA-256 format (for our demo users)
      if (user.password.length === 64) {
        // SHA-256 hash for comparison
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        isMatch = hashedPassword === user.password;
      } else {
        // Normal bcrypt check for regular users
        isMatch = await bcrypt.compare(password, user.password);
      }
      
      if (!isMatch) {
        return res.status(400).json({ message: "Credenciais inválidas" });
      }
      
      // Create session token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days token
      
      await storage.createSession({
        userId: user.id,
        token,
        expiresAt,
        userAgent: req.headers["user-agent"] || null,
        ipAddress: req.ip || null
      });
      
      // Update last login time - não podemos alterar lastLogin diretamente
      const updatedUser = await storage.getUser(user.id);
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = updatedUser || user;
      
      return res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Falha ao fazer login" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", authMiddleware, async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      
      if (token) {
        await storage.deleteSession(token);
      }
      
      return res.json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      console.error("Error logging out:", error);
      return res.status(500).json({ message: "Falha ao fazer logout" });
    }
  });
  
  // Get current user profile
  app.get("/api/user/profile", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ message: "Falha ao buscar perfil" });
    }
  });
  
  // Update user profile
  app.put("/api/user/profile", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      const { name, phone, document } = req.body;
      
      // Update user
      const updatedUser = await storage.updateUser(user.id, {
        name: name || user.name,
        phone: phone || user.phone,
        document: document || user.document
      });
      
      // Return user data without password
      const { password, ...userWithoutPassword } = updatedUser || user;
      
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ message: "Falha ao atualizar perfil" });
    }
  });
  
  // Change password
  app.post("/api/user/change-password", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      const { currentPassword, newPassword } = req.body;
      
      // Check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password
      await storage.updateUser(user.id, { password: hashedPassword });
      
      return res.json({ message: "Senha alterada com sucesso" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ message: "Falha ao alterar senha" });
    }
  });
  
  // User addresses
  
  // Get all user addresses
  app.get("/api/user/addresses", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const addresses = await storage.getUserAddresses(user.id);
      return res.json(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return res.status(500).json({ message: "Falha ao buscar endereços" });
    }
  });
  
  // Create a new address
  app.post("/api/user/addresses", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const addressData = insertAddressSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const address = await storage.createAddress(addressData);
      return res.status(201).json(address);
    } catch (error) {
      console.error("Error creating address:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Falha ao criar endereço" });
    }
  });
  
  // Update an address
  app.put("/api/user/addresses/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const addressId = parseInt(req.params.id);
      
      // Check if address exists and belongs to user
      const address = await storage.getAddress(addressId);
      if (!address) {
        return res.status(404).json({ message: "Endereço não encontrado" });
      }
      
      if (address.userId !== user.id) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      
      // Update address
      const updatedAddress = await storage.updateAddress(addressId, req.body);
      return res.json(updatedAddress);
    } catch (error) {
      console.error("Error updating address:", error);
      return res.status(500).json({ message: "Falha ao atualizar endereço" });
    }
  });
  
  // Delete an address
  app.delete("/api/user/addresses/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const addressId = parseInt(req.params.id);
      
      // Check if address exists and belongs to user
      const address = await storage.getAddress(addressId);
      if (!address) {
        return res.status(404).json({ message: "Endereço não encontrado" });
      }
      
      if (address.userId !== user.id) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      
      // Delete address
      await storage.deleteAddress(addressId);
      return res.json({ message: "Endereço excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting address:", error);
      return res.status(500).json({ message: "Falha ao excluir endereço" });
    }
  });
  
  // Set default address
  app.post("/api/user/addresses/:id/default", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const addressId = parseInt(req.params.id);
      
      // Check if address exists and belongs to user
      const address = await storage.getAddress(addressId);
      if (!address) {
        return res.status(404).json({ message: "Endereço não encontrado" });
      }
      
      if (address.userId !== user.id) {
        return res.status(403).json({ message: "Acesso negado" });
      }
      
      // Set as default
      await storage.setDefaultAddress(user.id, addressId);
      
      // Get updated addresses
      const addresses = await storage.getUserAddresses(user.id);
      return res.json(addresses);
    } catch (error) {
      console.error("Error setting default address:", error);
      return res.status(500).json({ message: "Falha ao definir endereço padrão" });
    }
  });
  
  // User orders
  
  // Get all user orders
  app.get("/api/user/orders", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orders = await storage.getUserOrders(user.id);
      
      // Get items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return { ...order, items };
        })
      );
      
      return res.json(ordersWithItems);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return res.status(500).json({ message: "Falha ao buscar pedidos" });
    }
  });
  
  // User wishlist
  
  // Get user wishlist
  app.get("/api/user/wishlist", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const wishlistItems = await storage.getUserWishlist(user.id);
      
      // Get product details for each wishlist item
      const wishlistWithProducts = await Promise.all(
        wishlistItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          const images = product ? await storage.getProductImages(product.id) : [];
          return {
            ...item,
            product: product ? { ...product, images } : null
          };
        })
      );
      
      return res.json(wishlistWithProducts);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return res.status(500).json({ message: "Falha ao buscar lista de desejos" });
    }
  });
  
  // Add product to wishlist
  app.post("/api/user/wishlist", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "ID do produto é obrigatório" });
      }
      
      // Check if product exists
      const product = await storage.getProductById(parseInt(productId));
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      // Add to wishlist
      await storage.addToWishlist({
        userId: user.id,
        productId: parseInt(productId)
      });
      
      return res.status(201).json({ message: "Produto adicionado à lista de desejos" });
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return res.status(500).json({ message: "Falha ao adicionar à lista de desejos" });
    }
  });
  
  // Remove product from wishlist
  app.delete("/api/user/wishlist/:productId", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const productId = parseInt(req.params.productId);
      
      // Remove from wishlist
      await storage.removeFromWishlist(user.id, productId);
      
      return res.json({ message: "Produto removido da lista de desejos" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return res.status(500).json({ message: "Falha ao remover da lista de desejos" });
    }
  });
  
  // Check if product is in wishlist
  app.get("/api/user/wishlist/:productId", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const productId = parseInt(req.params.productId);
      
      const isInWishlist = await storage.isInWishlist(user.id, productId);
      
      return res.json({ isInWishlist });
    } catch (error) {
      console.error("Error checking wishlist:", error);
      return res.status(500).json({ message: "Falha ao verificar lista de desejos" });
    }
  });
  
  // Product reviews
  
  // Get reviews for a product
  app.get("/api/products/:id/reviews", async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Check if product exists
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      const reviews = await storage.getProductReviews(productId);
      
      // Get user details for each review
      const reviewsWithUser = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            user: user ? { id: user.id, name: user.name } : null
          };
        })
      );
      
      return res.json(reviewsWithUser);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Falha ao buscar avaliações" });
    }
  });
  
  // Check if user can review a product
  app.get("/api/products/:id/can-review", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const productId = parseInt(req.params.id);
      
      // Check if product exists
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      // Check if user can review this product
      const canReview = await storage.canReviewProduct(user.id, productId);
      return res.json(canReview);
    } catch (error) {
      console.error("Error checking if user can review:", error);
      return res.status(500).json({ message: "Falha ao verificar permissão de avaliação" });
    }
  });
  
  // Create a review for a product
  app.post("/api/products/:id/reviews", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const productId = parseInt(req.params.id);
      
      // Check if product exists
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      
      // Check if user has ordered this product
      const canReview = await storage.canReviewProduct(user.id, productId);
      if (!canReview) {
        return res.status(403).json({ message: "Você precisa comprar este produto antes de avaliá-lo" });
      }
      
      // Create review
      const { rating, comment, title } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Avaliação deve ser entre 1 e 5" });
      }
      
      // Find the user's order containing this product
      const orders = await storage.getUserOrders(user.id);
      let orderId = null;
      
      for (const order of orders) {
        const items = await storage.getOrderItems(order.id);
        if (items.some(item => item.productId === productId)) {
          orderId = order.id;
          break;
        }
      }
      
      if (!orderId) {
        return res.status(403).json({ message: "Você precisa comprar este produto antes de avaliá-lo" });
      }
      
      const review = await storage.createReview({
        userId: user.id,
        productId,
        orderId,
        rating,
        comment: comment || null,
        title: title || null,
        isVerified: true
      });
      
      return res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      return res.status(500).json({ message: "Falha ao criar avaliação" });
    }
  });
  
  // Get user's reviews
  app.get("/api/user/reviews", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const reviews = await storage.getUserReviews(user.id);
      
      // Get product details for each review
      const reviewsWithProducts = await Promise.all(
        reviews.map(async (review) => {
          const product = await storage.getProductById(review.productId);
          return {
            ...review,
            product: product ? { id: product.id, name: product.name, imageUrl: product.imageUrl } : null
          };
        })
      );
      
      return res.json(reviewsWithProducts);
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      return res.status(500).json({ message: "Falha ao buscar avaliações" });
    }
  });
  
  // User notifications
  
  // Get user notifications
  app.get("/api/user/notifications", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const notifications = await storage.getUserNotifications(user.id);
      return res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ message: "Falha ao buscar notificações" });
    }
  });
  
  // Mark notification as read
  app.put("/api/user/notifications/:id/read", authMiddleware, async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      return res.json({ message: "Notificação marcada como lida" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return res.status(500).json({ message: "Falha ao marcar notificação como lida" });
    }
  });
  
  // Mark all notifications as read
  app.put("/api/user/notifications/read-all", authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      await storage.markAllNotificationsAsRead(user.id);
      return res.json({ message: "Todas as notificações marcadas como lidas" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return res.status(500).json({ message: "Falha ao marcar todas as notificações como lidas" });
    }
  });
  
  // Advanced product search
  app.get("/api/products/search/advanced", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const categoryId = req.query.category ? parseInt(req.query.category as string) : undefined;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const sort = req.query.sort as string;
      
      const products = await storage.searchProductsAdvanced({
        query,
        categoryId,
        minPrice,
        maxPrice,
        sort
      });
      
      return res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      return res.status(500).json({ message: "Falha ao buscar produtos" });
    }
  });
  
  // Get all categories
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      return res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      return res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get products by category
  app.get("/api/categories/:slug/products", async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const products = await storage.getProductsByCategory(category.id);
      return res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get all products with pagination
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const products = await storage.getProducts(limit, offset);
      return res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get featured products
  app.get("/api/products/featured", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      return res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Search products
  app.get("/api/products/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products = await storage.searchProducts(query);
      return res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      return res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Get product images
      const images = await storage.getProductImages(id);
      
      return res.json({
        ...product,
        images
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get product by slug
  app.get("/api/products/slug/:slug", async (req: Request, res: Response) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Get product images
      const images = await storage.getProductImages(product.id);
      
      return res.json({
        ...product,
        images
      });
    } catch (error) {
      console.error("Error fetching product by slug:", error);
      return res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create an order
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Create order items
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const orderItem = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id
          });
          await storage.createOrderItem(orderItem);
          
          // Update product stock
          await storage.updateProductStock(orderItem.productId, -orderItem.quantity);
        }
      }
      
      return res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get an order by ID
  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Get order items
      const items = await storage.getOrderItems(id);
      
      return res.json({
        ...order,
        items
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Create Mercado Pago preference (checkout)
  app.post("/api/payment/preference", async (req: Request, res: Response) => {
    try {
      const { items, buyer, backUrls, orderId } = req.body;
      
      if (!items || !items.length || !buyer || !backUrls || !orderId) {
        return res.status(400).json({ message: "Missing required information" });
      }
      
      const preferenceItems = items.map((item: any) => ({
        id: String(item.id),
        title: item.name,
        unit_price: parseFloat(item.price),
        quantity: item.quantity,
        currency_id: "BRL"
      }));
      
      const preferenceData = {
        items: preferenceItems,
        payer: {
          name: buyer.name,
          email: buyer.email,
          identification: {
            type: "CPF",
            number: buyer.document
          }
        },
        payment_methods: {
          excluded_payment_methods: [],
          installments: 10
        },
        back_urls: {
          success: backUrls.success,
          failure: backUrls.failure,
          pending: backUrls.pending
        },
        auto_return: "approved",
        external_reference: String(orderId),
        notification_url: `${process.env.BASE_URL || "https://example.com"}/api/payment/webhook`
      };
      
      if (!MERCADO_PAGO_ACCESS_TOKEN) {
        console.warn("Mercado Pago access token not set, returning mock preference");
        return res.json({
          id: "mock-preference-id",
          init_point: "#",
          sandbox_init_point: "#"
        });
      }
      
      // Using any tipo para evitar erros de compilação com a API do Mercado Pago
      const mpInstance: any = mercadopago;
      const preference = await mpInstance.preferences.create(preferenceData);
      return res.json(preference.body);
    } catch (error) {
      console.error("Error creating payment preference:", error);
      return res.status(500).json({ message: "Failed to create payment preference" });
    }
  });

  // Generate PIX for payment
  app.post("/api/payment/pix", async (req: Request, res: Response) => {
    try {
      const { amount, buyer, description, orderId } = req.body;
      
      if (!amount || !buyer || !description || !orderId) {
        return res.status(400).json({ message: "Missing required information" });
      }
      
      if (!MERCADO_PAGO_ACCESS_TOKEN) {
        console.warn("Mercado Pago access token not set, returning mock PIX data");
        return res.json({
          id: "mock-payment-id",
          status: "pending",
          point_of_interaction: {
            transaction_data: {
              qr_code: "00020126580014BR.GOV.BCB.PIX0136a629532e-7693-4846-b506-9698b936916952040000530398654041.005802BR5925MERCADOPAGO PAGAMENTO 6008SAOPAULO62070503***63041CC2",
              qr_code_base64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDE2MCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNDAgMEgyMEMxNC42OTU3IDAgOS42MDg2MiAyLjEwNzE0IDUuODU3ODcgNS44NTc4N0MyLjEwNzE0IDkuNjA4NjIgMCAxNC42OTU3IDAgMjBWMTQwQzAgMTQ1LjMwNCAyLjEwNzE0IDE1MC4zOTEgNS44NTc4NyAxNTQuMTQyQzkuNjA4NjIgMTU3Ljg5MyAxNC42OTU3IDE2MCAyMCAxNjBIMTQwQzE0NS4zMDQgMTYwIDE1MC4zOTEgMTU3Ljg5MyAxNTQuMTQyIDE1NC4xNDJDMTU3Ljg5MyAxNTAuMzkxIDE2MCAxNDUuMzA0IDE2MCAxNDBWMjBDMTYwIDE0LjY5NTcgMTU3Ljg5MyA5LjYwODYyIDE1NC4xNDIgNS44NTc4N0MxNTAuMzkxIDIuMTA3MTQgMTQ1LjMwNCAwIDE0MCAwVjBaTTIwIDQwSDE0MFYxMjBIMjBWNDBaIiBmaWxsPSIjRkY2QjAwIi8+CjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgZmlsbD0iI0ZGNkIwMCIvPgo8L3N2Zz4K",
              ticket_url: "#"
            }
          }
        });
      }
      
      // Create a payment using Mercado Pago
      // Using any tipo para evitar erros de compilação com a API do Mercado Pago
      const mpInstance: any = mercadopago;
      const pixPayment = await mpInstance.payment.create({
        transaction_amount: parseFloat(amount),
        description: description,
        payment_method_id: "pix",
        payer: {
          email: buyer.email,
          first_name: buyer.name.split(" ")[0],
          last_name: buyer.name.split(" ").slice(1).join(" "),
          identification: {
            type: "CPF",
            number: buyer.document
          }
        },
        notification_url: `${process.env.BASE_URL || "https://example.com"}/api/payment/webhook`,
        external_reference: String(orderId)
      });
      
      // Update order with payment ID
      await storage.updateOrderPaymentStatus(orderId, pixPayment.body.id, pixPayment.body.status);
      
      return res.json(pixPayment.body);
    } catch (error) {
      console.error("Error generating PIX payment:", error);
      return res.status(500).json({ message: "Failed to generate PIX payment" });
    }
  });

  // Webhook for payment notifications
  app.post("/api/payment/webhook", async (req: Request, res: Response) => {
    try {
      const { data, type } = req.query;
      
      // Only handle payment notifications
      if (type !== "payment") {
        return res.status(200).end();
      }
      
      if (!MERCADO_PAGO_ACCESS_TOKEN) {
        console.warn("Mercado Pago access token not set, skipping webhook handling");
        return res.status(200).end();
      }
      
      // Get payment info
      const paymentId = data as string;
      // Using any tipo para evitar erros de compilação com a API do Mercado Pago
      const mpInstance: any = mercadopago;
      const payment = await mpInstance.payment.get(paymentId);
      
      // Update order status
      const orderId = parseInt(payment.body.external_reference);
      await storage.updateOrderPaymentStatus(orderId, paymentId, payment.body.status);
      
      if (payment.body.status === "approved") {
        await storage.updateOrderStatus(orderId, "paid");
      }
      
      return res.status(200).end();
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(500).end();
    }
  });

  // Registrar rotas de cálculo de frete
  registerShippingRoutes(app);
  
  // Registrar rotas administrativas
  registerAdminRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
