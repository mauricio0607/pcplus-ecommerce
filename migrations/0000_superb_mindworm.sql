-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "addresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"street" text NOT NULL,
	"number" text NOT NULL,
	"complement" text,
	"neighborhood" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"is_default" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"related_id" integer,
	"link" text
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_document" text NOT NULL,
	"shipping_address" text NOT NULL,
	"shipping_city" text NOT NULL,
	"shipping_state" text NOT NULL,
	"shipping_zip" text NOT NULL,
	"shipping_method" text NOT NULL,
	"shipping_cost" numeric(10, 2) NOT NULL,
	"payment_method" text NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"payment_id" text,
	"payment_status" text DEFAULT 'pending',
	"tracking_code" text,
	"tracking_url" text,
	"notes" text,
	"invoice_url" text
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"is_rotation_image" boolean DEFAULT false,
	"rotation_order" integer
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"old_price" numeric(10, 2),
	"discount_percentage" integer,
	"image_url" text NOT NULL,
	"category_id" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"featured" boolean DEFAULT false,
	"specs" text NOT NULL,
	"sku" text NOT NULL,
	"rating" numeric(2, 1) DEFAULT '0',
	"review_count" integer DEFAULT 0,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"order_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_verified" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text,
	"ip_address" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"document" text,
	"role" text DEFAULT 'customer',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wishlist_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"position" integer DEFAULT 0,
	"parent_id" integer,
	"is_visible" boolean DEFAULT true,
	"open_in_new_tab" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" text DEFAULT 'PC+ Informática' NOT NULL,
	"site_url" text DEFAULT 'https://pcplus.com.br' NOT NULL,
	"site_description" text DEFAULT 'Loja de Informática e Tecnologia' NOT NULL,
	"site_logo" text,
	"site_favicon" text,
	"contact_email" text DEFAULT 'contato@pcplus.com.br' NOT NULL,
	"contact_phone" text DEFAULT '(62) 3333-4444' NOT NULL,
	"contact_address" text,
	"social_facebook" text,
	"social_instagram" text,
	"social_twitter" text,
	"social_whatsapp" text,
	"meta_keywords" text,
	"meta_description" text,
	"header_scripts" text,
	"footer_scripts" text,
	"custom_css" text,
	"enable_maintenance" boolean DEFAULT false,
	"enable_debug" boolean DEFAULT false,
	"cache_enabled" boolean DEFAULT true,
	"cache_ttl" integer DEFAULT 3600,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

*/