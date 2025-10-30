import { CoverLetterCard, CoverLetter } from "@/components/CoverLetterCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const mockCoverLetters: CoverLetter[] = [
  {
    id: "1",
    title: "Senior Software Engineer Cover Letter",
    company: "Tech Corp",
    role: "Senior Software Engineer",
    createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    tags: ["Technical", "Leadership", "Full Stack"],
  },
  {
    id: "2",
    title: "Frontend Specialist Cover Letter",
    company: "StartupXYZ",
    role: "Frontend Developer",
    createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    tags: ["Frontend", "React", "UI/UX"],
  },
  {
    id: "3",
    title: "General Tech Role Cover Letter",
    createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    tags: ["General", "Adaptable"],
  },
  {
    id: "4",
    title: "DevOps Engineer Cover Letter",
    company: "Cloud Systems",
    role: "DevOps Engineer",
    createdDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    tags: ["DevOps", "Cloud", "Infrastructure"],
  },
];

export default function CoverLetters() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Cover Letters</h1>
          <p className="text-muted-foreground">
            Create and manage cover letters for different job applications
          </p>
        </div>
        <Button data-testid="button-add-cover-letter">
          <Plus className="h-4 w-4 mr-2" />
          New Cover Letter
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cover letters by title, company, or role..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCoverLetters.map((coverLetter) => (
          <CoverLetterCard key={coverLetter.id} coverLetter={coverLetter} />
        ))}
      </div>
    </div>
  );
}
