import { pgTable, serial, integer, text, boolean, unique, timestamp, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const addresses = pgTable("addresses", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	street: text().notNull(),
	number: text().notNull(),
	complement: text(),
	neighborhood: text().notNull(),
	city: text().notNull(),
	state: text().notNull(),
	zipCode: text("zip_code").notNull(),
	isDefault: boolean("is_default").default(false),
});

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	icon: text().notNull(),
}, (table) => [
	unique("categories_slug_unique").on(table.slug),
]);

export const notifications = pgTable("notifications", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	title: text().notNull(),
	message: text().notNull(),
	type: text().notNull(),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	relatedId: integer("related_id"),
	link: text(),
});

export const orderItems = pgTable("order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer("order_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale:  2 }).notNull(),
	totalPrice: numeric("total_price", { precision: 10, scale:  2 }).notNull(),
});

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	customerName: text("customer_name").notNull(),
	customerEmail: text("customer_email").notNull(),
	customerPhone: text("customer_phone").notNull(),
	customerDocument: text("customer_document").notNull(),
	shippingAddress: text("shipping_address").notNull(),
	shippingCity: text("shipping_city").notNull(),
	shippingState: text("shipping_state").notNull(),
	shippingZip: text("shipping_zip").notNull(),
	shippingMethod: text("shipping_method").notNull(),
	shippingCost: numeric("shipping_cost", { precision: 10, scale:  2 }).notNull(),
	paymentMethod: text("payment_method").notNull(),
	totalAmount: numeric("total_amount", { precision: 10, scale:  2 }).notNull(),
	status: text().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	paymentId: text("payment_id"),
	paymentStatus: text("payment_status").default('pending'),
	trackingCode: text("tracking_code"),
	trackingUrl: text("tracking_url"),
	notes: text(),
	invoiceUrl: text("invoice_url"),
});

export const productImages = pgTable("product_images", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id").notNull(),
	imageUrl: text("image_url").notNull(),
	isPrimary: boolean("is_primary").default(false),
	isRotationImage: boolean("is_rotation_image").default(false),
	rotationOrder: integer("rotation_order"),
});

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text().notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	oldPrice: numeric("old_price", { precision: 10, scale:  2 }),
	discountPercentage: integer("discount_percentage"),
	imageUrl: text("image_url").notNull(),
	categoryId: integer("category_id").notNull(),
	stock: integer().default(0).notNull(),
	featured: boolean().default(false),
	specs: text().notNull(),
	sku: text().notNull(),
	rating: numeric({ precision: 2, scale:  1 }).default('0'),
	reviewCount: integer("review_count").default(0),
}, (table) => [
	unique("products_slug_unique").on(table.slug),
]);

export const reviews = pgTable("reviews", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id").notNull(),
	userId: integer("user_id").notNull(),
	orderId: integer("order_id").notNull(),
	rating: integer().notNull(),
	comment: text(),
	title: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	isVerified: boolean("is_verified").default(false),
});

export const sessions = pgTable("sessions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	userAgent: text("user_agent"),
	ipAddress: text("ip_address"),
}, (table) => [
	unique("sessions_token_unique").on(table.token),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	name: text().notNull(),
	phone: text(),
	document: text(),
	role: text().default('customer'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastLogin: timestamp("last_login", { mode: 'string' }),
	isActive: boolean("is_active").default(true),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const wishlistItems = pgTable("wishlist_items", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	productId: integer("product_id").notNull(),
	addedAt: timestamp("added_at", { mode: 'string' }).defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	url: text().notNull(),
	position: integer().default(0),
	parentId: integer("parent_id"),
	isVisible: boolean("is_visible").default(true),
	openInNewTab: boolean("open_in_new_tab").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
	id: serial().primaryKey().notNull(),
	siteName: text("site_name").default('PC+ Informática').notNull(),
	siteUrl: text("site_url").default('https://pcplus.com.br').notNull(),
	siteDescription: text("site_description").default('Loja de Informática e Tecnologia').notNull(),
	siteLogo: text("site_logo"),
	siteFavicon: text("site_favicon"),
	contactEmail: text("contact_email").default('contato@pcplus.com.br').notNull(),
	contactPhone: text("contact_phone").default('(62) 3333-4444').notNull(),
	contactAddress: text("contact_address"),
	socialFacebook: text("social_facebook"),
	socialInstagram: text("social_instagram"),
	socialTwitter: text("social_twitter"),
	socialWhatsapp: text("social_whatsapp"),
	metaKeywords: text("meta_keywords"),
	metaDescription: text("meta_description"),
	headerScripts: text("header_scripts"),
	footerScripts: text("footer_scripts"),
	customCss: text("custom_css"),
	enableMaintenance: boolean("enable_maintenance").default(false),
	enableDebug: boolean("enable_debug").default(false),
	cacheEnabled: boolean("cache_enabled").default(true),
	cacheTtl: integer("cache_ttl").default(3600),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});
