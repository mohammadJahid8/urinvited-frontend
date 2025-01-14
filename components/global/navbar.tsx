import { Bell, HelpCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className='flex h-16 items-center justify-between bg-white px-4 border-b'>
      <Link href='/' className='flex items-center gap-2'>
        <span className='text-lg font-semibold text-black'>Urinvited</span>
      </Link>
      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          className='text-black hover:bg-white/20'
        >
          <Bell className='h-5 w-5' />
          <span className='sr-only'>Notifications</span>
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='text-black hover:bg-white/20'
        >
          <HelpCircle className='h-5 w-5' />
          <span className='sr-only'>Time</span>
        </Button>
        <Avatar className='h-8 w-8'>
          <AvatarImage src='/placeholder.svg' alt='User avatar' />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
