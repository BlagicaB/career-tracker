// server/storage.ts
import { db } from "./db.js";
import * as Shared from "../shared/schema.js";

/**
 * Storage layer for handling user data, applications, resumes, cover letters,
 * contacts, skills, goals, and job folders.
 * Everything here should map directly to tables and schemas defined in shared/schema.ts
 */

export const storage = {
  // --- Users ---
  async getUser(userId: string) {
    return db.query.users.findFirst({ where: (u) => u.id.eq(userId) });
  },

  // --- Applications ---
  async getApplications(userId: string) {
    return db.query.applications.findMany({ where: (a) => a.userId.eq(userId) });
  },
  async createApplication(data: Shared.InsertApplication, userId: string) {
    return db.insert(Shared.applications).values({ ...data, userId }).returning();
  },
  async updateApplication(id: string, data: Partial<Shared.InsertApplication>, userId: string) {
    return db
      .update(Shared.applications)
      .set(data)
      .where((a) => a.id.eq(id).and(a.userId.eq(userId)))
      .returning()
      .then((rows) => rows[0]);
  },
  async deleteApplication(id: string, userId: string) {
    const result = await db
      .delete(Shared.applications)
      .where((a) => a.id.eq(id).and(a.userId.eq(userId)));
    return result.rowCount > 0;
  },

  // --- Resumes ---
  async getResumes(userId: string) {
    return db.query.resumes.findMany({ where: (r) => r.userId.eq(userId) });
  },
  async createResume(data: Shared.InsertResume, userId: string) {
    return db.insert(Shared.resumes).values({ ...data, userId }).returning();
  },
  async updateResume(id: string, data: Partial<Shared.InsertResume>, userId: string) {
    return db
      .update(Shared.resumes)
      .set(data)
      .where((r) => r.id.eq(id).and(r.userId.eq(userId)))
      .returning()
      .then((rows) => rows
