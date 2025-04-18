"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Baby, User, Plus } from "lucide-react";
import { useAppContext } from "@/lib/context";
import { toast } from "sonner";

export default function GroupGuestModal({
  open,
  onOpenChange,
  onAddGuests,
  guests,
}: any) {
  const { event, allowAdditionalAttendees, additionalAttendees } =
    useAppContext();

  // const eventData = event?.eventDetails;

  const [guestsState, setGuestsState] = useState<any[]>([]);

  const extraGuestsLength = guests?.length || 0;

  useEffect(() => {
    setGuestsState([...(guests || [])]);
  }, [
    additionalAttendees,
    allowAdditionalAttendees,
    guests,
    extraGuestsLength,
    open,
  ]);

  const handleTotalGuestsChange = (value: string) => {
    const newCount = parseInt(value);
    if (newCount > guestsState?.length) {
      // Add more guest inputs
      const additionalGuests = Array.from(
        { length: newCount - guestsState?.length },
        (_, index) => ({
          guestId: (guestsState?.length + index + 1).toString(),
          name: "",
          isAdult: true,
        })
      );
      setGuestsState([...guestsState, ...additionalGuests]);
    } else {
      // Remove excess guest inputs
      setGuestsState(guestsState?.slice(0, newCount));
    }
  };

  const handleGuestNameChange = (id: string, name: string) => {
    setGuestsState(
      guestsState?.map((guest) =>
        guest.guestId === id ? { ...guest, name } : guest
      )
    );
  };

  const handleDeleteGuest = (id: string) => {
    setGuestsState(guestsState?.filter((guest) => guest.guestId !== id));
  };

  const handleAddGuests = () => {
    onAddGuests(guestsState);
    onOpenChange(false);
  };

  const handleGuestTypeChange = (id: string, isAdult: boolean) => {
    setGuestsState(
      guestsState?.map((guest) =>
        guest.guestId === id ? { ...guest, isAdult } : guest
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle>Add Extra Guests</DialogTitle>
          <DialogDescription>Add extra guests to your event.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <div className='grid grid-cols-4 items-center gap-4'>
            <span className='text-sm'>Total Guests</span>
            <Input
              type='number'
              value={guests?.length}
              onChange={(e) => handleTotalGuestsChange(e.target.value)}
              min='1'
              max='10'
              disabled={hasMaximumCapacity}
              className='col-span-3'
              placeholder='Enter number of guests'
            />
          </div> */}

          <div className="space-y-4">
            <span className="text-sm font-medium">Guest Details</span>
            {guestsState?.map((guest) => (
              <div key={guest.guestId} className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGuestTypeChange(guest.guestId, true)}
                  className={guest.isAdult ? "bg-primary/10 text-primary" : ""}
                >
                  <User className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGuestTypeChange(guest.guestId, false)}
                  className={!guest.isAdult ? "bg-primary/10 text-primary" : ""}
                >
                  <Baby className="w-5 h-5" />
                </Button>
                <Input
                  value={guest.name}
                  onChange={(e) =>
                    handleGuestNameChange(guest.guestId, e.target.value)
                  }
                  placeholder="Enter guest name"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteGuest(guest.guestId)}
                  disabled={guestsState?.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
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
                  guestsState.length >= additionalAttendees - 1 &&
                  allowAdditionalAttendees
                ) {
                  toast.error("You have reached the maximum number of guests");
                  return;
                }

                setGuestsState([
                  ...guestsState,
                  {
                    guestId: (guestsState?.length + 1).toString(),
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
                `Upto ${additionalAttendees - 1} guests`}
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setGuestsState([]);
            }}
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleAddGuests}
            disabled={guestsState?.every((guest) => !guest.name.trim())}
          >
            Add Guests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
