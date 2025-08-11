import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { promptRequestSchema } from "@shared/schema";
import { generateVideoPrompts, translateText } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/generate-prompts - Generate video prompts using OpenAI
  app.post("/api/generate-prompts", async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Validate request body
      const validationResult = promptRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Ungültige Eingabedaten",
          errors: validationResult.error.errors
        });
      }

      const { platform, category, customCategory, videoContent, tones, styles } = validationResult.data;

      // Generate prompts using OpenAI
      const prompts = await generateVideoPrompts({
        platform,
        category,
        customCategory,
        videoContent,
        tones,
        styles
      });

      const generationTime = (Date.now() - startTime) / 1000;

      // Save each prompt to the database
      const savedPrompts = [];
      for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        const savedPrompt = await storage.savePrompt({
          userId: null, // No user authentication yet
          platform: platform,
          category: prompt.category,
          customCategory: customCategory,
          videoContent: videoContent,
          tones: tones,
          styles: styles,
          content: prompt.content,
          generationTime: Math.round(generationTime * 1000), // Convert to milliseconds
        });
        savedPrompts.push({
          id: prompt.id,
          content: prompt.content,
          category: prompt.category
        });
      }

      const response = {
        prompts: savedPrompts,
        generationTime,
        success: true
      };

      res.json(response);

    } catch (error) {
      console.error("Fehler bei der Prompt-Generierung:", error);
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten",
        prompts: [],
        generationTime: 0
      });
    }
  });

  // POST /api/translate-prompt - Translate a prompt to English
  app.post("/api/translate-prompt", async (req, res) => {
    try {
      const { content, text } = req.body;
      const textToTranslate = content || text;
      
      if (!textToTranslate || typeof textToTranslate !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Prompt-Inhalt ist erforderlich"
        });
      }

      const translation = await translateText(textToTranslate);

      res.json({
        success: true,
        translation: translation
      });

    } catch (error) {
      console.error("Fehler bei der Übersetzung:", error);
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten"
      });
    }
  });

  // GET /api/prompts - Get recent prompts
  app.get("/api/prompts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const prompts = await storage.getUserPrompts(undefined, limit);
      
      res.json({
        success: true,
        prompts: prompts.map(p => ({
          id: p.id,
          content: p.content,
          platform: p.platform,
          category: p.category,
          customCategory: p.customCategory,
          videoContent: p.videoContent,
          tones: p.tones,
          styles: p.styles,
          generationTime: p.generationTime,
          createdAt: p.createdAt
        }))
      });
    } catch (error) {
      console.error("Fehler beim Abrufen der Prompts:", error);
      res.status(500).json({
        success: false,
        message: "Fehler beim Abrufen der Prompts",
        prompts: []
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
