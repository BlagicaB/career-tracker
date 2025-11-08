import { 
  type User,
  type UpsertUser,
  type Application,
  type InsertApplication,
  type Resume,
  type InsertResume,
  type CoverLetter,
  type InsertCoverLetter,
  type Contact,
  type InsertContact,
  type Skill,
  type InsertSkill,
  type Goal,
  type InsertGoal,
  type JobFolder,
  type InsertJobFolder,
} from "@shared/schema.js";
import { randomUUID } from "crypto";

export interface IStorage {
  // Replit Auth - User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Applications (filtered by userId)
  getApplications(userId: string): Promise<Application[]>;
  getApplication(id: string, userId: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication, userId: string): Promise<Application>;
  updateApplication(id: string, application: Partial<InsertApplication>, userId: string): Promise<Application | undefined>;
  deleteApplication(id: string, userId: string): Promise<boolean>;
  
  // Resumes (filtered by userId)
  getResumes(userId: string): Promise<Resume[]>;
  getResume(id: string, userId: string): Promise<Resume | undefined>;
  createResume(resume: InsertResume, userId: string): Promise<Resume>;
  updateResume(id: string, resume: Partial<InsertResume>, userId: string): Promise<Resume | undefined>;
  deleteResume(id: string, userId: string): Promise<boolean>;
  
  // Cover Letters (filtered by userId)
  getCoverLetters(userId: string): Promise<CoverLetter[]>;
  getCoverLetter(id: string, userId: string): Promise<CoverLetter | undefined>;
  createCoverLetter(coverLetter: InsertCoverLetter, userId: string): Promise<CoverLetter>;
  updateCoverLetter(id: string, coverLetter: Partial<InsertCoverLetter>, userId: string): Promise<CoverLetter | undefined>;
  deleteCoverLetter(id: string, userId: string): Promise<boolean>;
  
  // Contacts (filtered by userId)
  getContacts(userId: string): Promise<Contact[]>;
  getContact(id: string, userId: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact, userId: string): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>, userId: string): Promise<Contact | undefined>;
  deleteContact(id: string, userId: string): Promise<boolean>;
  
  // Skills (filtered by userId)
  getSkills(userId: string): Promise<Skill[]>;
  getSkill(id: string, userId: string): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill, userId: string): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>, userId: string): Promise<Skill | undefined>;
  deleteSkill(id: string, userId: string): Promise<boolean>;
  
  // Goals (filtered by userId)
  getGoals(userId: string): Promise<Goal[]>;
  getGoal(id: string, userId: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal, userId: string): Promise<Goal>;
  updateGoal(id: string, goal: Partial<InsertGoal>, userId: string): Promise<Goal | undefined>;
  deleteGoal(id: string, userId: string): Promise<boolean>;
  
  // Job Folders (filtered by userId)
  getJobFolders(userId: string): Promise<JobFolder[]>;
  getJobFolder(id: string, userId: string): Promise<JobFolder | undefined>;
  createJobFolder(jobFolder: InsertJobFolder, userId: string): Promise<JobFolder>;
  updateJobFolder(id: string, jobFolder: Partial<InsertJobFolder>, userId: string): Promise<JobFolder | undefined>;
  deleteJobFolder(id: string, userId: string): Promise<boolean>;
}


export class DbStorage implements IStorage {
  private db;

  constructor(database: any) {
    this.db = database;
  }

