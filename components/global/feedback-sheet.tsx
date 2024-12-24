'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Smile, Paperclip, Send, Download, Copy } from 'lucide-react';
import { useAppContext } from '@/lib/context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import CreateTicket from './create-ticket';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
export function FeedbackSheet() {
  const { openFeedback, setOpenFeedback } = useAppContext();
  const [currentTab, setCurrentTab] = useState<'message' | 'history'>(
    'message'
  );

  return (
    <Sheet open={openFeedback} onOpenChange={setOpenFeedback}>
      <SheetContent className='sm:max-w-[480px] w-full p-0'>
        <SheetHeader className='border-b p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <Button
                onClick={() => setCurrentTab('message')}
                size='sm'
                variant='outline'
                className={cn(
                  'border-primary text-primary w-max ',
                  currentTab === 'message' && 'bg-primary/10'
                )}
              >
                Message
              </Button>
              <Button
                onClick={() => setCurrentTab('history')}
                size='sm'
                variant='outline'
                className={cn(
                  'border-primary text-primary w-max',
                  currentTab === 'history' && 'bg-primary/10'
                )}
              >
                Feedback History
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className='h-full overflow-y-auto'>
          {currentTab === 'message' && <MessageTab />}
          {currentTab === 'history' && <HistoryTab />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const HistoryTab = () => {
  const [tickets, setTickets] = useState([
    {
      ticketId: '1002',
      feedbackType: 'Image change request',
      loggedOn: '10-27-2023',
      feedback:
        'Lorem ipsum dolor sit amet consectetur. Sapien facilisis praesent morbi et et. Pellentesque felis rhoncus neque eget eu a laoreet et nisl. ',
      attachments: [{ name: 'Test image.png', url: '#' }],
    },
    {
      ticketId: '1002',
      feedbackType: 'Image change request',
      loggedOn: '10-27-2023',
      feedback:
        'Lorem ipsum dolor sit amet consectetur. Sapien facilisis praesent morbi et et. Pellentesque felis rhoncus neque eget eu a laoreet et nisl. ',
      attachments: [{ name: 'Test image.png', url: '#' }],
    },
    {
      ticketId: '1002',
      feedbackType: 'Image change request',
      loggedOn: '10-27-2023',
      feedback:
        'Lorem ipsum dolor sit amet consectetur. Sapien facilisis praesent morbi et et. Pellentesque felis rhoncus neque eget eu a laoreet et nisl. ',
      attachments: [{ name: 'Test image.png', url: '#' }],
    },
  ]);

  return (
    <div className='flex flex-col gap-2 p-4 mb-16'>
      <div className='flex flex-col gap-2'>
        {tickets.map((ticket, index) => (
          <FeedbackTicket key={index} {...ticket} />
        ))}
      </div>
    </div>
  );
};

export default function FeedbackTicket({
  ticketId = '1002',
  feedbackType = 'Image change request',
  loggedOn = '10-27-2023',
  feedback = 'Lorem ipsum dolor sit amet consectetur. Sapien facilisis praesent morbi et et. Pellentesque felis rhoncus neque eget eu a laoreet et nisl. ',
  attachments = [{ name: 'Test image.png', url: '#' }],
}: any) {
  return (
    <Card className=''>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='space-y-4 flex-1'>
            <div className='grid grid-cols-[120px,1fr] gap-2 items-center'>
              <span className='text-sm text-muted-foreground'>Ticket Id:</span>
              <div className='flex items-center gap-2'>
                <span>{ticketId}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6'
                  onClick={() => navigator.clipboard.writeText(ticketId)}
                >
                  <Copy className='h-4 w-4 text-blue-500' />
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-[120px,1fr] gap-2 items-center'>
              <span className='text-sm text-muted-foreground'>
                Feedback Type:
              </span>
              <span>{feedbackType}</span>
            </div>

            <div className='grid grid-cols-[120px,1fr] gap-2 items-center'>
              <span className='text-sm text-muted-foreground'>Logged On</span>
              <span>{loggedOn}</span>
            </div>

            <div className='grid grid-cols-[120px,1fr] gap-2'>
              <span className='text-sm text-muted-foreground'>Feedback</span>
              <p className='text-sm'>{feedback}</p>
            </div>

            {attachments && attachments.length > 0 && (
              <div className='grid grid-cols-[120px,1fr] gap-2'>
                <span className='text-sm text-muted-foreground'>
                  Attachments :
                </span>
                <div className='flex items-center gap-2 bg-blue-50 rounded-md p-2'>
                  <span className='text-sm text-blue-500'>
                    {attachments[0].name}
                  </span>
                  <Button variant='ghost' size='icon' className='h-6 w-6'>
                    <Download className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant='outline'
            size='sm'
            className='text-primary bg-primary/10'
          >
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const MessageTab = () => {
  const [openCreateTicket, setOpenCreateTicket] = useState(false);
  return (
    <>
      <div className='flex flex-col gap-2 bg-gray-50 p-4'>
        <p className='text-sm text-muted-foreground'>
          Submit up to 3 tickets for revisions and feedback (0/3)
        </p>
        <Button
          onClick={() => setOpenCreateTicket(true)}
          size='sm'
          className='bg-primary text-white w-max'
        >
          Create Ticket
        </Button>
        <CreateTicket
          open={openCreateTicket}
          onOpenChange={setOpenCreateTicket}
        />
      </div>
      <ChatContainer>
        <ChatMessage
          isAdmin
          message='Figma ipsum component variant main layer. Edit layer text align shadow pencil star pencil share. Variant union auto underline vertical undo. Device figma pencil hand pixel effect plugin.'
          timestamp='15th November 02:10 PM'
          avatarFallback='A'
        />
        <ChatMessage
          message='Welcome'
          timestamp='16th November 01:10 PM'
          avatarFallback='U'
        />
      </ChatContainer>

      <div className='mt-auto border-t p-4 absolute bottom-0 w-full bg-background'>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <Smile className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <Paperclip className='h-4 w-4' />
          </Button>
          <div className='relative flex-1'>
            <input
              placeholder='Write message'
              className='w-full rounded-md border bg-background px-3 py-2 text-sm'
            />
          </div>
          <Button size='icon' className='h-8 w-8'>
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </>
  );
};
interface ChatContainerProps {
  children: React.ReactNode;
}
function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className='flex flex-col p-4'>
      <h2 className='text-base font-medium'>Chat</h2>
      <p className='text-sm text-muted-foreground'>
        Chat here for quick queries and resolutions. Expect a response within 24
        working hours.
      </p>
      <div className='mt-4 space-y-4'>{children}</div>
    </div>
  );
}

interface ChatMessageProps {
  isAdmin?: boolean;
  message: string;
  timestamp: string;
  avatarSrc?: string;
  avatarFallback: string;
}

function ChatMessage({
  isAdmin = false,
  message,
  timestamp,
  avatarSrc = '/placeholder.svg',
  avatarFallback,
}: ChatMessageProps) {
  if (isAdmin) {
    return (
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <span className='text-xs font-medium'>Admin</span>
        </div>
        <div>
          <div className='flex flex-col border rounded-lg p-3'>
            <p className='text-sm'>{message}</p>
          </div>
          <span className='mt-1 text-xs text-muted-foreground'>
            {timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-end gap-2'>
      <div>
        <div className='flex flex-col border rounded-lg p-3'>
          <p className='text-sm'>{message}</p>
        </div>
        <span className='mt-1 text-xs text-muted-foreground'>{timestamp}</span>
      </div>
      <Avatar className='h-8 w-8'>
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
    </div>
  );
}
