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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private applications: Map<string, Application>;
  private resumes: Map<string, Resume>;
  private coverLetters: Map<string, CoverLetter>;
  private contacts: Map<string, Contact>;
  private skills: Map<string, Skill>;
  private goals: Map<string, Goal>;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.resumes = new Map();
    this.coverLetters = new Map();
    this.contacts = new Map();
    this.skills = new Map();
    this.goals = new Map();
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
}

export const storage = new MemStorage();
