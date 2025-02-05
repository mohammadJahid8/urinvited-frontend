import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { User, Baby, Trash2 } from 'lucide-react';
import { useAppContext } from '@/lib/context';

const RsvpGuests = ({ guests, setGuests }: any) => {
  const { hasMaximumCapacity } = useAppContext();
  const handleGuestNameChange = (guestId: string, name: string) => {
    setGuests(
      guests.map((guest: any) =>
        guest.guestId === guestId ? { ...guest, name } : guest
      )
    );
  };

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

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label>Total Guest</Label>
        <Input
          type='number'
          placeholder='Max guest limit is 3 including you'
          value={guests?.length}
          disabled={hasMaximumCapacity}
          // onChange={(e) => handleTotalGuestsChange(e.target.value)}
        />
      </div>
      <div className='space-y-2'>
        <Label>Guest Details</Label>
        <div className='space-y-2'>
          {guests.map((guest: any, index: number) => (
            <div key={guest.guestId} className='flex items-center gap-2'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleGuestTypeChange(guest.guestId, true)}
                  // disabled={guest.id === '1'}
                  className={cn(guest.isAdult && 'bg-primary/10 text-primary')}
                >
                  <User className='w-5 h-5' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleGuestTypeChange(guest.guestId, false)}
                  // disabled={guest.id === '1'}
                  className={cn(!guest.isAdult && 'bg-primary/10 text-primary')}
                >
                  <Baby className='w-5 h-5' />
                </Button>
              </div>
              <Input
                value={guest.name}
                // disabled={guest.guestId === '1'}
                onChange={(e) =>
                  handleGuestNameChange(guest.guestId, e.target.value)
                }
                placeholder='Guest name'
              />

              <Button
                variant='ghost'
                size='icon'
                disabled={guest.guestId === '1'}
                onClick={() => handleRemoveGuest(guest.guestId)}
                className='text-destructive hover:text-destructive hover:bg-destructive/10'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RsvpGuests;
