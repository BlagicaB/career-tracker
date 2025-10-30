import { useState } from "react";
import { JobSearchCard, JobSearchResult } from "@/components/JobSearchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockJobs: JobSearchResult[] = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    company: "Tech Innovations Inc",
    location: "San Francisco, CA (Remote)",
    salary: "$150k - $200k",
    description:
      "We're looking for an experienced Full Stack Engineer to join our growing team. You'll work on cutting-edge projects using React, Node.js, and PostgreSQL. Must have 5+ years of experience in web development and strong problem-solving skills.",
    jobUrl: "https://example.com/job/1",
    source: "LinkedIn",
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    connections: [
      {
        name: "Sarah Johnson",
        degree: "1st",
        title: "Engineering Manager at Tech Innovations",
      },
      {
        name: "Michael Chen",
        degree: "2nd",
        title: "Senior Developer at Tech Innovations",
      },
    ],
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$120k - $160k",
    description:
      "Join our dynamic startup as a Frontend Developer. Work with React, TypeScript, and modern web technologies. Build beautiful, responsive user interfaces for our growing platform.",
    jobUrl: "https://example.com/job/2",
    source: "Indeed",
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    connections: [
      {
        name: "Alex Rodriguez",
        degree: "2nd",
        title: "CTO at StartupXYZ",
      },
    ],
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "Cloud Systems",
    location: "Seattle, WA",
    salary: "$140k - $180k",
    description:
      "Cloud Systems is seeking a Backend Engineer with expertise in Node.js, PostgreSQL, and microservices architecture. You'll design and implement scalable backend systems.",
    jobUrl: "https://example.com/job/3",
    source: "Reddit",
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "Infrastructure Co",
    location: "Austin, TX (Hybrid)",
    salary: "$130k - $170k",
    description:
      "Looking for a DevOps Engineer to manage our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines required.",
    jobUrl: "https://example.com/job/4",
    source: "LinkedIn",
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    connections: [
      {
        name: "Emma Davis",
        degree: "1st",
        title: "Recruiter at Infrastructure Co",
      },
      {
        name: "David Kim",
        degree: "2nd",
        title: "VP Engineering at Infrastructure Co",
      },
      {
        name: "Lisa Wang",
        degree: "3rd",
        title: "Product Manager at Infrastructure Co",
      },
    ],
  },
];

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [source, setSource] = useState("all");
  const [showOnlyWithConnections, setShowOnlyWithConnections] = useState(false);

  const handleSearch = () => {
    console.log("Search triggered:", { searchQuery, location, jobType, source });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Job Search</h1>
        <p className="text-muted-foreground">
          Find opportunities that match your profile and connect with your network
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Smart Job Search</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            This feature searches across LinkedIn, Indeed, Reddit, and other platforms
            to find jobs matching your profile. It also identifies connections who can
            help you get referred.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title or Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. Senior Software Engineer, React Developer..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-query"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="e.g. San Francisco, Remote, New York..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="input-location"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-[200px]" data-testid="select-job-type">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="fullstack">Full Stack</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-[200px]" data-testid="select-source">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="indeed">Indeed</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showOnlyWithConnections ? "default" : "outline"}
              onClick={() => setShowOnlyWithConnections(!showOnlyWithConnections)}
              data-testid="button-toggle-connections"
            >
              {showOnlyWithConnections ? "✓ " : ""}Only Show Jobs with Connections
            </Button>
          </div>
          <Button onClick={handleSearch} className="w-full" data-testid="button-search">
            <Search className="h-4 w-4 mr-2" />
            Search Jobs
          </Button>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <Badge variant="outline" className="font-mono" data-testid="badge-results-count">
            {mockJobs.length} jobs found
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mockJobs.map((job) => (
          <JobSearchCard key={job.id} job={job} />
        ))}
      </div>

      <Card className="p-6 bg-muted/50">
        <div className="text-center space-y-2">
          <h3 className="font-semibold">Need More Results?</h3>
          <p className="text-sm text-muted-foreground">
            Connect your LinkedIn account to unlock personalized job recommendations and
            see more network connections.
          </p>
          <Button variant="outline" className="mt-4" data-testid="button-connect-linkedin">
            Connect LinkedIn Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
