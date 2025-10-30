import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: "application" | "skill" | "networking" | "career";
  progress: number;
  targetDate?: Date;
  status: "in-progress" | "completed" | "paused";
}

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  "in-progress": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  completed: "bg-green-500/10 text-green-700 dark:text-green-400",
  paused: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

const categoryColors = {
  application: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  skill: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  networking: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  career: "bg-green-500/10 text-green-700 dark:text-green-400",
};

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const handleAction = (action: string) => {
    console.log(`${action} triggered for goal:`, goal.title);
    if (action === "edit" && onEdit) onEdit(goal);
    if (action === "delete" && onDelete) onDelete(goal.id);
  };

  return (
    <Card className="p-6" data-testid={`card-goal-${goal.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold mb-2" data-testid={`text-goal-title-${goal.id}`}>{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-muted-foreground mb-3" data-testid={`text-goal-description-${goal.id}`}>
              {goal.description}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-actions-${goal.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAction("edit")}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("delete")}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Badge className={`${categoryColors[goal.category]} text-xs px-2 py-1 font-mono`} data-testid={`badge-category-${goal.id}`}>
            {goal.category}
          </Badge>
          <Badge className={`${statusColors[goal.status]} text-xs px-2 py-1 font-mono`} data-testid={`badge-status-${goal.id}`}>
            {goal.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono font-medium" data-testid={`text-progress-${goal.id}`}>{goal.progress}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
              style={{ width: `${goal.progress}%` }}
              data-testid={`progress-bar-${goal.id}`}
            />
          </div>
        </div>

        {goal.targetDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span data-testid={`text-target-date-${goal.id}`}>
              Target: {format(goal.targetDate, "MMM d, yyyy")}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
