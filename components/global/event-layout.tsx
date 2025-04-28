"use client";
import React from "react";
import Event from "./event";
import EventButtons from "./event-buttons";
import { usePathname } from "next/navigation";

const EventLayout = ({ children }: any) => {
  const pathname = usePathname();

  const isSharePage = pathname.includes("share");
  return (
    <div className="">
      {!isSharePage ? (
        <div className="lg:grid grid-cols-[580px_auto]">
          <div className="relative flex flex-col gap-4 h-screen overflow-y-auto pt-16">
            <EventButtons />

            <div className="px-4">{children}</div>
          </div>
          <div className="hidden lg:block h-screen overflow-y-auto bg-gray-100">
            <Event className="" />
          </div>
        </div>
      ) : (
        <div className=" bg-gray-50 pt-32">{children}</div>
      )}
    </div>
  );
};

export default EventLayout;
