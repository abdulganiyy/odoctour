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
import { useQuery } from "@tanstack/react-query";

type DashboardData = {
  name: string;
  data: number;
};

const Dashboard = () => {
  const { user } = useUser();
  const router = useRouter();

  const fetchDashboardSummary = async () => {
    const response = await apiService.get(`/dashboard`);
    console.log(response);
    return response;
  };

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardSummary,
  });

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-3xl">Hi, {user?.firstname} </h3>
      </div>
      {loading && (
        <div className="md:grid md:grid-cols-3 gap-4 animate-pulse">
          <div className="h-30 bg-gray-200 rounded-md dark:bg-gray-700"></div>
          <div className="h-30 bg-gray-200 rounded-md dark:bg-gray-700"></div>
          <div className="h-30 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        </div>
      )}
      {/* {error && (
        <div
          className="flex items-center justify-between gap-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md max-w-md"
          role="alert"
        >
          <span className="flex-1 text-sm">
            ⚠️ Failed to load data. Please check your connection.
          </span>

          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582M20 20v-5h-.581m0 0A8.001 8.001 0 004.582 9M4 15a8.001 8.001 0 0015.837 1"
              />
            </svg>
            Retry
          </button>
        </div>
      )} */}
      {!error ? (
        <div className="md:grid grid-cols-3 gap-4 space-y-4 md:space-y-0">
          {data?.map((res: DashboardData) => {
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
      ) : (
        <div
          className="flex items-center justify-between gap-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md"
          role="alert"
        >
          <span className="flex-1 text-sm">
            ⚠️ Failed to load data. Please check your connection.
          </span>

          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-md transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582M20 20v-5h-.581m0 0A8.001 8.001 0 004.582 9M4 15a8.001 8.001 0 0015.837 1"
              />
            </svg>
            Retry
          </button>
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
