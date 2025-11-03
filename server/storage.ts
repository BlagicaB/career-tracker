import { 
  type User, 
  type InsertUser,
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
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Applications
  getApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, application: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: string): Promise<boolean>;
  
  // Resumes
  getResumes(): Promise<Resume[]>;
  getResume(id: string): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: string, resume: Partial<InsertResume>): Promise<Resume | undefined>;
  deleteResume(id: string): Promise<boolean>;
  
  // Cover Letters
  getCoverLetters(): Promise<CoverLetter[]>;
  getCoverLetter(id: string): Promise<CoverLetter | undefined>;
  createCoverLetter(coverLetter: InsertCoverLetter): Promise<CoverLetter>;
  updateCoverLetter(id: string, coverLetter: Partial<InsertCoverLetter>): Promise<CoverLetter | undefined>;
  deleteCoverLetter(id: string): Promise<boolean>;
  
  // Contacts
  getContacts(): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
  
  // Skills
  getSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;
  
  // Goals
  getGoals(): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;
  
  // Job Folders
  getJobFolders(): Promise<JobFolder[]>;
  getJobFolder(id: string): Promise<JobFolder | undefined>;
  createJobFolder(jobFolder: InsertJobFolder): Promise<JobFolder>;
  updateJobFolder(id: string, jobFolder: Partial<InsertJobFolder>): Promise<JobFolder | undefined>;
  deleteJobFolder(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private applications: Map<string, Application>;
  private resumes: Map<string, Resume>;
  private coverLetters: Map<string, CoverLetter>;
  private contacts: Map<string, Contact>;
  private skills: Map<string, Skill>;
  private goals: Map<string, Goal>;
  private jobFolders: Map<string, JobFolder>;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.resumes = new Map();
    this.coverLetters = new Map();
    this.contacts = new Map();
    this.skills = new Map();
    this.goals = new Map();
    this.jobFolders = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      id,
      company: insertApplication.company,
      role: insertApplication.role,
      location: insertApplication.location ?? null,
      status: insertApplication.status ?? "applied",
      priority: insertApplication.priority ?? "medium",
      appliedDate: new Date(),
      salary: insertApplication.salary ?? null,
      jobUrl: insertApplication.jobUrl ?? null,
      referral: insertApplication.referral ?? null,
      notes: insertApplication.notes ?? null,
      nextFollowUp: insertApplication.nextFollowUp ?? null,
      offerAmount: insertApplication.offerAmount ?? null,
      jobType: insertApplication.jobType ?? null,
      resumeId: insertApplication.resumeId ?? null,
      coverLetterId: insertApplication.coverLetterId ?? null,
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const existing = this.applications.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.applications.set(id, updated);
    return updated;
  }

  async deleteApplication(id: string): Promise<boolean> {
    return this.applications.delete(id);
  }

  // Resumes
  async getResumes(): Promise<Resume[]> {
    return Array.from(this.resumes.values());
  }

  async getResume(id: string): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = randomUUID();
    const resume: Resume = {
      id,
      title: insertResume.title,
      uploadDate: new Date(),
      fileSize: insertResume.fileSize ?? null,
      tags: insertResume.tags ?? null,
      content: insertResume.content ?? null,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume | undefined> {
    const existing = this.resumes.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: string): Promise<boolean> {
    return this.resumes.delete(id);
  }

  // Cover Letters
  async getCoverLetters(): Promise<CoverLetter[]> {
    return Array.from(this.coverLetters.values());
  }

  async getCoverLetter(id: string): Promise<CoverLetter | undefined> {
    return this.coverLetters.get(id);
  }

  async createCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const id = randomUUID();
    const now = new Date();
    const coverLetter: CoverLetter = {
      id,
      title: insertCoverLetter.title,
      company: insertCoverLetter.company ?? null,
      role: insertCoverLetter.role ?? null,
      createdDate: now,
      lastModified: now,
      tags: insertCoverLetter.tags ?? null,
      content: insertCoverLetter.content ?? null,
    };
    this.coverLetters.set(id, coverLetter);
    return coverLetter;
  }

  async updateCoverLetter(id: string, updates: Partial<InsertCoverLetter>): Promise<CoverLetter | undefined> {
    const existing = this.coverLetters.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, lastModified: new Date() };
    this.coverLetters.set(id, updated);
    return updated;
  }

  async deleteCoverLetter(id: string): Promise<boolean> {
    return this.coverLetters.delete(id);
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      id,
      name: insertContact.name,
      title: insertContact.title,
      company: insertContact.company,
      email: insertContact.email ?? null,
      linkedinUrl: insertContact.linkedinUrl ?? null,
      howMet: insertContact.howMet ?? null,
      status: insertContact.status ?? "active",
      notes: insertContact.notes ?? null,
      createdDate: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: string, updates: Partial<InsertContact>): Promise<Contact | undefined> {
    const existing = this.contacts.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.contacts.set(id, updated);
    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const skill: Skill = {
      id,
      name: insertSkill.name,
      category: insertSkill.category,
      proficiency: insertSkill.proficiency ?? 0,
    };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: string, updates: Partial<InsertSkill>): Promise<Skill | undefined> {
    const existing = this.skills.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: string): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values());
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = {
      id,
      title: insertGoal.title,
      description: insertGoal.description ?? null,
      category: insertGoal.category,
      progress: insertGoal.progress ?? 0,
      targetDate: insertGoal.targetDate ?? null,
      status: insertGoal.status ?? "in-progress",
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, updates: Partial<InsertGoal>): Promise<Goal | undefined> {
    const existing = this.goals.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: string): Promise<boolean> {
    return this.goals.delete(id);
  }

  // Job Folders
  async getJobFolders(): Promise<JobFolder[]> {
    return Array.from(this.jobFolders.values());
  }

  async getJobFolder(id: string): Promise<JobFolder | undefined> {
    return this.jobFolders.get(id);
  }

  async createJobFolder(insertJobFolder: InsertJobFolder): Promise<JobFolder> {
    const id = randomUUID();
    const now = new Date();
    const jobFolder: JobFolder = {
      id,
      jobTitle: insertJobFolder.jobTitle,
      company: insertJobFolder.company,
      location: insertJobFolder.location ?? null,
      salary: insertJobFolder.salary ?? null,
      jobDescription: insertJobFolder.jobDescription ?? null,
      jobRequirements: insertJobFolder.jobRequirements ?? null,
      jobUrl: insertJobFolder.jobUrl ?? null,
      companyResearch: insertJobFolder.companyResearch ?? null,
      companyHistory: insertJobFolder.companyHistory ?? null,
      companyCurrent: insertJobFolder.companyCurrent ?? null,
      companyChallenges: insertJobFolder.companyChallenges ?? null,
      companyCulture: insertJobFolder.companyCulture ?? null,
      hiringManagerName: insertJobFolder.hiringManagerName ?? null,
      hiringManagerTitle: insertJobFolder.hiringManagerTitle ?? null,
      hiringManagerLinkedin: insertJobFolder.hiringManagerLinkedin ?? null,
      hiringManagerBackground: insertJobFolder.hiringManagerBackground ?? null,
      resumeId: insertJobFolder.resumeId ?? null,
      coverLetterId: insertJobFolder.coverLetterId ?? null,
      resumeAnalysis: insertJobFolder.resumeAnalysis ?? null,
      interviewNotes: insertJobFolder.interviewNotes ?? null,
      questions: insertJobFolder.questions ?? null,
      status: insertJobFolder.status ?? "researching",
      createdDate: now,
      lastModified: now,
      applicationId: insertJobFolder.applicationId ?? null,
    };
    this.jobFolders.set(id, jobFolder);
    return jobFolder;
  }

  async updateJobFolder(id: string, updates: Partial<InsertJobFolder>): Promise<JobFolder | undefined> {
    const existing = this.jobFolders.get(id);
    if (!existing) return undefined;
    const updated = { 
      ...existing, 
      ...updates,
      lastModified: new Date(),
    };
    this.jobFolders.set(id, updated);
    return updated;
  }

  async deleteJobFolder(id: string): Promise<boolean> {
    return this.jobFolders.delete(id);
  }
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

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { users } = await import("@shared/schema");
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getApplications(): Promise<Application[]> {
    const { applications } = await import("@shared/schema");
    return await this.db.select().from(applications);
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const { applications } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(applications).where(eq(applications.id, id));
    return result[0];
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const { applications } = await import("@shared/schema");
    const result = await this.db.insert(applications).values(insertApplication).returning();
    return result[0];
  }

  async updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const { applications } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.update(applications).set(updates).where(eq(applications.id, id)).returning();
    return result[0];
  }

  async deleteApplication(id: string): Promise<boolean> {
    const { applications } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.delete(applications).where(eq(applications.id, id)).returning();
    return result.length > 0;
  }

  async getResumes(): Promise<Resume[]> {
    const { resumes } = await import("@shared/schema");
    return await this.db.select().from(resumes);
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const { resumes } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(resumes).where(eq(resumes.id, id));
    return result[0];
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const { resumes } = await import("@shared/schema");
    const result = await this.db.insert(resumes).values(insertResume).returning();
    return result[0];
  }

  async updateResume(id: string, updates: Partial<InsertResume>): Promise<Resume | undefined> {
    const { resumes } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.update(resumes).set(updates).where(eq(resumes.id, id)).returning();
    return result[0];
  }

  async deleteResume(id: string): Promise<boolean> {
    const { resumes } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.delete(resumes).where(eq(resumes.id, id)).returning();
    return result.length > 0;
  }

  async getCoverLetters(): Promise<CoverLetter[]> {
    const { coverLetters } = await import("@shared/schema");
    return await this.db.select().from(coverLetters);
  }

  async getCoverLetter(id: string): Promise<CoverLetter | undefined> {
    const { coverLetters } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(coverLetters).where(eq(coverLetters.id, id));
    return result[0];
  }

  async createCoverLetter(insertCoverLetter: InsertCoverLetter): Promise<CoverLetter> {
    const { coverLetters } = await import("@shared/schema");
    const result = await this.db.insert(coverLetters).values(insertCoverLetter).returning();
    return result[0];
  }

  async updateCoverLetter(id: string, updates: Partial<InsertCoverLetter>): Promise<CoverLetter | undefined> {
    const { coverLetters } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const updatedValues = { ...updates, lastModified: new Date() };
    const result = await this.db.update(coverLetters).set(updatedValues).where(eq(coverLetters.id, id)).returning();
    return result[0];
  }

  async deleteCoverLetter(id: string): Promise<boolean> {
    const { coverLetters } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.delete(coverLetters).where(eq(coverLetters.id, id)).returning();
    return result.length > 0;
  }

  async getContacts(): Promise<Contact[]> {
    const { contacts } = await import("@shared/schema");
    return await this.db.select().from(contacts);
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const { contacts } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(contacts).where(eq(contacts.id, id));
    return result[0];
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const { contacts } = await import("@shared/schema");
    const result = await this.db.insert(contacts).values(insertContact).returning();
    return result[0];
  }

  async updateContact(id: string, updates: Partial<InsertContact>): Promise<Contact | undefined> {
    const { contacts } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.update(contacts).set(updates).where(eq(contacts.id, id)).returning();
    return result[0];
  }

  async deleteContact(id: string): Promise<boolean> {
    const { contacts } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.delete(contacts).where(eq(contacts.id, id)).returning();
    return result.length > 0;
  }

  async getSkills(): Promise<Skill[]> {
    const { skills } = await import("@shared/schema");
    return await this.db.select().from(skills);
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    const { skills } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(skills).where(eq(skills.id, id));
    return result[0];
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const { skills } = await import("@shared/schema");
    const result = await this.db.insert(skills).values(insertSkill).returning();
    return result[0];
  }

  async updateSkill(id: string, updates: Partial<InsertSkill>): Promise<Skill | undefined> {
    const { skills } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.update(skills).set(updates).where(eq(skills.id, id)).returning();
    return result[0];
  }

  async deleteSkill(id: string): Promise<boolean> {
    const { skills } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.delete(skills).where(eq(skills.id, id)).returning();
    return result.length > 0;
  }

  async getGoals(): Promise<Goal[]> {
    const { goals } = await import("@shared/schema");
    return await this.db.select().from(goals);
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    const { goals } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(goals).where(eq(goals.id, id));
    return result[0];
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const { goals } = await import("@shared/schema");
    const result = await this.db.insert(goals).values(insertGoal).returning();
    return result[0];
  }

  async updateGoal(id: string, updates: Partial<InsertGoal>): Promise<Goal | undefined> {
    const { goals } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.update(goals).set(updates).where(eq(goals.id, id)).returning();
    return result[0];
  }

  async deleteGoal(id: string): Promise<boolean> {
    const { goals } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.delete(goals).where(eq(goals.id, id)).returning();
    return result.length > 0;
  }

  async getJobFolders(): Promise<JobFolder[]> {
    const { jobFolders } = await import("@shared/schema");
    return await this.db.select().from(jobFolders);
  }

  async getJobFolder(id: string): Promise<JobFolder | undefined> {
    const { jobFolders } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.select().from(jobFolders).where(eq(jobFolders.id, id));
    return result[0];
  }

  async createJobFolder(insertJobFolder: InsertJobFolder): Promise<JobFolder> {
    const { jobFolders } = await import("@shared/schema");
    const result = await this.db.insert(jobFolders).values(insertJobFolder).returning();
    return result[0];
  }

  async updateJobFolder(id: string, updates: Partial<InsertJobFolder>): Promise<JobFolder | undefined> {
    const { jobFolders } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const updatedValues = { ...updates, lastModified: new Date() };
    const result = await this.db.update(jobFolders).set(updatedValues).where(eq(jobFolders.id, id)).returning();
    return result[0];
  }

  async deleteJobFolder(id: string): Promise<boolean> {
    const { jobFolders } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const result = await this.db.delete(jobFolders).where(eq(jobFolders.id, id)).returning();
    return result.length > 0;
  }
}

import { db } from "./db";

export const storage = new DbStorage(db);
