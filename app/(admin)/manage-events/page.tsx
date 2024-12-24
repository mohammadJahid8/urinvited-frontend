import { Edit, Search, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EventsPage() {
  return (
    <div className=''>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
        <h1 className='text-xl font-semibold'>Manage Events</h1>
        <Button className='bg-primary text-white w-full md:w-auto'>
          Create Event
        </Button>
      </div>

      {/* Tabs and Search Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
        <div className='flex flex-wrap gap-2 w-full md:w-auto'>
          <Button
            variant='outline'
            className='bg-primary/10 text-primary border-primary flex-grow md:flex-grow-0'
          >
            Upcoming Events (2)
          </Button>
          <Button variant='outline' className='flex-grow md:flex-grow-0'>
            Past Events (2)
          </Button>
        </div>
        <div className='relative w-full md:w-[300px]'>
          <Input
            placeholder='Search events by name or date...'
            className='pl-8 pr-4 py-2 w-full border rounded-md'
          />
          <Search className='absolute left-2.5 top-2.5 h-5 w-5 text-gray-400' />
        </div>
      </div>

      {/* Event Cards */}
      <div className='space-y-4'>
        <EventCard
          id='1'
          title="Aria's Second Birthday"
          date='02/15/2025'
          time='10:00 AM'
          location='210 Richmond park ln, Bothell, WA 75071'
          description="Celebrate two wonderful years of Aria's joy and laughter with us! Let's make beautiful memories together on her special day!"
          stats={{
            invited: 100,
            attending: 40,
            notAttending: 10,
            maybe: 50,
          }}
          daysLeft={3}
        />

        <EventCard
          id='2'
          title='Olivia Grace & John Baby shower'
          date='03/14/2025'
          time='12:00 PM'
          location='210 Richmond park ln, Bothell, WA 75071'
          description="Join us as we celebrate Olivia and John and their upcoming little miracle! Let's make this a day full of joy and love"
          stats={{
            invited: 100,
            attending: 30,
            notAttending: 10,
            maybe: 60,
          }}
          daysLeft={29}
        />
      </div>
    </div>
  );
}

interface EventStats {
  invited: number;
  attending: number;
  notAttending: number;
  maybe: number;
}

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  stats: EventStats;
  daysLeft: number;
}

function EventCard({
  id,
  title,
  date,
  time,
  location,
  description,
  stats,
  daysLeft,
}: EventCardProps) {
  return (
    <div className=''>
      <div className='bg-white p-4 rounded-t-lg border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start gap-2 md:gap-4 mb-4'>
          <div>
            <h3 className='text-lg font-medium mb-2'>{title}</h3>
            <div className='text-sm text-gray-500 mb-1'>
              {date} | {time}
            </div>
            <div className='text-sm text-gray-500'>{location}</div>
          </div>
          <div className='flex items-center'>
            <div className='w-2 h-2 rounded-full bg-red-500 mr-2' />
            <span className='text-sm text-red-500 whitespace-nowrap'>
              {daysLeft} days for the event
            </span>
          </div>
        </div>

        <p className='text-sm text-gray-600 mb-6'>{description}</p>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 rounded-b-lg p-4 border-b border-r border-l border-gray-200'>
        <div className='grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6 w-full md:w-auto'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>Invited</span>
            <span className='text-sm font-medium'>{stats.invited}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>Attending</span>
            <span className='text-sm font-medium'>{stats.attending}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>Not Attending</span>
            <span className='text-sm font-medium'>{stats.notAttending}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-500'>May be</span>
            <span className='text-sm font-medium'>{stats.maybe}</span>
          </div>
        </div>

        <div className='flex items-center flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto'>
          <Button
            variant='outline'
            size='icon'
            className='flex-grow md:flex-grow-0'
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='flex-grow md:flex-grow-0'
          >
            <Share2 className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='text-gray-700 flex-grow md:flex-grow-0'
          >
            View Invite
          </Button>
          <Button
            href={`/events/track-rsvp/${id}`}
            className='bg-primary text-white flex-grow md:flex-grow-0'
          >
            Track RSVP
          </Button>
        </div>
      </div>
    </div>
  );
}
