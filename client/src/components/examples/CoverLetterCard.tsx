import { CoverLetterCard, CoverLetter } from '../CoverLetterCard'

const mockCoverLetter: CoverLetter = {
  id: "1",
  title: "Senior Software Engineer Cover Letter",
  company: "Tech Corp",
  role: "Senior Software Engineer",
  createdDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  tags: ["Technical", "Leadership", "Full Stack"],
};

export default function CoverLetterCardExample() {
  return <CoverLetterCard coverLetter={mockCoverLetter} />
}
