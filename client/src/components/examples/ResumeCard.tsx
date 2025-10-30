import { ResumeCard, Resume } from '../ResumeCard'

const mockResume: Resume = {
  id: "1",
  title: "Software Engineer Resume - 2024",
  uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  fileSize: "245 KB",
  tags: ["Technical", "Senior Level", "Full Stack"],
};

export default function ResumeCardExample() {
  return <ResumeCard resume={mockResume} />
}
