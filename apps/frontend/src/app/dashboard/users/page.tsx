"use client";
import React from "react";
import UsersTable from "../_components/user-list-table";

const Page = () => {
  return (
    <div>
      <h2 className="text-3xl">Users</h2>
      <UsersTable />
    </div>
  );
};

export default Page;
