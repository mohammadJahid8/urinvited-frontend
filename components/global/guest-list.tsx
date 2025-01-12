'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import GroupGuestModal from './group-guest-modal';

export default function GuestList({ emails }: { emails: string[] }) {
  const [guests, setGuests] = useState<any[]>([]);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [guestIndex, setGuestIndex] = useState<number>(0);

  const handleOpenGroupModal = (index: number) => {
    setOpenGroupModal(true);
    setGuestIndex(index);
  };

  useEffect(() => {
    setGuests((prevGuests) => {
      const newGuests = emails
        .filter((email) => !prevGuests.some((guest) => guest.email === email))
        .map((email, index) => ({
          id: prevGuests.length + index,
          name: '',
          phone: '',
          email,
          isAdded: false,
        }));
      return [...prevGuests, ...newGuests];
    });
  }, [emails]);

  const handleAddGuest = (guest: any) => {
    setGuests(
      guests.map((g) => ({
        ...g,
        isAdded: g.id === guest.id ? true : g.isAdded,
      }))
    );
  };

  const handleRemoveGuest = (id: number) => {
    setGuests(
      guests.map((g) => ({
        ...g,
        isAdded: g.id === id ? false : g.isAdded,
      }))
    );
  };

  console.log({ guests });

  const handleAddGroupGuests = (data: any) => {
    setGuests((prev) => {
      const newGuests = [...prev];
      newGuests[guestIndex].extraGuests = data;
      return newGuests;
    });
  };

  const handleAddRow = () => {
    setGuests((prev) => [
      ...prev,
      { id: prev.length + 1, name: '', phone: '', email: '', isAdded: false },
    ]);
  };

  return (
    <div className='w-full'>
      <p className='text-sm text-primary pb-2 text-end cursor-pointer hoverl:underline'>
        Upload CSV
      </p>
      <Table className=''>
        <TableHeader className='bg-gray-100 rounded-lg'>
          <TableRow className='rounded-lg'>
            <TableHead className='rounded-tl-lg border-r text-black'>
              Guest Name
            </TableHead>
            <TableHead className='border-r text-black'>
              Phone/ Email Address
            </TableHead>
            <TableHead className='w-[100px] rounded-tr-lg text-black'>
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='rounded-b-lg border'>
          {guests.map((guest, index) => (
            <TableRow key={guest.id}>
              <TableCell className='border-r'>
                <Input
                  placeholder='Enter name'
                  value={guest.name}
                  onChange={(e) =>
                    setGuests(
                      guests.map((guest, i) => ({
                        ...guest,
                        name: i === index ? e.target.value : guest.name,
                      }))
                    )
                  }
                />
              </TableCell>
              <TableCell className='border-r'>
                <Input
                  placeholder='Enter Phone or Email address'
                  value={guest.phone || guest.email}
                  onChange={(e) =>
                    setGuests(
                      guests.map((guest, i) => ({
                        ...guest,
                        [guest.phone ? 'phone' : 'email']:
                          i === index
                            ? e.target.value
                            : guest[guest.phone ? 'phone' : 'email'],
                      }))
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleOpenGroupModal(guest.id)}
                  >
                    <Users className='w-5 h-5 text-blue-500' />
                  </Button>
                  {!guest.isAdded && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleAddGuest(guest)}
                    >
                      Add
                    </Button>
                  )}
                  {guest.isAdded && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleRemoveGuest(guest.id)}
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
        variant='outline'
        className='mt-4 border-dashed w-full'
        onClick={handleAddRow}
      >
        + Add Guests
      </Button>

      {guests.some((guest) => guest.isAdded) && (
        <div className='mt-8'>
          <h2 className='text-lg font-semibold mb-4'>Added Guests</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Phone/ Email Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests
                .filter((guest) => guest.isAdded)
                .map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>{guest.name}</TableCell>
                    <TableCell>{guest.phone || guest.email}</TableCell>
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
        extraGuests={guests?.[guestIndex]?.extraGuests}
      />
    </div>
  );
}
