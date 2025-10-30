import { ResumeCard, Resume } from "@/components/ResumeCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { useState } from "react";

const mockResumes: Resume[] = [
  {
    id: "1",
    title: "Software Engineer Resume - 2024",
    uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    fileSize: "245 KB",
    tags: ["Technical", "Senior Level", "Full Stack"],
    linkedApplications: [
      { id: "1", company: "Tech Corp", role: "Senior Software Engineer" },
      { id: "3", company: "BigTech Inc", role: "Frontend Engineer" },
    ],
  },
  {
    id: "2",
    title: "Frontend Specialist Resume",
    uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    fileSize: "198 KB",
    tags: ["Frontend", "React", "UI/UX"],
    linkedApplications: [
      { id: "2", company: "StartupXYZ", role: "Full Stack Developer" },
    ],
  },
  {
    id: "3",
    title: "General Tech Resume",
    uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    fileSize: "220 KB",
    tags: ["General", "Mid Level"],
  },
];

export default function Resumes() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log("File dropped", e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log("File selected", e.target.files);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Resumes</h1>
        <p className="text-muted-foreground">
          Store and manage different versions of your resume
        </p>
      </div>

      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        data-testid="dropzone-upload"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-muted">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Upload Resume</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your resume file here, or click to browse
            </p>
          </div>
          <div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              data-testid="input-file"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  <FileText className="h-4 w-4 mr-2" />
                  Choose File
                </span>
              </Button>
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Resumes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockResumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      </div>
    </div>
  );
}
