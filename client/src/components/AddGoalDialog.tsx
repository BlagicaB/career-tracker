import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertGoal, Goal } from "@shared/schema";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editGoal?: Goal | null;
}

export function AddGoalDialog({
  open,
  onOpenChange,
  editGoal,
}: AddGoalDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    progress: [0],
    status: "not-started",
  });
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (editGoal) {
      setFormData({
        title: editGoal.title,
        description: editGoal.description || "",
        category: editGoal.category,
        progress: [editGoal.progress],
        status: editGoal.status,
      });
      setTargetDate(editGoal.targetDate ? new Date(editGoal.targetDate) : undefined);
    } else {
      resetForm();
    }
  }, [editGoal, open]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertGoal) => {
      const res = await apiRequest("POST", "/api/goals", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Goal created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGoal> }) => {
      const res = await apiRequest("PATCH", `/api/goals/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      progress: [0],
      status: "not-started",
    });
    setTargetDate(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goalData: InsertGoal = {
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      progress: formData.progress[0],
      targetDate: targetDate || undefined,
      status: formData.status,
    };

    if (editGoal) {
      updateMutation.mutate({ id: editGoal.id, data: goalData });
    } else {
      createMutation.mutate(goalData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editGoal ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            {editGoal ? "Update your goal details below" : "Create a new goal to track your career progress"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                data-testid="input-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your goal..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                data-testid="textarea-description"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger id="category" data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Career Growth">Career Growth</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                    <SelectItem value="Job Search">Job Search</SelectItem>
                    <SelectItem value="Skills">Skills</SelectItem>
                    <SelectItem value="Personal Development">Personal Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
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
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress: {formData.progress[0]}%</Label>
              <Slider
                id="progress"
                min={0}
                max={100}
                step={5}
                value={formData.progress}
                onValueChange={(value) =>
                  setFormData({ ...formData, progress: value })
                }
                data-testid="slider-progress"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="targetDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !targetDate && "text-muted-foreground"
                    )}
                    data-testid="button-target-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
              {isPending ? (editGoal ? "Updating..." : "Creating...") : (editGoal ? "Update Goal" : "Create Goal")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
