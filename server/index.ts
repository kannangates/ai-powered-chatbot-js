import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { chatConfig } from "@shared/config";

// Check for required API keys
function checkRequiredEnvironmentVariables() {
  const missingVars = [];
  
  // Check if primary provider and fallback are set up
  const provider = chatConfig.ai.primaryProvider as string;
  
  if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
    missingVars.push('OPENAI_API_KEY');
  }
  
  if (provider === 'gemini' && !process.env.GEMINI_API_KEY) {
    missingVars.push('GEMINI_API_KEY');
  }
  
  // If fallback is enabled, check for the other provider's key
  if (chatConfig.ai.fallbackEnabled) {
    if (provider === 'openai' && !process.env.GEMINI_API_KEY) {
      missingVars.push('GEMINI_API_KEY (for fallback)');
    } else if (provider === 'gemini' && !process.env.OPENAI_API_KEY) {
      missingVars.push('OPENAI_API_KEY (for fallback)');
    }
  }
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Some chatbot functionality may not work correctly.');
  } else {
    console.log('✅ All required API keys are configured.');
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Check for required API keys on startup
  checkRequiredEnvironmentVariables();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
