import { useState } from "react";
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
import type { InsertResume } from "@shared/schema";

interface AddResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddResumeDialog({
  open,
  onOpenChange,
}: AddResumeDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    fileSize: "",
    content: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertResume) => {
      const res = await apiRequest("POST", "/api/resumes", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resume added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add resume",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      tags: "",
      fileSize: "",
      content: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formData.tags
      ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : undefined;

    const resumeData: InsertResume = {
      title: formData.title,
      tags: tagsArray,
      fileSize: formData.fileSize || undefined,
      content: formData.content || undefined,
    };
    
    createMutation.mutate(resumeData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Resume</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Software Engineer Resume - 2024"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                data-testid="input-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="e.g. Technical, Senior Level, Full Stack (comma-separated)"
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
              <Label htmlFor="fileSize">File Size</Label>
              <Input
                id="fileSize"
                placeholder="e.g. 245 KB"
                value={formData.fileSize}
                onChange={(e) =>
                  setFormData({ ...formData, fileSize: e.target.value })
                }
                data-testid="input-file-size"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Resume text content or notes..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={6}
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
              {createMutation.isPending ? "Adding..." : "Add Resume"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
