import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  categories, type Category, type InsertCategory,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  productImages, type ProductImage, type InsertProductImage,
  addresses, type Address, type InsertAddress,
  wishlistItems, type WishlistItem, type InsertWishlistItem,
  reviews, type Review, type InsertReview,
  notifications, type Notification, type InsertNotification,
  sessions, type Session, type InsertSession
} from "@shared/schema";

import type { Store } from 'express-session';

export interface IStorage {
  // Session store for express-session
  sessionStore: Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Authentication operations
  createSession(session: InsertSession): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<boolean>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  searchProductsAdvanced(params: {
    query?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: number, stockChange: number): Promise<Product | undefined>;
  
  // Product images operations
  getProductImages(productId: number): Promise<ProductImage[]>;
  addProductImage(image: InsertProductImage): Promise<ProductImage>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  updateOrderPaymentStatus(id: number, paymentId: string, paymentStatus: string): Promise<Order | undefined>;
  updateOrderTracking(id: number, trackingCode: string, trackingUrl: string): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  
  // Order items operations
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Address operations
  getUserAddresses(userId: number): Promise<Address[]>;
  getAddress(id: number): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, addressData: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;
  setDefaultAddress(userId: number, addressId: number): Promise<boolean>;
  
  // Wishlist operations
  getUserWishlist(userId: number): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;
  
  // Review operations
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getUserReviews(userId: number): Promise<Review[]>;
  canReviewProduct(userId: number, productId: number): Promise<boolean>;
  updateProductRating(productId: number): Promise<Product | undefined>;
  
  // Notification operations
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
}

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private productImages: Map<number, ProductImage>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private addresses: Map<number, Address>;
  private wishlistItems: Map<number, WishlistItem>;
  private reviews: Map<number, Review>;
  private notifications: Map<number, Notification>;
  private sessions: Map<string, Session>;
  public sessionStore: Store;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentProductImageId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentAddressId: number;
  private currentWishlistItemId: number;
  private currentReviewId: number;
  private currentNotificationId: number;
  private currentSessionId: number;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.productImages = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.addresses = new Map();
    this.wishlistItems = new Map();
    this.reviews = new Map();
    this.notifications = new Map();
    this.sessions = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentProductImageId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentAddressId = 1;
    this.currentWishlistItemId = 1;
    this.currentReviewId = 1;
    this.currentNotificationId = 1;
    this.currentSessionId = 1;
    
    // Initialize admin user
    const adminUser: User = {
      id: this.currentUserId++,
      name: "Admin",
      email: "admin@pcplus.com",
      password: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9", // "admin123" em SHA-256
      role: "admin",
      phone: null,
      document: null,
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    };
    this.users.set(adminUser.id, adminUser);
    
    // Initialize customer user
    const customerUser: User = {
      id: this.currentUserId++,
      name: "Cliente",
      email: "cliente@exemplo.com",
      password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", // "password" em SHA-256
      role: "customer",
      phone: "(11) 98765-4321",
      document: "123.456.789-00",
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    };
    this.users.set(customerUser.id, customerUser);
    
