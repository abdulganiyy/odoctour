"use client";
import { useUser } from "@/hooks/useUser";
import React, { useState, useEffect } from "react";
import { CreateUserModal } from "./_components/create-user-modal";
import UserListTable from "./_components/user-list-table";
import CreateMeeting from "./_components/create-meeting-modal";
import MeetingsTable from "./_components/meetings-table";
import BookingsTable from "./_components/bookings-table";
import apiService from "@/lib/apiService";

const Dashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
        {user?.role == "Doctor" && <CreateMeeting />}
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
