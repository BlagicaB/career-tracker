import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Target, FileText, TrendingUp, CheckCircle } from "lucide-react";
import { getLoginUrl } from "@/lib/auth";

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              Career & Job Tracker
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-4">
              Streamline your job search with a comprehensive platform to track applications,
              manage networking contacts, monitor skills development, and set career goals.
            </p>
            <p className="mx-auto max-w-xl text-base text-muted-foreground mb-8">
              Create your personal account to keep track of all your career progress in one secure place.
              Your data stays private and accessible only to you.
            </p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="text-lg px-8" data-testid="button-login">
                Create Account
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Land Your Next Job</h2>
          <p className="text-lg text-muted-foreground">
            A complete toolkit for modern job seekers
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Application Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Keep track of all your job applications in one place. Monitor status, set reminders,
                and never miss a follow-up opportunity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Job Folders</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Research companies and prepare tailored application materials with AI assistance.
                Analyze resumes, conduct company research, and more.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Networking CRM</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build and maintain professional relationships. Track contacts, scan business cards,
                and manage your professional network effectively.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Skills Dashboard</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your professional skills and competencies. Identify gaps and
                focus your learning efforts on what matters most.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Goals Tracker</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set and monitor career goals. Track progress, celebrate milestones,
                and stay motivated throughout your career journey.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Resume & Cover Letters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Store and manage your resumes and cover letters. Upload PDFs, extract text,
                and keep all your application materials organized.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Create your account to start tracking your career journey today. All your job applications,
              contacts, and progress will be saved securely in your personal workspace.
            </p>
            <a href={getLoginUrl()}>
              <Button size="lg" data-testid="button-login-cta">
                Create Account
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
