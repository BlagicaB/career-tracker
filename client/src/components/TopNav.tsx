import {
  Briefcase,
  Users,
  Award,
  Target,
  FileText,
  LayoutDashboard,
  FileEdit,
  FolderKanban,
  LogOut,
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth, getLogoutUrl } from "@/lib/auth";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Job Research", url: "/job-research", icon: FolderKanban },
  { title: "Applications", url: "/applications", icon: Briefcase },
  { title: "Networking", url: "/networking", icon: Users },
  { title: "Skills", url: "/skills", icon: Award },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Resumes", url: "/resumes", icon: FileText },
  { title: "Cover Letters", url: "/cover-letters", icon: FileEdit },
];

export function TopNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-semibold">Career Tracker</h1>
          <div className="flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = location === item.url;
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors hover-elevate ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user && (
            <>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profileImageUrl || undefined} />
                  <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium" data-testid="text-username">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <a href={getLogoutUrl()}>
                <Button variant="ghost" size="icon" data-testid="button-logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
