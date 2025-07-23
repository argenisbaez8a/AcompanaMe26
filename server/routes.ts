import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMoodEntrySchema, insertExerciseSessionSchema } from "@shared/schema";
import { sendCriticalPatternAlert } from "./email";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Mood entry routes
  app.post("/api/mood-entries", async (req, res) => {
    try {
      const entryData = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid mood entry data" });
    }
  });

  app.get("/api/mood-entries/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const entries = await storage.getMoodEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mood entries" });
    }
  });

  app.get("/api/mood-entries/:userId/trend/:days", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const days = parseInt(req.params.days);
      const entries = await storage.getRecentMoodTrend(userId, days);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mood trend" });
    }
  });

  // Exercise session routes
  app.post("/api/exercise-sessions", async (req, res) => {
    try {
      const sessionData = insertExerciseSessionSchema.parse(req.body);
      const session = await storage.createExerciseSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid exercise session data" });
    }
  });

  app.get("/api/exercise-sessions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessions = await storage.getExerciseSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exercise sessions" });
    }
  });

  // Email notification route for critical patterns
  app.post("/api/send-critical-alert", async (req, res) => {
    try {
      const { userId, patternType } = z.object({
        userId: z.number(),
        patternType: z.string()
      }).parse(req.body);

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.guardianEmail) {
        return res.status(400).json({ error: "No guardian email configured" });
      }

      const recentMoods = await storage.getRecentMoodTrend(userId, 7);
      const patternDetails = `Se detectaron ${recentMoods.filter(m => m.mood <= 2).length} registros con estado emocional bajo en los últimos 7 días. Los registros muestran una tendencia preocupante que requiere atención.`;

      const emailSent = await sendCriticalPatternAlert({
        to: user.guardianEmail,
        guardianName: user.guardianName || 'Tutor/Padre',
        studentName: user.name,
        patternDetails
      });

      if (emailSent) {
        res.json({ success: true, message: "Alert email sent successfully" });
      } else {
        res.status(500).json({ error: "Failed to send alert email" });
      }
    } catch (error) {
      console.error('Error sending critical alert:', error);
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
