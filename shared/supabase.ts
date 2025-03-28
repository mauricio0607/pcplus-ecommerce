import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

// Carrega variáveis de ambiente
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Função para verificar se o Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Função para obter o cliente Supabase - permite inicialização condicional
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    console.error('Erro: SUPABASE_URL e SUPABASE_ANON_KEY devem ser definidos nas variáveis de ambiente para usar Supabase');
    return null;
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Função para obter o cliente Supabase Admin - permite inicialização condicional
export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    console.error('Erro: SUPABASE_URL e SUPABASE_SERVICE_KEY devem ser definidos nas variáveis de ambiente para usar Supabase Admin');
    return null;
  }
  return createClient<Database>(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
}

// Cliente Supabase para uso no cliente (frontend) - somente inicializado se configurado
export const supabaseClient = isSupabaseConfigured() 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Cliente Supabase para uso no servidor (com permissões elevadas) - somente inicializado se configurado
export const supabaseAdmin = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
  : null;

// Funções auxiliares para interagir com o Supabase
export const supabaseApi = {
  // Autenticação
  auth: {
    signUp: async (email: string, password: string) => {
      if (!supabaseClient) {
        return { error: new Error('Supabase não está configurado') };
      }
      return supabaseClient.auth.signUp({ email, password });
    },
    signIn: async (email: string, password: string) => {
      if (!supabaseClient) {
        return { error: new Error('Supabase não está configurado') };
      }
      return supabaseClient.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      if (!supabaseClient) {
        return { error: new Error('Supabase não está configurado') };
      }
      return supabaseClient.auth.signOut();
    },
    getUser: async () => {
      if (!supabaseClient) {
        return { error: new Error('Supabase não está configurado') };
      }
      return supabaseClient.auth.getUser();
    },
  },
  
  // Usuários
  users: {
    getById: async (id: number) => {
      return supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
    },
    getByEmail: async (email: string) => {
      return supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
    },
    create: async (userData: any) => {
      return supabaseAdmin
        .from('users')
        .insert(userData)
        .select()
        .single();
    },
    update: async (id: number, userData: any) => {
      return supabaseAdmin
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();
    },
  },
  
  // Produtos
  products: {
    getAll: async (limit = 100, offset = 0) => {
      return supabaseClient
        .from('products')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('name');
    },
    getById: async (id: number) => {
      return supabaseClient
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    },
    getBySlug: async (slug: string) => {
      return supabaseClient
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
    },
    getByCategory: async (categoryId: number) => {
      return supabaseClient
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('name');
    },
    getFeatured: async () => {
      return supabaseClient
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(10);
    },
    search: async (query: string) => {
      return supabaseClient
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%, description.ilike.%${query}%, slug.ilike.%${query}%`)
        .order('name');
    },
    create: async (productData: any) => {
      return supabaseAdmin
        .from('products')
        .insert(productData)
        .select()
        .single();
    },
    update: async (id: number, productData: any) => {
      return supabaseAdmin
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
    },
    updateStock: async (id: number, stockChange: number) => {
      // Primeiro, buscamos o produto atual
      const { data: product, error: getError } = await supabaseAdmin
        .from('products')
        .select('stock')
        .eq('id', id)
        .single();
      
      if (getError || !product) {
        return { data: null, error: getError || new Error('Produto não encontrado') };
      }
      
      // Depois, atualizamos o estoque
      const newStock = Math.max(0, (product.stock || 0) + stockChange);
      return supabaseAdmin
        .from('products')
        .update({ stock: newStock })
        .eq('id', id)
        .select()
        .single();
    },
  },
  
  // Categorias
  categories: {
    getAll: async () => {
      return supabaseClient
        .from('categories')
        .select('*')
        .order('name');
    },
    getBySlug: async (slug: string) => {
      return supabaseClient
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
    },
    create: async (categoryData: any) => {
      return supabaseAdmin
        .from('categories')
        .insert(categoryData)
        .select()
        .single();
    },
  },
  
  // Imagens de Produtos
  productImages: {
    getByProduct: async (productId: number) => {
      return supabaseClient
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('order_num');
    },
    add: async (imageData: any) => {
      return supabaseAdmin
        .from('product_images')
        .insert(imageData)
        .select()
        .single();
    },
  },
  
  // Pedidos
  orders: {
    create: async (orderData: any) => {
      return supabaseAdmin
        .from('orders')
        .insert(orderData)
        .select()
        .single();
    },
    getById: async (id: number) => {
      return supabaseClient
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
    },
    getByUser: async (userId: number) => {
      return supabaseClient
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },
    updateStatus: async (id: number, status: string) => {
      return supabaseAdmin
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    },
    updatePaymentStatus: async (id: number, paymentId: string, paymentStatus: string) => {
      return supabaseAdmin
        .from('orders')
        .update({ 
          payment_id: paymentId, 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    },
    updateTracking: async (id: number, trackingCode: string, trackingUrl: string) => {
      return supabaseAdmin
        .from('orders')
        .update({ 
          tracking_code: trackingCode, 
          tracking_url: trackingUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    },
  },
  
  // Itens de Pedido
  orderItems: {
    create: async (itemData: any) => {
      return supabaseAdmin
        .from('order_items')
        .insert(itemData)
        .select()
        .single();
    },
    getByOrder: async (orderId: number) => {
      return supabaseClient
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);
    },
  },
  
  // Endereços
  addresses: {
    getByUser: async (userId: number) => {
      return supabaseClient
        .from('addresses')
        .select('*')
        .eq('user_id', userId);
    },
    getById: async (id: number) => {
      return supabaseClient
        .from('addresses')
        .select('*')
        .eq('id', id)
        .single();
    },
    create: async (addressData: any) => {
      return supabaseAdmin
        .from('addresses')
        .insert(addressData)
        .select()
        .single();
    },
    update: async (id: number, addressData: any) => {
      return supabaseAdmin
        .from('addresses')
        .update(addressData)
        .eq('id', id)
        .select()
        .single();
    },
    delete: async (id: number) => {
      return supabaseAdmin
        .from('addresses')
        .delete()
        .eq('id', id);
    },
    setDefault: async (userId: number, addressId: number) => {
      // Primeiro, removemos o status padrão de todos os endereços do usuário
      await supabaseAdmin
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
      
      // Depois, definimos o endereço específico como padrão
      return supabaseAdmin
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', userId);
    },
  },
  
  // Lista de Desejos
  wishlist: {
    getByUser: async (userId: number) => {
      return supabaseClient
        .from('wishlist_items')
        .select('*, products(*)')
        .eq('user_id', userId);
    },
    add: async (wishlistData: any) => {
      return supabaseAdmin
        .from('wishlist_items')
        .insert(wishlistData)
        .select()
        .single();
    },
    remove: async (userId: number, productId: number) => {
      return supabaseAdmin
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
    },
    isInWishlist: async (userId: number, productId: number) => {
      const { data, error } = await supabaseClient
        .from('wishlist_items')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();
      
      return { exists: !!data, error };
    },
  },
  
  // Avaliações
  reviews: {
    getByProduct: async (productId: number) => {
      return supabaseClient
        .from('reviews')
        .select('*, users(name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
    },
    getByUser: async (userId: number) => {
      return supabaseClient
        .from('reviews')
        .select('*, products(name, slug)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },
    create: async (reviewData: any) => {
      // Criar a avaliação
      const { data, error } = await supabaseAdmin
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();
      
      if (error || !data) {
        return { data, error };
      }
      
      // Atualizar a classificação média do produto
      await this.updateProductRating(reviewData.product_id);
      
      return { data, error: null };
    },
    canReviewProduct: async (userId: number, productId: number) => {
      // Verifica se o usuário já avaliou este produto
      const { data: existingReview } = await supabaseClient
        .from('reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();
      
      if (existingReview) {
        return false;
      }
      
      // Verifica se o usuário comprou este produto
      const { data: orders } = await supabaseClient
        .from('orders')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'completed');
      
      if (!orders || orders.length === 0) {
        return false;
      }
      
      const orderIds = orders.map(order => order.id);
      
      const { data: orderItems } = await supabaseClient
        .from('order_items')
        .select('id')
        .eq('product_id', productId)
        .in('order_id', orderIds);
      
      return !!orderItems && orderItems.length > 0;
    },
    updateProductRating: async (productId: number) => {
      // Buscar todas as avaliações do produto
      const { data: reviews } = await supabaseClient
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);
      
      if (!reviews || reviews.length === 0) {
        // Se não houver avaliações, definir a classificação como 0
        return supabaseAdmin
          .from('products')
          .update({ rating: 0 })
          .eq('id', productId);
      }
      
      // Calcular a classificação média
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = parseFloat((totalRating / reviews.length).toFixed(2));
      
      // Atualizar a classificação do produto
      return supabaseAdmin
        .from('products')
        .update({ rating: averageRating })
        .eq('id', productId);
    },
  },
  
  // Notificações
  notifications: {
    getByUser: async (userId: number) => {
      return supabaseClient
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },
    create: async (notificationData: any) => {
      return supabaseAdmin
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();
    },
    markAsRead: async (id: number) => {
      return supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    },
    markAllAsRead: async (userId: number) => {
      return supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    },
  },
  
  // Configurações do Site
  siteSettings: {
    get: async () => {
      const { data, error } = await supabaseClient
        .from('site_settings')
        .select('*')
        .order('id');
      
      if (error || !data || data.length === 0) {
        return { data: null, error: error || new Error('Configurações não encontradas') };
      }
      
      return { data: data[0], error: null };
    },
    update: async (settingsData: any) => {
      // Verificar se já existem configurações
      const { data: existing } = await supabaseClient
        .from('site_settings')
        .select('id')
        .limit(1);
      
      if (existing && existing.length > 0) {
        // Atualizar configurações existentes
        return supabaseAdmin
          .from('site_settings')
          .update(settingsData)
          .eq('id', existing[0].id)
          .select()
          .single();
      } else {
        // Criar novas configurações
        return supabaseAdmin
          .from('site_settings')
          .insert(settingsData)
          .select()
          .single();
      }
    },
    reset: async () => {
      // Valores padrão para as configurações do site
      const defaultSettings = {
        site_name: 'PC+ E-commerce',
        site_description: 'Sua loja de produtos de informática',
        contact_email: 'contato@pcplus.com.br',
        contact_phone: '(00) 0000-0000',
        address: 'Rua Exemplo, 123',
        social_facebook: 'https://facebook.com/pcplus',
        social_instagram: 'https://instagram.com/pcplus',
        social_twitter: 'https://twitter.com/pcplus',
        primary_color: '#ff6600',
        logo_url: 'https://placehold.co/200x60/ff6600/white?text=PC%2B',
        banner_url: 'https://placehold.co/1200x400/ff6600/white?text=PC%2B+E-commerce',
        shipping_min_value_free: 500,
        shipping_default_fee: 20,
        payment_methods: 'Cartão de Crédito, Boleto, PIX'
      };
      
      return this.update(defaultSettings);
    },
  },
  
  // Itens de Menu
  menuItems: {
    getAll: async () => {
      return supabaseClient
        .from('menu_items')
        .select('*')
        .order('order_num');
    },
    update: async (items: any[]) => {
      // Primeiro, remover todos os itens existentes
      await supabaseAdmin
        .from('menu_items')
        .delete()
        .neq('id', 0); // Condição sempre verdadeira para excluir todos
      
      // Se não houver novos itens, retornamos
      if (!items || items.length === 0) {
        return { success: true };
      }
      
      // Adicionar os novos itens com ordem atualizada
      return supabaseAdmin
        .from('menu_items')
        .insert(items.map((item, index) => ({
          ...item,
          order_num: index
        })));
    },
  },
};