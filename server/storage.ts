import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  categories, type Category, type InsertCategory,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  productImages, type ProductImage, type InsertProductImage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  
  // Order items operations
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private productImages: Map<number, ProductImage>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentProductImageId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.productImages = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentProductImageId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    // Initialize with default categories
    this.initCategories();
    this.initProducts();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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
    const product: Product = { ...insertProduct, id };
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
    const image: ProductImage = { ...insertImage, id };
    this.productImages.set(id, image);
    return image;
  }
  
  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { ...insertOrder, id };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
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
      paymentStatus 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
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
  
  // Initialize demo data
  private initCategories() {
    const categories: InsertCategory[] = [
      { name: "Notebooks", slug: "notebooks", icon: "laptop" },
      { name: "Desktops", slug: "desktops", icon: "desktop" },
      { name: "Periféricos", slug: "perifericos", icon: "keyboard" },
      { name: "Componentes", slug: "componentes", icon: "microchip" },
      { name: "Redes", slug: "redes", icon: "network-wired" },
      { name: "Acessórios", slug: "acessorios", icon: "headset" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
  }
  
  private initProducts() {
    const products: InsertProduct[] = [
      {
        name: "Notebook Pro X",
        slug: "notebook-pro-x",
        description: "O Notebook Pro X é a escolha perfeita para profissionais e entusiastas que buscam alto desempenho e confiabilidade. Com processador Intel Core i7 de última geração, 16GB de memória RAM e SSD de 512GB, ele oferece velocidade excepcional para qualquer tarefa.",
        price: "4999.00",
        oldPrice: "5899.00",
        discountPercentage: 15,
        imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
        categoryId: 1,
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
