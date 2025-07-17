import { users, moodEntries, exerciseSessions, type User, type InsertUser, type MoodEntry, type InsertMoodEntry, type ExerciseSession, type InsertExerciseSession } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mood entry operations
  getMoodEntries(userId: number): Promise<MoodEntry[]>;
  getMoodEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  
  // Exercise session operations
  getExerciseSessions(userId: number): Promise<ExerciseSession[]>;
  createExerciseSession(session: InsertExerciseSession): Promise<ExerciseSession>;
  
  // Analytics
  getRecentMoodTrend(userId: number, days: number): Promise<MoodEntry[]>;
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
      createdAt: new Date()
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
      date: new Date()
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
}

export const storage = new MemStorage();
