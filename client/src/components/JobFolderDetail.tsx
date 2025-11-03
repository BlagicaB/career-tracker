import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { EditHiringManagerDialog } from "@/components/EditHiringManagerDialog";
import { EditBasicInfoDialog } from "@/components/EditBasicInfoDialog";
import type { JobFolder, Resume, InsertResume } from "@shared/schema";
import { 
  ArrowLeft, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Link2, 
  Sparkles,
  FileText,
  User,
  MessageSquare,
  Loader2,
  Calendar,
  Edit,
  Upload
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface JobFolderDetailProps {
  folder: JobFolder;
  onBack: () => void;
  onUpdate: () => void;
}

export function JobFolderDetail({ folder, onBack, onUpdate }: JobFolderDetailProps) {
  const { toast } = useToast();
  const [interviewNotes, setInterviewNotes] = useState(folder.interviewNotes || "");
  const [questions, setQuestions] = useState(folder.questions || "");
  const [managerDialogOpen, setManagerDialogOpen] = useState(false);
  const [basicInfoDialogOpen, setBasicInfoDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { data: resumes = [] } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<JobFolder>) => {
      const res = await apiRequest("PATCH", `/api/job-folders/${folder.id}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-folders"] });
      onUpdate();
      toast({
        title: "Updated",
        description: "Job folder has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job folder",
        variant: "destructive",
      });
    },
  });

  const analyzeResumeMutation = useMutation({
    mutationFn: async ({ resumeId, resumeContent }: { resumeId: string; resumeContent?: string | null }) => {
      let content = resumeContent;
      
      if (!content) {
        const resume = resumes.find(r => r.id === resumeId);
        if (!resume) throw new Error("Resume not found");
        content = resume.content;
      }
      
      const res = await apiRequest("POST", `/api/job-folders/${folder.id}/analyze-resume`, {
        resumeContent: content
      });
      return await res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-folders"] });
      onUpdate();
      toast({
        title: "Resume analyzed",
        description: `Match score: ${data.matchScore}%. Check the Resume Analysis tab for details.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze resume",
        variant: "destructive",
      });
    },
  });

  const researchCompanyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/job-folders/${folder.id}/research-company`, {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-folders"] });
      onUpdate();
      toast({
        title: "Research complete",
        description: "Company research has been generated and saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to conduct company research",
        variant: "destructive",
      });
    },
  });

  const createResumeMutation = useMutation({
    mutationFn: async (data: InsertResume) => {
      const res = await apiRequest("POST", "/api/resumes", data);
      return await res.json();
    },
    onSuccess: (newResume: Resume) => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      updateMutation.mutate({ resumeId: newResume.id });
      
      if (folder.jobDescription) {
        analyzeResumeMutation.mutate({ 
          resumeId: newResume.id, 
          resumeContent: newResume.content 
        });
      }
      
      toast({
        title: "Resume uploaded",
        description: folder.jobDescription 
          ? "Your resume has been saved and will be analyzed."
          : "Your resume has been saved. Add a job description to enable analysis.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save resume",
        variant: "destructive",
      });
    },
  });

  const processFile = async (file: File) => {
    if (!file) return;
    
    if (processing) {
      toast({
        title: "Please wait",
        description: "A file is already being processed",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

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
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
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

      createResumeMutation.mutate({
        title: `${folder.company} - ${folder.jobTitle} Resume`,
        content: extractedText,
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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
      e.target.value = "";
    }
  };

  const handleResumeSelect = (resumeId: string) => {
    updateMutation.mutate({ resumeId });
    if (folder.jobDescription) {
      analyzeResumeMutation.mutate({ resumeId });
    }
  };

  const handleSaveNotes = () => {
    updateMutation.mutate({ 
      interviewNotes,
      questions 
    });
  };

  const resumeAnalysis = folder.resumeAnalysis 
    ? JSON.parse(folder.resumeAnalysis) 
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Folders
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold mb-2">{folder.jobTitle}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {folder.company}
                </div>
            {folder.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {folder.location}
              </div>
            )}
            {folder.salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {folder.salary}
              </div>
            )}
            {folder.jobUrl && (
              <a 
                href={folder.jobUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
                data-testid="link-job-posting"
              >
                <Link2 className="h-4 w-4" />
                View Posting
              </a>
            )}
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created {formatDistanceToNow(new Date(folder.createdDate), { addSuffix: true })}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBasicInfoDialogOpen(true)}
              data-testid="button-edit-basic-info"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Badge className={getStatusColor(folder.status)}>
          {folder.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {folder.jobDescription && (
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {folder.jobDescription}
                </p>
              </div>
            )}
            {folder.jobRequirements && (
              <div>
                <h3 className="font-medium mb-2">Requirements</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {folder.jobRequirements}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resumes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No resumes available. Create a resume first in the Resumes page.
                </p>
              ) : (
                <Select 
                  value={folder.resumeId || ""} 
                  onValueChange={handleResumeSelect}
                >
                  <SelectTrigger data-testid="select-resume">
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map(resume => (
                      <SelectItem 
                        key={resume.id} 
                        value={resume.id}
                        data-testid={`resume-option-${resume.id}`}
                      >
                        {resume.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {folder.resumeId && folder.jobDescription && !resumeAnalysis && (
                <Button 
                  className="w-full mt-3" 
                  onClick={() => analyzeResumeMutation.mutate({ resumeId: folder.resumeId! })}
                  disabled={analyzeResumeMutation.isPending}
                  data-testid="button-analyze-resume"
                >
                  {analyzeResumeMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" />Analyze Resume</>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4" />
                  Hiring Manager
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setManagerDialogOpen(true)}
                  data-testid="button-edit-manager"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            {folder.hiringManagerName ? (
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">{folder.hiringManagerName}</span>
                  {folder.hiringManagerTitle && (
                    <p className="text-muted-foreground">{folder.hiringManagerTitle}</p>
                  )}
                </div>
                {folder.hiringManagerLinkedin && (
                  <a 
                    href={folder.hiringManagerLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    LinkedIn Profile
                  </a>
                )}
                {folder.hiringManagerBackground && (
                  <p className="text-muted-foreground mt-2 whitespace-pre-wrap">
                    {folder.hiringManagerBackground}
                  </p>
                )}
              </CardContent>
            ) : (
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  No hiring manager information yet
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setManagerDialogOpen(true)}
                >
                  Add Information
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      <Tabs defaultValue="research" className="w-full">
        <TabsList>
          <TabsTrigger value="research">Company Research</TabsTrigger>
          <TabsTrigger value="resume-analysis">Resume Analysis</TabsTrigger>
          <TabsTrigger value="notes">Interview Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-4">
          {folder.companyResearch ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button 
                  onClick={() => researchCompanyMutation.mutate()}
                  disabled={researchCompanyMutation.isPending}
                  variant="outline"
                  data-testid="button-refresh-research"
                >
                  {researchCompanyMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Researching...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" />Refresh Research</>
                  )}
                </Button>
              </div>
              {folder.companyResearch && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {folder.companyResearch}
                    </p>
                  </CardContent>
                </Card>
              )}
              {folder.companyHistory && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Company History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {folder.companyHistory}
                    </p>
                  </CardContent>
                </Card>
              )}
              {folder.companyCurrent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Current State</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {folder.companyCurrent}
                    </p>
                  </CardContent>
                </Card>
              )}
              {folder.companyChallenges && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Challenges & Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {folder.companyChallenges}
                    </p>
                  </CardContent>
                </Card>
              )}
              {folder.companyCulture && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Company Culture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {folder.companyCulture}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No company research yet</h3>
                <p className="text-muted-foreground mb-6">
                  Conduct AI-powered research to learn about the company's history, culture, and current challenges.
                </p>
                <Button 
                  onClick={() => researchCompanyMutation.mutate()}
                  disabled={researchCompanyMutation.isPending}
                  data-testid="button-research-company"
                >
                  {researchCompanyMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Researching...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" />Research Company</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resume-analysis">
          {resumeAnalysis ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Match Score</CardTitle>
                    <Badge className="text-lg px-4 py-1">
                      {resumeAnalysis.matchScore}%
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {resumeAnalysis.strengths?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumeAnalysis.strengths.map((strength: string, i: number) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="text-muted-foreground">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {resumeAnalysis.gaps?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Gaps to Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumeAnalysis.gaps.map((gap: string, i: number) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-yellow-600">⚠</span>
                          <span className="text-muted-foreground">{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {resumeAnalysis.recommendations?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumeAnalysis.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-blue-600">→</span>
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {resumeAnalysis.keywordsToAdd?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Keywords to Add</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.keywordsToAdd.map((keyword: string, i: number) => (
                        <Badge key={i} variant="outline">{keyword}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload & Analyze Your Resume</h3>
                <p className="text-muted-foreground mb-6">
                  Upload a resume PDF to get AI-powered analysis and recommendations tailored to this job posting.
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  style={{ display: "none" }}
                  id="resume-upload-input"
                  data-testid="input-resume-upload"
                />
                <Button
                  onClick={() => document.getElementById("resume-upload-input")?.click()}
                  disabled={processing || !folder.jobDescription}
                  data-testid="button-upload-resume"
                >
                  {processing ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing PDF...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-2" />Upload Resume PDF</>
                  )}
                </Button>
                {!folder.jobDescription && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Add a job description first to enable resume analysis
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />
                Interview Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                placeholder="Take notes from your interviews..."
                className="min-h-[200px]"
                data-testid="textarea-interview-notes"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />
                Questions to Ask
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                placeholder="Prepare questions for your interviewer..."
                className="min-h-[150px]"
                data-testid="textarea-questions"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveNotes}
              disabled={updateMutation.isPending}
              data-testid="button-save-notes"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save Notes
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <EditHiringManagerDialog
        open={managerDialogOpen}
        onOpenChange={setManagerDialogOpen}
        initialValues={{
          hiringManagerName: folder.hiringManagerName || "",
          hiringManagerTitle: folder.hiringManagerTitle || "",
          hiringManagerLinkedin: folder.hiringManagerLinkedin || "",
          hiringManagerBackground: folder.hiringManagerBackground || "",
        }}
        onSave={(values) => updateMutation.mutate(values)}
      />

      <EditBasicInfoDialog
        open={basicInfoDialogOpen}
        onOpenChange={setBasicInfoDialogOpen}
        initialValues={{
          company: folder.company,
          jobTitle: folder.jobTitle,
          location: folder.location || "",
          salary: folder.salary || "",
          jobUrl: folder.jobUrl || "",
        }}
        onSave={(values) => updateMutation.mutate(values)}
      />
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "researching": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "preparing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "applied": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "interviewing": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}
