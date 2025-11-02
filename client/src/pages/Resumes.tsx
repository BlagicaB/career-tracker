import { ResumeCard } from "@/components/ResumeCard";
import { AddResumeDialog } from "@/components/AddResumeDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, Plus, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Resume, Application } from "@shared/schema";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker using unpkg CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

export default function Resumes() {
  const [dragActive, setDragActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [initialContent, setInitialContent] = useState<string>("");
  const { toast } = useToast();

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

  const processFile = async (file: File) => {
    if (!file) return;
    
    // Prevent concurrent processing
    if (processing) {
      toast({
        title: "Please wait",
        description: "A file is already being processed",
      });
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.includes("pdf")) {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Extract text from all pages
      let extractedText = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        extractedText += pageText + "\n";
      }
      
      extractedText = extractedText.trim();
      
      if (!extractedText) {
        toast({
          title: "No text found",
          description: "The PDF appears to be empty or contains only images",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }

      // Set the extracted content and open the dialog
      setInitialContent(extractedText);
      setDialogOpen(true);
      
      toast({
        title: "PDF processed",
        description: "Resume content extracted successfully",
      });
    } catch (error) {
      console.error("PDF parsing error:", error);
      toast({
        title: "Failed to process PDF",
        description: "There was an error reading your PDF file",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
      // Reset the input so the same file can be selected again
      e.target.value = "";
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
          dragActive ? "border-primary bg-primary/5" : processing ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        data-testid="dropzone-upload"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-muted">
            {processing ? (
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-1">
              {processing ? "Processing PDF..." : "Upload Resume"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {processing 
                ? "Extracting text from your PDF file"
                : "Drag and drop your resume file here, or click to browse"
              }
            </p>
          </div>
          {!processing && (
            <div>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
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
          )}
          <p className="text-xs text-muted-foreground">
            {processing 
              ? "This may take a few seconds..."
              : "Supported format: PDF (Max 5MB)"
            }
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

      <AddResumeDialog 
        open={dialogOpen} 
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setInitialContent("");
          }
        }}
        initialContent={initialContent}
      />
    </div>
  );
}
