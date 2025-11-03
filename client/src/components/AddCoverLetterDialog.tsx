import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertCoverLetter } from "@shared/schema";

interface AddCoverLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: {
    title?: string;
    company?: string;
    role?: string;
  };
  onSuccess?: () => void;
}

export function AddCoverLetterDialog({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
}: AddCoverLetterDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: initialValues?.title || "",
    company: initialValues?.company || "",
    role: initialValues?.role || "",
    tags: "",
    content: "",
  });

  useEffect(() => {
    if (open && initialValues) {
      setFormData({
        title: initialValues?.title || "",
        company: initialValues?.company || "",
        role: initialValues?.role || "",
        tags: "",
        content: "",
      });
    }
  }, [open, initialValues]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertCoverLetter) => {
      const res = await apiRequest("POST", "/api/cover-letters", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cover letter added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cover-letters"] });
      resetForm();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add cover letter",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      role: "",
      tags: "",
      content: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formData.tags
      ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : undefined;

    const coverLetterData: InsertCoverLetter = {
      title: formData.title,
      company: formData.company || undefined,
      role: formData.role || undefined,
      tags: tagsArray,
      content: formData.content || undefined,
    };
    
    createMutation.mutate(coverLetterData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Cover Letter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer Cover Letter"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                data-testid="input-title"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="e.g. Tech Corp"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  data-testid="input-company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  data-testid="input-role"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="e.g. Technical, Leadership, Full Stack (comma-separated)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                data-testid="input-tags"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple tags with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Cover letter text content..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={8}
                data-testid="textarea-content"
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
              {createMutation.isPending ? "Adding..." : "Add Cover Letter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
