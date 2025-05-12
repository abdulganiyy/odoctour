"use client";
import { useUser } from "@/hooks/useUser";
import React, { useState, useEffect } from "react";
import { CreateUserModal } from "./_components/create-user-modal";
import UserListTable from "./_components/user-list-table";
import CreateMeeting from "./_components/create-meeting-modal";
import MeetingsTable from "./_components/meetings-table";
import BookingsTable from "./_components/bookings-table";
import apiService from "@/lib/apiService";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/dashboard`);
        console.log(response);
        setData(response);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []);
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-3xl">Hi, {user?.firstname} </h3>
      </div>
      {loading ? (
        <div className="md:grid grid-cols-3 gap-4 animate-pulse">
          <div className="h-30 bg-gray-200 rounded-md dark:bg-gray-700"></div>
          <div className="h-30 bg-gray-200 rounded-md dark:bg-gray-700"></div>
          <div className="h-30 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        </div>
      ) : (
        <div className="md:grid grid-cols-3 gap-4">
          {data.map((res) => {
            return (
              <div
                key={res.name}
                className="border-[1px] border-gray-400 p-4 rounded-sm"
              >
                <h1 className="text-4xl">{res.data}</h1>
                <p>{res.name}</p>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-2 mt-4">
        {user?.role == "Administrator" && <CreateUserModal />}
        {/* {user?.role == "Doctor" && <CreateMeeting />} */}
        {user?.role == "User" && (
          <button
            onClick={() => {
              router.push("/meetings");
            }}
            className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Consult A Doctor
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
      <div className="space-y-8 mt-4">
        {user?.role == "Administrator" && (
          <div>
            <h2 className="text-3xl">Users</h2>
            <UserListTable />
          </div>
        )}
        {["Administrator", "Doctor"].includes(user?.role) && (
          <div>
            <h2 className="text-3xl">Meetings</h2>
            <MeetingsTable />
          </div>
        )}
        {["Administrator", "Doctor", "User"].includes(user?.role) && (
          <div>
            <h2 className="text-3xl">Appointments</h2>
            <BookingsTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
