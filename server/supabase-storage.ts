/**
 * Implementação da interface IStorage usando Supabase como backend
 */
import { IStorage } from './storage';
import { Store } from 'express-session';
import connectPg from 'connect-pg-simple';
import session from 'express-session';
import pg from 'pg';
const { Pool } = pg;
import { supabaseApi, isSupabaseConfigured } from '../shared/supabase';
import { 
  User, InsertUser, 
  Session, InsertSession,
  Category, InsertCategory,
  Product, InsertProduct,
  ProductImage, InsertProductImage,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Address, InsertAddress,
  WishlistItem, InsertWishlistItem,
  Review, InsertReview,
  Notification, InsertNotification,
  SiteSettings, MenuItem
} from '../shared/schema';

const PostgresSessionStore = connectPg(session);

export class SupabaseStorage implements IStorage {
  private pool: Pool;
  public sessionStore: Store;

  constructor() {
    // Verificar se o Supabase está configurado
    if (!isSupabaseConfigured()) {
      console.warn('Atenção: Supabase não está configurado corretamente. Certifique-se de definir SUPABASE_URL e SUPABASE_ANON_KEY nas variáveis de ambiente.');
    }
    
    // Configuração do pool de conexões para o PostgreSQL usado pelo Supabase
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    });

    // Configuração do store de sessões
    this.sessionStore = new PostgresSessionStore({
      pool: this.pool,
      createTableIfMissing: true,
      tableName: 'sessions'
    });
  }

  // Implementação dos métodos da interface IStorage usando o Supabase API

  // ===== Usuários =====
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabaseApi.users.getById(id);
    if (error || !data) return undefined;
    return data as unknown as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabaseApi.users.getByEmail(email);
    if (error || !data) return undefined;
    return data as unknown as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Em nosso sistema, o username é o mesmo que o email
    return this.getUserByEmail(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabaseApi.users.create({
      ...user,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as User;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const { data, error } = await supabaseApi.users.update(id, {
      ...userData,
      updated_at: new Date().toISOString()
    });
    
    if (error || !data) return undefined;
    return data as unknown as User;
  }

  // ===== Sessões =====
  async createSession(session: InsertSession): Promise<Session> {
    const { data, error } = await supabaseApi.users.create({
      user_id: session.userId,
      token: session.token,
      expires_at: session.expiresAt,
      user_agent: session.userAgent,
      ip_address: session.ipAddress,
      created_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as Session;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const { data, error } = await supabaseApi.users.getById(0); // TODO: Implementar método específico
    if (error || !data) return undefined;
    return data as unknown as Session;
  }

  async deleteSession(token: string): Promise<boolean> {
    // TODO: Implementar método específico
    return true;
  }

  // ===== Categorias =====
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabaseApi.categories.getAll();
    if (error) return [];
    return data as unknown as Category[];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const { data, error } = await supabaseApi.categories.getBySlug(slug);
    if (error || !data) return undefined;
    return data as unknown as Category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await supabaseApi.categories.create({
      ...category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as Category;
  }

  // ===== Produtos =====
  async getProducts(limit = 100, offset = 0): Promise<Product[]> {
    const { data, error } = await supabaseApi.products.getAll(limit, offset);
    if (error) return [];
    return data as unknown as Product[];
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const { data, error } = await supabaseApi.products.getById(id);
    if (error || !data) return undefined;
    return data as unknown as Product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const { data, error } = await supabaseApi.products.getBySlug(slug);
    if (error || !data) return undefined;
    return data as unknown as Product;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const { data, error } = await supabaseApi.products.getByCategory(categoryId);
    if (error) return [];
    return data as unknown as Product[];
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabaseApi.products.getFeatured();
    if (error) return [];
    return data as unknown as Product[];
  }

  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabaseApi.products.search(query);
    if (error) return [];
    return data as unknown as Product[];
  }

  async searchProductsAdvanced(params: {
    query?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<Product[]> {
    // TODO: Implementar pesquisa avançada específica
    if (params.query) {
      return this.searchProducts(params.query);
    }
    return this.getProducts();
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const { data, error } = await supabaseApi.products.create({
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as Product;
  }

  async updateProductStock(id: number, stockChange: number): Promise<Product | undefined> {
    const { data, error } = await supabaseApi.products.updateStock(id, stockChange);
    if (error || !data) return undefined;
    return data as unknown as Product;
  }

  // ===== Imagens de Produtos =====
  async getProductImages(productId: number): Promise<ProductImage[]> {
    const { data, error } = await supabaseApi.productImages.getByProduct(productId);
    if (error) return [];
    return data as unknown as ProductImage[];
  }

  async addProductImage(image: InsertProductImage): Promise<ProductImage> {
    const { data, error } = await supabaseApi.productImages.add({
      ...image,
      created_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as ProductImage;
  }

  // ===== Pedidos =====
  async createOrder(order: InsertOrder): Promise<Order> {
    const { data, error } = await supabaseApi.orders.create({
      ...order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as Order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const { data, error } = await supabaseApi.orders.getById(id);
    if (error || !data) return undefined;
    return data as unknown as Order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const { data, error } = await supabaseApi.orders.updateStatus(id, status);
    if (error || !data) return undefined;
    return data as unknown as Order;
  }

  async updateOrderPaymentStatus(id: number, paymentId: string, paymentStatus: string): Promise<Order | undefined> {
    const { data, error } = await supabaseApi.orders.updatePaymentStatus(id, paymentId, paymentStatus);
    if (error || !data) return undefined;
    return data as unknown as Order;
  }

  async updateOrderTracking(id: number, trackingCode: string, trackingUrl: string): Promise<Order | undefined> {
    const { data, error } = await supabaseApi.orders.updateTracking(id, trackingCode, trackingUrl);
    if (error || !data) return undefined;
    return data as unknown as Order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    const { data, error } = await supabaseApi.orders.getByUser(userId);
    if (error) return [];
    return data as unknown as Order[];
  }

  // ===== Itens de Pedido =====
  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const { data, error } = await supabaseApi.orderItems.create({
      ...item,
      created_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as OrderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const { data, error } = await supabaseApi.orderItems.getByOrder(orderId);
    if (error) return [];
    return data as unknown as OrderItem[];
  }

  // ===== Endereços =====
  async getUserAddresses(userId: number): Promise<Address[]> {
    const { data, error } = await supabaseApi.addresses.getByUser(userId);
    if (error) return [];
    return data as unknown as Address[];
  }

  async getAddress(id: number): Promise<Address | undefined> {
    const { data, error } = await supabaseApi.addresses.getById(id);
    if (error || !data) return undefined;
    return data as unknown as Address;
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    const { data, error } = await supabaseApi.addresses.create({
      ...address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as Address;
  }

  async updateAddress(id: number, addressData: Partial<InsertAddress>): Promise<Address | undefined> {
    const { data, error } = await supabaseApi.addresses.update(id, {
      ...addressData,
      updated_at: new Date().toISOString()
    });
    
    if (error || !data) return undefined;
    return data as unknown as Address;
  }

  async deleteAddress(id: number): Promise<boolean> {
    const { error } = await supabaseApi.addresses.delete(id);
    return !error;
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<boolean> {
    const { error } = await supabaseApi.addresses.setDefault(userId, addressId);
    return !error;
  }

  // ===== Lista de Desejos =====
  async getUserWishlist(userId: number): Promise<WishlistItem[]> {
    const { data, error } = await supabaseApi.wishlist.getByUser(userId);
    if (error) return [];
    return data as unknown as WishlistItem[];
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    const { data, error } = await supabaseApi.wishlist.add({
      ...item,
      added_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as WishlistItem;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const { error } = await supabaseApi.wishlist.remove(userId, productId);
    return !error;
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const { exists, error } = await supabaseApi.wishlist.isInWishlist(userId, productId);
    if (error) return false;
    return exists;
  }

  // ===== Avaliações =====
  async getProductReviews(productId: number): Promise<Review[]> {
    const { data, error } = await supabaseApi.reviews.getByProduct(productId);
    if (error) return [];
    return data as unknown as Review[];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const { data, error } = await supabaseApi.reviews.create({
      ...review,
      created_at: new Date().toISOString()
    });
    
    if (error || !data) throw error || new Error('Falha ao criar avaliação');
    return data as unknown as Review;
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    const { data, error } = await supabaseApi.reviews.getByUser(userId);
    if (error) return [];
    return data as unknown as Review[];
  }

  async canReviewProduct(userId: number, productId: number): Promise<boolean> {
    return supabaseApi.reviews.canReviewProduct(userId, productId);
  }

  async updateProductRating(productId: number): Promise<Product | undefined> {
    const { data, error } = await supabaseApi.reviews.updateProductRating(productId);
    if (error || !data) return undefined;
    return this.getProductById(productId);
  }

  // ===== Notificações =====
  async getUserNotifications(userId: number): Promise<Notification[]> {
    const { data, error } = await supabaseApi.notifications.getByUser(userId);
    if (error) return [];
    return data as unknown as Notification[];
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const { data, error } = await supabaseApi.notifications.create({
      ...notification,
      created_at: new Date().toISOString()
    });
    
    if (error) throw error;
    return data as unknown as Notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const { error } = await supabaseApi.notifications.markAsRead(id);
    return !error;
  }

  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const { error } = await supabaseApi.notifications.markAllAsRead(userId);
    return !error;
  }

  // ===== Configurações do Site =====
  async getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabaseApi.siteSettings.get();
    if (error || !data) return null;
    return data as unknown as SiteSettings;
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings | null> {
    const { data, error } = await supabaseApi.siteSettings.update({
      ...settings,
      updated_at: new Date().toISOString()
    });
    
    if (error || !data) return null;
    return data as unknown as SiteSettings;
  }

  async resetSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabaseApi.siteSettings.reset();
    if (error || !data) return null;
    return data as unknown as SiteSettings;
  }

  // ===== Itens de Menu =====
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabaseApi.menuItems.getAll();
    if (error) return [];
    return data as unknown as MenuItem[];
  }

  async updateMenuItems(items: MenuItem[]): Promise<boolean> {
    const { error } = await supabaseApi.menuItems.update(items);
    return !error;
  }
}