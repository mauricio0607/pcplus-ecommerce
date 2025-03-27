import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Initialize Mercado Pago SDK
import mercadopago from "mercadopago";

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN || "";
if (MERCADO_PAGO_ACCESS_TOKEN) {
  mercadopago.configure({
    access_token: MERCADO_PAGO_ACCESS_TOKEN
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  
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
      
      const preference = await mercadopago.preferences.create(preferenceData);
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
      const pixPayment = await mercadopago.payment.create({
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
      const payment = await mercadopago.payment.get(paymentId);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
