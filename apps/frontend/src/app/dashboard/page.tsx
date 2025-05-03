"use client";
import { useUser } from "@/hooks/useUser";
import React from "react";
import { CreateUserModal } from "./_components/create-user-modal";
import UserListTable from "./_components/user-list-table";
import CreateMeeting from "./_components/create-meeting-modal";
import MeetingsTable from "./_components/meetings-table";
import BookingsTable from "./_components/bookings-table";

const Dashboard = () => {
  const { user } = useUser();
  console.log(user);
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-3xl">Hi, {user?.firstname} </h3>
      </div>
      <div className="md:grid grid-cols-3 gap-4">
        {user?.role == "Administrator" && (
          <div className="border-[1px] border-gray-400 p-4 rounded-sm">
            <h1 className="text-4xl">10</h1>
            <p>Users</p>
          </div>
        )}
        {["Administrator", "Doctor"].includes(user?.role) && (
          <div className="border-[1px] border-gray-400 p-4 rounded-sm">
            <h1 className="text-4xl">20</h1>
            <p>Meetings</p>
          </div>
        )}
        {["Administrator", "Doctor", "User"].includes(user?.role) && (
          <div className="border-[1px] border-gray-400 p-4 rounded-sm">
            <h1 className="text-4xl">30</h1>
            <p>Bookings</p>
          </div>
        )}
      </div>
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
