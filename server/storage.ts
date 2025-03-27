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

export interface IStorage {
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

export const storage = new MemStorage();