import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  guardianEmail: text("guardian_email"), // Email for parent/teacher notifications
  guardianName: text("guardian_name"), // Name of parent/teacher
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mood: integer("mood").notNull(), // 1-5 scale
  notes: text("notes"),
  date: timestamp("date").notNull().defaultNow(),
});

export const exerciseSessions = pgTable("exercise_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'breathing' or 'meditation'
  duration: integer("duration").notNull(), // in seconds
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  age: true,
  gender: true,
  guardianEmail: true,
  guardianName: true,
}).extend({
  guardianEmail: z.string().email().optional().or(z.literal("")).optional(),
  guardianName: z.string().optional().or(z.literal("")).optional()
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).pick({
  userId: true,
  mood: true,
  notes: true,
});

export const insertExerciseSessionSchema = createInsertSchema(exerciseSessions).pick({
  userId: true,
  type: true,
  duration: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertExerciseSession = z.infer<typeof insertExerciseSessionSchema>;
export type ExerciseSession = typeof exerciseSessions.$inferSelect;
