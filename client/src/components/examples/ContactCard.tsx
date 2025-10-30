import { ContactCard, Contact } from '../ContactCard'

const mockContact: Contact = {
  id: "1",
  name: "Sarah Johnson",
  title: "Engineering Manager",
  company: "Tech Corp",
  email: "sarah@techcorp.com",
  linkedinUrl: "https://linkedin.com/in/sarahjohnson",
  howMet: "Conference",
  status: "active",
  notes: "Met at React Summit 2024",
};

export default function ContactCardExample() {
  return <ContactCard contact={mockContact} />
}
