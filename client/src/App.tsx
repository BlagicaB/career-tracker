import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TopNav } from "@/components/TopNav";
import Dashboard from "@/pages/Dashboard";
import JobSearch from "@/pages/JobSearch";
import Applications from "@/pages/Applications";
import Networking from "@/pages/Networking";
import Skills from "@/pages/Skills";
import Goals from "@/pages/Goals";
import Resumes from "@/pages/Resumes";
import CoverLetters from "@/pages/CoverLetters";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/job-search" component={JobSearch} />
      <Route path="/applications" component={Applications} />
      <Route path="/networking" component={Networking} />
      <Route path="/skills" component={Skills} />
      <Route path="/goals" component={Goals} />
      <Route path="/resumes" component={Resumes} />
      <Route path="/cover-letters" component={CoverLetters} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen w-full">
          <TopNav />
          <main className="flex-1 overflow-y-auto py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <Router />
            </div>
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
