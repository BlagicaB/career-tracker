import { useQuery } from "@tanstack/react-query";
import { DashboardMetricCard } from "@/components/DashboardMetricCard";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { Briefcase, Users, TrendingUp, Target, Award, Search, FileEdit, Send, BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, isFuture } from "date-fns";
import { Link } from "wouter";
import type { Application, Contact, Skill, Goal } from "@shared/schema";

export default function Dashboard() {
  const { data: applications = [], isLoading: isLoadingApplications } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const { data: contacts = [], isLoading: isLoadingContacts } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const { data: skills = [], isLoading: isLoadingSkills } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const { data: goals = [], isLoading: isLoadingGoals } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const isLoading = isLoadingApplications || isLoadingContacts || isLoadingSkills || isLoadingGoals;

  // Calculate statistics
  const totalApplications = applications.length;
  const activeInterviews = applications.filter(app => app.status === "interviewing").length;
  const activeContacts = contacts.filter(contact => contact.status === "active").length;
  const activeGoals = goals.filter(goal => goal.status === "in-progress").length;

  // Get applications by status
  const appliedCount = applications.filter(app => app.status === "applied").length;
  const interviewingCount = applications.filter(app => app.status === "interviewing").length;
  const offerCount = applications.filter(app => app.status === "offer").length;
  const rejectedCount = applications.filter(app => app.status === "rejected").length;

  // Get recent applications (last 5)
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  // Get upcoming follow-ups
  const upcomingFollowUps = applications
    .filter(app => app.nextFollowUp && isFuture(new Date(app.nextFollowUp)))
    .sort((a, b) => new Date(a.nextFollowUp!).getTime() - new Date(b.nextFollowUp!).getTime())
    .slice(0, 5)
    .map(app => ({
      id: app.id,
      company: app.company,
      action: `Follow up on ${app.role}`,
      date: formatDistanceToNow(new Date(app.nextFollowUp!), { addSuffix: true }),
    }));

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your job search progress and upcoming activities
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Career & Job Tracker</h1>
        <p className="text-muted-foreground">
          Your complete job search companion
        </p>
      </div>

      {/* Getting Started Section */}
      {totalApplications === 0 && (
        <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-background border-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
              <p className="text-muted-foreground">
                Follow this workflow to make your job applications stand out
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Research the Job</h3>
                <p className="text-sm text-muted-foreground">
                  Use Job Research to analyze the company, understand requirements, and get AI-powered insights
                </p>
                <Link href="/job-research">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-start-research">
                    Start Research
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <FileEdit className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Customize Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Tailor your resume and cover letter to match the job requirements and company culture
                </p>
                <Link href="/resumes">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-manage-resumes">
                    Manage Resumes
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Apply & Track</h3>
                <p className="text-sm text-muted-foreground">
                  After applying, track your application status, interviews, and follow-ups
                </p>
                <Link href="/applications">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-track-applications">
                    Track Applications
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Build Your Network</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with people at target companies and track your professional relationships
                </p>
                <Link href="/networking">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-manage-network">
                    Manage Network
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardMetricCard
          title="Total Applications"
          value={totalApplications}
          icon={Briefcase}
          trend={appliedCount > 0 ? `${appliedCount} applied` : undefined}
          testId="metric-applications"
        />
        <DashboardMetricCard
          title="Active Interviews"
          value={activeInterviews}
          icon={TrendingUp}
          trend={offerCount > 0 ? `${offerCount} offers` : undefined}
          testId="metric-interviews"
        />
        <DashboardMetricCard
          title="Network Contacts"
          value={activeContacts}
          icon={Users}
          trend={contacts.length > activeContacts ? `${contacts.length} total` : undefined}
          testId="metric-contacts"
        />
        <DashboardMetricCard
          title="Active Goals"
          value={activeGoals}
          icon={Target}
          trend={goals.length > activeGoals ? `${goals.length} total` : undefined}
          testId="metric-goals"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 h-32 flex flex-col justify-between" data-testid="metric-status-applied">
          <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">
            Applied
          </p>
          <div className="space-y-1">
            <p className="text-3xl font-bold font-mono" data-testid="metric-status-applied-value">
              {appliedCount}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalApplications > 0 
                ? `${Math.round((appliedCount / totalApplications) * 100)}% of total`
                : "No applications yet"
              }
            </p>
          </div>
        </Card>

        <Card className="p-6 h-32 flex flex-col justify-between" data-testid="metric-status-interviewing">
          <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">
            Interviewing
          </p>
          <div className="space-y-1">
            <p className="text-3xl font-bold font-mono" data-testid="metric-status-interviewing-value">
              {interviewingCount}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalApplications > 0 
                ? `${Math.round((interviewingCount / totalApplications) * 100)}% of total`
                : "No applications yet"
              }
            </p>
          </div>
        </Card>

        <Card className="p-6 h-32 flex flex-col justify-between" data-testid="metric-status-offer">
          <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">
            Offers
          </p>
          <div className="space-y-1">
            <p className="text-3xl font-bold font-mono" data-testid="metric-status-offer-value">
              {offerCount}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalApplications > 0 
                ? `${Math.round((offerCount / totalApplications) * 100)}% of total`
                : "No applications yet"
              }
            </p>
          </div>
        </Card>

        <Card className="p-6 h-32 flex flex-col justify-between" data-testid="metric-skills">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wide">
              Skills
            </p>
            <Award className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold font-mono" data-testid="metric-skills-value">
              {skills.length}
            </p>
            <p className="text-xs text-muted-foreground">Tracked skills</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Recent Applications</h2>
          {recentApplications.length > 0 ? (
            <ApplicationsTable applications={recentApplications} />
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground" data-testid="text-no-applications">
                No applications yet. Start tracking your job applications to see them here.
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Follow-ups</h2>
          <div className="space-y-3">
            {upcomingFollowUps.length > 0 ? (
              upcomingFollowUps.map((item) => (
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
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground text-sm" data-testid="text-no-followups">
                  No upcoming follow-ups scheduled. Add follow-up dates to your applications to see them here.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
