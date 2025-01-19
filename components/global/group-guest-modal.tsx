'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Baby, User } from 'lucide-react';
import { useAppContext } from '@/lib/context';

export default function GroupGuestModal({
  open,
  onOpenChange,
  onAddGuests,
  extraGuests,
}: any) {
  const { event } = useAppContext();

  const eventData = event?.eventDetails;
  const additionalAttendees = eventData?.additionalAttendees;
  const allowAdditionalAttendees = eventData?.allowAdditionalAttendees;

  const [guests, setGuests] = useState<any[]>([]);

  const extraGuestsLength = extraGuests?.length || 0;

  useEffect(() => {
    setGuests([
      ...(extraGuestsLength < additionalAttendees
        ? [
            ...(extraGuests || []),
            ...Array.from(
              { length: additionalAttendees - extraGuestsLength },
              (_, index) => ({
                guestId: String(Date.now() + index + 1),
                name: '',
                isAdult: true,
              })
            ),
          ]
        : extraGuests || []),
    ]);
  }, [
    additionalAttendees,
    allowAdditionalAttendees,
    extraGuests,
    extraGuestsLength,
    open,
  ]);

  // useEffect(() => {
  //   if (extraGuests && extraGuests.length > 0) {
  //     setGuests(extraGuests);
  //   } else {
  //     setGuests([
  //       { id: '1', name: '', isAdult: true },
  //       { id: '2', name: '', isAdult: false },
  //     ]);
  //   }
  // }, [extraGuests]);

  const handleTotalGuestsChange = (value: string) => {
    const newCount = parseInt(value);
    if (newCount > guests?.length) {
      // Add more guest inputs
      const additionalGuests = Array.from(
        { length: newCount - guests?.length },
        (_, index) => ({
          guestId: (guests?.length + index + 1).toString(),
          name: '',
          isAdult: true,
        })
      );
      setGuests([...guests, ...additionalGuests]);
    } else {
      // Remove excess guest inputs
      setGuests(guests?.slice(0, newCount));
    }
  };

  const handleGuestNameChange = (id: string, name: string) => {
    setGuests(
      guests?.map((guest) =>
        guest.guestId === id ? { ...guest, name } : guest
      )
    );
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(guests?.filter((guest) => guest.guestId !== id));
  };

  const handleAddGuests = () => {
    onAddGuests(guests);
    onOpenChange(false);
  };

  const handleGuestTypeChange = (id: string, isAdult: boolean) => {
    setGuests(
      guests?.map((guest) =>
        guest.guestId === id ? { ...guest, isAdult } : guest
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[560px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='text-left'>
          <DialogTitle>Add Guests</DialogTitle>
          <DialogDescription>Add guests to your event.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='text-sm'>Total Guests</span>
            <Input
              type='number'
              value={guests?.length}
              onChange={(e) => handleTotalGuestsChange(e.target.value)}
              min='1'
              max='10'
              disabled={true}
              className='col-span-3'
              placeholder='Enter number of guests'
            />
          </div>

          <div className='space-y-4'>
            <span className='text-sm font-medium'>Guest Details</span>
            {guests?.map((guest) => (
              <div key={guest.guestId} className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleGuestTypeChange(guest.guestId, true)}
                  className={guest.isAdult ? 'bg-primary/10 text-primary' : ''}
                >
                  <User className='w-5 h-5' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleGuestTypeChange(guest.guestId, false)}
                  className={!guest.isAdult ? 'bg-primary/10 text-primary' : ''}
                >
                  <Baby className='w-5 h-5' />
                </Button>
                <Input
                  value={guest.name}
                  onChange={(e) =>
                    handleGuestNameChange(guest.guestId, e.target.value)
                  }
                  placeholder='Enter guest name'
                  className='flex-1'
                />
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleDeleteGuest(guest.guestId)}
                  disabled={guests?.length === 1}
                >
                  <Trash2 className='h-4 w-4 text-red-500' />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className='sm:justify-between gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              onOpenChange(false);
              setGuests([]);
            }}
          >
            Clear
          </Button>
          <Button
            type='button'
            onClick={handleAddGuests}
            disabled={guests?.every((guest) => !guest.name.trim())}
          >
            Add Guests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
