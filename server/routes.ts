import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatController } from "./controllers/chatController";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API routes
  app.post('/api/chat', chatController.processMessage);
  
  // Health check route
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
