// server/storage.ts
// Minimal in-memory storage used for Render demo builds.
// No DB, no external schema; keeps the server compiling and running.

type Json = Record<string, any>;

function uid() {
  // Node 18+ has crypto.randomUUID; fall back if needed.
  try {
    // @ts-ignore
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

class InMemoryByUser {
  private byUser = new Map<string, Map<string, Json>>();

  list(userId: string): Json[] {
    return Array.from(this.byUser.get(userId)?.values() ?? []);
  }

  get(userId: string, id: string): Json | undefined {
    return this.byUser.get(userId)?.get(id);
  }

  create(userId: string, data: Json): Json {
    const m = this.ensureUserMap(userId);
    const id = data.id ?? uid();
    const row = { id, userId, ...data };
    m.set(id, row);
    return row;
  }

  update(userId: string, id: string, patch: Json): Json | null {
    const m = this.byUser.get(userId);
    if (!m) return null;
    const cur = m.get(id);
    if (!cur) return null;
    const next = { ...cur, ...patch };
    m.set(id, next);
    return next;
  }

  delete(userId: string, id: string): boolean {
    const m = this.byUser.get(userId);
    return m ? m.delete(id) : false;
  }

  private ensureUserMap(userId: string) {
    let m = this.byUser.get(userId);
    if (!m) {
      m = new Map();
      this.byUser.set(userId, m);
    }
    return m;
  }
}

// Individual “tables”
const users = new Map<string, Json>();
const applications = new InMemoryByUser();
const resumes = new InMemoryByUser();
const coverLetters = new InMemoryByUser();
const contacts = new InMemoryByUser();
const skills = new InMemoryByUser();
const goals = new InMemoryByUser();
const jobFolders = new InMemoryByUser();

export const storage = {
  // ---- Users ----
  async getUser(userId: string): Promise<Json | null> {
    if (!users.has(userId)) {
      users.set(userId, { id: userId, name: "Demo User" });
    }
    return users.get(userId) ?? null;
  },

  // ---- Applications ----
  async getApplications(userId: string) { return applications.list(userId); },
  async createApplication(data: Json, userId: string) { return applications.create(userId, data); },
  async updateApplication(id: string, data: Json, userId: string) { return applications.update(userId, id, data); },
  async deleteApplication(id: string, userId: string) { return applications.delete(userId, id); },

  // ---- Resumes ----
  async getResumes(userId: string) { return resumes.list(userId); },
  async createResume(data: Json, userId: string) { return resumes.create(userId, data); },
  async updateResume(id: string, data: Json, userId: string) { return resumes.update(userId, id, data); },
  async deleteResume(id: string, userId: string) { return resumes.delete(userId, id); },

  // ---- Cover Letters ----
  async getCoverLetters(userId: string) { return coverLetters.list(userId); },
  async createCoverLetter(data: Json, userId: string) { return coverLetters.create(userId, data); },
  async updateCoverLetter(id: string, data: Json, userId: string) { return coverLetters.update(userId, id, data); },
  async deleteCoverLetter(id: string, userId: string) { return coverLetters.delete(userId, id); },

  // ---- Contacts ----
  async getContacts(userId: string) { return contacts.list(userId); },
  async createContact(data: Json, userId: string) { return contacts.create(userId, data); },
  async updateContact(id: string, data: Json, userId: string) { return contacts.update(userId, id, data); },
  async deleteContact(id: string, userId: string) { return contacts.delete(userId, id); },

  // ---- Skills ----
  async getSkills(userId: string) { return skills.list(userId); },
  async createSkill(data: Json, userId: string) { return skills.create(userId, data); },
  async updateSkill(id: string, data: Json, userId: string) { return skills.update(userId, id, data); },
  async deleteSkill(id: string, userId: string) { return skills.delete(userId, id); },

  // ---- Goals ----
  async getGoals(userId: string) { return goals.list(userId); },
  async createGoal(data: Json, userId: string) { return goals.create(userId, data); },
  async updateGoal(id: string, data: Json, userId: string) { return goals.update(userId, id, data); },
  async deleteGoal(id: string, userId: string) { return goals.delete(userId, id); },

  // ---- Job Folders ----
  async getJobFolders(userId: string) { return jobFolders.list(userId); },
  async getJobFolder(id: string, userId: string) { return jobFolders.get(userId, id) ?? null; },
  async createJobFolder(data: Json, userId: string) { return jobFolders.create(userId, data); },
  async updateJobFolder(id: string, data: Json, userId: string) { return jobFolders.update(userId, id, data); },
  async deleteJobFolder(id: string, userId: string) { return jobFolders.delete(userId, id); },
};

export type Storage = typeof storage;
