import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Briefcase, MapPin, DollarSign, Calendar } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { AddJobFolderDialog } from "@/components/AddJobFolderDialog";
import { JobFolderDetail } from "@/components/JobFolderDetail";
import type { JobFolder } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function JobFolders() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<JobFolder | null>(null);

  const { data: jobFolders = [], isLoading } = useQuery<JobFolder[]>({
    queryKey: ["/api/job-folders"],
  });

  const handleFolderSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/job-folders"] });
  };

  const filteredFolders = jobFolders.filter(folder => {
    const searchLower = searchQuery.toLowerCase();
    return (
      folder.jobTitle.toLowerCase().includes(searchLower) ||
      folder.company.toLowerCase().includes(searchLower) ||
      folder.location?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "researching": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "preparing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "applied": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "interviewing": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (selectedFolder) {
    return (
      <JobFolderDetail 
        folder={selectedFolder} 
        onBack={() => setSelectedFolder(null)}
        onUpdate={handleFolderSuccess}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Job Research</h1>
            <p className="text-muted-foreground">
              Research companies, analyze fit, and prepare customized materials before applying
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading job research...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Job Research</h1>
          <p className="text-muted-foreground">
            Research companies, analyze fit, and prepare customized materials before applying
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-job-folder">
          <Plus className="h-4 w-4 mr-2" />
          Start New Research
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search job titles, companies, or locations..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-folders"
        />
      </div>

      {filteredFolders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Your Job Research</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Before applying, research the company and role. Get AI-powered company insights, analyze how your resume matches the job requirements, and prepare customized materials.
            </p>
            <Button onClick={() => setDialogOpen(true)} data-testid="button-create-first-folder">
              <Plus className="h-4 w-4 mr-2" />
              Research Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFolders.map((folder) => (
            <Card 
              key={folder.id} 
              className="hover-elevate active-elevate-2 cursor-pointer overflow-visible"
              onClick={() => setSelectedFolder(folder)}
              data-testid={`card-job-folder-${folder.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-2">{folder.jobTitle}</CardTitle>
                  <Badge className={`${getStatusColor(folder.status)} shrink-0 no-default-hover-elevate no-default-active-elevate`}>
                    {folder.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{folder.company}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {folder.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {folder.location}
                  </div>
                )}
                {folder.salary && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    {folder.salary}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created {formatDistanceToNow(new Date(folder.createdDate), { addSuffix: true })}
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {folder.companyResearch && (
                    <Badge variant="outline" className="text-xs">Research Complete</Badge>
                  )}
                  {folder.resumeAnalysis && (
                    <Badge variant="outline" className="text-xs">Resume Analyzed</Badge>
                  )}
                  {folder.hiringManagerName && (
                    <Badge variant="outline" className="text-xs">Manager Identified</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddJobFolderDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSuccess={handleFolderSuccess}
      />
    </div>
  );
}
