'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import moment from 'moment';
import Link from 'next/link';

export function CommentsDialog({ comments, userEmail }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          View Comments
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader className='flex-row items-center justify-between space-y-0 space-x-2 border-b pb-4'>
          <DialogTitle>
            Comments ({comments.length.toString().padStart(2, '0')})
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 pt-4'>
          {comments.map((comment: any, index: any) => (
            <div key={index} className='flex gap-3 border-b pb-4'>
              <div className='flex-1 space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  From : {userEmail}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {comment.feedbackType}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {comment.feedback}
                </p>
                <p className='text-xs text-muted-foreground'>
                  Received on:{' '}
                  {moment(comment.createdAt).format('DD-MM-YYYY hh:mm a')}
                </p>
                <Link
                  href={comment.attachment}
                  target='_blank'
                  className='text-xs text-blue-500'
                >
                  View Attachment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
