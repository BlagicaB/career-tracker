import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileEdit, Eye, Copy, Trash2, Download } from "lucide-react";
import { format } from "date-fns";

export interface CoverLetter {
  id: string;
  title: string;
  company?: string;
  role?: string;
  createdDate: Date;
  lastModified: Date;
  tags?: string[];
}

interface CoverLetterCardProps {
  coverLetter: CoverLetter;
  onView?: (coverLetter: CoverLetter) => void;
  onEdit?: (coverLetter: CoverLetter) => void;
  onCopy?: (coverLetter: CoverLetter) => void;
  onDownload?: (coverLetter: CoverLetter) => void;
  onDelete?: (id: string) => void;
}

export function CoverLetterCard({
  coverLetter,
  onView,
  onEdit,
  onCopy,
  onDownload,
  onDelete,
}: CoverLetterCardProps) {
  const handleView = () => {
    console.log("View cover letter triggered:", coverLetter.title);
    if (onView) onView(coverLetter);
  };

  const handleEdit = () => {
    console.log("Edit cover letter triggered:", coverLetter.title);
    if (onEdit) onEdit(coverLetter);
  };

  const handleCopy = () => {
    console.log("Copy cover letter triggered:", coverLetter.title);
    if (onCopy) onCopy(coverLetter);
  };

  const handleDownload = () => {
    console.log("Download cover letter triggered:", coverLetter.title);
    if (onDownload) onDownload(coverLetter);
  };

  const handleDelete = () => {
    console.log("Delete cover letter triggered:", coverLetter.title);
    if (onDelete) onDelete(coverLetter.id);
  };

  return (
    <Card className="p-6" data-testid={`card-cover-letter-${coverLetter.id}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-muted">
          <FileEdit className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium mb-1 truncate" data-testid={`text-title-${coverLetter.id}`}>
            {coverLetter.title}
          </h3>
          {(coverLetter.company || coverLetter.role) && (
            <p className="text-sm text-muted-foreground mb-2">
              {coverLetter.role && <span data-testid={`text-role-${coverLetter.id}`}>{coverLetter.role}</span>}
              {coverLetter.role && coverLetter.company && <span> at </span>}
              {coverLetter.company && <span data-testid={`text-company-${coverLetter.id}`}>{coverLetter.company}</span>}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span data-testid={`text-modified-${coverLetter.id}`}>
              Modified {format(coverLetter.lastModified, "MMM d, yyyy")}
            </span>
          </div>
          {coverLetter.tags && coverLetter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {coverLetter.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-0.5"
                  data-testid={`badge-tag-${coverLetter.id}-${index}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              data-testid={`button-view-${coverLetter.id}`}
            >
              <Eye className="h-3 w-3 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              data-testid={`button-edit-${coverLetter.id}`}
            >
              <FileEdit className="h-3 w-3 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              data-testid={`button-copy-${coverLetter.id}`}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              data-testid={`button-download-${coverLetter.id}`}
            >
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              data-testid={`button-delete-${coverLetter.id}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
