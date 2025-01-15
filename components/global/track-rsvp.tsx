'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Mail,
  Eye,
  Bell,
  ArrowDownToLine,
  Megaphone,
  Search,
  Loader2,
} from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAppContext } from '@/lib/context';
import daysLeft from '@/utils/daysLeft';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/axiosInstance';
import GuestsTable from './guests-table';

const exampleGuests = [
  {
    name: 'Emma Williams',
    email: 'emma.williams123@gmail.com',
    rsvpStatus: 'Attending',
    adults: 1,
    children: 1,
    message: "So excited to join the celebration! I'm definitely...",
  },
  {
    name: 'Daniel Henry Wilson',
    email: 'fbaker@icloud.com',
    rsvpStatus: 'Attending',
    adults: 2,
    children: 1,
    message: "Can't wait!❤️",
  },
  {
    name: 'Evelyn Lewis',
    email: '798 568 8725',
    rsvpStatus: 'Not Attending',
    adults: 0,
    children: 0,
    message: 'Lorem ipsum dolor sit amet, consectetur adipi...',
  },
  // Add more guests as needed
];

const TrackRsvp = () => {
  const { event } = useAppContext();
  const eventData = event?.eventDetails;
  const eventTitle = eventData?.events?.[0]?.title;
  const eventDaysLeft = daysLeft(eventData?.events?.[0]?.startDate);
  const startDate = moment(eventData?.events?.[0]?.startDate).format(
    'DD/MM/YYYY'
  );
  const startTime = moment(eventData?.events?.[0]?.startTime, 'HH:mm').format(
    'h:mm A'
  );
  const eventId = event?._id;

  const { isLoading: isRsvpLoading, data: rsvps } = useQuery({
    queryKey: [`rsvps`, eventId],
    queryFn: async () => {
      const response = await api.get(`/rsvp/event/${eventId}`);
      return response?.data?.data;
    },
  });

  console.log({ rsvps });

  return (
    <div className='flex flex-col gap-4'>
      <Heading
        title={eventTitle}
        daysLeft={eventDaysLeft}
        startDate={startDate}
        startTime={startTime}
        eventId={eventId}
      />

      {isRsvpLoading ? (
        <div className='flex items-center justify-center h-screen'>
          <Loader2 className='h-4 w-4 animate-spin' />
        </div>
      ) : (
        <GuestsTable data={rsvps} />
      )}
    </div>
  );
};

export default TrackRsvp;

const tabs = [
  { label: 'All', count: 100 },
  { label: 'Attending', count: 40 },
  { label: 'Not Attending', count: 10 },
  { label: 'Maybe', count: 30 },
];

// function GuestList({ guests, totalAdults = 35, totalChildren = 5 }: any) {
//   const [activeTab, setActiveTab] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);

//   return (
//     <div className='w-full bg-white rounded-lg p-4'>
//       {/* Header */}
//       <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-4'>
//         <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
//           <h1 className='text-lg font-medium'>Guest List (100)</h1>
//           <div className='flex items-center gap-4 mt-2 md:mt-0 md:ml-8'>
//             <div className='text-sm'>
//               Total Attending 40:
//               <span className='ml-2'>Adult {totalAdults}</span>
//               <span className='ml-2'>Child {totalChildren}</span>
//             </div>
//           </div>
//         </div>
//         <div className='flex flex-wrap items-center gap-2 mt-2 md:mt-0'>
//           <Button variant='outline' size='icon'>
//             <Bell className='h-4 w-4 text-primary' />
//           </Button>
//           <Button variant='outline' size='icon'>
//             <Mail className='h-4 w-4 text-primary' />
//           </Button>
//           <Button variant='outline' size='icon'>
//             <Megaphone className='h-4 w-4 text-primary' />
//           </Button>
//           <Button className='bg-blue-600 hover:bg-blue-700'>Add Guest</Button>
//           <Button variant='outline' size='icon'>
//             <ArrowDownToLine className='h-4 w-4 text-primary' />
//           </Button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className='flex flex-col md:flex-row items-start md:items-center gap-2 mb-4'>
//         <div className='flex flex-wrap gap-2'>
//           {tabs.map((tab) => (
//             <Button
//               key={tab.label}
//               variant='outline'
//               onClick={() => setActiveTab(tab.label)}
//               className={cn(
//                 activeTab === tab.label &&
//                   'bg-primary/10 border-primary text-primary',
//                 'text-sm'
//               )}
//             >
//               {tab.label} ({tab.count})
//             </Button>
//           ))}
//         </div>
//         <div className='relative w-full md:w-[300px] mt-2 md:mt-0 md:ml-auto'>
//           <Input
//             placeholder='Search events by name or date...'
//             className='pl-8 pr-4 py-2 w-full border rounded-md'
//           />
//           <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-gray-400' />
//         </div>
//       </div>

