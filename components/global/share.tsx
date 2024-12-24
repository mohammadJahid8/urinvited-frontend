'use client';

import ShareSocial from './share-social';
import AddGuests from './add-guests';
import { Button } from '../ui/button';

export default function Share() {
  return (
    <>
      <div className='flex flex-col gap-6 pt-10 pb-32'>
        <ShareSocial />
        <AddGuests />
      </div>
      <div className='flex gap-2 py-4 px-10 bg-white fixed bottom-0 w-full justify-end'>
        <Button variant='outline'>Cancel</Button>
        <Button>Share Event</Button>
      </div>
    </>
  );
}
