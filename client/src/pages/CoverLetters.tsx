import { CoverLetterCard, type CoverLetterWithApplications } from "@/components/CoverLetterCard";
import { AddCoverLetterDialog } from "@/components/AddCoverLetterDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CoverLetter, Application } from "@shared/schema";

export default function CoverLetters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: coverLetters, isLoading: coverLettersLoading } = useQuery<CoverLetter[]>({
    queryKey: ["/api/cover-letters"],
  });

  const { data: applications } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const coverLettersWithApplications = useMemo<CoverLetterWithApplications[]>(() => {
    if (!coverLetters) return [];

    return coverLetters.map((coverLetter) => {
      const linkedApplications = applications
        ?.filter((app) => app.coverLetterId === coverLetter.id)
        .map((app) => ({
          id: app.id,
          company: app.company,
          role: app.role,
        })) || [];

      return {
        ...coverLetter,
        linkedApplications: linkedApplications.length > 0 ? linkedApplications : undefined,
      };
    });
  }, [coverLetters, applications]);

  const filteredCoverLetters = useMemo(() => {
    if (!searchQuery) return coverLettersWithApplications;

    const query = searchQuery.toLowerCase();
    return coverLettersWithApplications.filter((coverLetter) => {
      return (
        coverLetter.title.toLowerCase().includes(query) ||
        coverLetter.company?.toLowerCase().includes(query) ||
        coverLetter.role?.toLowerCase().includes(query) ||
        coverLetter.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [coverLettersWithApplications, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Cover Letters</h1>
          <p className="text-muted-foreground">
            Create and manage cover letters for different job applications
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-cover-letter">
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

      {coverLettersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" data-testid={`skeleton-${i}`} />
          ))}
        </div>
      ) : filteredCoverLetters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12" data-testid="empty-state">
          <div className="p-6 rounded-full bg-muted mb-4">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? "No cover letters found" : "No cover letters yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search query"
              : "Get started by creating your first cover letter"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-first">
              <Plus className="h-4 w-4 mr-2" />
              Create Cover Letter
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoverLetters.map((coverLetter) => (
            <CoverLetterCard key={coverLetter.id} coverLetter={coverLetter} />
          ))}
        </div>
      )}

      <AddCoverLetterDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
