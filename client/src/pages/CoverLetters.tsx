import { CoverLetterCard, type CoverLetterWithApplications } from "@/components/CoverLetterCard";
import { AddCoverLetterDialog } from "@/components/AddCoverLetterDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CoverLetter, Application } from "@shared/schema";

export default function CoverLetters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoverLetter, setEditingCoverLetter] = useState<CoverLetter | undefined>();
  const [viewingCoverLetter, setViewingCoverLetter] = useState<CoverLetterWithApplications | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cover-letters/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cover letter deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cover-letters"] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete cover letter",
        variant: "destructive",
      });
    },
  });

  const handleView = (coverLetter: CoverLetterWithApplications) => {
    setViewingCoverLetter(coverLetter);
  };

  const handleEdit = (coverLetter: CoverLetterWithApplications) => {
    setEditingCoverLetter(coverLetter);
  };

  const handleCopy = (coverLetter: CoverLetterWithApplications) => {
    if (coverLetter.content) {
      navigator.clipboard.writeText(coverLetter.content);
      toast({
        title: "Copied",
        description: "Cover letter content copied to clipboard",
      });
    }
  };

  const handleDownload = (coverLetter: CoverLetterWithApplications) => {
    const content = coverLetter.content || "";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${coverLetter.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Cover letter exported successfully",
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

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
            <CoverLetterCard 
              key={coverLetter.id} 
              coverLetter={coverLetter}
              onView={handleView}
              onEdit={handleEdit}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddCoverLetterDialog 
        open={isDialogOpen || !!editingCoverLetter} 
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            setEditingCoverLetter(undefined);
          }
        }}
        coverLetter={editingCoverLetter}
      />

      <Dialog open={!!viewingCoverLetter} onOpenChange={(open) => !open && setViewingCoverLetter(undefined)}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingCoverLetter?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {viewingCoverLetter?.company && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Company</p>
                <p>{viewingCoverLetter.company}</p>
              </div>
            )}
            {viewingCoverLetter?.role && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
                <p>{viewingCoverLetter.role}</p>
              </div>
            )}
            {viewingCoverLetter?.tags && viewingCoverLetter.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {viewingCoverLetter.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-md bg-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {viewingCoverLetter?.content && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Content</p>
                <div className="whitespace-pre-wrap p-4 rounded-md bg-muted">
                  {viewingCoverLetter.content}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cover Letter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cover letter? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
