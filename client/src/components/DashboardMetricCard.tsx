import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  testId?: string;
}

export function DashboardMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  testId,
}: DashboardMetricCardProps) {
  return (
    <Card className="p-6 h-32 flex flex-col justify-between" data-testid={testId}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">
          {title}
        </p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold font-mono" data-testid={`${testId}-value`}>{value}</p>
        {trend && (
          <p className="text-xs text-muted-foreground" data-testid={`${testId}-trend`}>{trend}</p>
        )}
      </div>
    </Card>
  );
}
