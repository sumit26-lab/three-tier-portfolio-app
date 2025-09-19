import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, updateArticleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Article routes
  
  // Get all articles (published only for public, all for admin)
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, limit, offset } = req.query;
      const isAdmin = req.headers['x-admin-key'] === 'admin123'; // Simple admin check
      
      const options: any = {};
      // Always enforce published=true for non-admin users
      if (!isAdmin) {
        options.published = true;
      }
      if (category && typeof category === 'string') {
        options.category = category;
      }
      if (limit && typeof limit === 'string') {
        options.limit = parseInt(limit);
      }
      if (offset && typeof offset === 'string') {
        options.offset = parseInt(offset);
      }
      
      const articles = await storage.getArticles(options);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Get single article by ID or slug
  app.get("/api/articles/:idOrSlug", async (req, res) => {
    try {
      const { idOrSlug } = req.params;
      const isAdmin = req.headers['x-admin-key'] === 'admin123';
      
      let article = await storage.getArticle(idOrSlug);
      if (!article) {
        article = await storage.getArticleBySlug(idOrSlug);
      }
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      // Only allow unpublished articles for admin users
      if (!article.published && !isAdmin) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // Create new article (admin only)
  app.post("/api/articles", async (req, res) => {
    try {
      const isAdmin = req.headers['x-admin-key'] === 'admin123';
      if (!isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const validatedData = insertArticleSchema.parse(req.body);
      
      // Check for slug uniqueness
      const existingArticle = await storage.getArticleBySlug(validatedData.slug);
      if (existingArticle) {
        return res.status(400).json({ error: "Article with this slug already exists" });
      }
      
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  // Update article (admin only)
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const isAdmin = req.headers['x-admin-key'] === 'admin123';
      if (!isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { id } = req.params;
      const validatedData = updateArticleSchema.parse(req.body);
      
      // Check for slug uniqueness if slug is being updated
      if (validatedData.slug) {
        const existingArticle = await storage.getArticleBySlug(validatedData.slug);
        if (existingArticle && existingArticle.id !== id) {
          return res.status(400).json({ error: "Article with this slug already exists" });
        }
      }
      
      const article = await storage.updateArticle(id, validatedData);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  // Delete article (admin only)
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const isAdmin = req.headers['x-admin-key'] === 'admin123';
      if (!isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { id } = req.params;
      const success = await storage.deleteArticle(id);
      
      if (!success) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get tags
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
