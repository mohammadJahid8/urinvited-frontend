'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import moment from 'moment';

export default function ViewCommentsModal({
  videoComments,
}: {
  videoComments: any;
}) {
  const [open, setOpen] = useState(false);

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className='flex justify-center'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='gap-2'>
            <MessageSquare className='h-4 w-4' />
            View Comments ({videoComments?.length})
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[500px] md:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle className='text-xl'>Video Comments</DialogTitle>
            <DialogDescription>
              View comments from your guests.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className='h-[60vh] mt-4 pr-4'>
            <div className='space-y-6'>
              {videoComments?.map((comment: any) => (
                <div
                  key={comment.id}
                  className='flex gap-4 p-4 rounded-lg border bg-card'
                >
                  <Avatar className='h-10 w-10'>
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40`}
                      alt={comment.name}
                    />
                    <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
                  </Avatar>
                  <div className='space-y-2 flex-1'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-1'>
                      <h3 className='font-medium'>{comment.name}</h3>
                      <span className='text-xs text-muted-foreground'>
                        {moment(comment.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {comment.email}
                    </p>
                    <p className='text-sm'>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
