import { pgTable, text, serial, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  icon: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  discountPercentage: integer("discount_percentage"),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  stock: integer("stock").notNull().default(0),
  featured: boolean("featured").default(false),
  specs: text("specs").notNull(),
  sku: text("sku").notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  slug: true,
  description: true,
  price: true,
  oldPrice: true,
  discountPercentage: true,
  imageUrl: true,
  categoryId: true,
  stock: true,
  featured: true,
  specs: true,
  sku: true,
  rating: true,
  reviewCount: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Product Images
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  imageUrl: text("image_url").notNull(),
  isPrimary: boolean("is_primary").default(false),
});

export const insertProductImageSchema = createInsertSchema(productImages).pick({
  productId: true,
  imageUrl: true,
  isPrimary: true,
});

export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImages.$inferSelect;

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerDocument: text("customer_document").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingZip: text("shipping_zip").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paymentId: text("payment_id"),
  paymentStatus: text("payment_status").default("pending"),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  customerDocument: true,
  shippingAddress: true,
  shippingCity: true,
  shippingState: true,
  shippingZip: true,
  shippingMethod: true,
  shippingCost: true,
  paymentMethod: true,
  totalAmount: true,
  status: true,
  paymentId: true,
  paymentStatus: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  unitPrice: true,
  totalPrice: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Users schema left as-is from the template
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
