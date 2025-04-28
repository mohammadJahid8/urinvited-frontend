"use client";
import ManageEvents from "@/components/global/manage-events";
import { useAppContext } from "@/lib/context";
import { redirect } from "next/navigation";
import React from "react";

const MyEventsPage = () => {
  const { user } = useAppContext();
  if (!user?.role || user?.role !== "user") {
    return redirect("/");
  }
  return (
    <div>
      <ManageEvents title="My Events" />
    </div>
  );
};

export default MyEventsPage;
