import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Skill } from "@shared/schema";

interface SkillItemProps {
  skill: Skill;
  onEdit?: (skill: Skill) => void;
  onDelete?: (id: string) => void;
}

export function SkillItem({ skill, onEdit, onDelete }: SkillItemProps) {
  const handleEdit = () => {
    console.log("Edit skill triggered:", skill.name);
    if (onEdit) onEdit(skill);
  };

  const handleDelete = () => {
    console.log("Delete skill triggered:", skill.name);
    if (onDelete) onDelete(skill.id);
  };

  return (
    <div
      className="flex items-center justify-between py-3 px-4 rounded-lg border hover-elevate"
      data-testid={`skill-item-${skill.id}`}
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium" data-testid={`text-skill-name-${skill.id}`}>{skill.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-mono" data-testid={`text-proficiency-${skill.id}`}>
              {skill.proficiency}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleEdit}
              data-testid={`button-edit-skill-${skill.id}`}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDelete}
              data-testid={`button-delete-skill-${skill.id}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
            style={{ width: `${skill.proficiency}%` }}
            data-testid={`progress-skill-${skill.id}`}
          />
        </div>
      </div>
    </div>
  );
}
