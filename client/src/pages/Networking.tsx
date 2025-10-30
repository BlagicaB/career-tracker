import { useState } from "react";
import { ContactCard, Contact } from "@/components/ContactCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Engineering Manager",
    company: "Tech Corp",
    email: "sarah@techcorp.com",
    linkedinUrl: "https://linkedin.com/in/sarahjohnson",
    howMet: "Conference",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Senior Developer",
    company: "StartupXYZ",
    email: "michael@startupxyz.com",
    linkedinUrl: "https://linkedin.com/in/michaelchen",
    howMet: "Referral",
    status: "active",
  },
  {
    id: "3",
    name: "Emma Davis",
    title: "Recruiter",
    company: "BigTech Inc",
    email: "emma@bigtech.com",
    howMet: "LinkedIn",
    status: "pending",
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    title: "CTO",
    company: "Design Co",
    linkedinUrl: "https://linkedin.com/in/alexrodriguez",
    howMet: "Meetup",
    status: "active",
  },
  {
    id: "5",
    name: "Lisa Wang",
    title: "Product Manager",
    company: "Cloud Systems",
    email: "lisa@cloudsystems.com",
    howMet: "Former Colleague",
    status: "inactive",
  },
  {
    id: "6",
    name: "David Kim",
    title: "VP Engineering",
    company: "AI Startup",
    email: "david@aistartup.com",
    linkedinUrl: "https://linkedin.com/in/davidkim",
    howMet: "Coffee Chat",
    status: "active",
  },
];

export default function Networking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Networking</h1>
          <p className="text-muted-foreground">
            Manage your professional contacts and relationships
          </p>
        </div>
        <Button data-testid="button-add-contact">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, company, or title..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
}
