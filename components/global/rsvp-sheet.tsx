'use client';

import { useState } from 'react';
import {
  Baby,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/lib/context';

type RSVPOption = 'yes' | 'no' | 'decide-later';

export default function RSVPSheet() {
  const [rsvpOption, setRsvpOption] = useState<RSVPOption | null>('yes');
  const { openRSVP, setOpenRSVP } = useAppContext();
  const [totalGuests, setTotalGuests] = useState<string>('1');
  const [guests, setGuests] = useState([
    { id: '1', name: 'Kushboo R', isAdult: true },
  ]);
  const [message, setMessage] = useState('');

  const handleTotalGuestsChange = (value: string) => {
    const total = parseInt(value);
    setTotalGuests(value);

    if (total > guests.length) {
      // Add new guest slots
      const newGuests = [...guests];
      for (let i = guests.length; i < total; i++) {
        newGuests.push({
          id: String(Date.now() + i),
          name: '',
          isAdult: true,
        });
      }
      setGuests(newGuests);
    } else if (total < guests.length) {
      // Remove extra guest slots but keep the first one (Kushboo R)
      setGuests(guests.slice(0, Math.max(1, total)));
    }
  };

  const handleGuestNameChange = (id: string, name: string) => {
    setGuests(
      guests.map((guest) => (guest.id === id ? { ...guest, name } : guest))
    );
  };

  const handleRemoveGuest = (id: string) => {
    if (guests.length > 1) {
      // Prevent removing the first guest
      setGuests(guests.filter((guest) => guest.id !== id));
      setTotalGuests(String(parseInt(totalGuests) - 1));
    }
  };

  const handleGuestTypeChange = (id: string, isAdult: boolean) => {
    setGuests(
      guests.map((guest) => (guest.id === id ? { ...guest, isAdult } : guest))
    );
  };

  return (
    <Sheet open={openRSVP} onOpenChange={setOpenRSVP}>
      <SheetContent className='w-full sm:max-w-[485px] overflow-y-auto p-0'>
        <div className='relative p-6'>
          <SheetHeader className='space-y-4'>
            <div className='flex items-center justify-between'>
              <SheetTitle>RSVP Now</SheetTitle>
            </div>
            <div className='text-sm text-muted-foreground'>
              <p>
                Hi [Invitee&apos;s Name], Lorem ipsum dolor sit amet
                consectetur. Sapien facilisis praesent morbi et et.
              </p>
              <p className='text-xs mt-1'>xyz@gmail.com</p>
            </div>
          </SheetHeader>

          <div className='mt-6 space-y-6 relative'>
            <div>
              <h3 className='font-medium'>Test Event Title</h3>
              <h5 className='text-sm'>Hosted by Kushboo R</h5>
              <div className='mt-3 space-y-2 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-primary' />
                  <span>05/15/2025 | 10:00 AM</span>
                  <span className='text-red-500 text-xs'>
                    3 days for the event
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-primary' />
                  <span>210 Richmond park ln, Bothell, WA, 75071</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-primary' />
                  <span>You and 44 others</span>
                </div>
              </div>
            </div>
            <div className='space-y-2 bg-slate-50 p-3 rounded-md'>
              <h4 className='font-medium'>Kartik&apos;s Message</h4>
              <p className='text-sm text-muted-foreground'>
                Lorem ipsum dolor sit amet consectetur. Sapien facilisis
                praesent morbi et et. Pellentesque felis rhoncus risque sed eu.
                A tortor et sed. Pellentesque imperdiet et sed quis tortor cum
                tincidunt. Cras nunc in risus lacus in feugiat. Lorem ipsum
                dolor
              </p>
            </div>
            <div className='space-y-4'>
              <h4 className='font-medium'>Are you going?</h4>
              <div className='flex gap-4'>
                {['yes', 'no', 'decide-later'].map((option) => (
                  <Button
                    key={option}
                    variant={'outline'}
                    onClick={() => setRsvpOption(option as RSVPOption)}
                    className={cn(
                      'rounded-full w-full',
                      rsvpOption === option &&
                        'bg-primary/10  text-primary-foreground text-primary'
                    )}
                  >
                    {option.charAt(0).toUpperCase() +
                      option.slice(1).replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
            {rsvpOption === 'yes' && (
              <>
                <Button className='w-full bg-black text-white'>
                  <Calendar className='mr-2 h-4 w-4' />
                  Add to Calendar
                </Button>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Total Guest</Label>
                    <Input
                      type='number'
                      placeholder='Max guest limit is 3 including you'
                      value={totalGuests}
                      onChange={(e) => handleTotalGuestsChange(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Guest Details</Label>
                    <div className='space-y-2'>
                      {guests.map((guest, index) => (
                        <div key={guest.id} className='flex items-center gap-2'>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleGuestTypeChange(guest.id, true)
                              }
                              className={cn(
                                guest.isAdult && 'bg-primary/10 text-primary'
                              )}
                            >
                              <User className='w-5 h-5' />
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleGuestTypeChange(guest.id, false)
                              }
                              className={cn(
                                !guest.isAdult && 'bg-primary/10 text-primary'
                              )}
                            >
                              <Baby className='w-5 h-5' />
                            </Button>
                          </div>
                          <Input
                            value={guest.name}
                            onChange={(e) =>
                              handleGuestNameChange(guest.id, e.target.value)
                            }
                            placeholder='Guest name'
                          />

                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleRemoveGuest(guest.id)}
                            className='text-destructive hover:text-destructive hover:bg-destructive/10'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            {rsvpOption === 'decide-later' && (
              <p className='text-sm text-muted-foreground bg-red-50 px-3 py-2 rounded-full text-center'>
                We will send a reminder message after 3 days.
              </p>
            )}
            <GiftRegistry />
            <SpecialMessage />
          </div>
        </div>
        <SheetFooter className='flex gap-4 pt-4 sticky bottom-0 w-full bg-white px-6 py-4 border-t border-gray-200'>
          <SheetClose asChild>
            <Button variant='outline' className='flex-1'>
              Cancel
            </Button>
          </SheetClose>
          <Button className='flex-1'>Confirm</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const GiftRegistry = () => {
  return (
    <div className='space-y-2'>
      <h4 className='font-medium'>Gift Registry</h4>
      <p className='text-sm text-muted-foreground'>
        Hi [Invitee&apos;s Name], feel free to pick a gift from the link below
        if you&apos;d like. Your presence is the best gift!
      </p>
      <Button variant='link' className='h-auto p-0 text-primary'>
        View Gift List
      </Button>
    </div>
  );
};

const SpecialMessage = () => {
  return (
    <div className='space-y-2'>
      <div>
        <Label>Write a special message to the host (Optional)</Label>
        <p className='text-xs text-muted-foreground'>
          Message will only be visible to host
        </p>
      </div>
      <Textarea placeholder='Enter message here' className='resize-none' />
      <div className='text-xs text-right text-muted-foreground'>0/500</div>
    </div>
  );
};
