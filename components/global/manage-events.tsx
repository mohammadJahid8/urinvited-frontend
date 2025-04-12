"use client";
import { Edit, Search, Share2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/lib/context";
import moment from "moment";
import daysLeft from "@/utils/daysLeft";
import { useMemo, useState } from "react";
import statusCounts from "@/utils/statusCount";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import convertTime from "@/utils/convertTime";
import { format } from "date-fns";

export default function ManageEvents({ title }: { title: string }) {
  const { events, isEventsLoading, user, statusCountsData, refetchEvents } =
    useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  const filteredEvents = events?.filter((event: any) => {
    const eventTitle = event?.eventDetails?.events?.[0]?.title?.toLowerCase();
    const eventDate = moment(
      event?.eventDetails?.events?.[0]?.startDate
    ).format("MM/DD/YYYY");
    return (
      eventTitle?.includes(searchTerm.toLowerCase()) ||
      eventDate.includes(searchTerm) ||
      event?.userEmail?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
  });

  const upcomingEvents = filteredEvents?.filter((event: any) => {
    const eventDate = moment(event?.eventDetails?.events?.[0]?.startDate);
    return eventDate.isAfter(moment());
  });

  const pastEvents = filteredEvents?.filter((event: any) => {
    const eventDate = moment(event?.eventDetails?.events?.[0]?.startDate);
    return eventDate.isBefore(moment());
  });

  const tbdEvents = events?.filter((event: any) => {
    return (
      event?.eventDetails?.events?.[0]?.when === "tbd" ||
      event?.eventDetails?.events?.length === 0
    );
  });

  console.log({ events });

  const eventsToDisplay =
    activeTab === "upcoming"
      ? upcomingEvents
      : activeTab === "past"
      ? pastEvents
      : activeTab === "tbd"
      ? tbdEvents
      : filteredEvents;

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-xl font-semibold">
          {title} ({events?.length || 0})
        </h1>
        <Button
          href="/event-details"
          className="bg-primary text-white w-full md:w-auto"
        >
          Create Event
        </Button>
      </div>

      {/* Tabs and Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* <Button
            variant='outline'
            className={`${
              activeTab === 'all' ? 'bg-primary/10 text-primary' : ''
            } border-primary flex-grow md:flex-grow-0`}
            onClick={() => setActiveTab('all')}
          >
            All Events ({events?.length || 0})
          </Button> */}
          <Button
            variant="outline"
            className={`${
              activeTab === "upcoming" ? "bg-primary/10 text-primary" : ""
            } border-primary flex-grow md:flex-grow-0`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events ({upcomingEvents?.length || 0})
          </Button>
          <Button
            variant="outline"
            className={`${
              activeTab === "past" ? "bg-primary/10 text-primary" : ""
            } flex-grow md:flex-grow-0`}
            onClick={() => setActiveTab("past")}
          >
            Past Events ({pastEvents?.length || 0})
          </Button>
          <Button
            variant="outline"
            className={`${
              activeTab === "tbd" ? "bg-primary/10 text-primary" : ""
            } flex-grow md:flex-grow-0`}
            onClick={() => setActiveTab("tbd")}
          >
            TBD Events ({tbdEvents?.length || 0})
          </Button>
        </div>
        <div className="relative w-full md:w-[300px]">
          <Input
            placeholder="Search event by title or email..."
            className="pl-8 pr-4 py-2 w-full border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Event Cards */}
      <div className="space-y-4">
        {eventsToDisplay?.length > 0 ? (
          eventsToDisplay?.map((event: any, index: any) => (
            <EventCard
              key={index}
              id={event._id}
              hasEvent={event?.eventDetails?.events?.length > 0}
              title={event?.eventDetails?.events?.[0]?.title}
              startDate={
                event?.eventDetails?.events?.[0]?.startDate &&
                format(
                  new Date(event?.eventDetails?.events?.[0]?.startDate),
                  "MMMM d, yyyy"
                )
              }
              startTime={
                event?.eventDetails?.events?.[0]?.startTime &&
                convertTime(event?.eventDetails?.events?.[0]?.startTime)
              }
              location={`${event?.eventDetails?.events?.[0]?.locationName}, ${event?.eventDetails?.events?.[0]?.address}`}
              inviteDetails={event?.eventDetails?.events?.[0]?.inviteDetails}
              invited={
                event?.rsvps?.filter((rsvp: any) => rsvp.isFromShare)?.length ||
                0
              }
              rsvps={event?.rsvps}
              daysLeft={daysLeft(event?.eventDetails?.events?.[0]?.startDate)!}
              video={event?.video}
              isAdmin={user?.role === "admin"}
              refetchEvents={refetchEvents}
              userEmail={event?.userEmail}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">No events found.</div>
        )}
      </div>
    </div>
  );
}

interface EventCardProps {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  location: string;
  inviteDetails: string;
  invited: number;
  daysLeft: string;
  hasEvent: boolean;
  video: any;
  isAdmin: boolean;
  rsvps: any;
  refetchEvents: any;
  userEmail: string;
}

function EventCard({
  id,
  title,
  startDate,
  startTime,
  location,
  inviteDetails,
  invited,
  daysLeft,
  hasEvent,
  video,
  isAdmin,
  rsvps,
  refetchEvents,
  userEmail,
}: EventCardProps) {
  // const isVideoPending = video?.status === 'Pending';

  // const path =
  //   !isAdmin && isVideoPending
  //     ? `/video-preview?id=${id}`
  //     : `/event-details?id=${id}`;

  const statusCountsData = useMemo(() => statusCounts(rsvps), [rsvps]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const promise = api.delete(`/event/${id}`);
        toast.promise(promise, {
          loading: "Deleting event...",
          success: () => {
            refetchEvents();
            return "Event deleted successfully";
          },
          error: "Event deletion failed",
          position: "top-center",
        });
      } catch (error: any) {
        console.error(error);

        return toast.error(
          error?.response?.data?.message || `Guest deletion failed`,
          {
            position: "top-center",
          }
        );
      }
    }
  };

  return (
    <div className="">
      <div className="bg-white p-4 rounded-t-lg border border-gray-200">
        {hasEvent ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:gap-4 mb-4">
              <div>
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <p className="text-sm font-medium mb-2 text-gray-500">
                  {userEmail}
                </p>
                <div className="text-sm text-gray-500 mb-1">
                  {startDate} | {startTime}
                </div>

                <div className="text-sm text-gray-500">{location}</div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                <span className="text-sm text-red-500 whitespace-nowrap">
                  {daysLeft}
                </span>
              </div>
            </div>

            <div
              className="text-sm text-gray-600 mb-6"
              dangerouslySetInnerHTML={{ __html: inviteDetails }}
            />
          </>
        ) : (
          <div className="text-sm text-gray-600 mb-6 text-start">
            <p className="text-sm font-medium mb-2 text-gray-500">
              {userEmail}
            </p>
            This event has no event details. Please update the event details
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 rounded-b-lg p-4 border-b border-r border-l border-gray-200">
        <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6 w-full md:w-auto">
          {hasEvent && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Invited</span>
                <span className="text-sm font-medium">{invited}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Attending</span>
                <span className="text-sm font-medium">
                  {statusCountsData.yes}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Not Attending</span>
                <span className="text-sm font-medium">
                  {statusCountsData.no}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">May be</span>
                <span className="text-sm font-medium">
                  {statusCountsData.maybe}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto">
          {hasEvent && (
            <>
              <Button
                href={`/events/track-rsvp/${id}`}
                className="bg-primary text-white flex-grow md:flex-grow-0"
              >
                Track RSVP
              </Button>

              {video && (
                <Button
                  href={`/video-preview?id=${id}`}
                  variant="outline"
                  className="text-gray-700 flex-grow md:flex-grow-0"
                >
                  Video Preview
                </Button>
              )}
              <Button
                href={`/event/${id}?preview=true`}
                variant="outline"
                className="text-gray-700 flex-grow md:flex-grow-0"
              >
                View Event
              </Button>
              <Button
                href={`/share/${id}`}
                variant="outline"
                size="icon"
                className="flex-grow md:flex-grow-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </>
          )}

          <Button
            href={`/event-details?id=${id}`}
            variant="outline"
            size="icon"
            className="flex-grow md:flex-grow-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex-grow md:flex-grow-0"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
