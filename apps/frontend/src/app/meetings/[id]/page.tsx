"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Link from "next/link";
import { Pin, CalendarCheck, Clock, MapPin, Timer } from "lucide-react";
import apiService from "@/lib/apiService";
import { useRouter, useParams } from "next/navigation";
import { capitalize } from "lodash";
import { Input } from "@/components/ui/input";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useUser } from "@/hooks/useUser";
import { combineDateTime } from "@/lib/utils";
import Spinner from "@/components/spinner";

function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  //  const [duration,setDuration] = useState(30)
  const [description, setDescription] = useState("I have body pains");

  const { user } = useUser();

  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [meeting, setMeeting] = useState<any>(null);

  const [prevBookings, setPrevBookings] = useState<any[]>([]);

  useEffect(() => {
    meeting?.duration && createTimeSlot(meeting?.duration);
  }, [meeting?.duration]);

  const createTimeSlot = (interval: any) => {
    const startTime = 8 * 60; // 8 AM in minutes
    const endTime = 22 * 60; // 10 PM in minutes
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

  const handleDateChange = (date: any) => {
    setDate(date);
  };

  const handleBooking = async () => {
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
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
      closePaymentModal();
    }
  };

  useEffect(() => {
    const fetchMeeting = async () => {
      const response = await apiService.get(`/meeting/${id}`);

      console.log(response);

      setMeeting(response);
    };

    fetchMeeting();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await apiService.get(`/meeting/${id}/bookings`);

      setPrevBookings(response);
    };

    fetchBookings();
  }, []);

  /**
   * Used to check timeslot whether its already booked or not
   * @param {*} time
   * @returns Boolean
   */
  const checkTimeSlot = (time: any) => {
    return (
      prevBookings.filter((item: any) => item.selectedTime == time).length > 0
    );
  };

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: 1000,
    currency: "NGN",
    payment_options: "card",
    customer: {
      email: user?.email ?? "user@gmail.com",
      phone_number: user?.phone ?? "070********",
      name: user?.firstname,
    },
    customizations: {
      title: "Consultation Appointment",
      description: "Payment for consultation",
      // logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config as any);

  return (
    <div className="p-8">
      <div className="">
        <h2 className="font-bold text-3xl">
          {meeting?.name ? meeting?.name : "Meeting Name"}
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          <h2 className="flex gap-2">
            <Clock />
            {meeting?.duration} Min{" "}
          </h2>
          <h2 className="flex gap-2">
            <MapPin />
            {capitalize(meeting?.type)} Meeting{" "}
          </h2>
          <h2 className="flex gap-2">
            <CalendarCheck />
            {format(date, "PPP")}{" "}
          </h2>
          {selectedTime && (
            <h2 className="flex gap-2">
              <Timer />
              {selectedTime}{" "}
            </h2>
          )}

          <Link
            href={meeting?.url ? meeting?.url : "#"}
            className="text-primary"
          >
            {meeting?.url}
          </Link>
          <div className="flex flex-col gap-y-4">
            <label>Add notes for the doctor...</label>
            <textarea
              className="border rounded-md p-2 max-w-[450px]"
              placeholder="Add some notes for the doctor"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="md:flex gap-4 mt-4">
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Select Date</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => handleDateChange(d)}
            className="border rounded-sm"
            classNames={{
              day_selected: "bg-black text-white hover:bg-blue-700",
            }}
            disabled={(date) => date <= new Date()}
          />
        </div>
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Select Available time slot</h2>
          <div className="max-w-[300px] grid grid-cols-4 gap-2">
            {timeSlots?.map((time: any, index: any) => (
              <Button
                key={index}
                disabled={checkTimeSlot(time)}
                onClick={() => setSelectedTime(time)}
                className={`
             ${time == selectedTime && "bg-black text-white"}
             `}
                variant="outline"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex pt-8 justify-end px-6">
        <Button
          className="w-64 bg-slate-800 text-white"
          // disabled={!userEmail || !userName}
          onClick={() => {
            handleFlutterPayment({
              callback: (response) => {
                handleBooking();
              },
              onClose: () => {},
            });
          }}
        >
          {isLoading ? <Spinner /> : "Schedule"}
        </Button>
      </div>
    </div>
  );
}

export default Page;
