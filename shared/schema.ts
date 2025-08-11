import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Prompt storage table
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  platform: text("platform").notNull(),
  category: text("category").notNull(),
  customCategory: text("custom_category"),
  videoContent: text("video_content").notNull(),
  tones: text("tones").array().default([]),
  styles: text("styles").array().default([]),
  content: text("content").notNull(),
  generationTime: integer("generation_time").notNull(), // in milliseconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
}));

export const promptsRelations = relations(prompts, ({ one }) => ({
  user: one(users, {
    fields: [prompts.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type StoredPrompt = typeof prompts.$inferSelect;

// Platform-specific categories
export const platformCategories = {
  youtube: ["tutorials", "vlogs", "reviews", "gaming", "comedy", "musik", "dokus", "howtos", "unboxings", "storytelling", "diverses"],
  tiktok: ["trends", "challenges", "dance", "memes", "hacks", "skits", "reactions", "edits", "pov", "storytime", "diverses"],
  instagram: ["reels", "fashion", "food", "travel", "aesthetics", "lifestyle", "quotes", "stories", "diy", "fitness", "diverses"],
  facebook: ["community", "news", "events", "memes", "groups", "reactions", "diverses"],
  linkedin: ["leadership", "networking", "insights", "careers", "skills", "trends", "events", "success", "culture", "learning", "diverses"]
} as const;

// Style and tone options
export const toneOptions = [
  "motivierend", "informativ", "unterhaltsam", "seriös", "emotional", 
  "provokativ", "persönlich", "dramatisch", "inspirativ", "vertrauensvoll"
] as const;

export const styleOptions = [
  "dokumentarisch", "cinematisch", "minimalistisch", "dynamisch", "illustrativ",
  "authentisch", "ästhetisch", "humorvoll", "storytelling"
] as const;

// Prompt generation schemas
export const promptRequestSchema = z.object({
  platform: z.enum(["youtube", "tiktok", "instagram", "facebook", "linkedin"]),
  category: z.string().min(1, "Kategorie ist erforderlich"),
  customCategory: z.string().optional(),
  videoContent: z.string().min(1, "Inhalt und Ziel des Videos sind erforderlich").max(1000, "Beschreibung ist zu lang"),
  tones: z.array(z.enum(toneOptions)).default([]),
  styles: z.array(z.enum(styleOptions)).default([]),
}).refine((data) => {
  // If category is "diverses", customCategory must be provided
  if (data.category === "diverses") {
    return data.customCategory && data.customCategory.trim().length > 0;
  }
  return true;
}, {
  message: "Bei 'Diverses' ist eine individuelle Kategorie-Eingabe erforderlich",
  path: ["customCategory"]
});

export const promptSchema = z.object({
  id: z.number(),
  content: z.string(),
  category: z.string(),
});

export const promptResponseSchema = z.object({
  prompts: z.array(promptSchema),
  generationTime: z.number(),
  success: z.boolean(),
});

export type PromptRequest = z.infer<typeof promptRequestSchema>;
export type Prompt = z.infer<typeof promptSchema>;
export type PromptResponse = z.infer<typeof promptResponseSchema>;
