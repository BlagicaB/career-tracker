import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Replit Auth - Session storage table
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Replit Auth - User storage table
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  company: text("company").notNull(),
  role: text("role").notNull(),
  location: text("location"),
  status: text("status").notNull().default("applied"),
  priority: text("priority").notNull().default("medium"),
  appliedDate: timestamp("applied_date").notNull().defaultNow(),
  salary: text("salary"),
  jobUrl: text("job_url"),
  referral: text("referral"),
  notes: text("notes"),
  nextFollowUp: timestamp("next_follow_up"),
  offerAmount: text("offer_amount"),
  jobType: text("job_type"),
  resumeId: varchar("resume_id"),
  coverLetterId: varchar("cover_letter_id"),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  uploadDate: timestamp("upload_date").notNull().defaultNow(),
  fileSize: text("file_size"),
  tags: text("tags").array(),
  content: text("content"),
});

export const coverLetters = pgTable("cover_letters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  company: text("company"),
  role: text("role"),
  createdDate: timestamp("created_date").notNull().defaultNow(),
  lastModified: timestamp("last_modified").notNull().defaultNow(),
  tags: text("tags").array(),
  content: text("content"),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  email: text("email"),
  linkedinUrl: text("linkedin_url"),
  howMet: text("how_met"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdDate: timestamp("created_date").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(),
  proficiency: integer("proficiency").notNull().default(0),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  progress: integer("progress").notNull().default(0),
  targetDate: timestamp("target_date"),
  status: text("status").notNull().default("in-progress"),
});

export const jobSearches = pgTable("job_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  salary: text("salary"),
  description: text("description"),
  jobUrl: text("job_url").notNull(),
  source: text("source").notNull(),
  postedDate: timestamp("posted_date"),
  connections: text("connections").array(),
  savedDate: timestamp("saved_date").notNull().defaultNow(),
});

export const jobFolders = pgTable("job_folders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  // Job Posting Details
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  salary: text("salary"),
  jobDescription: text("job_description"),
  jobRequirements: text("job_requirements"),
  jobUrl: text("job_url"),
  
  // Company Research
  companyResearch: text("company_research"), // AI-generated research summary
  companyHistory: text("company_history"),
  companyCurrent: text("company_current"),
  companyChallenges: text("company_challenges"),
  companyCulture: text("company_culture"),
  
  // Hiring Manager Info
  hiringManagerName: text("hiring_manager_name"),
  hiringManagerTitle: text("hiring_manager_title"),
  hiringManagerLinkedin: text("hiring_manager_linkedin"),
  hiringManagerBackground: text("hiring_manager_background"),
  
  // Resume & Application Materials
  resumeId: varchar("resume_id"),
  coverLetterId: varchar("cover_letter_id"),
  resumeAnalysis: text("resume_analysis"), // AI suggestions for resume improvements
  
  // Interview Prep
  interviewNotes: text("interview_notes"),
  questions: text("questions"),
  
  // Metadata
  status: text("status").notNull().default("researching"), // researching, ready, applied, interviewing, offered, rejected
  createdDate: timestamp("created_date").notNull().defaultNow(),
  lastModified: timestamp("last_modified").notNull().defaultNow(),
  applicationId: varchar("application_id"), // Link to existing application if created
});

// Replit Auth - User insert type
export type UpsertUser = typeof users.$inferInsert;

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  userId: true,
  appliedDate: true,
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  userId: true,
  uploadDate: true,
});

export const insertCoverLetterSchema = createInsertSchema(coverLetters).omit({
  id: true,
  userId: true,
  createdDate: true,
  lastModified: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  userId: true,
  createdDate: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  userId: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  userId: true,
});

export const insertJobSearchSchema = createInsertSchema(jobSearches).omit({
  id: true,
  userId: true,
  savedDate: true,
});

export const insertJobFolderSchema = createInsertSchema(jobFolders).omit({
  id: true,
  userId: true,
  createdDate: true,
  lastModified: true,
});

export type User = typeof users.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;
export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;
export type CoverLetter = typeof coverLetters.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertJobSearch = z.infer<typeof insertJobSearchSchema>;
export type JobSearch = typeof jobSearches.$inferSelect;
export type InsertJobFolder = z.infer<typeof insertJobFolderSchema>;
export type JobFolder = typeof jobFolders.$inferSelect;
