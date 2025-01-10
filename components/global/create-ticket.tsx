'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'sonner';
import api from '@/utils/axiosInstance';
import { useAppContext } from '@/lib/context';

export default function CreateTicket({ open, onOpenChange }: any) {
  const { event, refetchEvent } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<any>({
    videoId: '',
    feedbackType: '',
    feedback: '',
    attachment: null,
  });

  const feedbacks = event?.video?.feedbacks;
  const totalTickets = feedbacks?.length;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (totalTickets >= 3) {
      return toast.error('You have reached the maximum number of tickets', {
        position: 'top-center',
      });
    }
    if (inputs.feedbackType === '') {
      return toast.error('Please select a feedback type', {
        position: 'top-center',
      });
    }

    if (inputs.feedback === '') {
      return toast.error('Please enter your feedback', {
        position: 'top-center',
      });
    }

    const formData = new FormData();
    formData.append('videoId', event?.video?._id);
    formData.append('feedbackType', inputs.feedbackType);
    formData.append('feedback', inputs.feedback);
    if (inputs.attachment) {
      formData.append('attachment', inputs.attachment);
    }

    try {
      setIsLoading(true);
      const promise = await api.patch(`/video/feedback`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log({ promise });
      if (promise?.status === 200) {
        toast.success(`Ticket created`, {
          position: 'top-center',
        });
        refetchEvent();
        setIsLoading(false);
        onOpenChange(false);
        setInputs({
          videoId: '',
          feedbackType: '',
          feedback: '',
          attachment: null,
        });
      }
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      return toast.error(
        error?.response?.data?.message || `Ticket creation failed`,
        {
          position: 'top-center',
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Ticket ({totalTickets}/3)</DialogTitle>
          <p className='text-sm text-muted-foreground'>
            Submit up to 3 tickets for revisions and feedback
          </p>
        </DialogHeader>
        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
          <div className='grid gap-2'>
            <Label
              htmlFor='feedback-type'
              className="after:content-['*'] after:text-red-500 after:ml-0.5"
            >
              Feedback type
            </Label>
            <Select
              required
              value={inputs.feedbackType}
              onValueChange={(value) =>
                setInputs({ ...inputs, feedbackType: value })
              }
            >
              <SelectTrigger id='feedback-type'>
                <SelectValue placeholder='Select subject here' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='bug'>Bug Report</SelectItem>
                <SelectItem value='feature'>Feature Request</SelectItem>
                <SelectItem value='improvement'>Improvement</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label
              htmlFor='feedback'
              className="after:content-['*'] after:text-red-500 after:ml-0.5"
            >
              Feedback
            </Label>

            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY as string}
              value={inputs.feedback}
              onEditorChange={(content) =>
                setInputs({ ...inputs, feedback: content })
              }
              init={{
                height: 150,
                menubar: false,
                branding: false,
                statusbar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                  'fontsize textcolor',
                ],
                toolbar:
                  'undo redo | formatselect fontselect fontfamily fontsize | bold italic backcolor forecolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help',
              }}
            />
          </div>
          <div className='grid gap-2'>
            <Label>Attachment</Label>
            <Input
              type='file'
              onChange={(e) =>
                setInputs({ ...inputs, attachment: e.target.files?.[0] })
              }
            />
          </div>
          <div className='flex justify-end gap-2 mt-4'>
            <Button
              type='button'
              disabled={isLoading}
              variant='outline'
              onClick={() => {
                onOpenChange(false);
                setInputs({
                  videoId: '',
                  feedbackType: '',
                  feedback: '',
                  attachment: null,
                });
              }}
            >
              Close
            </Button>
            <Button type='submit' disabled={isLoading}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
