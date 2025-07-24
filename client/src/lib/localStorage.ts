// Local storage management for mood diary entries
import type { MoodEntry, User } from "@shared/schema";

const MOOD_ENTRIES_KEY = 'mindcare_mood_entries';
const USERS_KEY = 'mindcare_users';

// Helper functions to handle null/undefined conversion
function deserializeMoodEntry(entry: any): MoodEntry {
  return {
    ...entry,
    date: new Date(entry.date),
    notes: entry.notes || undefined
  };
}

function deserializeUser(user: any): User {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    guardianEmail: user.guardianEmail || undefined,
    guardianName: user.guardianName || undefined
  };
}

export class LocalStorage {
  // Mood entries management
  static getMoodEntries(userId: number): MoodEntry[] {
    try {
      const entries = localStorage.getItem(MOOD_ENTRIES_KEY);
      if (!entries) return [];
      
      const allEntries = JSON.parse(entries);
      return allEntries
        .filter((entry: any) => entry.userId === userId)
        .map(deserializeMoodEntry);
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  }

  static addMoodEntry(entry: Omit<MoodEntry, 'id'>): MoodEntry {
    try {
      const entries = localStorage.getItem(MOOD_ENTRIES_KEY);
      const allEntries: MoodEntry[] = entries ? JSON.parse(entries) : [];
      
      const newEntry: MoodEntry = {
        ...entry,
        id: Date.now(), // Simple ID generation
        date: new Date(),
        notes: entry.notes || null,
      };
      
      allEntries.push(newEntry);
      localStorage.setItem(MOOD_ENTRIES_KEY, JSON.stringify(allEntries));
      
      return newEntry;
    } catch (error) {
      console.error('Error adding mood entry:', error);
      throw error;
    }
  }

  static getAllMoodEntries(): MoodEntry[] {
    try {
      const entries = localStorage.getItem(MOOD_ENTRIES_KEY);
      return entries ? JSON.parse(entries).map(deserializeMoodEntry) : [];
    } catch (error) {
      console.error('Error getting all mood entries:', error);
      return [];
    }
  }

  // Users management
  static getUser(userId: number): User | null {
    try {
      const users = localStorage.getItem(USERS_KEY);
      if (!users) return null;
      
      const allUsers = JSON.parse(users);
      const user = allUsers.find((user: any) => user.id === userId);
      return user ? deserializeUser(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    try {
      const users = localStorage.getItem(USERS_KEY);
      const allUsers: User[] = users ? JSON.parse(users) : [];
      
      const newUser: User = {
        ...user,
        id: Date.now(),
        createdAt: new Date(),
      };
      
      allUsers.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
      
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  static getAllUsers(): User[] {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users).map(deserializeUser) : [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Clear all data (for master code reset)
  static clearAllData(): void {
    try {
      localStorage.removeItem(MOOD_ENTRIES_KEY);
      localStorage.removeItem(USERS_KEY);
      localStorage.removeItem('mindcare_current_user');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  // Current user session
  static setCurrentUser(userId: number): void {
    localStorage.setItem('mindcare_current_user', userId.toString());
  }

  static getCurrentUser(): number | null {
    const userId = localStorage.getItem('mindcare_current_user');
    return userId ? parseInt(userId, 10) : null;
  }

  static clearCurrentUser(): void {
    localStorage.removeItem('mindcare_current_user');
  }
}