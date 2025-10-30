import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SkillItem } from "@/components/SkillItem";
import { AddSkillDialog } from "@/components/AddSkillDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { Skill } from "@shared/schema";

const categories = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "Tools",
  "Soft Skills",
  "Mobile",
  "Design",
  "Other",
];

export default function Skills() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/skills/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setSkillToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    },
  });

  const handleAddClick = () => {
    setSkillToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setSkillToEdit(skill);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSkillToDelete(id);
  };

  const confirmDelete = () => {
    if (skillToDelete) {
      deleteMutation.mutate(skillToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Skills</h1>
            <p className="text-muted-foreground">
              Track and assess your professional skills
            </p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const categoriesWithSkills = categories
    .map((category) => ({
      category,
      skills: (skills || []).filter((skill) => skill.category === category),
    }))
    .filter((group) => group.skills.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Skills</h1>
          <p className="text-muted-foreground">
            Track and assess your professional skills
          </p>
        </div>
        <Button onClick={handleAddClick} data-testid="button-add-skill">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {!skills || skills.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">No skills added yet</p>
              <p className="text-sm">
                Start building your skills portfolio by adding your first skill
              </p>
            </div>
            <Button onClick={handleAddClick} data-testid="button-add-first-skill">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoriesWithSkills.map(({ category, skills: categorySkills }) => (
            <Card key={category} className="p-6">
              <h2
                className="text-lg font-semibold mb-4"
                data-testid={`heading-category-${category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {category}
              </h2>
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <SkillItem
                    key={skill.id}
                    skill={skill}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddSkillDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        skillToEdit={skillToEdit}
      />

      <AlertDialog open={!!skillToDelete} onOpenChange={() => setSkillToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this skill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
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
