import { useState } from "react";
import { ApplicationsTable, Application } from "@/components/ApplicationsTable";
import { AddApplicationDialog } from "@/components/AddApplicationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";

const mockApplications: Application[] = [
  {
    id: "1",
    company: "Tech Corp",
    role: "Senior Software Engineer",
    location: "San Francisco, CA",
    status: "interviewing",
    priority: "high",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    salary: "$150k - $200k",
    jobUrl: "https://example.com/job/1",
  },
  {
    id: "2",
    company: "StartupXYZ",
    role: "Full Stack Developer",
    location: "Remote",
    status: "applied",
    priority: "medium",
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    salary: "$120k - $160k",
  },
  {
    id: "3",
    company: "BigTech Inc",
    role: "Frontend Engineer",
    location: "New York, NY",
    status: "offer",
    priority: "high",
    appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    offerAmount: "$180k",
  },
  {
    id: "4",
    company: "Design Co",
    role: "UI Engineer",
    location: "Austin, TX",
    status: "applied",
    priority: "low",
    appliedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    salary: "$130k - $150k",
  },
  {
    id: "5",
    company: "Cloud Systems",
    role: "DevOps Engineer",
    location: "Seattle, WA",
    status: "rejected",
    priority: "medium",
    appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
  },
];

export default function Applications() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Job Applications</h1>
          <p className="text-muted-foreground">
            Track and manage all your job applications
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-application">
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies, roles, or locations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-priority-filter">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ApplicationsTable applications={mockApplications} />

      <AddApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
