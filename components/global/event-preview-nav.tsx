'use client';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useAppContext } from '@/lib/context';
import { useParams, useSearchParams } from 'next/navigation';

export default function EventPreviewNav() {
  const { user } = useAppContext();
  const { id: urlId } = useParams();
  const searchParams = useSearchParams();
  const paramsId = searchParams.get('id');
  const id = urlId || paramsId;
  const queryString = searchParams.toString();
  const querySuffix = queryString ? `?${queryString}` : '';
  const isAdmin = user?.role === 'admin';
  return (
    <header className='flex h-14 items-center justify-between border-b px-4 shadow-md bg-white'>
      <Link
        href={
          isAdmin
            ? '/manage-events'
            : `/video-preview${querySuffix || '?id=' + id}`
        }
        className='flex items-center gap-1 text-base font-semibold text-[#2E333B] hover:text-[#4A61FF]'
      >
        <ChevronLeft className='h-6 w-6' />
        {isAdmin ? 'Back to Dashboard' : 'Back to Video'}
      </Link>
      <Button
        href={`/event/${id}?preview=true`}
        className='bg-[#4A61FF] hover:bg-[#4338CA] px-6'
      >
        Preview
      </Button>
    </header>
  );
}
