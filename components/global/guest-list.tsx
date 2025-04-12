"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";
import GroupGuestModal from "./group-guest-modal";
import { useAppContext } from "@/lib/context";
import { toast } from "sonner";

export default function GuestList({ emails }: { emails: string[] }) {
  const {
    guests,
    setGuests,
    allowAdditionalAttendees,
    totalGuestAdded,
    maximumCapacity,
    hasMaximumCapacity,
    id,
  } = useAppContext();
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [guestIndex, setGuestIndex] = useState<number>(0);

  console.log({ id });

  const handleOpenGroupModal = (index: number) => {
    if (totalGuestAdded >= maximumCapacity && hasMaximumCapacity) {
      return toast.error(
        `You have reached the maximum capacity of ${maximumCapacity} guests`
      );
    }

    setOpenGroupModal(true);
    setGuestIndex(index);
  };

  useEffect(() => {
    setGuests((prevGuests: any) => {
      // Get the highest existing guestId
      const maxGuestId = prevGuests.reduce(
        (maxId: number, guest: any) => Math.max(maxId, guest.guestId),
        0
      );

      // Separate guests with phone numbers (no email)
      const phoneGuests = prevGuests.filter(
        (guest: any) => !guest.contact.includes("@")
      );

      // Create new guests from emails that are not already in the guest list
      const newGuests = emails
        .filter(
          (email) => !prevGuests.some((guest: any) => guest.contact === email)
        )
        .map((email, index) => ({
          guestId: maxGuestId + index + 1, // Ensure unique guestId
          name: "",
          contact: email,
          isConfirmed: false,
          fromEmail: true,
          event: id,
        }));

      // Filter guests whose emails match the current list of emails
      const emailMatchedGuests = prevGuests.filter((guest: any) =>
        emails.includes(guest.contact)
      );

      // Combine all guest categories into the final list
      return [...emailMatchedGuests, ...newGuests, ...phoneGuests].sort(
        (a: any, b: any) => a.guestId - b.guestId
      );
    });
  }, [emails]);
  const handleConfirm = (guest: any) => {
    if (totalGuestAdded >= maximumCapacity && hasMaximumCapacity) {
      return toast.error(
        `You have reached the maximum capacity of ${maximumCapacity} guests`
      );
    }
    if (!guest.contact) {
      return toast.error("Please enter a valid email");
    }

    // if (guest.phone && !guest.phone.includes("+")) {
    //   return toast.error(
    //     "Please enter a valid phone number with a country code. e.g +2348060000000"
    //   );
    // }

    // validate the email
    if (guest.contact && !guest.contact.includes("@")) {
      return toast.error("Please enter a valid email address");
    }

    if (!guest.name) {
      return toast.error("Please enter a valid name");
    }

    setGuests(
      guests.map((g: any) => ({
        ...g,
        isConfirmed: g.guestId === guest.guestId ? true : g.isConfirmed,
      }))
    );
  };

  const handleRemoveGuest = (id: number) => {
    setGuests(
      guests.map((g: any) => ({
        ...g,
        isConfirmed: g.guestId === id ? false : g.isConfirmed,
      }))
    );
  };

  const handleDeleteGuest = (id: number) => {
    setGuests(guests.filter((g: any) => g.guestId !== id));
  };

  const handleAddGroupGuests = (data: any) => {
    setGuests((prev: any) => {
      const newGuests = [...prev];
      newGuests[guestIndex].guests = data;
      return newGuests;
    });
  };

  const handleAddRow = () => {
    if (totalGuestAdded >= maximumCapacity && hasMaximumCapacity) {
      return toast.error(
        `You have reached the maximum capacity of ${maximumCapacity} guests`
      );
    }
    setGuests((prev: any) => [
      ...prev,
      {
        guestId: prev.length + 1,
        name: "",
        contact: "",
        isConfirmed: false,
        event: id,
      },
    ]);
  };

  return (
    <div className="w-full">
      {/* <p className='text-sm text-primary pb-2 text-end cursor-pointer hoverl:underline'>
        Upload CSV
      </p> */}
      <Table className="">
        <TableHeader className="bg-gray-100 rounded-lg">
          <TableRow className="rounded-lg">
            <TableHead className="rounded-tl-lg border-r text-black">
              Guest Name
            </TableHead>
            <TableHead className="border-r text-black">Email Address</TableHead>
            <TableHead className="w-[100px] rounded-tr-lg text-black">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rounded-b-lg border">
          {guests.map((guest: any, index: number) => (
            <TableRow key={guest.guestId}>
              <TableCell className="border-r">
                <Input
                  placeholder="Enter name"
                  value={guest.name}
                  onChange={(e) =>
                    setGuests(
                      guests.map((guest: any, i: number) => ({
                        ...guest,
                        name: i === index ? e.target.value : guest.name,
                      }))
                    )
                  }
                />
              </TableCell>
              <TableCell className="border-r">
                <Input
                  placeholder="Enter Phone or Email address"
                  value={guest.contact}
                  disabled={guest.fromEmail}
                  onChange={(e) => {
                    const value = e.target.value;
                    setGuests(
                      guests.map((guest: any, i: number) => ({
                        ...guest,
                        // phone: "",
                        contact: i === index ? value : guest.contact,
                      }))
                    );

                    // if (value.includes('@')) {
                    //   setGuests(
                    //     guests.map((guest: any, i: number) => ({
                    //       ...guest,
                    //       email: i === index ? value : guest.email,
                    //       phone: i === index ? '' : guest.phone,
                    //     }))
                    //   );
                    // } else if (value.includes('+') || /^\d{3}/.test(value)) {
                    //   setGuests(
                    //     guests.map((guest: any, i: number) => ({
                    //       ...guest,
                    //       email: i === index ? '' : guest.email,
                    //       phone: i === index ? value : guest.phone,
                    //     }))
                    //   );
                    // } else {
                    //   setGuests(
                    //     guests.map((guest: any, i: number) => ({
                    //       ...guest,
                    //       phone: '',
                    //       email: i === index ? value : guest.email,
                    //     }))
                    //   );
                    // }
                  }}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteGuest(guest.guestId)}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                  {allowAdditionalAttendees && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenGroupModal(index)}
                      disabled={!guest.isConfirmed}
                    >
                      <Users className="w-5 h-5 text-primary" />
                    </Button>
                  )}
                  {!guest.isConfirmed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfirm(guest)}
                    >
                      Confirm
                    </Button>
                  )}
                  {guest.isConfirmed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveGuest(guest.guestId)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        variant="outline"
        className="mt-4 border-dashed w-full"
        onClick={handleAddRow}
      >
        + Add Guests
      </Button>

      {guests.some((guest: any) => guest.isConfirmed) && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Added Guests</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Phone/ Email Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests
                .filter((guest: any) => guest.isConfirmed)
                .map((guest: any) => (
                  <TableRow key={guest.guestId}>
                    <TableCell>{guest.name}</TableCell>
                    <TableCell>{guest.contact}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      <GroupGuestModal
        open={openGroupModal}
        onOpenChange={setOpenGroupModal}
        onAddGuests={handleAddGroupGuests}
        // @ts-ignore
        guests={guests?.[guestIndex]?.guests}
      />
    </div>
  );
}
