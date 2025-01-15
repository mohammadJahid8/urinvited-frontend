'use client';
import { Edit, Search, Share2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/lib/context';
import moment from 'moment';
import daysLeft from '@/utils/daysLeft';

export default function ManageEvents({ title }: { title: string }) {
  const { events, isEventsLoading, user } = useAppContext();
  console.log({ events });

  return (
    <div className=''>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
        <h1 className='text-xl font-semibold'>{title}</h1>
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
        {events?.length > 0 &&
          events?.map((event: any, index: any) => (
            <EventCard
              key={index}
              id={event._id}
              hasEvent={event?.eventDetails?.events?.length > 0}
              title={event?.eventDetails?.events?.[0]?.title}
              startDate={moment(
                event?.eventDetails?.events?.[0]?.startDate
              ).format('MM/DD/YYYY')}
              startTime={event?.eventDetails?.events?.[0]?.startTime}
              location={`${event?.eventDetails?.events?.[0]?.locationName}, ${event?.eventDetails?.events?.[0]?.address}`}
              inviteDetails={event?.eventDetails?.events?.[0]?.inviteDetails}
              stats={{
                invited: 100,
                attending: 40,
                notAttending: 10,
                maybe: 50,
              }}
              daysLeft={daysLeft(event?.eventDetails?.events?.[0]?.startDate)}
              video={event?.video}
              isAdmin={user?.role === 'admin'}
            />
          ))}
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
  startDate: string;
  startTime: string;
  location: string;
  inviteDetails: string;
  stats: EventStats;
  daysLeft: string;
  hasEvent: boolean;
  video: any;
  isAdmin: boolean;
}

function EventCard({
  id,
  title,
  startDate,
  startTime,
  location,
  inviteDetails,
  stats,
  daysLeft,
  hasEvent,
  video,
  isAdmin,
}: EventCardProps) {
  console.log({ video, isAdmin });

  const isVideoPending = video?.status === 'Pending';

  const path =
    !isAdmin && isVideoPending
      ? `/video-preview?id=${id}`
      : `/event-details?id=${id}`;

  return (
    <div className=''>
      <div className='bg-white p-4 rounded-t-lg border border-gray-200'>
        {hasEvent ? (
          <>
            <div className='flex flex-col md:flex-row justify-between items-start gap-2 md:gap-4 mb-4'>
              <div>
                <h3 className='text-lg font-medium mb-2'>{title}</h3>
                <div className='text-sm text-gray-500 mb-1'>
                  {startDate} | {startTime}
                </div>
                <div className='text-sm text-gray-500'>{location}</div>
              </div>
              <div className='flex items-center'>
                <div className='w-2 h-2 rounded-full bg-red-500 mr-2' />
                <span className='text-sm text-red-500 whitespace-nowrap'>
                  {daysLeft}
                </span>
              </div>
            </div>

            <div
              className='text-sm text-gray-600 mb-6'
              dangerouslySetInnerHTML={{ __html: inviteDetails }}
            />
          </>
        ) : (
          <div className='text-sm text-gray-600 mb-6 text-center'>
            This event has no event details. Please update the event details
          </div>
        )}
      </div>

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-100 rounded-b-lg p-4 border-b border-r border-l border-gray-200'>
        <div className='grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6 w-full md:w-auto'>
          {hasEvent && (
            <>
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
                <span className='text-sm font-medium'>
                  {stats.notAttending}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-500'>May be</span>
                <span className='text-sm font-medium'>{stats.maybe}</span>
              </div>
            </>
          )}
        </div>

        <div className='flex items-center flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto'>
          {hasEvent && (
            <>
              <Button
                href={`/events/track-rsvp/${id}`}
                className='bg-primary text-white flex-grow md:flex-grow-0'
              >
                Track RSVP
              </Button>

              <Button
                href={`/event/${id}?preview=true`}
                variant='outline'
                className='text-gray-700 flex-grow md:flex-grow-0'
              >
                View Event
              </Button>
              <Button
                href={`/share/${id}`}
                variant='outline'
                size='icon'
                className='flex-grow md:flex-grow-0'
              >
                <Share2 className='h-4 w-4' />
              </Button>
            </>
          )}

          <Button
            href={path}
            variant='outline'
            size='icon'
            className='flex-grow md:flex-grow-0'
          >
            <Edit className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
