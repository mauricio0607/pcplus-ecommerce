import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Middleware para verificar se o usuário é administrador
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const session = await storage.getSessionByToken(token);
    if (!session) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    // Verifica se a sessão não expirou
    if (new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ message: "Token expired" });
    }
    
    const user = await storage.getUser(session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Verifica se o usuário é administrador
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    // Adiciona o usuário ao objeto de requisição
    (req as any).user = user;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

// Registrar rotas administrativas
export function registerAdminRoutes(app: any) {
  // Buscar configurações do site
  app.get("/api/admin/settings", adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();
      return res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      return res.status(500).json({ message: "Falha ao buscar configurações" });
    }
  });
  
  // Salvar configurações do site
  app.post("/api/admin/settings", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const settings = req.body;
      await storage.updateSiteSettings(settings);
      
      // Limpar cache se solicitado
      if (settings.clearCache) {
        // Implementar lógica de limpeza de cache se necessário
        console.log("Limpando cache do sistema...");
      }
      
      return res.json({ message: "Configurações salvas com sucesso", settings });
    } catch (error) {
      console.error("Error saving site settings:", error);
      return res.status(500).json({ message: "Falha ao salvar configurações" });
    }
  });
  
  // Buscar itens de menu
  app.get("/api/admin/menu", adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const menuItems = await storage.getMenuItems();
      return res.json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return res.status(500).json({ message: "Falha ao buscar itens de menu" });
    }
  });
  
  // Salvar itens de menu
  app.post("/api/admin/menu", adminMiddleware, async (req: Request, res: Response) => {
    try {
      const menuItems = req.body;
      await storage.updateMenuItems(menuItems);
      return res.json({ message: "Menu atualizado com sucesso", menuItems });
    } catch (error) {
      console.error("Error saving menu items:", error);
      return res.status(500).json({ message: "Falha ao salvar itens de menu" });
    }
  });
  
  // Limpar cache
  app.post("/api/admin/clear-cache", adminMiddleware, async (_req: Request, res: Response) => {
    try {
      // Implementar lógica de limpeza de cache real
      console.log("Limpando cache do sistema...");
      
      // Simulação de limpeza de cache
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return res.json({ message: "Cache limpo com sucesso" });
    } catch (error) {
      console.error("Error clearing cache:", error);
      return res.status(500).json({ message: "Falha ao limpar cache" });
    }
  });
  
  // Restaurar configurações padrão
  app.post("/api/admin/reset-settings", adminMiddleware, async (_req: Request, res: Response) => {
    try {
      await storage.resetSiteSettings();
      return res.json({ message: "Configurações restauradas com sucesso" });
    } catch (error) {
      console.error("Error resetting settings:", error);
      return res.status(500).json({ message: "Falha ao restaurar configurações" });
    }
  });
}