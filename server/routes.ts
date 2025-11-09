// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

import { storage } from "./storage.js"; // relative -> .js
import {
  extractBusinessCardInfo,
  analyzeResumeForJob,
  conductCompanyResearch,
  generateCoverLetter,
} from "./openai.js"; // relative -> .js

const businessCardScanSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // --- TEMP auth shim so code using req.user.claims.sub keeps working ---
  app.use((req, _res, next) => {
    const anyReq = req as any;
    if (!anyReq.user) {
      anyReq.user = { claims: { sub: (req.headers["x-user-id"] as string) || "demo" } };
    }
    next();
  });

  // Health check (Render checks this sometimes)
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Minimal /api/me so client has something to read
  app.get("/api/me", async (_req, res) => {
    res.json({ authenticated: false });
  });

  // ========== Applications ==========
  app.get("/api/applications", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const rows = await storage.getApplications(userId);
      res.json(rows);
    } catch {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.createApplication(req.body, userId);
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.updateApplication(req.params.id, req.body, userId);
      if (!row) return res.status(404).json({ error: "Application not found" });
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const ok = await storage.deleteApplication(req.params.id, userId);
      if (!ok) return res.status(404).json({ error: "Application not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // ========== Resumes ==========
  app.get("/api/resumes", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.getResumes(userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.createResume(req.body, userId));
    } catch {
      res.status(500).json({ error: "Failed to create resume" });
    }
  });

  app.patch("/api/resumes/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.updateResume(req.params.id, req.body, userId);
      if (!row) return res.status(404).json({ error: "Resume not found" });
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const ok = await storage.deleteResume(req.params.id, userId);
      if (!ok) return res.status(404).json({ error: "Resume not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete resume" });
    }
  });

  // ========== Cover Letters ==========
  app.get("/api/cover-letters", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.getCoverLetters(userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch cover letters" });
    }
  });

  app.post("/api/cover-letters", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.createCoverLetter(req.body, userId));
    } catch {
      res.status(500).json({ error: "Failed to create cover letter" });
    }
  });

  app.patch("/api/cover-letters/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.updateCoverLetter(req.params.id, req.body, userId);
      if (!row) return res.status(404).json({ error: "Cover letter not found" });
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to update cover letter" });
    }
  });

  app.delete("/api/cover-letters/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const ok = await storage.deleteCoverLetter(req.params.id, userId);
      if (!ok) return res.status(404).json({ error: "Cover letter not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete cover letter" });
    }
  });

  // ========== Contacts ==========
  app.get("/api/contacts", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.getContacts(userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.createContact(req.body, userId));
    } catch {
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.updateContact(req.params.id, req.body, userId);
      if (!row) return res.status(404).json({ error: "Contact not found" });
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const ok = await storage.deleteContact(req.params.id, userId);
      if (!ok) return res.status(404).json({ error: "Contact not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // ========== Skills ==========
  app.get("/api/skills", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.getSkills(userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.createSkill(req.body, userId));
    } catch {
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  app.patch("/api/skills/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.updateSkill(req.params.id, req.body, userId);
      if (!row) return res.status(404).json({ error: "Skill not found" });
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const ok = await storage.deleteSkill(req.params.id, userId);
      if (!ok) return res.status(404).json({ error: "Skill not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // ========== Goals ==========
  app.get("/api/goals", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.getGoals(userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.createGoal(req.body, userId));
    } catch {
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.updateGoal(req.params.id, req.body, userId);
      if (!row) return res.status(404).json({ error: "Goal not found" });
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const ok = await storage.deleteGoal(req.params.id, userId);
      if (!ok) return res.status(404).json({ error: "Goal not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete goal" });
    }
  });

  // ========== Job Folders ==========
  app.get("/api/job-folders", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.getJobFolders(userId));
    } catch {
      res.status(500).json({ error: "Failed to fetch job folders" });
    }
  });

  app.get("/api/job-folders/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.getJobFolder(req.params.id, userId);
      if (!row) return res.status(404).json({ error: "Job folder not found" });
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to fetch job folder" });
    }
  });

  app.post("/api/job-folders", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      res.json(await storage.createJobFolder(req.body, userId));
    } catch {
      res.status(500).json({ error: "Failed to create job folder" });
    }
  });

  app.patch("/api/job-folders/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const row = await storage.updateJobFolder(req.params.id, req.body, userId);
      if (!row) return res.status(404).json({ error: "Job folder not found" });
      res.json(row);
    } catch {
      res.status(500).json({ error: "Failed to update job folder" });
    }
  });

  app.delete("/api/job-folders/:id", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const ok = await storage.deleteJobFolder(req.params.id, userId);
      if (!ok) return res.status(404).json({ error: "Job folder not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete job folder" });
    }
  });

  // ========== AI helpers ==========
  app.post("/api/job-folders/:id/analyze-resume", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const jf = await storage.getJobFolder(req.params.id, userId);
      if (!jf) return res.status(404).json({ error: "Job folder not found" });

      const { resumeContent } = req.body ?? {};
      if (!resumeContent) return res.status(400).json({ error: "Resume content is required" });
      if (!jf.jobDescription) return res.status(400).json({ error: "Job description is required for analysis" });

      const analysis = await analyzeResumeForJob(resumeContent, jf.jobDescription);
      await storage.updateJobFolder(req.params.id, { resumeAnalysis: JSON.stringify(analysis) }, userId);
      res.json(analysis);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to analyze resume", details: e?.message });
    }
  });

  app.post("/api/job-folders/:id/research-company", async (req, res) => {
    try {
      const userId = (req as any).user.claims.sub as string;
      const jf = await storage.getJobFolder(req.params.id, userId);
      if (!jf) return res.status(404).json({ error: "Job folder not found" });

      const demoContext = `Generate comprehensive research for ${jf.company} including history, current state, challenges, and culture.`;
      const research = await conductCompanyResearch(jf.company, demoContext);

      await storage.updateJobFolder(
        req.params.id,
        {
          companyResearch: research.summary,
          companyHistory: research.history,
          companyCurrent: research.currentState,
          companyChallenges: research.challenges,
          companyCulture: research.culture,
        },
        userId
      );

      res.json(research);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to conduct company research", details: e?.message });
    }
  });

  app.post("/api/generate-cover-letter", async (req, res) => {
    try {
      const { resumeContent, jobTitle, company, jobDescription } = req.body ?? {};
      if (!resumeContent || !jobTitle || !company) {
        return res.status(400).json({ error: "resumeContent, jobTitle, and company are required" });
      }
      const coverLetter = await generateCoverLetter(resumeContent, jobTitle, company, jobDescription);
      res.json({ coverLetter });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to generate cover letter", details: e?.message });
    }
  });

  // Business card scanning
  app.post("/api/scan/business-card", async (req, res) => {
    try {
      const parsed = businessCardScanSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request", details: parsed.error.issues[0]?.message });
      }
      const contactInfo = await extractBusinessCardInfo(parsed.data.imageData);
      res.json(contactInfo);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to extract business card information", details: e?.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
