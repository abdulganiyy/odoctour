"use client";
import React from "react";
import BookingsTable from "../_components/bookings-table";

const Page = () => {
  return (
    <div>
      <h2 className="text-3xl">Bookings</h2>
      <BookingsTable />
    </div>
  );
};

export default Page;