//       {/* Table */}
//       <div className='border border-gray-100 rounded-lg overflow-x-auto'>
//         <Table className='min-w-full'>
//           <TableHeader className='bg-gray-50 border-gray-100'>
//             <TableRow>
//               <TableCell>Guest name ↑↓</TableCell>
//               <TableCell>Contact ↑↓</TableCell>
//               <TableCell>RSVP Status ↑↓</TableCell>
//               <TableCell>No. Of Guest ↑↓</TableCell>
//               <TableCell>Message ↑↓</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {guests?.map((guest: any) => (
//               <TableRow key={guest.email}>
//                 <TableCell className='font-medium text-blue-600'>
//                   {guest.name}
//                 </TableCell>
//                 <TableCell>{guest.email}</TableCell>
//                 <TableCell>
//                   <StatusBadge status={guest.rsvpStatus} />
//                 </TableCell>
//                 <TableCell>
//                   Adult ({guest.adults}) Child ({guest.children})
//                 </TableCell>
//                 <TableCell className='max-w-[300px] truncate'>
//                   {guest.message}
//                 </TableCell>
//                 <TableCell>
//                   <div className='flex items-center gap-2'>
//                     <Button variant='ghost' size='icon'>
//                       <Mail className='h-4 w-4 text-primary' />
//                     </Button>
//                     <Button variant='ghost' size='icon'>
//                       <Eye className='h-4 w-4 text-primary' />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className='flex flex-wrap items-center justify-end gap-2 mt-4'>
//         <Button
//           variant='outline'
//           size='icon'
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage(currentPage - 1)}
//         >
//           ←
//         </Button>
//         {[1, 2, 3, 4, 5].map((page) => (
//           <Button
//             key={page}
//             variant={currentPage === page ? 'secondary' : 'outline'}
//             onClick={() => setCurrentPage(page)}
//           >
//             {page}
//           </Button>
//         ))}
//         <Button
//           variant='outline'
//           size='icon'
//           onClick={() => setCurrentPage(currentPage + 1)}
//         >
//           →
//         </Button>
//       </div>
//     </div>
//   );
// }

function StatusBadge({ status }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Attending':
        return 'text-green-600';
      case 'Not Attending':
        return 'text-gray-600';
      case 'Maybe':
        return 'text-orange-600';
      case 'Pending Response':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <span className={`${getStatusColor(status)} font-medium`}>{status}</span>
  );
}

function Heading({ title, daysLeft, startDate, startTime, eventId }: any) {
  return (
    <div className=''>
      <div className='flex items-center text-sm text-muted-foreground mb-2'>
        <Link href='/events' className='hover:underline'>
          My Events
        </Link>
        <ChevronRight className='h-4 w-4 mx-1' />
        <span>Track RSVP</span>
      </div>

      <div className='flex flex-col md:flex-row items-start md:items-center justify-between py-2 px-4 border bg-white rounded-lg'>
        <div className='text-sm font-medium mb-2 md:mb-0'>{title}</div>

        <div className='flex items-center flex-wrap md:flex-nowrap gap-2 text-sm text-muted-foreground mb-2 md:mb-0'>
          <span>{startDate}</span>
          <span>|</span>
          <span>{startTime}</span>
          <span className='text-red-500 ml-1'>{daysLeft}</span>
        </div>

        <Button
          variant='outline'
          className='text-primary font-normal hover:no-underline border-primary'
          href={`/event/${eventId}?preview=true`}
        >
          View Event
        </Button>
      </div>
    </div>
  );
}
