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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertSkill, Skill } from "@shared/schema";

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillToEdit?: Skill | null;
}

const categories = [
  "Frontend",
  "Backend",
  "DevOps",
  "Mobile",
  "Database",
  "Tools",
  "Soft Skills",
  "Cloud",
  "Design",
  "Other",
];

export function AddSkillDialog({
  open,
  onOpenChange,
  skillToEdit,
}: AddSkillDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    proficiency: 50,
  });

  useEffect(() => {
    if (skillToEdit) {
      setFormData({
        name: skillToEdit.name,
        category: skillToEdit.category,
        proficiency: skillToEdit.proficiency,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        proficiency: 50,
      });
    }
  }, [skillToEdit, open]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      const res = await apiRequest("POST", "/api/skills", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<InsertSkill> }) => {
      const res = await apiRequest("PATCH", `/api/skills/${data.id}`, data.updates);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Skill updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      proficiency: 50,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const skillData: InsertSkill = {
      name: formData.name.trim(),
      category: formData.category,
      proficiency: formData.proficiency,
    };

    if (skillToEdit) {
      updateMutation.mutate({ id: skillToEdit.id, updates: skillData });
    } else {
      createMutation.mutate(skillData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {skillToEdit ? "Edit Skill" : "Add New Skill"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. React, TypeScript, Leadership"
                required
                data-testid="input-skill-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger id="category" data-testid="select-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="proficiency">Proficiency *</Label>
                <span className="text-sm font-mono text-muted-foreground" data-testid="text-proficiency-value">
                  {formData.proficiency}%
                </span>
              </div>
              <Slider
                id="proficiency"
                min={0}
                max={100}
                step={5}
                value={[formData.proficiency]}
                onValueChange={(value) =>
                  setFormData({ ...formData, proficiency: value[0] })
                }
                data-testid="slider-proficiency"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} data-testid="button-submit">
              {isPending
                ? skillToEdit
                  ? "Updating..."
                  : "Adding..."
                : skillToEdit
                ? "Update Skill"
                : "Add Skill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
