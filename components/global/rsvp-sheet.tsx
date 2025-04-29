"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/context";
import moment from "moment";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";
import daysLeft from "@/utils/daysLeft";
import RsvpGuests from "./rsvp-guests";
import convertTime from "@/utils/convertTime";
import dateFormatter from "@/utils/dateFormatter";

type RSVPOption = "yes" | "no" | "maybe";

export default function RSVPSheet({
  reaction,
  rsvp,
  email,
  name,
  id,
  isAddToCalendar,
  handleCalendarLink,
}: any) {
  // console.log({ email, name });

  const [rsvpStatus, setRsvpStatus] = useState<RSVPOption | null>("yes");
  const {
    openRSVP,
    setOpenRSVP,
    event,
    additionalAttendees,
    allowAdditionalAttendees,
    input,
  } = useAppContext();
  const [specialMessage, setSpecialMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [contact, setContact] = useState<string>(rsvp?.contact || email);
  const [guestName, setGuestName] = useState<string>(rsvp?.name || name);

  // console.log({ rsvp });

  useEffect(() => {
    if (rsvp) {
      setRsvpStatus(rsvp?.rsvpStatus || "yes");
      setSpecialMessage(rsvp?.message || "");
    }
  }, [rsvp]);

  const rsvpGuests = rsvp?.guests;

  const [guests, setGuests] = useState<any[]>([]);

  const eventData = event?.eventDetails;
  const rsvpLength = rsvpGuests?.length || 0;

  useEffect(() => {
    const newGuests = [];

    if (guestName && email) {
      newGuests[0] = {
        guestId: "1",
        name: guestName,
        isAdult: true,
        email: email,
      };
    } else {
      newGuests[0] = {
        guestId: "1",
        name: "",
        isAdult: true,
        email: "",
      };
    }

    setGuests(newGuests);
  }, [
    additionalAttendees,
    email,
    allowAdditionalAttendees,
    rsvpGuests,
    rsvpLength,
    guestName,
  ]);

  const eventName = eventData?.events?.[0]?.title;
  const hostName = event?.hostedBy;
  const message = eventData?.events?.[0]?.inviteDetails;
  const startDate = eventData?.events?.[0]?.startDate;
  const endDate = eventData?.events?.[0]?.endDate;
  const eventLocation = eventData?.events?.[0]?.locationName;
  const startTime = eventData?.events?.[0]?.startTime;
  const endTime = eventData?.events?.[0]?.endTime;
  const eventDaysLeft = daysLeft(
    dateFormatter(eventData?.events?.[0]?.startDate),
    eventData?.events?.[0]?.startTime
  );

  const additionalFeatures = event?.additionalFeatures;
  const giftRegistry = additionalFeatures?.registry;

  const allowRsvpAfterDueDate = eventData?.allowRsvpAfterDueDate;
  const rsvpDueDate = eventData?.rsvpDueDate;

  const isRsvpDueDatePassed = moment(rsvpDueDate).isBefore(moment());

  // console.log({ rsvpDueDate, allowRsvpAfterDueDate, isRsvpDueDatePassed });

  const handleConfirmRsvp = async () => {
    const status = ["yes", "no", "maybe"];

    if (!status.includes(rsvpStatus || "")) {
      return toast.error("Are you going?", {
        position: "top-center",
      });
    }

    if (!allowRsvpAfterDueDate && isRsvpDueDatePassed) {
      return toast.error("RSVP is not allowed after the due date", {
        position: "top-center",
      });
    }
    if (!guests[0]?.name && rsvpStatus !== "no") {
      return toast.error("Please fill in the first guest name", {
        position: "top-center",
      });
    }

    if (!contact) {
      return toast.error("Please fill in a valid contact", {
        position: "top-center",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const phoneRegex = /^\+[1-9]\d{1,14}$/;

    if (input === "email" && !emailRegex.test(contact)) {
      return toast.error("Please fill in a valid contact (email)", {
        position: "top-center",
      });
    }

    if (input === "phone" && !contact.includes("+")) {
      return toast.error("Please fill in a valid contact (phone)", {
        position: "top-center",
      });
    }

    if (!guestName && rsvpStatus === "no") {
      return toast.error("Please fill in your name", {
        position: "top-center",
      });
    }

    // guests.length >= additionalAttendees && allowAdditionalAttendees;

    // if (guests.length >= additionalAttendees && allowAdditionalAttendees) {
    //   return toast.error(
    //     `You can only add ${additionalAttendees} guests including yourself but you have added ${guests.length} guests`,
    //     {
    //       position: "top-center",
    //     }
    //   );
    // }

    const payload = {
      rsvpStatus,
      guests: rsvpStatus === "no" ? [] : guests,
      message: specialMessage,
      contact,
      name: guestName || guests[0]?.name,
      event: id,
      reaction,
    };

    // console.log({ payload });

    try {
      setLoading(true);
      const promise = await api.post(`/rsvp`, payload);
      if (promise?.status === 200) {
        toast.success(`RSVP submitted successfully`, {
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.error(error);

      return toast.error(
        error?.response?.data?.message || `RSVP submission failed`,
        {
          position: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={openRSVP} onOpenChange={setOpenRSVP} modal={false}>
      <SheetContent className="w-full sm:max-w-[485px] overflow-y-auto p-0">
        <div className="relative p-6">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle>RSVP Now</SheetTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              {/* <p>
                Hi {name}, we are excited to invite you to our special event. We
                hope you can join us for a memorable experience.
              </p> */}
              <p className="text-xs mt-1">{email}</p>
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6 relative">
            <div>
              <h3 className="font-medium">{eventName}</h3>
              <h5 className="text-sm">Hosted by {hostName}</h5>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>
                    {startDate ? dateFormatter(startDate) : ""}
                    {startDate && startTime
                      ? ` | ${convertTime(startTime)}`
                      : ""}
                  </span>
                  <span className="text-red-500 text-xs">{eventDaysLeft}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{eventLocation}</span>
                </div>
                {/* <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-primary' />
                  <span>You and 44 others</span>
                </div> */}
              </div>
            </div>
            {message && (
              <div className="space-y-2 bg-slate-50 p-3 rounded-md">
                <h4 className="font-medium">Host&apos;s Message</h4>
                <div
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: message }}
                />
              </div>
            )}
            <div className="space-y-4">
              <h4 className="font-medium">Are you going?</h4>
              <div className="flex gap-4">
                {["yes", "no", "maybe"].map((option) => (
                  <Button
                    key={option}
                    variant={"outline"}
                    onClick={() => setRsvpStatus(option as RSVPOption)}
                    className={cn(
                      "rounded-full w-full",
                      rsvpStatus === option &&
                        "bg-primary/10  text-primary-foreground text-primary"
                    )}
                  >
                    {option.charAt(0).toUpperCase() +
                      option.slice(1).replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>

            {rsvpStatus !== "no" && isAddToCalendar && (
              <Button
                className="w-full bg-black text-white"
                href={handleCalendarLink(
                  eventName,
                  startDate,
                  startTime,
                  endDate,
                  endTime,
                  message,
                  eventLocation
                )}
                target="_blank"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
            )}

            <RsvpGuests
              guests={guests}
              setGuests={setGuests}
              contact={contact}
              setContact={setContact}
              rsvpStatus={rsvpStatus}
              setGuestName={setGuestName}
              guestName={guestName}
            />

            {/* {rsvpOption === 'maybe' && (
              <p className='text-sm text-muted-foreground bg-red-50 px-3 py-2 rounded-full text-center'>
                We will send a reminder message after 3 days.
              </p>
            )} */}
            {rsvpStatus !== "no" && giftRegistry?.[0]?.url && (
              <GiftRegistry giftRegistry={giftRegistry} name={name || ""} />
            )}
            <SpecialMessage
              specialMessage={specialMessage}
              setSpecialMessage={setSpecialMessage}
            />
          </div>
        </div>
        <SheetFooter className="flex gap-4 pt-4 sticky bottom-0 w-full bg-white px-6 py-4 border-t border-gray-200">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1" disabled={loading}>
              Cancel
            </Button>
          </SheetClose>
          <Button
            className="flex-1"
            onClick={handleConfirmRsvp}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Confirm"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const GiftRegistry = ({
  giftRegistry,
  name,
}: {
  giftRegistry: any;
  name: string;
}) => {
  return (
    <div className="space-y-2">
      {/* <h4 className='font-medium'>Gift Registry</h4> */}
      {/* <p className='text-sm text-muted-foreground'>
        Hi {name}, feel free to pick a gift from the link below if you&apos;d
        like. Your presence is the best gift!
      </p> */}
      <div className="flex flex-col gap-2 items-start">
        {giftRegistry.map((registry: any, index: number) => (
          <Button
            key={index}
            variant="link"
            className="h-auto p-0 text-primary inline-flex items-center gap-2"
            href={registry.url}
            target="_blank"
          >
            <img src="/gift.svg" alt="Gift" className="mx-auto h-6" />
            View Gift List
          </Button>
        ))}
      </div>
    </div>
  );
};

const SpecialMessage = ({
  specialMessage,
  setSpecialMessage,
}: {
  specialMessage: string;
  setSpecialMessage: (message: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <div>
        <Label>Write a special message to the host (Optional)</Label>
        <p className="text-xs text-muted-foreground">
          Message will only be visible to host
        </p>
      </div>
      <Textarea
        placeholder="Enter message here"
        className="resize-none"
        value={specialMessage}
        onChange={(e) => setSpecialMessage(e.target.value)}
      />
      {/* <div className='text-xs text-right text-muted-foreground'>0/500</div> */}
    </div>
  );
};