    // Initialize with default data
    this.initializeCategories();
    this.initializeProducts();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.getUserByEmail(username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    
    // Garantir que todos os campos opcionais tenham valores padrão
    const user: User = { 
      id,
      email: insertUser.email,
      password: insertUser.password,
      name: insertUser.name,
      phone: insertUser.phone ?? null,
      document: insertUser.document ?? null,
      role: insertUser.role ?? null,
      createdAt, 
      lastLogin: null, 
      isActive: true 
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Authentication operations
  async createSession(session: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const createdAt = new Date();
    const newSession: Session = { 
      ...session, 
      id, 
      createdAt,
      userAgent: session.userAgent || null,
      ipAddress: session.ipAddress || null
    };
    this.sessions.set(session.token, newSession);
    return newSession;
  }
  
  async getSessionByToken(token: string): Promise<Session | undefined> {
    return this.sessions.get(token);
  }
  
  async deleteSession(token: string): Promise<boolean> {
    return this.sessions.delete(token);
  }
  
  // Address operations
  async getUserAddresses(userId: number): Promise<Address[]> {
    return Array.from(this.addresses.values()).filter(
      (address) => address.userId === userId
    );
  }
  
  async getAddress(id: number): Promise<Address | undefined> {
    return this.addresses.get(id);
  }
  
  async createAddress(address: InsertAddress): Promise<Address> {
    const id = this.currentAddressId++;
    const newAddress: Address = { 
      ...address, 
      id,
      complement: address.complement || null,
      isDefault: address.isDefault || null
    };
    this.addresses.set(id, newAddress);
    
    // If this is the default address, unset any existing default
    if (address.isDefault) {
      await this.setDefaultAddress(address.userId, id);
    }
    
    return newAddress;
  }
  
  async updateAddress(id: number, addressData: Partial<InsertAddress>): Promise<Address | undefined> {
    const address = this.addresses.get(id);
    if (!address) return undefined;
    
    const updatedAddress = { ...address, ...addressData };
    this.addresses.set(id, updatedAddress);
    
    // If updated to be default, unset any existing default
    if (addressData.isDefault) {
      await this.setDefaultAddress(address.userId, id);
    }
    
    return updatedAddress;
  }
  
  async deleteAddress(id: number): Promise<boolean> {
    return this.addresses.delete(id);
  }
  
  async setDefaultAddress(userId: number, addressId: number): Promise<boolean> {
    // First, unset all default addresses for this user
    const userAddresses = await this.getUserAddresses(userId);
    for (const address of userAddresses) {
      if (address.id !== addressId && address.isDefault) {
        const updatedAddress = { ...address, isDefault: false };
        this.addresses.set(address.id, updatedAddress);
      }
    }
    
    // Set the specified address as default
    const address = this.addresses.get(addressId);
    if (!address) return false;
    
    const updatedAddress = { ...address, isDefault: true };
    this.addresses.set(addressId, updatedAddress);
    return true;
  }
  
  // Advanced product search
  async searchProductsAdvanced(params: {
    query?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    // Filter by query
    if (params.query) {
      const lowercaseQuery = params.query.toLowerCase();
      products = products.filter(
        (product) => 
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Filter by category
    if (params.categoryId) {
      products = products.filter(
        (product) => product.categoryId === params.categoryId
      );
    }
    
    // Filter by price range
    if (params.minPrice !== undefined) {
      products = products.filter(
        (product) => parseFloat(product.price) >= params.minPrice!
      );
    }
    
    if (params.maxPrice !== undefined) {
      products = products.filter(
        (product) => parseFloat(product.price) <= params.maxPrice!
      );
    }
    
    // Sort results
    if (params.sort) {
      switch (params.sort) {
        case 'price_asc':
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price_desc':
          products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'name_asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating_desc':
          products.sort((a, b) => (parseFloat(b.rating || "0") - parseFloat(a.rating || "0")));
          break;
        case 'newest':
          // In a real DB we would have a createdAt field, but here we'll use the ID as a proxy
          products.sort((a, b) => b.id - a.id);
          break;
      }
    }
    
    return products;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product operations
  async getProducts(limit = 100, offset = 0): Promise<Product[]> {
    return Array.from(this.products.values())
      .slice(offset, offset + limit);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured === true
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      oldPrice: insertProduct.oldPrice || null,
      discountPercentage: insertProduct.discountPercentage || null,
      stock: insertProduct.stock || 0,
      featured: insertProduct.featured || false,
      rating: insertProduct.rating || "0.0",
      reviewCount: insertProduct.reviewCount || 0
    };
    this.products.set(id, product);
    return product;
  }

  async updateProductStock(id: number, stockChange: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { 
      ...product, 
      stock: product.stock + stockChange 
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  // Product images operations
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return Array.from(this.productImages.values()).filter(
      (image) => image.productId === productId
    );
  }

  async addProductImage(insertImage: InsertProductImage): Promise<ProductImage> {
    const id = this.currentProductImageId++;
    const image: ProductImage = { 
      ...insertImage, 
      id,
      isPrimary: insertImage.isPrimary || false
    };
    this.productImages.set(id, image);
    return image;
  }
  
  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const createdAt = new Date();
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt,
      updatedAt: null,
      status: insertOrder.status || "pending",
      userId: insertOrder.userId || null,
      paymentId: insertOrder.paymentId || null,
      paymentStatus: insertOrder.paymentStatus || "pending",
      trackingCode: insertOrder.trackingCode || null,
      trackingUrl: insertOrder.trackingUrl || null,
      notes: insertOrder.notes || null,
      invoiceUrl: insertOrder.invoiceUrl || null
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async updateOrderPaymentStatus(
    id: number, 
    paymentId: string, 
    paymentStatus: string
  ): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      paymentId, 
      paymentStatus,
      updatedAt: new Date() 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async updateOrderTracking(
    id: number, 
    trackingCode: string, 
    trackingUrl: string
  ): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      trackingCode, 
      trackingUrl,
      updatedAt: new Date() 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  // Order items operations
  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  // Wishlist operations
  async getUserWishlist(userId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    // Check if already exists
    const existingItem = Array.from(this.wishlistItems.values()).find(
      (wishlistItem) => wishlistItem.userId === item.userId && wishlistItem.productId === item.productId
    );
    
    if (existingItem) {
      return existingItem;
    }
    
    const id = this.currentWishlistItemId++;
    const addedAt = new Date();
    const wishlistItem: WishlistItem = { ...item, id, addedAt };
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }
  
  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const item = Array.from(this.wishlistItems.values()).find(
      (wishlistItem) => wishlistItem.userId === userId && wishlistItem.productId === productId
    );
    
    if (!item) return false;
    
    return this.wishlistItems.delete(item.id);
  }
  
  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    return Array.from(this.wishlistItems.values()).some(
      (wishlistItem) => wishlistItem.userId === userId && wishlistItem.productId === productId
    );
  }
  
  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const createdAt = new Date();
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt,
      comment: insertReview.comment || null,
      title: insertReview.title || null,
      isVerified: insertReview.isVerified || false
    };
    this.reviews.set(id, review);
    
    // Update product rating
    await this.updateProductRating(insertReview.productId);
    
    return review;
  }
  
  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.userId === userId
    );
  }
  
