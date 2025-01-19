'use client';

import ShareSocial from './share-social';
import AddGuests from './add-guests';
import { Button } from '../ui/button';
import { useAppContext } from '@/lib/context';
import { toast } from 'sonner';
import { useState } from 'react';
import api from '@/utils/axiosInstance';
import { shareUrl } from '@/lib/shareUrl';
import LoadingOverlay from './loading-overlay';
import { useRouter } from 'next/navigation';

export default function Share({ id }: { id: string }) {
  const { guests, event, user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hostName = event?.hostedBy;

  const handleShareEvent = async () => {
    const addedGuests = guests?.filter((guest: any) => guest?.isConfirmed);

    if (addedGuests.length === 0) {
      return toast.error('Please confirm at least one guest', {
        position: 'top-center',
      });
    }

    const path = user?.role === 'admin' ? `/manage-events` : `/events`;

    try {
      setLoading(true);
      const promise = await api.post(`/share`, {
        eventLink: shareUrl(id),
        hostName,
        guests: addedGuests,
        eventId: id,
      });
      if (promise?.status === 200) {
        toast.success(`Event shared successfully`, {
          position: 'top-center',
        });
        // router.push(path);
      }
    } catch (error: any) {
      console.error(error);

      return toast.error(
        error?.response?.data?.message || `Event sharing failed`,
        {
          position: 'top-center',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className='flex flex-col gap-6 pt-10 pb-32'>
        <ShareSocial id={id} />
        <AddGuests id={id} />
      </div>
      <div className='flex gap-2 py-4 px-10 bg-white fixed bottom-0 w-full justify-end'>
        <Button variant='outline'>Cancel</Button>
        <Button onClick={handleShareEvent}>Share Event</Button>
      </div>
    </>
  );
}
