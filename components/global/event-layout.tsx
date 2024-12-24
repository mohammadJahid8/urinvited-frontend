'use client';
import React from 'react';
import Preview from './preview';
import EventButtons from './event-buttons';
import { usePathname } from 'next/navigation';

const EventLayout = ({ children }: any) => {
  const pathname = usePathname();

  const isSharePage = pathname.includes('share');
  return (
    <div className=''>
      {!isSharePage ? (
        <div className='grid grid-cols-[580px_auto]'>
          <div className='relative flex flex-col gap-4 h-screen overflow-y-auto pt-28'>
            <EventButtons />

            <div className='px-4'>{children}</div>
          </div>
          <div className='p-4 h-screen overflow-y-auto bg-gray-100 pt-48'>
            <Preview />
          </div>
        </div>
      ) : (
        <div className='pt-32 bg-gray-50'>{children}</div>
      )}
    </div>
  );
};

export default EventLayout;
