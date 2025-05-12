"use client";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/lib/apiService";
import Image from "next/image";
import InitialsAvatar from "@/components/custom/initial-avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PhoneCall } from "lucide-react";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

const fetchDoctors = async () => {
  const response = await apiService.get(`/user/doctors`);
  console.log(response);
  return response;
};

export default function MeetingsPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  const goToMeeting = (meeting: any) => {
    if (typeof window !== undefined) {
      if (meeting) {
        router.push(`/meetings/${meeting.id}`);
      }
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-4">
      <Link href={"/"} className="flex mb-4">
        <ArrowLeftIcon color="black" />
      </Link>
      <ul className="grid md:grid-cols-4 gap-4">
        {data.map((user: any) => (
          <li key={user.id}>
            <div className="p-4 border-2 box-shadow-2xl rounded-lg space-y-4">
              <h3 className="italic">Dr's Profile</h3>
              <p className="font-semibold text-xl">
                Dr {user.firstname} {user.lastname}
              </p>
              <p>{user.email}</p>
              {/* <Image
                          src={"/logo-small.png"}
                          height={10}
                          width={50}
                          className="-ml-3"
                          alt="Odoctor Logo"
                        /> */}
              {user?.profilePicture?.url ? (
                <img
                  className="rounded-full w-40 h-40"
                  src={user?.profilePicture?.url}
                  alt="profile image"
                />
              ) : (
                <InitialsAvatar
                  firstName={user.firstname}
                  lastName={user.lastname}
                  size={160}
                />
              )}
              <Button
                onClick={() => {
                  goToMeeting(user.meeting);
                }}
                className="bg-white text-[#2E8ECD] border-[1px]"
              >
                <PhoneCall /> Book Appointment
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
