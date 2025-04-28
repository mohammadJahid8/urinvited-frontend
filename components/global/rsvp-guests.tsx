import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { User, Baby, Trash2, Plus } from "lucide-react";
import { useAppContext } from "@/lib/context";
import { toast } from "sonner";
import { PhoneInput } from "../ui/phone-input";

const RsvpGuests = ({
  guests,
  setGuests,
  contact,
  setContact,
  setGuestName,
  rsvpStatus,
  guestName,
}: any) => {
  const { hasMaximumCapacity, allowAdditionalAttendees, additionalAttendees } =
    useAppContext();

  const [input, setInput] = useState("email");

  const handleGuestNameChange = (guestId: string, name: string) => {
    setGuests(
      guests.map((guest: any) =>
        guest.guestId === guestId ? { ...guest, name } : guest
      )
    );
  };

  console.log({ allowAdditionalAttendees, additionalAttendees });

  // console.log({ allowAdditionalAttendees, hasMaximumCapacity });

  const handleRemoveGuest = (guestId: string) => {
    if (guests.length > 1) {
      // Prevent removing the first guest
      setGuests(guests.filter((guest: any) => guest.guestId !== guestId));
    }
  };

  const handleGuestTypeChange = (guestId: string, isAdult: boolean) => {
    setGuests(
      guests.map((guest: any) =>
        guest.guestId === guestId ? { ...guest, isAdult } : guest
      )
    );
  };

  // console.log({ additionalAttendees });

  return (
    <div className="space-y-4">
      {/* {rsvpStatus !== 'no' && (
        <div className='space-y-2'>
          <Label>
            Enter Total Guest{' '}
            {additionalAttendees &&
              `(Upto ${additionalAttendees} including you)`}
          </Label>
          <Input
            type='number'
            // placeholder='Max guest limit is 3 including you'
            value={guests?.length || null}
            // disabled={hasMaximumCapacity}
            onChange={(e) =>
              setGuests(
                // @ts-ignore
                Array.from({ length: e.target.value }, (_, index) => ({
                  guestId: String(index + 1),
                  name: '',
                  isAdult: true,
                }))
              )
            }
          />
        </div>
      )} */}

      {rsvpStatus && (
        <div className="space-y-2">
          <Label>Contact</Label>

          <div className="flex items-center gap-2">
            {input === "phone" ? (
              <PhoneInput
                value={contact}
                onChange={(value) => {
                  setContact(value);
                }}
                // defaultCountry=""
              />
            ) : (
              <Input
                placeholder="Enter Email address"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            )}
            <Button
              variant="outline"
              size="sm"
              className={`${
                input === "email" ? "bg-primary/10 text-primary" : ""
              }`}
              onClick={() => setInput("email")}
            >
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${
                input === "phone" ? "bg-primary/10 text-primary" : ""
              }`}
              onClick={() => setInput("phone")}
            >
              Phone
            </Button>
          </div>
        </div>
      )}
      {rsvpStatus === "no" && (
        <div className="space-y-2">
          <Label>Your Name</Label>

          <Input
            type="text"
            placeholder="Enter your name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>
      )}

      {rsvpStatus !== "no" && (
        <div className="space-y-2">
          <Label>Guest Details</Label>
          <div className="space-y-2">
            {guests.map((guest: any, index: number) => (
              <div key={guest.guestId} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGuestTypeChange(guest.guestId, true)}
                    // disabled={guest.id === '1'}
                    className={cn(
                      guest.isAdult && "bg-primary/10 text-primary"
                    )}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGuestTypeChange(guest.guestId, false)}
                    // disabled={guest.id === '1'}
                    className={cn(
                      !guest.isAdult && "bg-primary/10 text-primary"
                    )}
                  >
                    <Baby className="w-5 h-5" />
                  </Button>
                </div>
                <Input
                  value={guest.name}
                  // disabled={guest.guestId === '1'}
                  onChange={(e) =>
                    handleGuestNameChange(guest.guestId, e.target.value)
                  }
                  placeholder="Guest name"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => handleRemoveGuest(guest.guestId)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              variant="outline"
              size="sm"
              onClick={() => {
                if (
                  guests.length >= additionalAttendees &&
                  allowAdditionalAttendees
                ) {
                  toast.error("You have reached the maximum number of guests");
                  return;
                }
                setGuests([
                  ...guests,
                  {
                    guestId: (guests?.length + 1).toString(),
                    name: "",
                    isAdult: true,
                  },
                ]);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Guest
            </Button>
            <p className="text-sm text-muted-foreground">
              {additionalAttendees &&
                allowAdditionalAttendees &&
                `Upto ${additionalAttendees} guests including you`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RsvpGuests;
