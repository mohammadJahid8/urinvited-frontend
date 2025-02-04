'use client';
import { Bell, HelpCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAppContext } from '@/lib/context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from './logo';

export default function Navbar() {
  const { user, logout } = useAppContext();

  return (
    <header className='flex h-16 items-center justify-between bg-white px-4 border-b'>
      <Logo />
      <div className='flex items-center gap-2'>
        {/* <Button
          variant='ghost'
          size='icon'
          className='text-black hover:bg-white/20'
        >
          <Bell className='h-5 w-5' />
          <span className='sr-only'>Notifications</span>
        </Button> */}
        {/* <Button
          variant='ghost'
          size='icon'
          className='text-black hover:bg-white/20'
        >
          <HelpCircle className='h-5 w-5' />
          <span className='sr-only'>Time</span>
        </Button> */}
        <UserDropdown user={user} logout={logout} />
      </div>
    </header>
  );
}

const UserDropdown = ({ user, logout }: { user: any; logout: () => void }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={user?.image} alt='User avatar' />
          <AvatarFallback>
            {user?.name?.charAt(0) || user?.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
