import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  ExternalLink,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  priority: "high" | "medium" | "low";
  appliedDate: Date;
  salary?: string;
  jobUrl?: string;
  referral?: string;
  nextFollowUp?: Date;
  offerAmount?: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  onViewDetails?: (application: Application) => void;
  onEdit?: (application: Application) => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  applied: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  interviewing: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  offer: "bg-green-500/10 text-green-700 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const priorityColors = {
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  low: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

export function ApplicationsTable({
  applications,
  onViewDetails,
  onEdit,
  onDelete,
}: ApplicationsTableProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const handleAction = (action: string, app: Application) => {
    console.log(`${action} triggered for`, app.company);
    if (action === "view" && onViewDetails) onViewDetails(app);
    if (action === "edit" && onEdit) onEdit(app);
    if (action === "delete" && onDelete) onDelete(app.id);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b-2 sticky top-0 bg-background">
            <tr>
              <th className="text-left py-3 px-4 text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Company
              </th>
              <th className="text-left py-3 px-4 text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Role
              </th>
              <th className="text-left py-3 px-4 text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Location
              </th>
              <th className="text-center py-3 px-4 text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Status
              </th>
              <th className="text-center py-3 px-4 text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Priority
              </th>
              <th className="text-center py-3 px-4 text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Applied
              </th>
              <th className="text-right py-3 px-4 text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-b hover-elevate"
                data-testid={`row-application-${app.id}`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" data-testid={`text-company-${app.id}`}>
                      {app.company}
                    </span>
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        data-testid={`link-job-url-${app.id}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4" data-testid={`text-role-${app.id}`}>{app.role}</td>
                <td className="py-3 px-4 text-muted-foreground" data-testid={`text-location-${app.id}`}>
                  {app.location}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <Badge
                      className={`${statusColors[app.status]} font-mono text-xs px-3 py-1`}
                      data-testid={`badge-status-${app.id}`}
                    >
                      {app.status}
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <Badge
                      className={`${priorityColors[app.priority]} font-mono text-xs px-3 py-1`}
                      data-testid={`badge-priority-${app.id}`}
                    >
                      {app.priority}
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4 text-center font-mono text-muted-foreground" data-testid={`text-applied-${app.id}`}>
                  {formatDistanceToNow(app.appliedDate, { addSuffix: true })}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          data-testid={`button-actions-${app.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleAction("view", app)}
                          data-testid={`menu-view-${app.id}`}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("edit", app)}
                          data-testid={`menu-edit-${app.id}`}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("delete", app)}
                          className="text-destructive"
                          data-testid={`menu-delete-${app.id}`}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {applications.length === 0 && (
        <div className="py-12 text-center text-muted-foreground" data-testid="text-empty-state">
          <p>No applications yet. Add your first application to get started.</p>
        </div>
      )}
    </div>
  );
}
