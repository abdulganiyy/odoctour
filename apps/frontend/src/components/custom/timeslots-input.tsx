import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

function TimeSlotsInput({ name }: any) {
  const {
    register,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name,
  });

  const watchAvailability = watch("availability");

  //   console.log(errors.availability);

  return (
    <div className="space-y-4">
      {fields.map((field: any, index: number) => {
        const canBook = watchAvailability?.[index]?.canBook;
        const isAllDay = watchAvailability?.[index]?.allDay;
        const start = watchAvailability?.[index]?.startTime;
        const end = watchAvailability?.[index]?.endTime;

        const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const checked = e.target.checked;

          setValue(`availability.${index}.allDay`, checked);
          if (checked) {
            setValue(`availability.${index}.startTime`, "00:00");
            setValue(`availability.${index}.endTime`, "23:00");
          } else {
            setValue(`availability.${index}.startTime`, "09:00");
            setValue(`availability.${index}.endTime`, "17:00");
          }
        };
        return (
          <div key={field.id} className="flex justify-between items-center">
            <span className="text-md font-bold mb-2">{field.dayOfWeek}</span>
            <div className="flex gap-2 items-center mb-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  //   id="open-mode"
                  {...register(`availability.${index}.canBook`)}
                  //   className={cn(
                  //     `${watchAvailability?.[index]?.canBook ? "bg-blue-600" : "bg-red-600"}`
                  //   )}
                />
                <Label
                  className={cn(
                    "text-black",
                    !watchAvailability?.[index]?.canBook && "text-red-600"
                  )}
                >
                  {canBook ? "Opened" : "Closed"}
                </Label>
              </div>
              <input
                type="time"
                {...register(`availability.${index}.startTime`)}
                onBlur={(e) => {
                  const startValue = e.target.value;
                  const [eh, em] = end?.split(":").map(Number) ?? [];
                  const [sh, sm] = startValue.split(":").map(Number);

                  if (sh != null && sm != null && eh != null && em != null) {
                    const startMins = sh * 60 + sm;
                    const endMins = eh * 60 + em;

                    if (endMins - startMins < 60) {
                      // Clear the value
                      //   e.target.value = "";
                      setValue(`availability.${index}.startTime`, "");
                      setError(`availability.${index}.startTime`, {
                        type: "manual",
                        message:
                          "Start time must be at least 1 hour before end time",
                      });

                      // Optional: show a toast or alert
                    }
                  }
                }}
                disabled={!canBook || isAllDay}
                className="border px-2 py-1 rounded"
              />
              {(errors as any)?.availability?.[index]?.startTime && (
                <span className="text-red-600 text-sm">
                  {(errors as any)?.availability?.[index]?.startTime.message}
                </span>
              )}
              <input
                type="time"
                disabled={!canBook || isAllDay}
                {...register(`availability.${index}.endTime`)}
                onBlur={(e) => {
                  const endValue = e.target.value;
                  const [sh, sm] = start?.split(":").map(Number) ?? [];
                  const [eh, em] = endValue.split(":").map(Number);

                  if (sh != null && sm != null && eh != null && em != null) {
                    const startMins = sh * 60 + sm;
                    const endMins = eh * 60 + em;

                    if (endMins - startMins < 60) {
                      // Clear the value
                      //   e.target.value = "";
                      setValue(`availability.${index}.endTime`, "");
                      setError(`availability.${index}.endTime`, {
                        type: "manual",
                        message:
                          "End time must be at least 1 hour after start time",
                      });

                      // Optional: show a toast or alert
                    }
                  }
                }}
                className="border px-2 py-1 rounded"
              />
              {(errors as any)?.availability?.[index]?.endTime && (
                <span className="text-red-600 text-sm">
                  {(errors as any)?.availability?.[index]?.endTime.message}
                </span>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  //   {...register(`availability.${index}.allDay`)}
                  onChange={handleAllDayChange}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Open for 24hours
                </label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TimeSlotsInput;
