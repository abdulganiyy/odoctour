import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import FormFactory from "@/components/custom/form-factory";

import type { FieldConfig, FormValues } from "@/types";
import { createNewMeetingFormSchema } from "@/schema/user";
import apiService from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";

export const createNewMeetingFormFields: FieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter meeting name",
  },
  {
    name: "duration",
    label: "Meeting Duration",
    type: "select",
    placeholder: "Select Meeting Duration",
    options: [
      { label: "30 mins", value: "30" },
      // { label: "45 mins", value: "45" },
    ],
  },
  {
    name: "type",
    label: "Meeting Type",
    type: "select",
    placeholder: "Select Meeting Type",
    options: [
      { label: "Physical", value: "physical" },
      { label: "Virtual", value: "virtual" },
    ],
  },
  {
    name: "url",
    type: "text",
    label: "Meeting Link",
    hidden: (values?: FormValues) => values?.type !== "virtual",
  },
];

export const createNewMeetingErrorMessages = {
  GENERIC_ERROR: "There was an error creating your meeting.",
} as const;
const CreateMeeting = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { GENERIC_ERROR } = createNewMeetingErrorMessages;

  const { toast } = useToast();

  async function handleSubmit(data: FormValues): Promise<void> {
    setError(null);
    setIsSubmitting(true);

    // console.log(data);

    data;

    try {
      const response = await apiService.post("/meeting", data);
      setIsSubmitting(false);
      toast({ description: "Your meeting calendar has been created" });
    } catch (error) {
      setError(GENERIC_ERROR);
      setIsSubmitting(false);
      toast({ description: GENERIC_ERROR });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white">Add New Meeting</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Meeting</DialogTitle>
        </DialogHeader>
        <FormFactory
          fields={createNewMeetingFormFields}
          schema={createNewMeetingFormSchema}
          formWrapperClassName="flex flex-col"
          formFieldElClass="w-full"
          onSubmit={handleSubmit}
          actionButtonsComponent={
            <div className="flex flex-col gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              {error ? (
                <Label className="text-destructive">{error}</Label>
              ) : null}
            </div>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeeting;
