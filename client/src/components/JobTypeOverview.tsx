import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Briefcase, MapPin, DollarSign, Users } from "lucide-react";

interface JobTypeStats {
  category: string;
  count: number;
  color: string;
}

interface JobTypeOverviewProps {
  stats?: JobTypeStats[];
}

const defaultStats: JobTypeStats[] = [
  { category: "Frontend", count: 8, color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  { category: "Full Stack", count: 6, color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  { category: "Backend", count: 4, color: "bg-green-500/10 text-green-700 dark:text-green-400" },
  { category: "DevOps", count: 3, color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  { category: "Mobile", count: 2, color: "bg-pink-500/10 text-pink-700 dark:text-pink-400" },
  { category: "Data", count: 1, color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400" },
];

export function JobTypeOverview({ stats = defaultStats }: JobTypeOverviewProps) {
  const totalApplications = stats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Job Types Overview</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-mono font-semibold" data-testid="text-total-applications">{totalApplications}</span> total applications
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {stats.map((stat) => (
          <Badge
            key={stat.category}
            className={`${stat.color} px-3 py-1 font-mono text-xs`}
            data-testid={`badge-job-type-${stat.category.toLowerCase()}`}
          >
            {stat.category}: {stat.count}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
