import { GoalCard, Goal } from "@/components/GoalCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Apply to 20 companies this month",
    description: "Target companies in the tech sector with strong engineering culture",
    category: "application",
    progress: 65,
    targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: "in-progress",
  },
  {
    id: "2",
    title: "Master GraphQL",
    description: "Complete advanced GraphQL course and build a project",
    category: "skill",
    progress: 40,
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: "in-progress",
  },
  {
    id: "3",
    title: "Expand network by 10 contacts",
    description: "Attend 2 meetups and connect with professionals on LinkedIn",
    category: "networking",
    progress: 30,
    targetDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: "in-progress",
  },
  {
    id: "4",
    title: "Secure senior role offer",
    description: "Focus on senior-level positions at top tech companies",
    category: "career",
    progress: 50,
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    status: "in-progress",
  },
  {
    id: "5",
    title: "Update resume with recent projects",
    description: "Highlight achievements from the past year",
    category: "application",
    progress: 100,
    status: "completed",
  },
  {
    id: "6",
    title: "Learn Kubernetes fundamentals",
    description: "Get CKA certification",
    category: "skill",
    progress: 0,
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    status: "paused",
  },
];

export default function Goals() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Goals</h1>
          <p className="text-muted-foreground">
            Set and track your career objectives
          </p>
        </div>
        <Button data-testid="button-add-goal">
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
            <SelectItem value="application">Application</SelectItem>
            <SelectItem value="skill">Skill</SelectItem>
            <SelectItem value="networking">Networking</SelectItem>
            <SelectItem value="career">Career</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}