  async getUser(id: string): Promise<User | undefined> {
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { users } = await import("@shared/schema");
    const [user] = await this.db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getApplications(userId: string): Promise<Application[]> {
    const { applications } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    return await this.db.select().from(applications).where(eq(applications.userId, userId));
  }

  async getApplication(id: string, userId: string): Promise<Application | undefined> {
    const { applications } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.select().from(applications).where(and(eq(applications.id, id), eq(applications.userId, userId)));
    return result[0];
  }

  async createApplication(insertApplication: InsertApplication, userId: string): Promise<Application> {
    const { applications } = await import("@shared/schema");
    const result = await this.db.insert(applications).values({ ...insertApplication, userId }).returning();
    return result[0];
  }

  async updateApplication(id: string, updates: Partial<InsertApplication>, userId: string): Promise<Application | undefined> {
    const { applications } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.update(applications).set(updates).where(and(eq(applications.id, id), eq(applications.userId, userId))).returning();
    return result[0];
  }

  async deleteApplication(id: string, userId: string): Promise<boolean> {
    const { applications } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.delete(applications).where(and(eq(applications.id, id), eq(applications.userId, userId))).returning();
    return result.length > 0;
  }

  async getResumes(userId: string): Promise<Resume[]> {
    const { resumes } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    return await this.db.select().from(resumes).where(eq(resumes.userId, userId));
  }

  async getResume(id: string, userId: string): Promise<Resume | undefined> {
    const { resumes } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.select().from(resumes).where(and(eq(resumes.id, id), eq(resumes.userId, userId)));
    return result[0];
  }

  async createResume(insertResume: InsertResume, userId: string): Promise<Resume> {
    const { resumes } = await import("@shared/schema");
    const result = await this.db.insert(resumes).values({ ...insertResume, userId }).returning();
    return result[0];
  }

  async updateResume(id: string, updates: Partial<InsertResume>, userId: string): Promise<Resume | undefined> {
    const { resumes } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.update(resumes).set(updates).where(and(eq(resumes.id, id), eq(resumes.userId, userId))).returning();
    return result[0];
  }

  async deleteResume(id: string, userId: string): Promise<boolean> {
    const { resumes } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.delete(resumes).where(and(eq(resumes.id, id), eq(resumes.userId, userId))).returning();
    return result.length > 0;
  }

  async getCoverLetters(userId: string): Promise<CoverLetter[]> {
    const { coverLetters } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    return await this.db.select().from(coverLetters).where(eq(coverLetters.userId, userId));
  }

  async getCoverLetter(id: string, userId: string): Promise<CoverLetter | undefined> {
    const { coverLetters } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.select().from(coverLetters).where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId)));
    return result[0];
  }

  async createCoverLetter(insertCoverLetter: InsertCoverLetter, userId: string): Promise<CoverLetter> {
    const { coverLetters } = await import("@shared/schema");
    const result = await this.db.insert(coverLetters).values({ ...insertCoverLetter, userId }).returning();
    return result[0];
  }

  async updateCoverLetter(id: string, updates: Partial<InsertCoverLetter>, userId: string): Promise<CoverLetter | undefined> {
    const { coverLetters } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const updatedValues = { ...updates, lastModified: new Date() };
    const result = await this.db.update(coverLetters).set(updatedValues).where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId))).returning();
    return result[0];
  }

  async deleteCoverLetter(id: string, userId: string): Promise<boolean> {
    const { coverLetters } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.delete(coverLetters).where(and(eq(coverLetters.id, id), eq(coverLetters.userId, userId))).returning();
    return result.length > 0;
  }

  async getContacts(userId: string): Promise<Contact[]> {
    const { contacts } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    return await this.db.select().from(contacts).where(eq(contacts.userId, userId));
  }

  async getContact(id: string, userId: string): Promise<Contact | undefined> {
    const { contacts } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.select().from(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, userId)));
    return result[0];
  }

  async createContact(insertContact: InsertContact, userId: string): Promise<Contact> {
    const { contacts } = await import("@shared/schema");
    const result = await this.db.insert(contacts).values({ ...insertContact, userId }).returning();
    return result[0];
  }

  async updateContact(id: string, updates: Partial<InsertContact>, userId: string): Promise<Contact | undefined> {
    const { contacts } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.update(contacts).set(updates).where(and(eq(contacts.id, id), eq(contacts.userId, userId))).returning();
    return result[0];
  }

  async deleteContact(id: string, userId: string): Promise<boolean> {
    const { contacts } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, userId))).returning();
    return result.length > 0;
  }

  async getSkills(userId: string): Promise<Skill[]> {
    const { skills } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    return await this.db.select().from(skills).where(eq(skills.userId, userId));
  }

  async getSkill(id: string, userId: string): Promise<Skill | undefined> {
    const { skills } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.select().from(skills).where(and(eq(skills.id, id), eq(skills.userId, userId)));
    return result[0];
  }

  async createSkill(insertSkill: InsertSkill, userId: string): Promise<Skill> {
    const { skills } = await import("@shared/schema");
    const result = await this.db.insert(skills).values({ ...insertSkill, userId }).returning();
    return result[0];
  }

  async updateSkill(id: string, updates: Partial<InsertSkill>, userId: string): Promise<Skill | undefined> {
    const { skills } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.update(skills).set(updates).where(and(eq(skills.id, id), eq(skills.userId, userId))).returning();
    return result[0];
  }

  async deleteSkill(id: string, userId: string): Promise<boolean> {
    const { skills } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.delete(skills).where(and(eq(skills.id, id), eq(skills.userId, userId))).returning();
    return result.length > 0;
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const { goals } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    return await this.db.select().from(goals).where(eq(goals.userId, userId));
  }

  async getGoal(id: string, userId: string): Promise<Goal | undefined> {
    const { goals } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    return result[0];
  }

  async createGoal(insertGoal: InsertGoal, userId: string): Promise<Goal> {
    const { goals } = await import("@shared/schema");
    const result = await this.db.insert(goals).values({ ...insertGoal, userId }).returning();
    return result[0];
  }

  async updateGoal(id: string, updates: Partial<InsertGoal>, userId: string): Promise<Goal | undefined> {
    const { goals } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.update(goals).set(updates).where(and(eq(goals.id, id), eq(goals.userId, userId))).returning();
    return result[0];
  }

  async deleteGoal(id: string, userId: string): Promise<boolean> {
    const { goals } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId))).returning();
    return result.length > 0;
  }

  async getJobFolders(userId: string): Promise<JobFolder[]> {
    const { jobFolders } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    return await this.db.select().from(jobFolders).where(eq(jobFolders.userId, userId));
  }

  async getJobFolder(id: string, userId: string): Promise<JobFolder | undefined> {
    const { jobFolders } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.select().from(jobFolders).where(and(eq(jobFolders.id, id), eq(jobFolders.userId, userId)));
    return result[0];
  }

  async createJobFolder(insertJobFolder: InsertJobFolder, userId: string): Promise<JobFolder> {
    const { jobFolders } = await import("@shared/schema");
    const result = await this.db.insert(jobFolders).values({ ...insertJobFolder, userId }).returning();
    return result[0];
  }

  async updateJobFolder(id: string, updates: Partial<InsertJobFolder>, userId: string): Promise<JobFolder | undefined> {
    const { jobFolders } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const updatedValues = { ...updates, lastModified: new Date() };
    const result = await this.db.update(jobFolders).set(updatedValues).where(and(eq(jobFolders.id, id), eq(jobFolders.userId, userId))).returning();
    return result[0];
  }

  async deleteJobFolder(id: string, userId: string): Promise<boolean> {
    const { jobFolders } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    const result = await this.db.delete(jobFolders).where(and(eq(jobFolders.id, id), eq(jobFolders.userId, userId))).returning();
    return result.length > 0;
  }
}

import { db } from "./db";

export const storage = new DbStorage(db);
