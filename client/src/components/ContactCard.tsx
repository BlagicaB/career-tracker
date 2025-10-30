import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Linkedin, MoreHorizontal, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Contact } from "@shared/schema";

interface ContactCardProps {
  contact: Contact;
  onViewDetails?: (contact: Contact) => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-700 dark:text-green-400",
  inactive: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export function ContactCard({
  contact,
  onViewDetails,
  onEdit,
  onDelete,
}: ContactCardProps) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAction = (action: string) => {
    console.log(`${action} triggered for`, contact.name);
    if (action === "view" && onViewDetails) onViewDetails(contact);
    if (action === "edit" && onEdit) onEdit(contact);
    if (action === "delete" && onDelete) onDelete(contact.id);
  };

  return (
    <Card className="p-6" data-testid={`card-contact-${contact.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium" data-testid={`text-name-${contact.id}`}>{contact.name}</h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-title-${contact.id}`}>
              {contact.title}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-actions-${contact.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAction("view")}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("edit")}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("delete")}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span data-testid={`text-company-${contact.id}`}>{contact.company}</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`${statusColors[contact.status]} text-xs px-2 py-1 font-mono`} data-testid={`badge-status-${contact.id}`}>
            {contact.status}
          </Badge>
          {contact.howMet && (
            <Badge variant="outline" className="text-xs px-2 py-1" data-testid={`badge-how-met-${contact.id}`}>
              {contact.howMet}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {contact.email && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`mailto:${contact.email}`, "_self")}
              data-testid={`button-email-${contact.id}`}
            >
              <Mail className="h-3 w-3 mr-2" />
              Email
            </Button>
          )}
          {contact.linkedinUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(contact.linkedinUrl || "", "_blank")}
              data-testid={`button-linkedin-${contact.id}`}
            >
              <Linkedin className="h-3 w-3 mr-2" />
              LinkedIn
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
