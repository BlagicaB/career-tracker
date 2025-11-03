import { useEffect } from "react";
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
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  salary: z.string().optional(),
  jobUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBasicInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: FormValues;
  onSave: (values: FormValues) => void;
}

export function EditBasicInfoDialog({ 
  open, 
  onOpenChange,
  initialValues,
  onSave
}: EditBasicInfoDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);

  const handleSubmit = (values: FormValues) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Job Information</DialogTitle>
          <DialogDescription>
            Update the basic details for this job opportunity.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Acme Inc."
                      {...field}
                      data-testid="input-company"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Senior Software Engineer"
                      {...field}
                      data-testid="input-jobtitle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="San Francisco, CA"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="$120k - $180k"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-salary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Posting URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://..."
                      {...field}
                      value={field.value || ""}
                      data-testid="input-joburl"
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
