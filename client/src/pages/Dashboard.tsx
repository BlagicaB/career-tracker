import { DashboardMetricCard } from "@/components/DashboardMetricCard";
import { ApplicationsTable, Application } from "@/components/ApplicationsTable";
import { Briefcase, Users, TrendingUp, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockRecentApplications: Application[] = [
  {
    id: "1",
    company: "Tech Corp",
    role: "Senior Software Engineer",
    location: "San Francisco, CA",
    status: "interviewing",
    priority: "high",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    salary: "$150k - $200k",
  },
  {
    id: "2",
    company: "StartupXYZ",
    role: "Full Stack Developer",
    location: "Remote",
    status: "applied",
    priority: "medium",
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    company: "BigTech Inc",
    role: "Frontend Engineer",
    location: "New York, NY",
    status: "offer",
    priority: "high",
    appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    offerAmount: "$180k",
  },
];

const upcomingFollowUps = [
  { id: "1", company: "Tech Corp", action: "Technical Interview", date: "Tomorrow at 2:00 PM" },
  { id: "2", company: "BigTech Inc", action: "Decision Deadline", date: "In 3 days" },
  { id: "3", company: "Design Co", action: "Follow-up Email", date: "In 5 days" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your job search progress and upcoming activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardMetricCard
          title="Total Applications"
          value={24}
          icon={Briefcase}
          trend="+3 this week"
          testId="metric-applications"
        />
        <DashboardMetricCard
          title="Active Interviews"
          value={7}
          icon={TrendingUp}
          trend="2 scheduled"
          testId="metric-interviews"
        />
        <DashboardMetricCard
          title="Network Contacts"
          value={42}
          icon={Users}
          trend="+5 this month"
          testId="metric-contacts"
        />
        <DashboardMetricCard
          title="Days Tracking"
          value={28}
          icon={Calendar}
          testId="metric-days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
          <ApplicationsTable applications={mockRecentApplications} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Follow-ups</h2>
          <div className="space-y-3">
            {upcomingFollowUps.map((item) => (
              <Card
                key={item.id}
                className="p-4 hover-elevate"
                data-testid={`card-followup-${item.id}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium" data-testid={`text-company-${item.id}`}>
                      {item.company}
                    </h3>
                    <Badge variant="outline" className="text-xs" data-testid={`badge-date-${item.id}`}>
                      {item.date}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`text-action-${item.id}`}>
                    {item.action}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
