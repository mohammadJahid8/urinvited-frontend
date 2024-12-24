'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '../ui/button';

export default function EventButtons() {
  const router = useRouter();
  const pathname = usePathname();

  const buttons = [
    { name: 'details', label: 'Event Details', path: 'event-details' },
    { name: 'customization', label: 'Customization', path: 'customization' },
    {
      name: 'additionalFeatures',
      label: 'Additional features',
      path: 'additional-features',
    },
  ];

  return (
    <div className='flex w-full gap-2 mt-4 p-4 sticky top-0 bg-white z-10'>
      {buttons.map((button) => (
        <Button
          key={button.name}
          variant='outline'
          className={`flex-1 ${
            pathname.includes(button.path)
              ? 'bg-[#E9ECFF] text-[#4A61FF]'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            router.push(button.path);
          }}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
}
