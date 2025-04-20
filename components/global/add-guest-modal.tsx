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
import { PhoneInput } from "../ui/phone-input";

type RSVPStatus = "yes" | "no" | "maybe";

interface RSVPData {
  name: string;
  contact: string;
  rsvpStatus: RSVPStatus;
  message: string;
  guests?: any[];
  event: string;
}

export function AddGuestModal() {
  const {
    event,
    refetchEvents,
    refetchEvent,
    additionalAttendees,
    allowAdditionalAttendees,
  } = useAppContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rsvpData, setRSVPData] = useState<RSVPData>({
    name: "",
    contact: "",
    rsvpStatus: "maybe",
    message: "",
    guests: [],
    event: event?._id,
  });

  const [inputType, setInputType] = useState<"email" | "phone">("email");

  // const eventData = event?.eventDetails;

  const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    if (rsvpData.rsvpStatus === "yes" || rsvpData.rsvpStatus === "maybe") {
      setGuests([
        ...[
          {
            guestId: "1",
            name: rsvpData.name,
            isAdult: true,
          },
        ],
      ]);
    }
  }, [rsvpData]);

  const handleChange = (field: keyof RSVPData, value: string) => {
    setRSVPData((prev) => ({ ...prev, [field]: value }));
  };

  const isRequiredFieldsFilled =
    rsvpData.name && rsvpData.contact && rsvpData.rsvpStatus;

  const handleSubmit = async () => {
    if (isRequiredFieldsFilled) {
      rsvpData.guests = guests;
      rsvpData.event = event?._id;

      // console.log({ rsvpData });
      // check if the contact is a valid email
      if (
        inputType === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rsvpData.contact)
      ) {
        return toast.error("Please enter a valid email address", {
          position: "top-center",
        });
      }
      if (inputType === "phone" && !rsvpData.contact.includes("+")) {
        return toast.error("Please enter a valid phone number", {
          position: "top-center",
        });
      }
      try {
        setLoading(true);
        const promise = await api.post(`/rsvp`, rsvpData);
        if (promise?.status === 200) {
          toast.success(`Guest added successfully`, {
            position: "top-center",
          });
          refetchEvents();
          refetchEvent();
          setOpen(false);
          setRSVPData({
            name: "",
            contact: "",
            rsvpStatus: "maybe",
            message: "",
            guests: [],
            event: event?._id,
          });
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
      toast.error("Please fill all required fields", {
        position: "top-center",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button>Add Guest</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Guest</DialogTitle>
          <DialogDescription>
            Please provide your guest details.
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
            <div className="flex items-center gap-2">
              {inputType === "phone" ? (
                <PhoneInput
                  value={rsvpData.contact}
                  onChange={(value) => {
                    handleChange("contact", value);
                  }}
                  className="w-full"
                />
              ) : (
                <Input
                  placeholder="Enter Email address"
                  value={rsvpData.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                />
              )}
              <Button
                variant="outline"
                size="sm"
                className={`${
                  inputType === "email" ? "bg-primary/10 text-primary" : ""
                }`}
                onClick={() => setInputType("email")}
              >
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`${
                  inputType === "phone" ? "bg-primary/10 text-primary" : ""
                }`}
                onClick={() => setInputType("phone")}
              >
                Phone
              </Button>
            </div>
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
          {allowAdditionalAttendees && (
            <RsvpGuests guests={guests} setGuests={setGuests} />
          )}
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={loading || !isRequiredFieldsFilled}
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
