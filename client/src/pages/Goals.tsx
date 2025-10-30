import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GoalCard } from "@/components/GoalCard";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Goal } from "@shared/schema";

export default function Goals() {
  const { toast } = useToast();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

  const { data: goals, isLoading } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/goals/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      setDeleteGoalId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    },
  });

  const filteredGoals = useMemo(() => {
    if (!goals) return [];

    return goals.filter((goal) => {
      const categoryMatch = categoryFilter === "all" || goal.category === categoryFilter;
      const statusMatch = statusFilter === "all" || goal.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [goals, categoryFilter, statusFilter]);

  const handleEdit = (goal: Goal) => {
    setEditGoal(goal);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteGoalId(id);
  };

  const handleAddNew = () => {
    setEditGoal(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditGoal(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Goals</h1>
          <p className="text-muted-foreground">
            Set and track your career objectives
          </p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-goal">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Career Growth">Career Growth</SelectItem>
            <SelectItem value="Learning">Learning</SelectItem>
            <SelectItem value="Networking">Networking</SelectItem>
            <SelectItem value="Job Search">Job Search</SelectItem>
            <SelectItem value="Skills">Skills</SelectItem>
            <SelectItem value="Personal Development">Personal Development</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" data-testid="loader-goals" />
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="text-center py-12" data-testid="empty-state-goals">
          <p className="text-muted-foreground mb-4">
            {goals?.length === 0 
              ? "No goals yet. Start tracking your career objectives!"
              : "No goals match your filters."}
          </p>
          {goals?.length === 0 && (
            <Button onClick={handleAddNew} data-testid="button-add-first-goal">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddGoalDialog 
        open={dialogOpen} 
        onOpenChange={handleDialogClose}
        editGoal={editGoal}
      />

      <AlertDialog open={!!deleteGoalId} onOpenChange={(open) => !open && setDeleteGoalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteGoalId && deleteMutation.mutate(deleteGoalId)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
