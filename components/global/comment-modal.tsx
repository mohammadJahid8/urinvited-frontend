'use client';

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

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import api from '@/utils/axiosInstance';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

export function CommentModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.patch('/event/comment', {
        name: e.target.name.value,
        email: e.target.email.value,
        comment: e.target.comment.value,
        eventId: id,
      });

      if (response?.status === 200) {
        toast.success(`Comment added successfully`, {
          position: 'top-center',
        });
        setOpen(false);
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='special'
          className='flex items-center gap-2 text-gray-700 hover:text-black px-0 text-xs'
        >
          <MessageCircle className='size-4' />
          Comment
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Add a Comment</DialogTitle>
        </DialogHeader>
        <fieldset disabled={loading}>
          <form className='space-y-4 py-4' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <Label htmlFor='name'>
                Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                required
                id='name'
                name='name'
                placeholder='Enter your name'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>
                Email <span className='text-red-500'>*</span>
              </Label>
              <Input
                required
                id='email'
                name='email'
                placeholder='Enter your email'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='comment'>
                Comment <span className='text-red-500'>*</span>
              </Label>
              <Textarea
                required
                id='comment'
                name='comment'
                placeholder='Enter your comment'
              />
            </div>

            <DialogFooter>
              <Button
                disabled={loading}
                onClick={() => setOpen(false)}
                variant='outline'
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
}
