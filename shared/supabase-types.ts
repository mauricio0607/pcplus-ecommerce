export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          id: number
          user_id: number
          street: string
          number: string
          complement: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          is_default: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: number
          street: string
          number: string
          complement?: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          street?: string
          number?: string
          complement?: string | null
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          is_default?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          id: number
          title: string
          url: string
          order_num: number
          parent_id: number | null
          is_external: boolean
        }
        Insert: {
          id?: number
          title: string
          url: string
          order_num?: number
          parent_id?: number | null
          is_external?: boolean
        }
        Update: {
          id?: number
          title?: string
          url?: string
          order_num?: number
          parent_id?: number | null
          is_external?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: number
          user_id: number
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: number
          user_id: number
          title: string
          message: string
          type: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          product_id?: number | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          product_id?: number | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: number
          user_id: number | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          customer_document: string | null
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_zip: string
          shipping_cost: number
          shipping_method: string | null
          payment_method: string
          payment_id: string | null
          payment_status: string | null
          tracking_code: string | null
          tracking_url: string | null
          status: string
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          customer_document?: string | null
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_zip: string
          shipping_cost?: number
          shipping_method?: string | null
          payment_method: string
          payment_id?: string | null
          payment_status?: string | null
          tracking_code?: string | null
          tracking_url?: string | null
          status?: string
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          customer_document?: string | null
          shipping_address?: string
          shipping_city?: string
          shipping_state?: string
          shipping_zip?: string
          shipping_cost?: number
          shipping_method?: string | null
          payment_method?: string
          payment_id?: string | null
          payment_status?: string | null
          tracking_code?: string | null
          tracking_url?: string | null
          status?: string
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      product_images: {
        Row: {
          id: number
          product_id: number
          url: string
          alt: string | null
          order_num: number | null
          created_at: string
        }
        Insert: {
          id?: number
          product_id: number
          url: string
          alt?: string | null
          order_num?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          url?: string
          alt?: string | null
          order_num?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          price: number
          old_price: number | null
          stock: number
          category_id: number | null
          featured: boolean | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          price: number
          old_price?: number | null
          stock?: number
          category_id?: number | null
          featured?: boolean | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          price?: number
          old_price?: number | null
          stock?: number
          category_id?: number | null
          featured?: boolean | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: number
          user_id: number | null
          product_id: number
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: number | null
          product_id: number
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number | null
          product_id?: number
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sessions: {
        Row: {
          id: number
          user_id: number
          token: string
          expires_at: string
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: number
          token: string
          expires_at: string
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          token?: string
          expires_at?: string
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      site_settings: {
        Row: {
          id: number
          site_name: string
          site_description: string | null
          contact_email: string | null
          contact_phone: string | null
          address: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          primary_color: string | null
          logo_url: string | null
          banner_url: string | null
          shipping_min_value_free: number | null
          shipping_default_fee: number | null
          payment_methods: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          site_name: string
          site_description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          primary_color?: string | null
          logo_url?: string | null
          banner_url?: string | null
          shipping_min_value_free?: number | null
          shipping_default_fee?: number | null
          payment_methods?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          site_name?: string
          site_description?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          address?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          primary_color?: string | null
          logo_url?: string | null
          banner_url?: string | null
          shipping_min_value_free?: number | null
          shipping_default_fee?: number | null
          payment_methods?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: number
          name: string
          email: string
          password: string
          phone: string | null
          document: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          password: string
          phone?: string | null
          document?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          password?: string
          phone?: string | null
          document?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          id: number
          user_id: number
          product_id: number
          added_at: string
        }
        Insert: {
          id?: number
          user_id: number
          product_id: number
          added_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          product_id?: number
          added_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}