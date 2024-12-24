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

export default function CreateTicket({ open, onOpenChange }: any) {
  const [ticketCount, setTicketCount] = useState(0);
  const [formData, setFormData] = useState({
    feedbackType: '',
    feedback: '',
    attachment: null,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Ticket ({ticketCount}/3)</DialogTitle>
          <p className='text-sm text-muted-foreground'>
            Submit up to 3 tickets for revisions and feedback
          </p>
        </DialogHeader>
        <form className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label
              htmlFor='feedback-type'
              className="after:content-['*'] after:text-red-500 after:ml-0.5"
            >
              Feedback type
            </Label>
            <Select
              required
              value={formData.feedbackType}
              onValueChange={(value) =>
                setFormData({ ...formData, feedbackType: value })
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
              value={formData.feedback}
              onEditorChange={(content) =>
                setFormData({ ...formData, feedback: content })
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
            <Input type='file' />
          </div>
          <div className='flex justify-end gap-2 mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type='submit'>Submit Ticket</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
