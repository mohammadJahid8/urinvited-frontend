'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import RsvpGuests from './rsvp-guests';
import { useAppContext } from '@/lib/context';
import { toast } from 'sonner';
import api from '@/utils/axiosInstance';

type RSVPStatus = 'yes' | 'no' | 'maybe';

interface RSVPData {
  name: string;
  contact: string;
  rsvpStatus: RSVPStatus;
  message: string;
  guests?: any[];
  event: string;
}

export function AddGuestModal() {
  const { event, refetchEvents, refetchEvent } = useAppContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rsvpData, setRSVPData] = useState<RSVPData>({
    name: '',
    contact: '',
    rsvpStatus: 'maybe',
    message: '',
    guests: [],
    event: event?._id,
  });

  const eventData = event?.eventDetails;
  const additionalAttendees = eventData?.additionalAttendees;
  const allowAdditionalAttendees = eventData?.allowAdditionalAttendees;

  const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    setGuests([
      ...(allowAdditionalAttendees
        ? Array.from({ length: additionalAttendees }, (_, index) => ({
            guestId: String(Date.now() + index + 1),
            name: '',
            isAdult: true,
          }))
        : []),
    ]);
  }, [additionalAttendees, allowAdditionalAttendees]);

  const handleChange = (field: keyof RSVPData, value: string) => {
    setRSVPData((prev) => ({ ...prev, [field]: value }));
  };

  const isRequiredFieldsFilled =
    rsvpData.name && rsvpData.contact && rsvpData.rsvpStatus;

  const handleSubmit = async () => {
    if (isRequiredFieldsFilled) {
      rsvpData.guests = guests;
      rsvpData.event = event?._id;

      try {
        setLoading(true);
        const promise = await api.post(`/rsvp`, rsvpData);
        if (promise?.status === 200) {
          toast.success(`Guest added successfully`, {
            position: 'top-center',
          });
          refetchEvents();
          refetchEvent();
          setOpen(false);
        }
      } catch (error: any) {
        console.error(error);

        return toast.error(
          error?.response?.data?.message || `Guest addition failed`,
          {
            position: 'top-center',
          }
        );
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Please fill all required fields');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Guest</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add Guest</DialogTitle>
          <DialogDescription>
            Please provide your guest details.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>
              Guest Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              value={rsvpData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contact'>
              Contact <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='contact'
              value={rsvpData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='rsvpStatus'>
              RSVP Status <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={rsvpData.rsvpStatus}
              onValueChange={(value) =>
                handleChange('rsvpStatus', value as RSVPStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select your RSVP status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='yes'>Yes</SelectItem>
                <SelectItem value='no'>No</SelectItem>
                <SelectItem value='maybe'>Maybe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              value={rsvpData.message}
              onChange={(e) => handleChange('message', e.target.value)}
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
            variant='outline'
          >
            Cancel
          </Button>
          <Button
            disabled={loading || !isRequiredFieldsFilled}
            onClick={handleSubmit}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
