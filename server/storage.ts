import { users, moodEntries, exerciseSessions, type User, type InsertUser, type MoodEntry, type InsertMoodEntry, type ExerciseSession, type InsertExerciseSession } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Mood entry operations
  getMoodEntries(userId: number): Promise<MoodEntry[]>;
  getMoodEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getAllMoodEntries(): Promise<MoodEntry[]>;
  
  // Exercise session operations
  getExerciseSessions(userId: number): Promise<ExerciseSession[]>;
  createExerciseSession(session: InsertExerciseSession): Promise<ExerciseSession>;
  
  // Analytics
  getRecentMoodTrend(userId: number, days: number): Promise<MoodEntry[]>;
  
  // Admin operations
  clearAllData(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moodEntries: Map<number, MoodEntry>;
  private exerciseSessions: Map<number, ExerciseSession>;
  private currentUserId: number;
  private currentMoodEntryId: number;
  private currentExerciseSessionId: number;

  constructor() {
    this.users = new Map();
    this.moodEntries = new Map();
    this.exerciseSessions = new Map();
    this.currentUserId = 1;
    this.currentMoodEntryId = 1;
    this.currentExerciseSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      guardianEmail: (insertUser.guardianEmail && insertUser.guardianEmail.trim()) || null,
      guardianName: (insertUser.guardianName && insertUser.guardianName.trim()) || null
    };
    this.users.set(id, user);
    return user;
  }

  async getMoodEntries(userId: number): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getMoodEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values())
      .filter(entry => 
        entry.userId === userId && 
        entry.date >= startDate && 
        entry.date <= endDate
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const id = this.currentMoodEntryId++;
    const entry: MoodEntry = { 
      ...insertEntry, 
      id, 
      date: new Date(),
      notes: insertEntry.notes || null
    };
    this.moodEntries.set(id, entry);
    return entry;
  }

  async getExerciseSessions(userId: number): Promise<ExerciseSession[]> {
    return Array.from(this.exerciseSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async createExerciseSession(insertSession: InsertExerciseSession): Promise<ExerciseSession> {
    const id = this.currentExerciseSessionId++;
    const session: ExerciseSession = { 
      ...insertSession, 
      id, 
      completedAt: new Date()
    };
    this.exerciseSessions.set(id, session);
    return session;
  }

  async getRecentMoodTrend(userId: number, days: number): Promise<MoodEntry[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return Array.from(this.moodEntries.values())
      .filter(entry => 
        entry.userId === userId && 
        entry.date >= startDate
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllMoodEntries(): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async clearAllData(): Promise<void> {
    this.users.clear();
    this.moodEntries.clear();
    this.exerciseSessions.clear();
    this.currentUserId = 1;
    this.currentMoodEntryId = 1;
    this.currentExerciseSessionId = 1;
  }
}

export class DbStorage implements IStorage {
  private db = drizzle(neon(process.env.DATABASE_URL!));

  async getAllUsers(): Promise<User[]> {
    const result = await this.db.select().from(users);
    return result;
  }

  async getAllMoodEntries(): Promise<MoodEntry[]> {
    const result = await this.db.select().from(moodEntries).orderBy(desc(moodEntries.date));
    return result;
  }

  async clearAllData(): Promise<void> {
    await this.db.delete(exerciseSessions);
    await this.db.delete(moodEntries);
    await this.db.delete(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getMoodEntries(userId: number): Promise<MoodEntry[]> {
    const result = await this.db.select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.date));
    return result;
  }

  async getMoodEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    const result = await this.db.select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          gte(moodEntries.date, startDate),
          lte(moodEntries.date, endDate)
        )
      )
      .orderBy(desc(moodEntries.date));
    return result;
  }

  async createMoodEntry(insertEntry: InsertMoodEntry): Promise<MoodEntry> {
    const result = await this.db.insert(moodEntries).values(insertEntry).returning();
    return result[0];
  }

  async getExerciseSessions(userId: number): Promise<ExerciseSession[]> {
    const result = await this.db.select()
      .from(exerciseSessions)
      .where(eq(exerciseSessions.userId, userId))
      .orderBy(desc(exerciseSessions.completedAt));
    return result;
  }

  async createExerciseSession(insertSession: InsertExerciseSession): Promise<ExerciseSession> {
    const result = await this.db.insert(exerciseSessions).values(insertSession).returning();
    return result[0];
  }

  async getRecentMoodTrend(userId: number, days: number): Promise<MoodEntry[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const result = await this.db.select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          gte(moodEntries.date, startDate)
        )
      )
      .orderBy(desc(moodEntries.date));
    return result;
  }
}

export const storage = new MemStorage();
