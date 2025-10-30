import { ResumeCard } from "@/components/ResumeCard";
import { AddResumeDialog } from "@/components/AddResumeDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Resume, Application } from "@shared/schema";

export default function Resumes() {
  const [dragActive, setDragActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: resumes, isLoading: resumesLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const resumesWithLinkedApps = useMemo(() => {
    if (!resumes || !applications) return [];
    
    return resumes.map((resume) => ({
      ...resume,
      linkedApplications: applications
        .filter((app) => app.resumeId === resume.id)
        .map((app) => ({
          id: app.id,
          company: app.company,
          role: app.role,
        })),
    }));
  }, [resumes, applications]);

  const isLoading = resumesLoading || applicationsLoading;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log("File dropped", e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log("File selected", e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Resumes</h1>
          <p className="text-muted-foreground">
            Store and manage different versions of your resume
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-resume">
          <Plus className="h-4 w-4 mr-2" />
          Add Resume
        </Button>
      </div>

      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        data-testid="dropzone-upload"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-muted">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Upload Resume</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your resume file here, or click to browse
            </p>
          </div>
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              data-testid="input-file"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </span>
              </Button>
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : resumesWithLinkedApps.length === 0 ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">No resumes yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by adding your first resume
                </p>
              </div>
              <Button onClick={() => setDialogOpen(true)} data-testid="button-add-first-resume">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Resume
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumesWithLinkedApps.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>

      <AddResumeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
