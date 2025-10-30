import {
  Briefcase,
  Users,
  Award,
  Target,
  FileText,
  LayoutDashboard,
  FileEdit,
} from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Applications", url: "/applications", icon: Briefcase },
  { title: "Networking", url: "/networking", icon: Users },
  { title: "Skills", url: "/skills", icon: Award },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Resumes", url: "/resumes", icon: FileText },
  { title: "Cover Letters", url: "/cover-letters", icon: FileEdit },
];

export function TopNav() {
  const [location] = useLocation();

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-semibold">Career Tracker</h1>
          <div className="flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = location === item.url;
              return (
                <a
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
                </a>
              );
            })}
          </div>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
