import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

import { storage } from "./storage.js"; // <-- .js because it's a relative import
import {
  insertApplicationSchema,
  insertResumeSchema,
  insertCoverLetterSchema,
  insertContactSchema,
  insertSkillSchema,
  insertGoalSchema,
  insertJobFolderSchema,
} from "@shared/schema"; // <-- NO extension for alias

import {
  extractBusinessCardInfo,
  analyzeResumeForJob,
  conductCompanyResearch,
  generateCoverLetter,
} from "./openai.js"; // <-- .js because it's a relative import

const businessCardScanSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // --- TEMP auth shim while you don’t have real auth ---
  // (Matches your code that expects req.user.claims.sub)
  app.use((req, _res, next) => {
    const anyReq = req as any;
    if (!anyReq.user) {
      anyReq.user = {
        claims: { sub: (req.headers["x-user-id"] as string) || "demo" },
      };
    }
    next();
  });

  // Minimal /api/me so the client has something to read
  app.get("/api/me", async (_req, res) => {
    res.json({ authenticated: false });
  });

  // …leave the rest of your existing route handlers exactly as they are …
  // (Applications, Resumes, Cover Letters, Contacts, Skills, Goals, Job Folders, etc.)

  const httpServer = createServer(app);
  return httpServer;
}
