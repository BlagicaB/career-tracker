import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import {
  insertApplicationSchema,
  insertResumeSchema,
  insertCoverLetterSchema,
  insertContactSchema,
  insertSkillSchema,
  insertGoalSchema,
} from "@shared/schema";
import { extractBusinessCardInfo } from "./openai";

const businessCardScanSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Applications
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const result = insertApplicationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const application = await storage.createApplication(result.data);
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const result = insertApplicationSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const application = await storage.updateApplication(req.params.id, result.data);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const success = await storage.deleteApplication(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // Resumes
  app.get("/api/resumes", async (req, res) => {
    try {
      const resumes = await storage.getResumes();
      res.json(resumes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    try {
      const result = insertResumeSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const resume = await storage.createResume(result.data);
      res.json(resume);
    } catch (error) {
      res.status(500).json({ error: "Failed to create resume" });
    }
  });

  app.patch("/api/resumes/:id", async (req, res) => {
    try {
      const result = insertResumeSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const resume = await storage.updateResume(req.params.id, result.data);
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      res.status(500).json({ error: "Failed to update resume" });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const success = await storage.deleteResume(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete resume" });
    }
  });

  // Cover Letters
  app.get("/api/cover-letters", async (req, res) => {
    try {
      const coverLetters = await storage.getCoverLetters();
      res.json(coverLetters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cover letters" });
    }
  });

  app.post("/api/cover-letters", async (req, res) => {
    try {
      const result = insertCoverLetterSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const coverLetter = await storage.createCoverLetter(result.data);
      res.json(coverLetter);
    } catch (error) {
      res.status(500).json({ error: "Failed to create cover letter" });
    }
  });

  app.patch("/api/cover-letters/:id", async (req, res) => {
    try {
      const result = insertCoverLetterSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const coverLetter = await storage.updateCoverLetter(req.params.id, result.data);
      if (!coverLetter) {
        return res.status(404).json({ error: "Cover letter not found" });
      }
      res.json(coverLetter);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cover letter" });
    }
  });

  app.delete("/api/cover-letters/:id", async (req, res) => {
    try {
      const success = await storage.deleteCoverLetter(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Cover letter not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete cover letter" });
    }
  });

  // Contacts
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const contact = await storage.createContact(result.data);
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to create contact" });
    }
  });

  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const result = insertContactSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const contact = await storage.updateContact(req.params.id, result.data);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContact(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Skills
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const result = insertSkillSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const skill = await storage.createSkill(result.data);
      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  app.patch("/api/skills/:id", async (req, res) => {
    try {
      const result = insertSkillSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const skill = await storage.updateSkill(req.params.id, result.data);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const success = await storage.deleteSkill(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // Goals
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const result = insertGoalSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const goal = await storage.createGoal(result.data);
      res.json(goal);
    } catch (error) {
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const result = insertGoalSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      const goal = await storage.updateGoal(req.params.id, result.data);
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(500).json({ error: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const success = await storage.deleteGoal(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Goal not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete goal" });
    }
  });

  // Business card scanning endpoint
  app.post("/api/scan/business-card", async (req, res) => {
    try {
      const result = businessCardScanSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          error: "Invalid request",
          details: result.error.issues[0]?.message || "Image data is required"
        });
      }

      const contactInfo = await extractBusinessCardInfo(result.data.imageData);
      res.json(contactInfo);
    } catch (error: any) {
      console.error("Business card extraction error:", error);
      res.status(500).json({ 
        error: "Failed to extract business card information",
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
