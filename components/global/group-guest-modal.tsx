'use client';

import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserCircle, Circle, Trash2, Baby, User } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
}

interface GuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGuests: (guests: Guest[]) => void;
}

export default function GroupGuestModal({
  open,
  onOpenChange,
  onAddGuests,
}: GuestDialogProps) {
  const [totalGuests, setTotalGuests] = useState('2');
  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: '' },
    { id: '2', name: '' },
  ]);

  const handleTotalGuestsChange = (value: string) => {
    setTotalGuests(value);
    const newCount = parseInt(value);
    if (newCount > guests.length) {
      // Add more guest inputs
      const additionalGuests = Array.from(
        { length: newCount - guests.length },
        (_, index) => ({
          id: (guests.length + index + 1).toString(),
          name: '',
        })
      );
      setGuests([...guests, ...additionalGuests]);
    } else {
      // Remove excess guest inputs
      setGuests(guests.slice(0, newCount));
    }
  };

  const handleGuestNameChange = (id: string, name: string) => {
    setGuests(
      guests.map((guest) => (guest.id === id ? { ...guest, name } : guest))
    );
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(guests.filter((guest) => guest.id !== id));
    setTotalGuests(guests.length - 1 + '');
  };

  const handleAddGuests = () => {
    onAddGuests(guests);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[560px]'>
        <DialogHeader className='text-left'>
          <DialogTitle>Add Guests</DialogTitle>
          <DialogDescription>Add guests to your event.</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <span className='text-sm'>Total Guests</span>
            <Select value={totalGuests} onValueChange={handleTotalGuestsChange}>
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Select number of guests' />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-4'>
            <span className='text-sm font-medium'>Guest Details</span>
            {guests.map((guest) => (
              <div key={guest.id} className='flex items-center gap-2'>
                <Button variant='outline' size='sm'>
                  <User className='w-5 h-5' />
                </Button>
                <Button variant='outline' size='sm'>
                  <Baby className='w-5 h-5' />
                </Button>
                <Input
                  value={guest.name}
                  onChange={(e) =>
                    handleGuestNameChange(guest.id, e.target.value)
                  }
                  placeholder='Enter guest name'
                  className='flex-1'
                />
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleDeleteGuest(guest.id)}
                  disabled={guests.length === 1}
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
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type='button'
            onClick={handleAddGuests}
            disabled={guests.some((guest) => !guest.name.trim())}
          >
            Add Guests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
