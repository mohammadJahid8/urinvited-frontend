'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';

export default function EventButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const buttons = [
    {
      name: 'details',
      label: 'Event Details',
      path: 'event-details',
      href: `event-details?id=${id}`,
    },
    {
      name: 'customization',
      label: 'Customization',
      path: 'customization',
      href: `customization?id=${id}`,
    },
    {
      name: 'additionalFeatures',
      label: 'Additional features',
      path: 'additional-features',
      href: `additional-features?id=${id}`,
    },
  ];

  return (
    <div className='flex w-full sm:gap-2 gap-1 mt-4 p-4 sticky top-0 bg-white z-10'>
      {buttons.map((button) => (
        <Button
          key={button.name}
          variant='outline'
          className={`flex-1 sm:text-sm text-xs px-2 sm:px-4 ${
            pathname.includes(button.path)
              ? 'bg-[#E9ECFF] text-[#4A61FF]'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            router.push(button.href);
          }}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
}
