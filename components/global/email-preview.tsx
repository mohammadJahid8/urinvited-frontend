'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/context';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Editor } from '@tinymce/tinymce-react';
import Event from './event';

export function EmailPreview() {
  const { openEmailPreview, setOpenEmailPreview } = useAppContext();
  const [data, setData] = React.useState({
    subject: '',
    body: '',
  });

  return (
    <Sheet open={openEmailPreview} onOpenChange={setOpenEmailPreview}>
      <SheetContent className='sm:max-w-[700px] w-full p-0'>
        <SheetHeader className='border-b p-4'>
          <div className='flex gap-2 items-center justify-between'>
            <h1 className='text-base font-bold'>Email Preview</h1>
            <Button
              size='sm'
              variant='outline'
              className={cn(
                'border-primary text-primary w-max bg-primary/10 mr-10'
              )}
            >
              Send Test Email
            </Button>
          </div>
        </SheetHeader>

        <div className='p-4 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>Subject</Label>
            <Input
              placeholder='Enter Subject'
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label>Body</Label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY as string}
              value={data.body}
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
              onEditorChange={(content) => setData({ ...data, body: content })}
            />
          </div>
        </div>

        <Event data={data} />

        <div className='mt-auto border-t p-4 absolute bottom-0 w-full bg-background'>
          <div className='flex items-center justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => setOpenEmailPreview(false)}
            >
              Cancel
            </Button>
            <Button>Send Email</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const Preview = ({ data }: { data: { subject: string; body: string } }) => {
  return (
    <div className='border p-4 flex flex-col gap-4 text-center max-w-[600px] mx-auto rounded-lg'>
      <h1 className='text-base font-bold'>{data.subject}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.body }}></div>

      <div className='bg-gray-50 p-8 '>
        <h1 className='text-2xl font-bold'>LOGO</h1>
      </div>
    </div>
  );
};
