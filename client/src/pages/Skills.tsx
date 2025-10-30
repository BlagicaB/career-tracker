import { SkillItem, Skill } from "@/components/SkillItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

const mockSkills: Skill[] = [
  { id: "1", name: "React", category: "Frontend", proficiency: 90 },
  { id: "2", name: "TypeScript", category: "Frontend", proficiency: 85 },
  { id: "3", name: "Node.js", category: "Backend", proficiency: 80 },
  { id: "4", name: "Python", category: "Backend", proficiency: 75 },
  { id: "5", name: "PostgreSQL", category: "Database", proficiency: 70 },
  { id: "6", name: "MongoDB", category: "Database", proficiency: 65 },
  { id: "7", name: "AWS", category: "Cloud", proficiency: 75 },
  { id: "8", name: "Docker", category: "DevOps", proficiency: 80 },
  { id: "9", name: "Git", category: "Tools", proficiency: 95 },
  { id: "10", name: "Communication", category: "Soft Skills", proficiency: 85 },
  { id: "11", name: "Leadership", category: "Soft Skills", proficiency: 70 },
  { id: "12", name: "Problem Solving", category: "Soft Skills", proficiency: 90 },
];

const categories = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "Tools",
  "Soft Skills",
];

export default function Skills() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Skills</h1>
          <p className="text-muted-foreground">
            Track and assess your professional skills
          </p>
        </div>
        <Button data-testid="button-add-skill">
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => {
          const categorySkills = mockSkills.filter(
            (skill) => skill.category === category
          );
          if (categorySkills.length === 0) return null;

          return (
            <Card key={category} className="p-6">
              <h2 className="text-lg font-semibold mb-4" data-testid={`heading-category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                {category}
              </h2>
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <SkillItem key={skill.id} skill={skill} />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