  async canReviewProduct(userId: number, productId: number): Promise<boolean> {
    // Check if the user has ordered this product
    const orders = await this.getUserOrders(userId);
    
    for (const order of orders) {
      const orderItems = await this.getOrderItems(order.id);
      if (orderItems.some(item => item.productId === productId)) {
        // Check if user has already reviewed this product
        const existingReview = Array.from(this.reviews.values()).find(
          (review) => review.userId === userId && review.productId === productId
        );
        
        return existingReview === undefined;
      }
    }
    
    return false;
  }
  
  async updateProductRating(productId: number): Promise<Product | undefined> {
    const product = this.products.get(productId);
    if (!product) return undefined;
    
    const reviews = await this.getProductReviews(productId);
    if (reviews.length === 0) {
      const updatedProduct = { 
        ...product, 
        rating: "0.0", 
        reviewCount: 0 
      };
      this.products.set(productId, updatedProduct);
      return updatedProduct;
    }
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);
    
    const updatedProduct = {
      ...product,
      rating: averageRating,
      reviewCount: reviews.length
    };
    
    this.products.set(productId, updatedProduct);
    return updatedProduct;
  }
  
  // Notification operations
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const createdAt = new Date();
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      createdAt,
      isRead: false,
      link: insertNotification.link || null,
      relatedId: insertNotification.relatedId || null
    };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return true;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const userNotifications = await this.getUserNotifications(userId);
    
    for (const notification of userNotifications) {
      if (!notification.isRead) {
        const updatedNotification = { ...notification, isRead: true };
        this.notifications.set(notification.id, updatedNotification);
      }
    }
    
    return true;
  }
  
  // Helper methods for initialization
  private initializeCategories() {
    const categories: InsertCategory[] = [
      {
        name: "Computadores",
        slug: "computadores",
        icon: "computer"
      },
      {
        name: "Notebooks",
        slug: "notebooks",
        icon: "laptop"
      },
      {
        name: "Periféricos",
        slug: "perifericos",
        icon: "mouse"
      },
      {
        name: "Hardware",
        slug: "hardware",
        icon: "cpu"
      },
      {
        name: "Redes",
        slug: "redes",
        icon: "wifi"
      }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
  }
  
  private initializeProducts() {
    const products: InsertProduct[] = [
      {
        name: "Notebook Pro X",
        slug: "notebook-pro-x",
        description: "O Notebook Pro X é a escolha perfeita para profissionais e entusiastas que buscam alto desempenho e confiabilidade. Com processador Intel Core i7 de última geração, 16GB de memória RAM e SSD de 512GB, ele oferece velocidade excepcional para qualquer tarefa.",
        price: "4999.00",
        oldPrice: "5899.00",
        discountPercentage: 15,
        imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
        categoryId: 2,
        stock: 25,
        featured: true,
        specs: "Processador: Intel Core i7-11800H\nMemória RAM: 16GB DDR4 3200MHz\nArmazenamento: SSD 512GB NVMe\nTela: 15.6\" Full HD IPS (1920 x 1080)\nPlaca de Vídeo: NVIDIA GeForce RTX 3050 4GB GDDR6\nSistema Operacional: Windows 11 Pro\nBateria: 4 células, 65Wh\nPeso: 1,8kg",
        sku: "NB-PRO-X-2023",
        rating: "4.5",
        reviewCount: 120
      },
      {
        name: "Mouse Gamer RGB",
        slug: "mouse-gamer-rgb",
        description: "Mouse gamer de alta precisão com sensor óptico de 12000 DPI e 8 botões programáveis. Iluminação RGB customizável e design ergonômico para longas sessões de jogo.",
        price: "159.90",
        oldPrice: null,
        discountPercentage: null,
        imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
        categoryId: 3,
        stock: 50,
        featured: true,
        specs: "Sensor: Óptico\nDPI: até 12000\nBotões: 8 programáveis\nIluminação: RGB\nConexão: USB\nCabo: 1,8m trançado",
        sku: "MS-GMR-RGB-01",
        rating: "5.0",
        reviewCount: 85
      },
      {
        name: "Teclado Mecânico",
        slug: "teclado-mecanico",
        description: "Teclado mecânico com switches Blue, iluminação RGB e formato ABNT2. Ideal para gamers e profissionais que buscam precisão e durabilidade.",
        price: "299.90",
        oldPrice: "379.90",
        discountPercentage: 20,
        imageUrl: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605",
        categoryId: 3,
        stock: 30,
        featured: true,
        specs: "Switches: Blue\nLayout: ABNT2\nIluminação: RGB\nAnti-Ghosting: Sim\nMacros: Sim\nMaterial: Alumínio e plástico ABS",
        sku: "KB-MEC-RGB-02",
        rating: "4.0",
        reviewCount: 42
      },
      {
        name: "Monitor Ultra HD",
        slug: "monitor-ultra-hd",
        description: "Monitor de 32 polegadas com resolução 4K, taxa de atualização de 144Hz e suporte a HDR. Cores vibrantes e tempo de resposta ultrarrápido para uma experiência visual imersiva.",
        price: "2599.00",
        oldPrice: null,
        discountPercentage: null,
        imageUrl: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96",
        categoryId: 3,
        stock: 15,
        featured: true,
        specs: "Tamanho: 32\"\nResolução: 4K (3840 x 2160)\nTaxa de atualização: 144Hz\nTempo de resposta: 1ms\nConexões: HDMI 2.1, DisplayPort 1.4\nCompatível com: HDR10, FreeSync Premium",
        sku: "MN-4K-32-HDR",
        rating: "3.5",
        reviewCount: 28
      }
    ];
    
    products.forEach(product => {
      this.createProduct(product);
    });
    
    // Add product images
    const productImages: InsertProductImage[] = [
      { productId: 1, imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302", isPrimary: true },
      { productId: 1, imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed", isPrimary: false },
      { productId: 1, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853", isPrimary: false },
      { productId: 1, imageUrl: "https://images.unsplash.com/photo-1609240873846-55c9846b7087", isPrimary: false },
      { productId: 2, imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7", isPrimary: true },
      { productId: 3, imageUrl: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605", isPrimary: true },
      { productId: 4, imageUrl: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96", isPrimary: true }
    ];
    
    productImages.forEach(image => {
      this.addProductImage(image);
    });
  }
}

import { Pool } from '@neondatabase/serverless';
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  private pool: Pool;
  public sessionStore: session.SessionStore;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
    
    this.sessionStore = new PostgresSessionStore({
      pool: this.pool,
      createTableIfMissing: true
    });
    
    this.setupTables().catch(err => {
      console.error("Error setting up database tables:", err);
    });
  }
  
  private async setupTables() {
    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          document VARCHAR(20),
          role VARCHAR(20) NOT NULL DEFAULT 'customer',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS sessions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          user_agent TEXT,
          ip_address VARCHAR(45),
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          image_url TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          old_price DECIMAL(10, 2),
          stock INTEGER NOT NULL DEFAULT 0,
          category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
          featured BOOLEAN DEFAULT FALSE,
          rating DECIMAL(3, 2) DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS product_images (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          url TEXT NOT NULL,
          alt VARCHAR(255),
          order_num INTEGER DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS addresses (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          street VARCHAR(255) NOT NULL,
          number VARCHAR(20) NOT NULL,
          complement VARCHAR(255),
          neighborhood VARCHAR(255) NOT NULL,
          city VARCHAR(255) NOT NULL,
          state VARCHAR(2) NOT NULL,
          zip_code VARCHAR(20) NOT NULL,
          is_default BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(20),
          customer_document VARCHAR(20),
          shipping_address TEXT NOT NULL,
          shipping_city VARCHAR(255) NOT NULL,
          shipping_state VARCHAR(2) NOT NULL,
          shipping_zip VARCHAR(20) NOT NULL,
          shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
          shipping_method VARCHAR(50),
          payment_method VARCHAR(50) NOT NULL,
          payment_id VARCHAR(255),
          payment_status VARCHAR(50) DEFAULT 'pending',
          tracking_code VARCHAR(255),
          tracking_url TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          total_amount DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(10, 2) NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS wishlist_items (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          added_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(user_id, product_id)
        );
        
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          type VARCHAR(50) NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
      
      // Check if we need to seed the database with initial data
      const { rows } = await client.query('SELECT COUNT(*) FROM categories');
      if (parseInt(rows[0].count) === 0) {
        await this.seedDatabase(client);
      }
    } finally {
      client.release();
    }
  }
  
  private async seedDatabase(client: any) {
    try {
      // Insert categories
      await client.query(`
        INSERT INTO categories (name, slug, description) VALUES
        ('Computadores', 'computadores', 'Desktop, notebooks e computadores all-in-one'),
        ('Periféricos', 'perifericos', 'Teclados, mouses, headsets e mais'),
        ('Hardware', 'hardware', 'Placas de vídeo, processadores, memórias e outros componentes'),
        ('Monitores', 'monitores', 'Monitores para jogos e trabalho'),
        ('Redes', 'redes', 'Roteadores, switches e equipamentos de rede');
      `);
      
      // Insert products
      await client.query(`
        INSERT INTO products (name, slug, description, price, old_price, stock, category_id, featured) VALUES
        ('Notebook Pro X', 'notebook-pro-x', 'Notebook de alta performance com processador Intel i7, 16GB RAM e SSD de 512GB', 5499.90, 5999.90, 10, 1, TRUE),
        ('Mouse Gamer RGB', 'mouse-gamer-rgb', 'Mouse com 7 botões programáveis e iluminação RGB', 149.90, 199.90, 50, 2, TRUE),
        ('Monitor UltraWide 29"', 'monitor-ultrawide-29', 'Monitor ultrawide com resolução 2560x1080 e painel IPS', 1299.90, 1499.90, 15, 4, TRUE),
        ('Teclado Mecânico', 'teclado-mecanico', 'Teclado mecânico com switches blue e iluminação RGB', 299.90, 349.90, 30, 2, TRUE),
        ('Placa de Vídeo RTX 4060', 'placa-de-video-rtx-4060', 'Placa de vídeo NVIDIA RTX 4060 com 8GB GDDR6', 2799.90, 3299.90, 7, 3, TRUE),
        ('SSD 1TB NVMe', 'ssd-1tb-nvme', 'SSD M.2 NVMe com velocidade de leitura de até 3500MB/s', 599.90, 699.90, 25, 3, FALSE),
        ('Desktop Gamer', 'desktop-gamer', 'Computador completo para jogos com RTX 3060 e Ryzen 5', 4899.90, 5299.90, 5, 1, TRUE),
        ('Webcam HD', 'webcam-hd', 'Webcam com resolução HD e microfone integrado', 199.90, 249.90, 40, 2, FALSE),
        ('Headset 7.1 Surround', 'headset-7-1-surround', 'Headset com som surround 7.1 e microfone removível', 349.90, 399.90, 20, 2, FALSE),
        ('Processador Intel i7', 'processador-intel-i7', 'Processador Intel Core i7 12ª geração', 1899.90, 2199.90, 8, 3, TRUE);
      `);
      
      // Insert product images
      await client.query(`
        INSERT INTO product_images (product_id, url, alt) VALUES
        (1, 'https://placehold.co/600x400/orange/white?text=Notebook+Pro+X', 'Notebook Pro X'),
        (2, 'https://placehold.co/600x400/orange/white?text=Mouse+Gamer+RGB', 'Mouse Gamer RGB'),
        (3, 'https://placehold.co/600x400/orange/white?text=Monitor+UltraWide', 'Monitor UltraWide 29"'),
        (4, 'https://placehold.co/600x400/orange/white?text=Teclado+Mecanico', 'Teclado Mecânico'),
        (5, 'https://placehold.co/600x400/orange/white?text=RTX+4060', 'Placa de Vídeo RTX 4060'),
        (6, 'https://placehold.co/600x400/orange/white?text=SSD+1TB', 'SSD 1TB NVMe'),
        (7, 'https://placehold.co/600x400/orange/white?text=Desktop+Gamer', 'Desktop Gamer'),
        (8, 'https://placehold.co/600x400/orange/white?text=Webcam+HD', 'Webcam HD'),
        (9, 'https://placehold.co/600x400/orange/white?text=Headset+7.1', 'Headset 7.1 Surround'),
        (10, 'https://placehold.co/600x400/orange/white?text=Intel+i7', 'Processador Intel i7');
      `);
      
      // Insert admin user with password 'admin123' (password is hashed)
      await client.query(`
        INSERT INTO users (name, email, password, role) VALUES
        ('Admin', 'admin@pcplus.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin');
      `);
      
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
  
  // Implementation of all IStorage methods using PostgreSQL
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    // username is the same as email in our implementation
    return this.getUserByEmail(username);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const { rows } = await this.pool.query(
      'INSERT INTO users (name, email, password, phone, document, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userData.name, userData.email, userData.password, userData.phone || null, userData.document || null, userData.role || 'customer']
    );
    return rows[0];
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    // Build dynamic query based on the fields to update
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });
    
    // Add updated_at field
    fields.push(`updated_at = NOW()`);
    
    // Add id as the last parameter
    values.push(id);
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const { rows } = await this.pool.query(query, values);
    return rows[0] || undefined;
  }
  
  // Sessions
  async createSession(session: InsertSession): Promise<Session> {
    const { rows } = await this.pool.query(
      'INSERT INTO sessions (user_id, token, expires_at, user_agent, ip_address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [session.userId, session.token, session.expiresAt, session.userAgent, session.ipAddress]
    );
    return rows[0];
  }
  
  async getSessionByToken(token: string): Promise<Session | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM sessions WHERE token = $1', [token]);
    return rows[0] || undefined;
  }
  
  async deleteSession(token: string): Promise<boolean> {
    const { rowCount } = await this.pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    return rowCount > 0;
  }
  
  // Categories
  async getCategories(): Promise<Category[]> {
    const { rows } = await this.pool.query('SELECT * FROM categories ORDER BY name');
    return rows;
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
    return rows[0] || undefined;
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const { rows } = await this.pool.query(
      'INSERT INTO categories (name, slug, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [category.name, category.slug, category.description || null, category.imageUrl || null]
    );
    return rows[0];
  }
  
  // Products
  async getProducts(limit: number = 100, offset: number = 0): Promise<Product[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM products ORDER BY name LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return rows;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0] || undefined;
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM products WHERE slug = $1', [slug]);
    return rows[0] || undefined;
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM products WHERE category_id = $1 ORDER BY name',
      [categoryId]
    );
    return rows;
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM products WHERE featured = TRUE ORDER BY created_at DESC LIMIT 10'
    );
    return rows;
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const { rows } = await this.pool.query(
      `SELECT * FROM products WHERE 
       name ILIKE $1 OR 
       description ILIKE $1 OR 
       slug ILIKE $1 
       ORDER BY name`,
      [`%${query}%`]
    );
    return rows;
  }
  
  async searchProductsAdvanced(params: {
    query?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<Product[]> {
    let conditions = [];
    let values = [];
    let paramCount = 1;
    
    if (params.query) {
      conditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      values.push(`%${params.query}%`);
      paramCount++;
    }
    
    if (params.categoryId) {
      conditions.push(`category_id = $${paramCount}`);
      values.push(params.categoryId);
      paramCount++;
    }
    
    if (params.minPrice !== undefined) {
      conditions.push(`price >= $${paramCount}`);
      values.push(params.minPrice);
      paramCount++;
    }
    
    if (params.maxPrice !== undefined) {
      conditions.push(`price <= $${paramCount}`);
      values.push(params.maxPrice);
      paramCount++;
    }
    
    let orderBy = 'name ASC';
    if (params.sort) {
      switch (params.sort) {
        case 'price_asc':
          orderBy = 'price ASC';
          break;
        case 'price_desc':
          orderBy = 'price DESC';
          break;
        case 'name_asc':
          orderBy = 'name ASC';
          break;
        case 'name_desc':
          orderBy = 'name DESC';
          break;
        case 'newest':
          orderBy = 'created_at DESC';
          break;
      }
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM products ${whereClause} ORDER BY ${orderBy}`;
    
    const { rows } = await this.pool.query(query, values);
    return rows;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const { rows } = await this.pool.query(
      `INSERT INTO products 
       (name, slug, description, price, old_price, stock, category_id, featured) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        product.name, 
        product.slug, 
        product.description || null, 
        product.price, 
        product.oldPrice || null, 
        product.stock, 
        product.categoryId, 
        product.featured || false
      ]
    );
    return rows[0];
  }
  
  async updateProductStock(id: number, stockChange: number): Promise<Product | undefined> {
    const { rows } = await this.pool.query(
      'UPDATE products SET stock = stock + $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [stockChange, id]
    );
    return rows[0] || undefined;
  }
  
  // Product images
  async getProductImages(productId: number): Promise<ProductImage[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY order_num',
      [productId]
    );
    return rows;
  }
  
  async addProductImage(image: InsertProductImage): Promise<ProductImage> {
    const { rows } = await this.pool.query(
      'INSERT INTO product_images (product_id, url, alt, order_num) VALUES ($1, $2, $3, $4) RETURNING *',
      [image.productId, image.url, image.alt || null, image.orderNum || 0]
    );
    return rows[0];
  }
  
  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const { rows } = await this.pool.query(
      `INSERT INTO orders 
       (user_id, customer_name, customer_email, customer_phone, customer_document,
        shipping_address, shipping_city, shipping_state, shipping_zip,
        shipping_cost, shipping_method, payment_method, status, total_amount) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING *`,
      [
        order.userId || null,
        order.customerName,
        order.customerEmail,
        order.customerPhone || null,
        order.customerDocument || null,
        order.shippingAddress,
        order.shippingCity,
        order.shippingState,
        order.shippingZip,
        order.shippingCost,
        order.shippingMethod,
        order.paymentMethod,
        order.status || 'pending',
        order.totalAmount
      ]
    );
    return rows[0];
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    return rows[0] || undefined;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const { rows } = await this.pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    return rows[0] || undefined;
  }
  
  async updateOrderPaymentStatus(id: number, paymentId: string, paymentStatus: string): Promise<Order | undefined> {
    const { rows } = await this.pool.query(
      'UPDATE orders SET payment_id = $1, payment_status = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [paymentId, paymentStatus, id]
    );
    return rows[0] || undefined;
  }
  
  async updateOrderTracking(id: number, trackingCode: string, trackingUrl: string): Promise<Order | undefined> {
    const { rows } = await this.pool.query(
      'UPDATE orders SET tracking_code = $1, tracking_url = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [trackingCode, trackingUrl, id]
    );
    return rows[0] || undefined;
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
  
  // Order items
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const { rows } = await this.pool.query(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [item.orderId, item.productId, item.quantity, item.unitPrice, item.totalPrice]
    );
    return rows[0];
  }
  
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );
    return rows;
  }
  
  // Addresses
  async getUserAddresses(userId: number): Promise<Address[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    return rows;
  }
  
  async getAddress(id: number): Promise<Address | undefined> {
    const { rows } = await this.pool.query('SELECT * FROM addresses WHERE id = $1', [id]);
    return rows[0] || undefined;
  }
  
  async createAddress(address: InsertAddress): Promise<Address> {
    // If this is the first address for the user, make it default
    const existingAddresses = await this.getUserAddresses(address.userId);
    const isDefault = existingAddresses.length === 0 ? true : address.isDefault || false;
    
    // If this address is being set as default, unset any existing default
    if (isDefault) {
      await this.pool.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND is_default = TRUE',
        [address.userId]
      );
    }
    
    const { rows } = await this.pool.query(
      `INSERT INTO addresses 
       (user_id, street, number, complement, neighborhood, city, state, zip_code, is_default) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        address.userId,
        address.street,
        address.number,
        address.complement || null,
        address.neighborhood,
        address.city,
        address.state,
        address.zipCode,
        isDefault
      ]
    );
    return rows[0];
  }
  
  async updateAddress(id: number, addressData: Partial<InsertAddress>): Promise<Address | undefined> {
    // Build dynamic query based on the fields to update
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    Object.entries(addressData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'userId') { // Skip userId as we shouldn't update it
        if (key === 'isDefault' && value === true) {
          // Handle is_default separately since it requires special logic
        } else {
          // Convert camelCase to snake_case
          const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          fields.push(`${snakeKey} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }
    });
    
    // Add updated_at field
    fields.push(`updated_at = NOW()`);
    
    // Add id as the last parameter
    values.push(id);
    
    const query = `UPDATE addresses SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const { rows } = await this.pool.query(query, values);
    
    // If we're setting this address as default, update other addresses
    if (addressData.isDefault === true && rows[0]) {
      await this.pool.query(
        'UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND id != $2',
        [rows[0].user_id, id]
      );
    }
    
    return rows[0] || undefined;
  }
  
  async deleteAddress(id: number): Promise<boolean> {
    const { rowCount } = await this.pool.query('DELETE FROM addresses WHERE id = $1', [id]);
    return rowCount > 0;
  }
  
  async setDefaultAddress(userId: number, addressId: number): Promise<boolean> {
    // First unset any existing default address
    await this.pool.query(
      'UPDATE addresses SET is_default = FALSE WHERE user_id = $1 AND is_default = TRUE',
      [userId]
    );
    
    // Then set the new default address
    const { rowCount } = await this.pool.query(
      'UPDATE addresses SET is_default = TRUE WHERE id = $1 AND user_id = $2',
      [addressId, userId]
    );
    
    return rowCount > 0;
  }
  
  // Wishlist
  async getUserWishlist(userId: number): Promise<WishlistItem[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM wishlist_items WHERE user_id = $1 ORDER BY added_at DESC',
      [userId]
    );
    return rows;
  }
  
  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    // First check if item already exists
    const existing = await this.isInWishlist(item.userId, item.productId);
    if (existing) {
      // Return the existing item
      const { rows } = await this.pool.query(
        'SELECT * FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
        [item.userId, item.productId]
      );
      return rows[0];
    }
    
    // Insert new wishlist item
    const { rows } = await this.pool.query(
      'INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [item.userId, item.productId]
    );
    return rows[0];
  }
  
  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      'DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    return rowCount > 0;
  }
  
  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      'SELECT COUNT(*) FROM wishlist_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    return parseInt(rows[0].count) > 0;
  }
  
  // Reviews
  async getProductReviews(productId: number): Promise<Review[]> {
    const { rows } = await this.pool.query(
      'SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = $1 ORDER BY r.created_at DESC',
      [productId]
    );
    return rows;
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const { rows } = await this.pool.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [review.userId, review.productId, review.rating, review.comment || null]
    );
    
    // Update product rating
    await this.updateProductRating(review.productId);
    
    return rows[0];
  }
  
  async getUserReviews(userId: number): Promise<Review[]> {
    const { rows } = await this.pool.query(
      'SELECT r.*, p.name as product_name FROM reviews r LEFT JOIN products p ON r.product_id = p.id WHERE r.user_id = $1 ORDER BY r.created_at DESC',
      [userId]
    );
    return rows;
  }
  
  async canReviewProduct(userId: number, productId: number): Promise<boolean> {
    // Check if user has ordered this product
    const { rows } = await this.pool.query(
      `SELECT COUNT(*) FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'delivered'`,
      [userId, productId]
    );
    
    if (parseInt(rows[0].count) === 0) {
      return false;
    }
    
    // Check if user has already reviewed this product
    const { rows: reviewRows } = await this.pool.query(
      'SELECT COUNT(*) FROM reviews WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );
    
    return parseInt(reviewRows[0].count) === 0;
  }
  
  async updateProductRating(productId: number): Promise<Product | undefined> {
    // Calculate average rating
    const { rows: ratingRows } = await this.pool.query(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = $1',
      [productId]
    );
    
    const avgRating = ratingRows[0].avg_rating || 0;
    
    // Update product rating
    const { rows } = await this.pool.query(
      'UPDATE products SET rating = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [avgRating, productId]
    );
    
    return rows[0] || undefined;
  }
  
  // Notifications
  async getUserNotifications(userId: number): Promise<Notification[]> {
    const { rows } = await this.pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
  
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const { rows } = await this.pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *',
      [notification.userId, notification.title, notification.message, notification.type]
    );
    return rows[0];
  }
  
  async markNotificationAsRead(id: number): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
      [userId]
    );
    return rowCount > 0;
  }
}

// Use DatabaseStorage instead of MemStorage
// Temporariamente usando MemStorage enquanto resolvemos os problemas de conexão com o banco
export const storage = new MemStorage();