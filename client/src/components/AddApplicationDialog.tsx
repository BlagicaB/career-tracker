import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertApplication, Resume, CoverLetter } from "@shared/schema";

interface AddApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddApplicationDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddApplicationDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    status: "applied",
    priority: "medium",
    salary: "",
    jobUrl: "",
    referral: "",
    notes: "",
    jobType: "",
    resumeId: "",
    coverLetterId: "",
  });

  const { data: resumes, isLoading: resumesLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  const { data: coverLetters, isLoading: coverLettersLoading } = useQuery<CoverLetter[]>({
    queryKey: ["/api/cover-letters"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertApplication) => {
      const res = await apiRequest("POST", "/api/applications", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Application added successfully",
      });
      resetForm();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add application",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      location: "",
      status: "applied",
      priority: "medium",
      salary: "",
      jobUrl: "",
      referral: "",
      notes: "",
      jobType: "",
      resumeId: "",
      coverLetterId: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const applicationData: InsertApplication = {
      company: formData.company,
      role: formData.role,
      location: formData.location || undefined,
      status: formData.status,
      priority: formData.priority,
      salary: formData.salary || undefined,
      jobUrl: formData.jobUrl || undefined,
      referral: formData.referral || undefined,
      notes: formData.notes || undefined,
      jobType: formData.jobType || undefined,
      resumeId: formData.resumeId || undefined,
      coverLetterId: formData.coverLetterId || undefined,
    };
    
    createMutation.mutate(applicationData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  required
                  data-testid="input-company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                  data-testid="input-role"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  data-testid="input-location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  placeholder="e.g. $120k - $160k"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  data-testid="input-salary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="priority" data-testid="select-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job Listing URL</Label>
              <Input
                id="jobUrl"
                type="url"
                placeholder="https://..."
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
                data-testid="input-job-url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral">Referral Source</Label>
              <Input
                id="referral"
                placeholder="e.g. John Doe, LinkedIn, Company Website"
                value={formData.referral}
                onChange={(e) =>
                  setFormData({ ...formData, referral: e.target.value })
                }
                data-testid="input-referral"
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobType: value })
                  }
                >
                  <SelectTrigger id="jobType" data-testid="select-job-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resumeId">Resume</Label>
                <Select
                  value={formData.resumeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, resumeId: value })
                  }
                >
                  <SelectTrigger id="resumeId" data-testid="select-resume">
                    <SelectValue placeholder={resumesLoading ? "Loading..." : "Select resume"} />
                  </SelectTrigger>
                  <SelectContent>
                    {!resumesLoading && (!resumes || resumes.length === 0) ? (
                      <SelectItem value="none" disabled>No resumes available</SelectItem>
                    ) : (
                      resumes?.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverLetterId">Cover Letter</Label>
                <Select
                  value={formData.coverLetterId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, coverLetterId: value })
                  }
                >
                  <SelectTrigger id="coverLetterId" data-testid="select-cover-letter">
                    <SelectValue placeholder={coverLettersLoading ? "Loading..." : "Select cover letter"} />
                  </SelectTrigger>
                  <SelectContent>
                    {!coverLettersLoading && (!coverLetters || coverLetters.length === 0) ? (
                      <SelectItem value="none" disabled>No cover letters available</SelectItem>
                    ) : (
                      coverLetters?.map((coverLetter) => (
                        <SelectItem key={coverLetter.id} value={coverLetter.id}>
                          {coverLetter.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this application..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                data-testid="textarea-notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
              {createMutation.isPending ? "Adding..." : "Add Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
