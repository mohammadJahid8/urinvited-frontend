"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Mail,
  Eye,
  Bell,
  ArrowDownToLine,
  Megaphone,
  Search,
  Loader2,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/lib/context";
import daysLeft from "@/utils/daysLeft";
import moment from "moment";
import GuestsTable from "./guests-table";

const TrackRsvp = () => {
  const { event, isEventLoading } = useAppContext();
  // console.log({ event });

  const eventData = event?.eventDetails;
  const videoComments = event?.videoComments;
  const eventTitle = eventData?.events?.[0]?.title;
  const eventDaysLeft =
    eventData?.events?.[0]?.startDate &&
    daysLeft(eventData?.events?.[0]?.startDate);
  const startDate = moment(eventData?.events?.[0]?.startDate).format(
    "DD/MM/YYYY"
  );
  const startTime =
    eventData?.events?.[0]?.startTime &&
    moment(eventData?.events?.[0]?.startTime, "HH:mm").format("h:mm A");

  const eventId = event?._id;
  const rsvps = event?.rsvps;

  return (
    <div className="flex flex-col gap-4">
      <Heading
        title={eventTitle}
        daysLeft={eventDaysLeft}
        startDate={startDate}
        startTime={startTime}
        eventId={eventId}
      />

      {isEventLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <GuestsTable data={rsvps} videoComments={videoComments} />
      )}
    </div>
  );
};

export default TrackRsvp;

function Heading({ title, daysLeft, startDate, startTime, eventId }: any) {
  return (
    <div className="">
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <Link href="/events" className="hover:underline">
          My Events
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Track RSVP</span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-2 px-4 border bg-white rounded-lg">
        <div className="text-sm font-medium mb-2 md:mb-0">{title}</div>

        <div className="flex items-center flex-wrap md:flex-nowrap gap-2 text-sm text-muted-foreground mb-2 md:mb-0">
          <span>{startDate}</span>
          <span>|</span>
          <span>{startTime}</span>
          <span className="text-red-500 ml-1">{daysLeft}</span>
        </div>

        <Button
          variant="outline"
          className="text-primary font-normal hover:no-underline border-primary"
          href={`/event/${eventId}?preview=true`}
        >
          View Event
        </Button>
      </div>
    </div>
  );
}
