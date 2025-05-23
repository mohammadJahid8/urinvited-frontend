"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import RsvpGuests from "./rsvp-guests";
import { useAppContext } from "@/lib/context";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";

type RSVPStatus = "yes" | "no" | "maybe";

interface RSVPData {
  name: string;
  contact: string;
  rsvpStatus: RSVPStatus;
  message: string;
  guests?: any[];
  event: string;
}

export function EditRSVPModal({ guest, openEditRSVP, setOpenEditRSVP }: any) {
  const { event, refetchEvents, refetchEvent } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [rsvpData, setRSVPData] = useState<RSVPData>({
    name: guest?.name || "",
    contact: guest?.contact || "",
    rsvpStatus: guest?.rsvpStatus || "maybe",
    message: guest?.message || "",
    guests: guest?.guests || [],
    event: event?._id,
  });

  const eventData = event?.eventDetails;
  const additionalAttendees = eventData?.additionalAttendees;
  const allowAdditionalAttendees = eventData?.allowAdditionalAttendees;

  console.log({ allowAdditionalAttendees });

  const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    setGuests([
      ...(guest?.guests?.length < additionalAttendees
        ? [
            ...guest.guests,
            ...Array.from(
              { length: additionalAttendees - guest.guests.length },
              (_, index) => ({
                guestId: String(Date.now() + index + 1),
                name: "",
                isAdult: true,
              })
            ),
          ]
        : guest?.guests || []),
    ]);
  }, [additionalAttendees, allowAdditionalAttendees, guest?.guests]);

  const handleChange = (field: keyof RSVPData, value: string) => {
    setRSVPData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (rsvpData.name && rsvpData.contact) {
      rsvpData.guests = guests;

      try {
        setLoading(true);
        const promise = await api.patch(`/rsvp/${guest._id}`, rsvpData);
        if (promise?.status === 200) {
          toast.success(`Guest added successfully`, {
            position: "top-center",
          });
          refetchEvents();
          refetchEvent();
          setOpenEditRSVP(false);
        }
      } catch (error: any) {
        console.error(error);

        return toast.error(
          error?.response?.data?.message || `Guest addition failed`,
          {
            position: "top-center",
          }
        );
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill all required fields");
    }
  };

  return (
    <Dialog open={openEditRSVP} onOpenChange={setOpenEditRSVP}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>RSVP</DialogTitle>
          <DialogDescription>
            Please provide your RSVP details for the event.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Guest Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={rsvpData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">
              Contact <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact"
              value={rsvpData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvpStatus">
              RSVP Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={rsvpData.rsvpStatus}
              onValueChange={(value) =>
                handleChange("rsvpStatus", value as RSVPStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your RSVP status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="maybe">Maybe</SelectItem>
                <SelectItem value="opened">Opened</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={rsvpData.message}
              onChange={(e) => handleChange("message", e.target.value)}
            />
          </div>
          {/* {allowAdditionalAttendees && ( */}
          <RsvpGuests guests={guests} setGuests={setGuests} />
          {/* )} */}
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            disabled={loading}
            onClick={() => setOpenEditRSVP(false)}
          >
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
