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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  jobDescription: z.string().optional(),
  jobRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditJobDescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: FormValues;
  onSave: (values: FormValues) => void;
  isPending?: boolean;
  jobUrl?: string | null;
}

export function EditJobDescriptionDialog({ 
  open, 
  onOpenChange,
  initialValues,
  onSave,
  isPending,
  jobUrl
}: EditJobDescriptionDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(initialValues);
    }
  }, [open, initialValues, form]);

  const onSubmit = (values: FormValues) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Description</DialogTitle>
          <DialogDescription>
            Copy the job description from the posting and paste it here to enable AI-powered resume analysis.
          </DialogDescription>
        </DialogHeader>
        
        {jobUrl && (
          <div className="rounded-md bg-muted p-3 flex items-start gap-2">
            <div className="flex-1 text-sm">
              <p className="text-muted-foreground mb-2">
                Open the job posting in a new tab, then copy and paste the description below:
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(jobUrl, '_blank')}
                data-testid="button-open-job-url"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Job Posting
              </Button>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste the full job description here..."
                      className="min-h-[150px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-job-description"
                    />
                  </FormControl>
                  <FormDescription>
                    This helps the AI analyze how well your resume matches the position.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements & Qualifications</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste the requirements and qualifications here..."
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ""}
                      data-testid="textarea-job-requirements"
                    />
                  </FormControl>
                  <FormDescription>
                    Include required skills, experience, and qualifications.
                  </FormDescription>
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
                disabled={isPending}
                data-testid="button-save"
              >
                {isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
