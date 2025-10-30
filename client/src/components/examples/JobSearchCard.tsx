import { JobSearchCard, JobSearchResult } from '../JobSearchCard'

const mockJob: JobSearchResult = {
  id: "1",
  title: "Senior Full Stack Engineer",
  company: "Tech Innovations Inc",
  location: "San Francisco, CA (Remote)",
  salary: "$150k - $200k",
  description: "We're looking for an experienced Full Stack Engineer to join our growing team. You'll work on cutting-edge projects using React, Node.js, and PostgreSQL. Must have 5+ years of experience in web development.",
  jobUrl: "https://example.com/job/1",
  source: "LinkedIn",
  postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  connections: [
    { name: "Sarah Johnson", degree: "1st", title: "Engineering Manager at Tech Innovations" },
    { name: "Michael Chen", degree: "2nd", title: "Senior Developer at Tech Innovations" },
  ],
};

export default function JobSearchCardExample() {
  return <JobSearchCard job={mockJob} />
}
