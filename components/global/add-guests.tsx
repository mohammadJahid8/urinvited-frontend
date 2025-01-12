import React from 'react';
import { Button } from '@/components/ui/button';

import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import GuestList from './guest-list';
import { EmailPreview } from './email-preview';
import { useAppContext } from '@/lib/context';

const AddGuests = ({ id }: { id: string }) => {
  const { setOpenEmailPreview } = useAppContext();
  const [emails, setEmails] = React.useState<string[]>([]);
  const [focused, setFocused] = React.useState(false);

  console.log({ emails });
  return (
    <div className='w-full max-w-full sm:max-w-[900px] mx-auto bg-white rounded-lg overflow-hidden shadow-sm border'>
      <div className='bg-gray-100 p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center'>
        <h2 className='text-lg sm:text-xl font-bold'>Add guest</h2>
        <div className='flex items-center gap-2'>
          <p className='text-sm sm:text-base text-gray-600 font-medium'>
            Total guests added: 0
          </p>
          <Button
            variant='outline'
            className='border-primary text-primary'
            onClick={() => setOpenEmailPreview(true)}
          >
            View Email Preview
          </Button>
        </div>
      </div>
      <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
        <div className='space-y-2'>
          <ReactMultiEmail
            placeholder='Enter or paste a list of email separated by comma, space or return.'
            emails={emails}
            onChange={(_emails: string[]) => {
              setEmails(_emails);
            }}
            autoFocus={true}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className='h-16 sm:h-20 overflow-y-auto text-sm'
            getLabel={(email, index, removeEmail) => {
              return (
                <div data-tag key={index}>
                  <div data-tag-item>{email}</div>
                  <span data-tag-handle onClick={() => removeEmail(index)}>
                    ×
                  </span>
                </div>
              );
            }}
          />

          <p className='text-xs sm:text-sm text-gray-500'>
            Example: Johnsmith@gmail.com, Jessi@gmail.com (or)
            Johnsmith@gmail.com; Jessi@gmail.com
          </p>
        </div>

        <div className='space-y-2'>
          <GuestList emails={emails} />
        </div>
      </div>
      <EmailPreview />
    </div>
  );
};

export default AddGuests;
