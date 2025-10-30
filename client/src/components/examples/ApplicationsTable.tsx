import { ApplicationsTable, Application } from '../ApplicationsTable'

const mockApplications: Application[] = [
  {
    id: "1",
    company: "Tech Corp",
    role: "Senior Software Engineer",
    location: "San Francisco, CA",
    status: "interviewing",
    priority: "high",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    salary: "$150k - $200k",
    jobUrl: "https://example.com/job/1",
  },
  {
    id: "2",
    company: "StartupXYZ",
    role: "Full Stack Developer",
    location: "Remote",
    status: "applied",
    priority: "medium",
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    salary: "$120k - $160k",
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

export default function ApplicationsTableExample() {
  return <ApplicationsTable applications={mockApplications} />
}
