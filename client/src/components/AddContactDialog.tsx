import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertContact, Contact } from "@shared/schema";
import { CameraScanner } from "./CameraScanner";
import { Scan, CreditCard, Keyboard } from "lucide-react";

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingContact?: Contact | null;
}

type InputMode = "manual" | "qr" | "businesscard";

export function AddContactDialog({
  open,
  onOpenChange,
  editingContact,
}: AddContactDialogProps) {
  const { toast } = useToast();
  const isEditing = !!editingContact;
  const [inputMode, setInputMode] = useState<InputMode>("manual");
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    linkedinUrl: "",
    howMet: "",
    status: "active",
    notes: "",
  });

  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        title: editingContact.title,
        company: editingContact.company,
        email: editingContact.email || "",
        linkedinUrl: editingContact.linkedinUrl || "",
        howMet: editingContact.howMet || "",
        status: editingContact.status,
        notes: editingContact.notes || "",
      });
    } else {
      resetForm();
    }
  }, [editingContact, open]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const res = await apiRequest("POST", "/api/contacts", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add contact",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertContact>) => {
      const res = await apiRequest("PATCH", `/api/contacts/${editingContact!.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      company: "",
      email: "",
      linkedinUrl: "",
      howMet: "",
      status: "active",
      notes: "",
    });
    setInputMode("manual");
    setIsScanning(false);
    setIsProcessing(false);
  };

  // Handle QR code scan result
  const handleQRScan = async (qrData: string) => {
    try {
      setIsScanning(false);
      // Try to parse as vCard or JSON
      if (qrData.startsWith("BEGIN:VCARD")) {
        // Parse vCard format
        const name = qrData.match(/FN:(.+)/)?.[1] || "";
        const email = qrData.match(/EMAIL[^:]*:(.+)/)?.[1] || "";
        const phone = qrData.match(/TEL[^:]*:(.+)/)?.[1] || "";
        const org = qrData.match(/ORG:(.+)/)?.[1] || "";
        const title = qrData.match(/TITLE:(.+)/)?.[1] || "";
        const url = qrData.match(/URL:(.+)/)?.[1] || "";
        
        setFormData(prev => ({
          ...prev,
          name: name || prev.name,
          title: title || prev.title,
          company: org || prev.company,
          email: email || prev.email,
          linkedinUrl: url.includes("linkedin") ? url : prev.linkedinUrl,
        }));
        
        toast({
          title: "QR Code Scanned",
          description: "Contact information filled from QR code",
        });
      } else {
        // Try parsing as JSON
        try {
          const data = JSON.parse(qrData);
          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            title: data.title || prev.title,
            company: data.company || prev.company,
            email: data.email || prev.email,
            linkedinUrl: data.linkedin || data.linkedinUrl || prev.linkedinUrl,
          }));
          
          toast({
            title: "QR Code Scanned",
            description: "Contact information filled from QR code",
          });
        } catch {
          toast({
            title: "Invalid QR Code",
            description: "QR code does not contain valid contact data",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("QR scan error:", error);
      toast({
        title: "Scan Error",
        description: "Failed to process QR code",
        variant: "destructive",
      });
    }
  };

  // Handle business card scan result
  const handleBusinessCardScan = async (imageData: string) => {
    try {
      setIsScanning(false);
      setIsProcessing(true);
      
      const res = await apiRequest("POST", "/api/scan/business-card", { imageData });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || errorData.details || "Failed to extract business card information");
      }
      
      const contactInfo = await res.json();
      
      // Only update form if we got valid data
      if (contactInfo && (contactInfo.name || contactInfo.email || contactInfo.company)) {
        setFormData(prev => ({
          ...prev,
          name: contactInfo.name || prev.name,
          title: contactInfo.title || prev.title,
          company: contactInfo.company || prev.company,
          email: contactInfo.email || prev.email,
          linkedinUrl: contactInfo.linkedin || prev.linkedinUrl,
        }));
        
        toast({
          title: "Business Card Scanned",
          description: "Contact information extracted successfully",
        });
      } else {
        toast({
          title: "No Information Found",
          description: "Could not extract contact information from the image. Please try again or enter manually.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Business card scan error:", error);
      toast({
        title: "Scan Error",
        description: error.message || "Failed to extract business card information",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactData: InsertContact = {
      name: formData.name,
      title: formData.title,
      company: formData.company,
      email: formData.email || undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      howMet: formData.howMet || undefined,
      status: formData.status,
      notes: formData.notes || undefined,
    };

    if (isEditing) {
      updateMutation.mutate(contactData);
    } else {
      createMutation.mutate(contactData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      {isScanning && (
        <CameraScanner
          mode={inputMode as "qr" | "businesscard"}
          onScanComplete={inputMode === "qr" ? handleQRScan : handleBusinessCardScan}
          onClose={() => setIsScanning(false)}
        />
      )}
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Contact" : "Add New Contact"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update contact information" : "Add a new professional contact to your network"}
            </DialogDescription>
          </DialogHeader>
          
          {!isEditing && (
            <div className="flex gap-2 pb-4 border-b">
              <Button
                type="button"
                variant={inputMode === "manual" ? "default" : "outline"}
                size="sm"
                onClick={() => setInputMode("manual")}
                className="flex-1"
                disabled={isProcessing}
                data-testid="button-input-manual"
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Manual Entry
              </Button>
              <Button
                type="button"
                variant={inputMode === "qr" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setInputMode("qr");
                  setIsScanning(true);
                }}
                className="flex-1"
                disabled={isProcessing}
                data-testid="button-input-qr"
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
              <Button
                type="button"
                variant={inputMode === "businesscard" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setInputMode("businesscard");
                  setIsScanning(true);
                }}
                className="flex-1"
                disabled={isProcessing}
                data-testid="button-input-businesscard"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Scan Card
              </Button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {isProcessing && (
              <div className="p-4 mb-4 bg-primary/10 text-sm rounded-lg text-center">
                Extracting information from business card...
              </div>
            )}
            
            <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Engineer"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  data-testid="input-title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                required
                data-testid="input-company"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedinUrl: e.target.value })
                  }
                  data-testid="input-linkedin-url"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="howMet">How Met</Label>
                <Input
                  id="howMet"
                  placeholder="e.g. Conference, LinkedIn, Referral"
                  value={formData.howMet}
                  onChange={(e) =>
                    setFormData({ ...formData, howMet: e.target.value })
                  }
                  data-testid="input-how-met"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this contact..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                data-testid="textarea-notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isProcessing}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isProcessing} data-testid="button-submit">
              {isPending ? (isEditing ? "Updating..." : "Adding...") : isProcessing ? "Processing..." : (isEditing ? "Update Contact" : "Add Contact")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
