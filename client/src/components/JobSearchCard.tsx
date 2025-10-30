import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  BookmarkPlus,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface JobSearchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  jobUrl: string;
  source: string;
  postedDate: Date;
  connections?: {
    name: string;
    degree: "1st" | "2nd" | "3rd";
    title: string;
  }[];
}

interface JobSearchCardProps {
  job: JobSearchResult;
  onSave?: (job: JobSearchResult) => void;
  onApply?: (job: JobSearchResult) => void;
}

const sourceColors: Record<string, string> = {
  linkedin: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  indeed: "bg-green-500/10 text-green-700 dark:text-green-400",
  reddit: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  other: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
};

const degreeColors: Record<string, string> = {
  "1st": "bg-green-500/10 text-green-700 dark:text-green-400",
  "2nd": "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "3rd": "bg-purple-500/10 text-purple-700 dark:text-purple-400",
};

export function JobSearchCard({ job, onSave, onApply }: JobSearchCardProps) {
  const handleSave = () => {
    console.log("Save job triggered:", job.title);
    if (onSave) onSave(job);
  };

  const handleApply = () => {
    console.log("Apply to job triggered:", job.title);
    if (onApply) onApply(job);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-job-${job.id}`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold" data-testid={`text-title-${job.id}`}>
                {job.title}
              </h3>
              <Badge
                className={`${
                  sourceColors[job.source.toLowerCase()] || sourceColors.other
                } text-xs px-2 py-0.5 font-mono`}
                data-testid={`badge-source-${job.id}`}
              >
                {job.source}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span data-testid={`text-company-${job.id}`}>{job.company}</span>
              </div>
              {job.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span data-testid={`text-location-${job.id}`}>{job.location}</span>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span data-testid={`text-salary-${job.id}`}>{job.salary}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground" data-testid={`text-posted-${job.id}`}>
            {formatDistanceToNow(job.postedDate, { addSuffix: true })}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-description-${job.id}`}>
          {job.description}
        </p>

        {job.connections && job.connections.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Your Connections</span>
            </div>
            <div className="space-y-2">
              {job.connections.slice(0, 3).map((connection, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                  data-testid={`connection-${job.id}-${index}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(connection.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate" data-testid={`text-connection-name-${job.id}-${index}`}>
                        {connection.name}
                      </p>
                      <Badge
                        className={`${degreeColors[connection.degree]} text-xs px-2 py-0.5 font-mono`}
                        data-testid={`badge-degree-${job.id}-${index}`}
                      >
                        {connection.degree}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate" data-testid={`text-connection-title-${job.id}-${index}`}>
                      {connection.title}
                    </p>
                  </div>
                </div>
              ))}
              {job.connections.length > 3 && (
                <p className="text-xs text-muted-foreground" data-testid={`text-more-connections-${job.id}`}>
                  +{job.connections.length - 3} more connections
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={handleApply}
            data-testid={`button-apply-${job.id}`}
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            data-testid={`button-save-${job.id}`}
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(job.jobUrl, "_blank")}
            data-testid={`button-view-${job.id}`}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
