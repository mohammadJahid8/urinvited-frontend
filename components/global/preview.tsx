'use client';
import {
  Share2,
  Heart,
  Plane,
  Building2,
  Calendar,
  MapPin,
  Hotel,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import useStore from '@/app/store/useStore';
import Image from 'next/image';
import React from 'react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import RSVPSheet from './rsvp-sheet';

const convertTime = (timeString: string) => {
  // Parse the time string into a Date object
  const time = parse(timeString, 'HH:mm', new Date());
  // Format the time into a readable format
  return format(time, 'hh:mm a');
};

export default function Preview() {
  const { formData } = useStore();
  const eventDetails = formData?.eventDetails;
  const events = eventDetails?.events;
  const hostedBy = eventDetails?.hostedBy;
  const rsvpDueDate = eventDetails?.rsvpDueDate;
  const isRsvpDueDateSet = eventDetails?.isRsvpDueDateSet;

  const customization = formData?.customization;
  const eventLogo = customization?.eventLogo
    ? URL.createObjectURL(customization.eventLogo)
    : null;
  const themeBackgroundImage = customization?.themeBackgroundImage
    ? URL.createObjectURL(customization.themeBackgroundImage)
    : 'https://i.ibb.co/hV7nmSc/5628-Anyoh-and-Eugene-s-little-man-baby-shower-static.jpg';
  const footerBackgroundImage = customization?.footerBackgroundImage
    ? URL.createObjectURL(customization.footerBackgroundImage)
    : null;
  const thumbnailImage = customization?.thumbnailImage
    ? URL.createObjectURL(customization.thumbnailImage)
    : null;
  console.log({
    eventDetails,
    eventLogo,
    themeBackgroundImage,
    footerBackgroundImage,
    thumbnailImage,
  });
  return (
    <div
      className={cn('bg-cover bg-center bg-no-repeat')}
      style={{ background: themeBackgroundImage! }}
      key={themeBackgroundImage}
    >
      <div className=''>
        {/* Logo */}

        {/* Video Section */}
        <div className='relative max-w-[300px] mx-auto rounded-lg shadow-lg overflow-hidden'>
          <video
            className='w-full h-[450px] object-cover'
            poster={thumbnailImage || ''}
            loop
            playsInline
            controls
          >
            <source src='/preview-video.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>

          <div className='absolute top-3 right-3 bg-white text-black text-sm font-medium px-2 py-1 rounded-lg shadow-md'>
            <div className='text-center'>
              <p>15</p>
              <span>May</span>
            </div>
          </div>

          <div className='flex gap-6 bg-white/80 backdrop-blur-md px-4 rounded-b-lg shadow-md'>
            <Button
              variant='special'
              className='flex items-center gap-2 text-gray-700 hover:text-black'
            >
              <Share2 className='size-4' />
              Share Invite
            </Button>
            <Button
              variant='special'
              className='flex items-center gap-2 text-gray-700 hover:text-black'
            >
              <Heart className='size-4' />
              Reaction
            </Button>
          </div>
        </div>

        <div className='bg-white max-w-[720px] mx-auto w-full shadow-md rounded-lg space-y-6 mt-10 p-8'>
          {events?.map(
            (
              {
                title,
                inviteDetails,
                when,
                startDate,
                startTime,
                endDate,
                endTime,
                timeZone,
                address,
                locationName,
                locationType,
                virtualPlatformName,
                virtualUrl,
                showGoogleMap,
              }: any,
              index: number
            ) => (
              <React.Fragment key={index}>
                <div className='text-center space-y-4'>
                  <h1 className='text-4xl font-semibold text-gray-800'>
                    {title}
                  </h1>
                  {typeof inviteDetails === 'string' && (
                    <p
                      className='text-lg text-gray-600'
                      dangerouslySetInnerHTML={{ __html: inviteDetails }}
                    />
                  )}
                </div>

                {/* Event Details */}
                {(when !== 'tbd' ||
                  virtualPlatformName ||
                  virtualUrl ||
                  address ||
                  locationName) && (
                  <div className='space-y-4 text-center'>
                    <div className='border-t border-dashed border-gray-300 max-w-[300px] mx-auto w-full'></div>

                    {(startDate ||
                      startTime ||
                      timeZone ||
                      endDate ||
                      endTime) &&
                      when !== 'tbd' && (
                        <div className='space-y-1'>
                          <div className='flex items-center justify-center gap-2 text-lg text-gray-700 font-semibold'>
                            <Calendar className='w-5 h-5 text-blue-600' />
                            <span>
                              {startDate &&
                                format(new Date(startDate), 'MM/dd/yyyy')}{' '}
                              {startTime &&
                                startTime &&
                                `| ${convertTime(startTime)}`}{' '}
                              {endDate &&
                                endDate &&
                                `to ${format(
                                  new Date(endDate),
                                  'MM/dd/yyyy'
                                )}`}{' '}
                              {endTime &&
                                endTime &&
                                `| ${convertTime(endTime)}`}{' '}
                              {timeZone && `| ${timeZone}`}
                            </span>
                          </div>
                          <a href='#' className='text-blue-500 text-base'>
                            Add to Calendar
                          </a>
                        </div>
                      )}

                    {(address || locationName) &&
                      locationType === 'in-person' && (
                        <div className='space-y-1'>
                          <div className='flex items-center justify-center gap-2 text-lg text-gray-700 font-semibold'>
                            <MapPin className='w-5 h-5 text-blue-600' />
                            <span>
                              {address}, {locationName}
                            </span>
                          </div>
                          {showGoogleMap && (
                            <a href='#' className='text-blue-500 text-base'>
                              View Map
                            </a>
                          )}
                        </div>
                      )}

                    {(virtualPlatformName || virtualUrl) &&
                      locationType === 'virtual' && (
                        <div className='space-y-1'>
                          <div className='flex items-center justify-center gap-2 text-lg text-gray-700 font-semibold'>
                            <Plane className='w-5 h-5 text-blue-600' />
                            <span>{virtualPlatformName}</span>
                          </div>
                          {virtualUrl && (
                            <a
                              target='_blank'
                              href={virtualUrl}
                              className='text-blue-500 text-base'
                            >
                              Join Link
                            </a>
                          )}
                        </div>
                      )}

                    <div className='border-t border-dashed border-gray-300 max-w-[300px] mx-auto w-full'></div>
                  </div>
                )}
              </React.Fragment>
            )
          )}

          {hostedBy && (
            <p className='text-xl text-gray-500 text-center'>
              Hosted By: {hostedBy}
            </p>
          )}

          {/* RSVP Button */}
          {/* {isRsvpDueDateSet && rsvpDueDate && ( */}
          <div className='text-center'>
            {/* <p className='text-sm text-gray-500'>
              RSVP by {format(new Date(rsvpDueDate), 'MM/dd/yyyy')}
            </p> */}
            <RSVPSheet />
          </div>
          {/* )} */}

          {/* Gift Section */}
          <div className='p-4 bg-gray-50 shadow-sm text-center space-y-4'>
            <img src='/gift.svg' alt='Gift' className='mx-auto h-10' />
            <h2 className='text-xl font-bold'>
              Choose a Gift for the Celebration
            </h2>
            <p className='text-sm text-gray-500'>
              Hi [Invitee&apos;s Name], feel free to pick a gift from the link
              below if you&apos;d like. Your presence is the best gift!
            </p>
            <Button
              variant='outline'
              className='max-w-[172px] w-full py-2 mt-2 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-100'
            >
              Shop Gifts
            </Button>
          </div>

          {/* Custom Section */}
          <div className='space-y-4 text-center'>
            <h2 className='text-xl font-bold'>Custom Title</h2>
            <p className='text-sm text-gray-600'>
              Lorem ipsum dolor sit amet consectetur. Sapien facilisis praesent
              morbi et et. Pellentesque felis rhoncus neque eget eu a laoreet et
              nisl.
            </p>
            <Button
              variant='outline'
              className='max-w-[172px] w-full py-2 mt-2 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-100'
            >
              Custom Button
            </Button>
          </div>

          {/* Footer Icons */}
          <div className='flex justify-center gap-8 py-4 bg-gray-50 shadow-sm items-center'>
            <div className='flex items-center gap-1'>
              <Car className='w-6 h-6 text-blue-600' />
              <span className='text-sm text-gray-700'>Travel</span>
            </div>
            <div className='flex items-center gap-1'>
              <Hotel className='w-6 h-6 text-blue-600' />
              <span className='text-sm text-gray-700'>Accommodation</span>
            </div>
          </div>
        </div>
        {footerBackgroundImage && (
          <Image
            src={footerBackgroundImage}
            alt='Footer'
            width={720}
            height={100}
            className='w-full h-[240px] mt-20 object-cover'
          />
        )}
        <div className='p-4 flex justify-center'>
          {eventLogo && (
            <img src={eventLogo} alt='Event Logo' width={150} height={100} />
          )}
        </div>
      </div>
    </div>
  );
}
