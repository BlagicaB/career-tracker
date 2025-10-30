import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";

export interface Resume {
  id: string;
  title: string;
  uploadDate: Date;
  fileSize?: string;
  tags?: string[];
  linkedApplications?: {
    id: string;
    company: string;
    role: string;
  }[];
}

interface ResumeCardProps {
  resume: Resume;
  onView?: (resume: Resume) => void;
  onDownload?: (resume: Resume) => void;
  onDelete?: (id: string) => void;
}

export function ResumeCard({
  resume,
  onView,
  onDownload,
  onDelete,
}: ResumeCardProps) {
  const handleView = () => {
    console.log("View resume triggered:", resume.title);
    if (onView) onView(resume);
  };

  const handleDownload = () => {
    console.log("Download resume triggered:", resume.title);
    if (onDownload) onDownload(resume);
  };

  const handleDelete = () => {
    console.log("Delete resume triggered:", resume.title);
    if (onDelete) onDelete(resume.id);
  };

  return (
    <Card className="p-6" data-testid={`card-resume-${resume.id}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-muted">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1 truncate" data-testid={`text-resume-title-${resume.id}`}>
            {resume.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span data-testid={`text-upload-date-${resume.id}`}>
              {format(resume.uploadDate, "MMM d, yyyy")}
            </span>
            {resume.fileSize && (
              <>
                <span>•</span>
                <span data-testid={`text-file-size-${resume.id}`}>{resume.fileSize}</span>
              </>
            )}
          </div>
          {resume.tags && resume.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {resume.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-0.5"
                  data-testid={`badge-tag-${resume.id}-${index}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {resume.linkedApplications && resume.linkedApplications.length > 0 && (
            <div className="mb-3 p-2 rounded-md bg-muted/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Used in {resume.linkedApplications.length} application{resume.linkedApplications.length > 1 ? 's' : ''}:
              </p>
              <div className="space-y-1">
                {resume.linkedApplications.slice(0, 2).map((app) => (
                  <p key={app.id} className="text-xs text-muted-foreground" data-testid={`text-linked-app-${resume.id}-${app.id}`}>
                    • {app.role} at {app.company}
                  </p>
                ))}
                {resume.linkedApplications.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{resume.linkedApplications.length - 2} more
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              data-testid={`button-view-${resume.id}`}
            >
              <Eye className="h-3 w-3 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              data-testid={`button-download-${resume.id}`}
            >
              <Download className="h-3 w-3 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              data-testid={`button-delete-${resume.id}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
