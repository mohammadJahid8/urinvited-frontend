'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/context';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import api from '@/utils/axiosInstance';
import { toast } from 'sonner';

export function EmailPreview() {
  const {
    openEmailPreview,
    setOpenEmailPreview,
    emailData,
    setEmailData,
    user,
  } = useAppContext();
  const [loading, setLoading] = React.useState(false);

  const handleSendTestEmail = async () => {
    if (!emailData.subject) {
      return toast.error(`Please fill subject`, {
        position: 'top-center',
      });
    }
    if (!emailData.body) {
      return toast.error(`Please fill body`, {
        position: 'top-center',
      });
    }

    try {
      setLoading(true);
      const promise = await api.post(`/share/send-mail`, {
        to: user?.email,
        subject: emailData.subject,
        body: emailData.body,
      });
      if (promise?.status === 200) {
        toast.success(`Test email sent`, {
          position: 'top-center',
        });
      }
    } catch (error: any) {
      console.error(error);

      return toast.error(
        error?.response?.data?.message || `Test email failed`,
        {
          position: 'top-center',
        }
      );
    } finally {
      setLoading(false);
    }
  };

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
              onClick={handleSendTestEmail}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </Button>
          </div>
        </SheetHeader>

        <div className='p-4 flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>Subject</Label>
            <Input
              placeholder='Enter Subject'
              value={emailData.subject}
              onChange={(e) =>
                setEmailData({ ...emailData, subject: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label>Body</Label>
            <Textarea
              className='w-full h-32 p-2 border rounded'
              placeholder='Enter Body'
              value={emailData.body}
              onChange={(e) =>
                setEmailData({ ...emailData, body: e.target.value })
              }
            />
          </div>
        </div>

        <Preview data={emailData} />

        <div className='mt-auto border-t p-4 absolute bottom-0 w-full bg-background'>
          <div className='flex items-center justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => setOpenEmailPreview(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={() => setOpenEmailPreview(false)}
            >
              Save Email
            </Button>
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
        <h1 className='text-2xl font-bold'>URINVITED</h1>
      </div>
    </div>
  );
};
