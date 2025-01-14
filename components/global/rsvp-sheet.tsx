'use client';

import { useEffect, useState } from 'react';
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
import { useSearchParams } from 'next/navigation';
import moment from 'moment';
import { toast } from 'sonner';

type RSVPOption = 'yes' | 'no' | 'decide-later';

const daysLeft = (date: any) => {
  const startDate = moment(date);
  const today = moment();
  const diff = startDate.diff(today, 'days');
  return diff >= 0 ? `${diff} days left` : `${Math.abs(diff)} days ago`;
};

export default function RSVPSheet() {
  const searchParams = useSearchParams();
  const name = searchParams.get('n');
  const email = searchParams.get('e');
  const [rsvpStatus, setRsvpStatus] = useState<RSVPOption | null>('yes');
  const { openRSVP, setOpenRSVP, event } = useAppContext();
  const [totalGuests, setTotalGuests] = useState<string>('1');
  const [specialMessage, setSpecialMessage] = useState<string>('');

  const [guests, setGuests] = useState<any[]>([
    {
      id: '1',
      name: name || '',
      isAdult: true,
      email: email || '',
    },
  ]);

  const eventData = event?.eventDetails;
  const additionalAttendees = eventData?.additionalAttendees;
  const allowAdditionalAttendees = eventData?.allowAdditionalAttendees;

  useEffect(() => {
    setGuests([
      {
        id: '1',
        name: name || '',
        isAdult: true,
        email: email || '',
      },
      ...(allowAdditionalAttendees
        ? Array.from({ length: additionalAttendees }, (_, index) => ({
            id: String(Date.now() + index + 1),
            name: '',
            isAdult: true,
          }))
        : []),
    ]);
  }, [additionalAttendees, name, email, allowAdditionalAttendees]);

  const eventName = eventData?.events?.[0]?.title;
  const hostName = event?.hostedBy;
  const message = eventData?.events?.[0]?.inviteDetails;
  const eventDate = moment(eventData?.events?.[0]?.startDate).format(
    'MM/DD/YYYY'
  );
  const eventLocation = eventData?.events?.[0]?.locationName;
  const eventTime = moment(eventData?.events?.[0]?.startTime, 'HH:mm').format(
    'h:mm A'
  );
  const eventDaysLeft = daysLeft(eventData?.events?.[0]?.startDate);

  const additionalFeatures = event?.additionalFeatures;
  const giftRegistry = additionalFeatures?.registry;

  const allowRsvpAfterDueDate = eventData?.allowRsvpAfterDueDate;

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventName
  )}&dates=${eventDate}/${eventDate}&details=${encodeURIComponent(
    message
  )}&location=${encodeURIComponent(eventLocation)}`;

  // const handleTotalGuestsChange = (value: string) => {
  //   const total = parseInt(value);
  //   setTotalGuests(value);

  //   if (total > guests.length) {
  //     // Add new guest slots
  //     const newGuests = [...guests];
  //     for (let i = guests.length; i < total; i++) {
  //       newGuests.push({
  //         id: String(Date.now() + i),
  //         name: '',
  //         isAdult: true,
  //       });
  //     }
  //     setGuests(newGuests);
  //   } else if (total < guests.length) {
  //     // Remove extra guest slots but keep the first one (Kushboo R)
  //     setGuests(guests.slice(0, Math.max(1, total)));
  //   }
  // };

  const handleGuestNameChange = (id: string, name: string) => {
    setGuests(
      guests.map((guest: any) => (guest.id === id ? { ...guest, name } : guest))
    );
  };

  const handleRemoveGuest = (id: string) => {
    if (guests.length > 1) {
      // Prevent removing the first guest
      setGuests(guests.filter((guest: any) => guest.id !== id));
      setTotalGuests(String(parseInt(totalGuests) - 1));
    }
  };

  const handleGuestTypeChange = (id: string, isAdult: boolean) => {
    setGuests(
      guests.map((guest: any) =>
        guest.id === id ? { ...guest, isAdult } : guest
      )
    );
  };

  const handleConfirmRsvp = () => {
    if (!allowRsvpAfterDueDate) {
      return toast.error('RSVP is not allowed after the due date', {
        position: 'top-center',
      });
    }
    const isAnyGuestNameEmpty = guests.some((guest: any) => guest.name === '');
    if (isAnyGuestNameEmpty) {
      return toast.error('Please fill in all guest names', {
        position: 'top-center',
      });
    }

    console.log({ rsvpStatus, guests, specialMessage });
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
                Hi {name}, we are excited to invite you to our special event. We
                hope you can join us for a memorable experience.
              </p>
              <p className='text-xs mt-1'>{email}</p>
            </div>
          </SheetHeader>

          <div className='mt-6 space-y-6 relative'>
            <div>
              <h3 className='font-medium'>{eventName}</h3>
              <h5 className='text-sm'>Hosted by {hostName}</h5>
              <div className='mt-3 space-y-2 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-primary' />
                  <span>
                    {eventDate} | {eventTime}
                  </span>
                  <span className='text-red-500 text-xs'>{eventDaysLeft}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-primary' />
                  <span>{eventLocation}</span>
                </div>
                {/* <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4 text-primary' />
                  <span>You and 44 others</span>
                </div> */}
              </div>
            </div>
            <div className='space-y-2 bg-slate-50 p-3 rounded-md'>
              <h4 className='font-medium'>{hostName}&apos;s Message</h4>
              <div
                className='text-sm text-muted-foreground'
                dangerouslySetInnerHTML={{ __html: message }}
              />
            </div>
            <div className='space-y-4'>
              <h4 className='font-medium'>Are you going?</h4>
              <div className='flex gap-4'>
                {['yes', 'no', 'decide-later'].map((option) => (
                  <Button
                    key={option}
                    variant={'outline'}
                    onClick={() => setRsvpStatus(option as RSVPOption)}
                    className={cn(
                      'rounded-full w-full',
                      rsvpStatus === option &&
                        'bg-primary/10  text-primary-foreground text-primary'
                    )}
                  >
                    {option.charAt(0).toUpperCase() +
                      option.slice(1).replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
            {rsvpStatus === 'yes' && (
              <>
                <Button
                  className='w-full bg-black text-white'
                  href={calendarUrl}
                  target='_blank'
                >
                  <Calendar className='mr-2 h-4 w-4' />
                  Add to Calendar
                </Button>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Total Guest</Label>
                    <Input
                      type='number'
                      placeholder='Max guest limit is 3 including you'
                      value={guests?.length}
                      disabled
                      // onChange={(e) => handleTotalGuestsChange(e.target.value)}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Guest Details</Label>
                    <div className='space-y-2'>
                      {guests.map((guest: any, index: number) => (
                        <div key={guest.id} className='flex items-center gap-2'>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleGuestTypeChange(guest.id, true)
                              }
                              // disabled={guest.id === '1'}
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
                              // disabled={guest.id === '1'}
                              className={cn(
                                !guest.isAdult && 'bg-primary/10 text-primary'
                              )}
                            >
                              <Baby className='w-5 h-5' />
                            </Button>
                          </div>
                          <Input
                            value={guest.name}
                            disabled={guest.id === '1'}
                            onChange={(e) =>
                              handleGuestNameChange(guest.id, e.target.value)
                            }
                            placeholder='Guest name'
                          />

                          <Button
                            variant='ghost'
                            size='icon'
                            disabled={guest.id === '1'}
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
            {/* {rsvpOption === 'decide-later' && (
              <p className='text-sm text-muted-foreground bg-red-50 px-3 py-2 rounded-full text-center'>
                We will send a reminder message after 3 days.
              </p>
            )} */}
            <GiftRegistry giftRegistry={giftRegistry} name={name || ''} />
            <SpecialMessage
              specialMessage={specialMessage}
              setSpecialMessage={setSpecialMessage}
            />
          </div>
        </div>
        <SheetFooter className='flex gap-4 pt-4 sticky bottom-0 w-full bg-white px-6 py-4 border-t border-gray-200'>
          <SheetClose asChild>
            <Button variant='outline' className='flex-1'>
              Cancel
            </Button>
          </SheetClose>
          <Button className='flex-1' onClick={handleConfirmRsvp}>
            Confirm
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const GiftRegistry = ({
  giftRegistry,
  name,
}: {
  giftRegistry: any;
  name: string;
}) => {
  return (
    <div className='space-y-2'>
      <h4 className='font-medium'>Gift Registry</h4>
      <p className='text-sm text-muted-foreground'>
        Hi {name}, feel free to pick a gift from the link below if you&apos;d
        like. Your presence is the best gift!
      </p>
      <div className='flex flex-col gap-2 items-start'>
        {giftRegistry.map((registry: any, index: number) => (
          <Button
            key={index}
            variant='link'
            className='h-auto p-0 text-primary'
            href={registry.url}
            target='_blank'
          >
            View Gift List
          </Button>
        ))}
      </div>
    </div>
  );
};

const SpecialMessage = ({
  specialMessage,
  setSpecialMessage,
}: {
  specialMessage: string;
  setSpecialMessage: (message: string) => void;
}) => {
  return (
    <div className='space-y-2'>
      <div>
        <Label>Write a special message to the host (Optional)</Label>
        <p className='text-xs text-muted-foreground'>
          Message will only be visible to host
        </p>
      </div>
      <Textarea
        placeholder='Enter message here'
        className='resize-none'
        value={specialMessage}
        onChange={(e) => setSpecialMessage(e.target.value)}
      />
      <div className='text-xs text-right text-muted-foreground'>0/500</div>
    </div>
  );
};
