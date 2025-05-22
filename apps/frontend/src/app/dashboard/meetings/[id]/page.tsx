"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Link from "next/link";
import {
  Pin,
  CalendarCheck,
  Clock,
  MapPin,
  Timer,
  ArrowLeftIcon,
} from "lucide-react";
import apiService from "@/lib/apiService";
import { useRouter, useParams } from "next/navigation";
import { capitalize } from "lodash";
import { Input } from "@/components/ui/input";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useUser } from "@/hooks/useUser";
import { combineDateTime } from "@/lib/utils";
import Spinner from "@/components/spinner";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { isBefore, startOfDay, isEqual } from "date-fns";

function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  //  const [duration,setDuration] = useState(30)
  const [description, setDescription] = useState("");

  const { user } = useUser();

  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [meeting, setMeeting] = useState<any>(null);

  const [prevBookings, setPrevBookings] = useState<any[]>([]);

  useEffect(() => {
    meeting?.duration && createTimeSlot(meeting?.duration);
  }, [meeting?.duration, date]);

  const createTimeSlot = (interval: any) => {
    const dayNames: string[] = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    const dateParsed = new Date(date);
    const dayOfWeek = dayNames[dateParsed.getDay()];
    let slot = meeting.availabilitySlots.find(
      (slot: any) => slot.dayOfWeek == dayOfWeek
    );
    // const startTime = 8 * 60; // 8 AM in minutes
    // const endTime = 22 * 60; // 10 PM in minutes

    const [eh, em] = slot.endTime?.split(":").map(Number) ?? [];
    const [sh, sm] = slot.startTime.split(":").map(Number);

    const startTime = sh * 60 + sm;
    const endTime = eh * 60 + em;
    const totalSlots = (endTime - startTime) / interval;
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
      const period = hours >= 12 ? "PM" : "AM";
      return `${String(formattedHours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")} ${period}`;
    });

    setTimeSlots(slots);
  };

  // const createTimeSlot = (interval: any) => {
  //   const startTime = 8 * 60; // 8 AM in minutes
  //   const endTime = 22 * 60; // 10 PM in minutes
  //   const totalSlots = (endTime - startTime) / interval;
  //   const slots = Array.from({ length: totalSlots }, (_, i) => {
  //     const totalMinutes = startTime + i * interval;
  //     const hours = Math.floor(totalMinutes / 60);
  //     const minutes = totalMinutes % 60;
  //     const formattedHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
  //     const period = hours >= 12 ? "PM" : "AM";
  //     return `${String(formattedHours).padStart(2, "0")}:${String(
  //       minutes
  //     ).padStart(2, "0")} ${period}`;
  //   });

  //   setTimeSlots(slots);
  // };

  const handleDateChange = (date: any) => {
    setDate(date);
  };

  const handleBooking = async () => {
    // router.refresh()

    if (!selectedTime) return;
    const payload = {
      name: meeting.name,
      description,
      meetingId: id,
      time: combineDateTime(date.toDateString(), selectedTime),
      date: combineDateTime(date.toDateString(), selectedTime),
    };

    try {
      setIsLoading(true);
      const response = await apiService.post(`/booking`, payload);
      toast({ description: "Your appointment has been booked successfully" });
      // router.refresh()

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast({ variant: "destructive", description: error.message });
    } finally {
      setIsLoading(false);
      closePaymentModal();
    }
  };

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await apiService.get(`/meeting/${id}`);

        console.log(response);

        setMeeting(response);
      } catch (error: any) {
        toast({ variant: "destructive", description: error.message });
      }
    };

    fetchMeeting();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiService.get(`/meeting/${id}/bookings`);

        console.log(response);

        setPrevBookings(response);
      } catch (error: any) {
        toast({ variant: "destructive", description: error.message });
      }
    };

    fetchBookings();
  }, []);

  /**
   * Used to check timeslot whether its already booked or not
   * @param {*} time
   * @returns Boolean
   */
  const checkTimeSlot = (timeSlot: any) => {
    return (
      prevBookings.filter((item: any) => {
        return isEqual(
          new Date(item.time),
          combineDateTime(date.toDateString(), timeSlot)
        );
      }).length > 0
    );
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-[#2E8ECD] bg-opacity-50 overflow-y-auto p-4">
        <div className="md:w-5/12 rounded-md p-4 drop-shadow-xl bg-white">
          <Link href={"/meetings"}>
            <ArrowLeftIcon color="black" />
          </Link>
          <Image
            src={"/logo-small.png"}
            height={10}
            width={50}
            className="-ml-3"
            alt="Odoctor Logo"
          />
          <h3 className="text-xl font-bold">
            My Upcoming Appointments Calendar
            {meeting?.user?.profilePicture?.url && (
              <img
                src={meeting?.user?.profilePicture?.url ?? "/logo-small.png"}
                // height={5}
                // width={5}
                className="h-20 w-20 rounded-full"
                alt="Doctor Picture"
              />
            )}
          </h3>
          <div className="mt-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => handleDateChange(d)}
              className="w-full border-[1px] border-[#2E8ECD] rounded-md"
              classNames={{
                table: "w-full table-fixed",
                head_row: "grid grid-cols-7",
                row: "grid grid-cols-7",
                cell: "aspect-square w-full text-center",
                day: "p-1 flex items-center justify-center w-full h-full rounded-md focus:outline-none",
                day_selected: "bg-black text-white",
              }}
              disabled={(date) => {
                const today = startOfDay(new Date());
                return isBefore(date, today);
              }}
            />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
            {timeSlots?.map((time: any, index: any) => (
              <Button
                key={index}
                disabled={true}
                className={`${checkTimeSlot(time) && "bg-black text-white cursor-not-allowed"}`}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
