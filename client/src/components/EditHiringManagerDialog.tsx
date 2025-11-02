import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  hiringManagerName: z.string().optional(),
  hiringManagerTitle: z.string().optional(),
  hiringManagerLinkedin: z.string().optional(),
  hiringManagerBackground: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditHiringManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: FormValues;
  onSave: (values: FormValues) => void;
}

export function EditHiringManagerDialog({ 
  open, 
  onOpenChange,
  initialValues,
  onSave
}: EditHiringManagerDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Hiring Manager Information</DialogTitle>
          <DialogDescription>
            Add or update details about the hiring manager for this position.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="hiringManagerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Jane Smith"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-manager-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hiringManagerTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title/Role</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Engineering Manager"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-manager-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hiringManagerLinkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      {...field}
                      value={field.value || ""}
                      data-testid="input-manager-linkedin"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hiringManagerBackground"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes about their background, experience, interests..."
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-manager-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                data-testid="button-save"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
