import { users, prompts, type User, type InsertUser, type StoredPrompt, type InsertPrompt } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  savePrompt(prompt: InsertPrompt): Promise<StoredPrompt>;
  getUserPrompts(userId?: number, limit?: number): Promise<StoredPrompt[]>;
  getPromptById(id: number): Promise<StoredPrompt | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async savePrompt(prompt: InsertPrompt): Promise<StoredPrompt> {
    const [savedPrompt] = await db
      .insert(prompts)
      .values(prompt)
      .returning();
    return savedPrompt;
  }

  async getUserPrompts(userId?: number, limit: number = 50): Promise<StoredPrompt[]> {
    if (userId) {
      return await db.select()
        .from(prompts)
        .where(eq(prompts.userId, userId))
        .orderBy(desc(prompts.createdAt))
        .limit(limit);
    }
    
    return await db.select()
      .from(prompts)
      .orderBy(desc(prompts.createdAt))
      .limit(limit);
  }

  async getPromptById(id: number): Promise<StoredPrompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt || undefined;
  }
}

export const storage = new DatabaseStorage();
