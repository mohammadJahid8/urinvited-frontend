'use client';
import {
  CalendarCheck,
  Contact,
  HelpCircle,
  Settings,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/global/navbar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: '/events', icon: CalendarCheck, label: 'My Events' },
    { href: '/contact', icon: Contact, label: 'Contact' },
    { href: '/settings', icon: Settings, label: 'Settings' },
    { href: '/help', icon: HelpCircle, label: 'Help' },
  ];

  const NavLinks = () => (
    <>
      {links.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-2 px-4 py-3 w-full ${
            pathname === href
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Icon className='w-5 h-5' />
          <span>{label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='fixed top-0 left-0 w-full z-50'>
        <Navbar />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='fixed bottom-4 right-4 z-50 md:hidden bg-primary text-white rounded-full shadow-lg'
          >
            <Menu className='w-6 h-6' />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-[250px] sm:w-[300px]'>
          <nav className='flex flex-col mt-8'>
            <NavLinks />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Sidebar - hidden on mobile, visible on md and up */}
      <aside className='hidden md:block fixed left-0 top-0 bottom-0 w-[80px] border-r bg-background overflow-y-auto mt-16 z-50'>
        <nav className='flex flex-col items-center'>
          {links.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-2 py-5 w-full mx-auto text-center ${
                pathname === href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Icon className='w-5 h-5' />
              <span className='text-xs'>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className='flex-1 md:ml-[80px] flex flex-col min-h-screen'>
        <div className='flex-1 overflow-y-auto mt-16 p-4 md:p-6 bg-[#F8F8F8]'>
          {children}
        </div>
      </main>
    </div>
  );
}
