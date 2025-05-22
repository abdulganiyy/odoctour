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
import { EditMeetingFormSchema } from "@/schema/user";
import apiService from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";

export const EditMeetingFormFields: FieldConfig[] = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter meeting name",
  },
  //   {
  //     name: "duration",
  //     label: "Meeting Duration",
  //     type: "select",
  //     placeholder: "Select Meeting Duration",
  //     options: [
  //       { label: "30 mins", value: "30" },
  //       // { label: "45 mins", value: "45" },
  //     ],
  //   },
  //   {
  //     name: "type",
  //     label: "Meeting Type",
  //     type: "select",
  //     placeholder: "Select Meeting Type",
  //     options: [
  //       { label: "Physical", value: "physical" },
  //       { label: "Virtual", value: "virtual" },
  //     ],
  //   },
  {
    name: "url",
    type: "text",
    label: "Meeting Link",
    // hidden: (values?: FormValues) => values?.type !== "virtual",
  },
  {
    name: "availability",
    type: "availability",
    label: "Availability Slots",
  },
];

export const EditMeetingErrorMessages = {
  GENERIC_ERROR: "There was an error updating your meeting.",
} as const;

const EditMeeting = ({ data }: any) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { GENERIC_ERROR } = EditMeetingErrorMessages;

  const { toast } = useToast();

  async function handleSubmit(data: FormValues): Promise<void> {
    const availabilityTimes = (data as any).availability.map(
      (availabilityTime: any) => ({
        dayOfWeek: availabilityTime.dayOfWeek,
        canBook: availabilityTime.canBook,
        startTime: availabilityTime.startTime,
        endTime: availabilityTime.endTime,
      })
    );

    setError(null);
    setIsSubmitting(true);

    // console.log(data);

    // data;

    try {
      const response = await apiService.patch(`/meeting/${data.id}`, {
        name: data.name,
        url: data.url,
        type: "virtual",
        duration: 30,
        availability: availabilityTimes,
      });
      setIsSubmitting(false);
      toast({
        description: "Your meeting calendar has been successfully updated",
      });
    } catch (error) {
      setError(GENERIC_ERROR);
      setIsSubmitting(false);
      toast({ description: GENERIC_ERROR });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white">Edit Meeting</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Meeting</DialogTitle>
        </DialogHeader>
        <FormFactory
          fields={EditMeetingFormFields}
          schema={EditMeetingFormSchema}
          formWrapperClassName="flex flex-col"
          formFieldElClass="w-full"
          defaultValues={{
            ...data,
            availability: [
              {
                dayOfWeek: "MONDAY",
                canBook: true,
                allDay: false,
                startTime: "09:00",
                endTime: "17:00",
              },
              {
                dayOfWeek: "TUESDAY",
                canBook: true,
                allDay: false,
                startTime: "09:00",
                endTime: "17:00",
              },
              {
                dayOfWeek: "WEDNESDAY",
                canBook: true,
                allDay: false,
                startTime: "09:00",
                endTime: "17:00",
              },
              {
                dayOfWeek: "THURSDAY",
                canBook: true,
                allDay: false,
                startTime: "09:00",
                endTime: "17:00",
              },
              {
                dayOfWeek: "FRIDAY",
                canBook: true,
                allDay: false,
                startTime: "09:00",
                endTime: "17:00",
              },
              {
                dayOfWeek: "SATURDAY",
                isAvailable: false,
                allDay: false,
                startTime: "09:00",
                endTime: "17:00",
              },
              {
                dayOfWeek: "SUNDAY",
                canBook: false,
                allDay: false,
                startTime: "09:00",
                endTime: "17:00",
              },
            ],
          }}
          onSubmit={handleSubmit}
          actionButtonsComponent={
            <div className="flex flex-col gap-4">
              <Button
                className="bg-black text-white"
                type="submit"
                disabled={isSubmitting}
              >
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

export default EditMeeting;
