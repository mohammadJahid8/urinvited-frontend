'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Monitor, Smartphone, ChevronDown } from 'lucide-react';
import { FeedbackSheet } from './feedback-sheet';
import { Sheet, SheetTrigger } from '../ui/sheet';
import { useAppContext } from '@/lib/context';

export default function VideoPreviewNav() {
  const [activeView, setActiveView] = useState('Desktop');
  const { openFeedback, setOpenFeedback } = useAppContext();
  return (
    <header className='flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm'>
      <p className='flex items-center gap-1 text-base font-semibold text-[#2E333B]'>
        Video Preview
      </p>

      <div className='flex items-center gap-4'>
        <div className='flex items-center rounded-lg mr-10 gap-2'>
          <Button
            variant={activeView === 'Desktop' ? 'secondary' : 'ghost'}
            size='sm'
            className='flex items-center gap-2'
            onClick={() => setActiveView('Desktop')}
          >
            <Monitor className='h-4 w-4' />
            Desktop
          </Button>
          <Button
            variant={activeView === 'Mobile' ? 'secondary' : 'ghost'}
            size='sm'
            className='flex items-center gap-2'
            onClick={() => setActiveView('Mobile')}
          >
            <Smartphone className='h-4 w-4' />
            Mobile
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='flex items-center gap-2 border-primary text-primary'
            >
              Download
              <ChevronDown className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Download as MP4</DropdownMenuItem>
            <DropdownMenuItem>Download as GIF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() => setOpenFeedback(true)}
          variant='outline'
          className='text-primary border-primary'
        >
          Suggest Feedback
        </Button>

        <FeedbackSheet />

        <Button
          href='/event-details'
          className='bg-[#4A61FF] text-white hover:bg-[#4338CA]'
        >
          Yes, I Approve
        </Button>
      </div>
    </header>
  );
}
