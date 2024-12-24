import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function EventPreviewNav() {
  return (
    <header className='flex h-14 items-center justify-between border-b px-4 shadow-md bg-white'>
      <Link
        href='/video-preview'
        className='flex items-center gap-1 text-base font-semibold text-[#2E333B] hover:text-[#4A61FF]'
      >
        <ChevronLeft className='h-6 w-6' />
        Back to Video
      </Link>
      <Button href='/preview' className='bg-[#4A61FF] hover:bg-[#4338CA] px-6'>
        Preview
      </Button>
    </header>
  );
}
