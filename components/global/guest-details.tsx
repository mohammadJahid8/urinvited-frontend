'use client';

import { Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function GuestDetailsDialog({ guest }: { guest: any }) {
  const status = {
    yes: 'Attending',
    no: 'Not Attending',
    maybe: 'Maybe',
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Eye className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Guest Details</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <div className='text-sm font-medium mb-1'>Guest Name:</div>
              <div>{guest.name}</div>
            </div>
            {/* <Button variant='outline' size='sm'>
              Edit
            </Button> */}
          </div>
          <div>
            <div className='text-sm font-medium mb-1'>Contact:</div>
            <div>{guest.contact}</div>
          </div>
          <div>
            <div className='text-sm font-medium mb-1'>RSVP Status:</div>
            <div>{status[guest.rsvpStatus as keyof typeof status]}</div>
          </div>
          <div>
            <div className='text-sm font-medium mb-1'>
              No. of Guest ({guest.guests.length})
            </div>
            <ol className='list-decimal list-inside space-y-1'>
              {guest.guests.map((g: any, i: any) => (
                <li key={i}>
                  {g.name} ({g.isAdult ? 'Adult' : 'Child'})
                </li>
              ))}
            </ol>
          </div>
          <div>
            <div className='text-sm font-medium mb-1'>Message:</div>
            <div className='text-sm text-muted-foreground'>{guest.message}</div>
          </div>
          <div>
            <div className='text-sm font-medium mb-1'>Video Reaction</div>
            <div className='text-sm text-muted-foreground'>
              {guest.videoReaction || '-'}
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button onClick={() => setOpen(false)}>Ok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
