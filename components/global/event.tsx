'use client';
import {
  Share2,
  Heart,
  Plane,
  Calendar,
  MapPin,
  Hotel,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import useStore from '@/app/store/useStore';
import Image from 'next/image';
import React from 'react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import RSVPSheet from './rsvp-sheet';
import api from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import moment from 'moment';
import { useAppContext } from '@/lib/context';

const convertTime = (timeString: string) => {
  // Parse the time string into a Date object
  const time = parse(timeString, 'HH:mm', new Date());
  // Format the time into a readable format
  return format(time, 'hh:mm a');
};

export default function Event({ className }: any) {
  const { formData } = useStore();
  const { setOpenRSVP, event, isEventLoading } = useAppContext();

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (isEventLoading) {
    return <div>Loading...</div>;
  }

  const eventDetails = formData?.eventDetails || event?.eventDetails;
  const customization = formData?.customization || event?.customization;
  const additionalFeatures =
    formData?.additionalFeatures || event?.additionalFeatures;

  console.log({ eventDetails, customization, additionalFeatures });

  const events = eventDetails?.events;
  const hostedBy = event?.hostedBy;
  const requestRsvps = eventDetails?.requestRsvps;
  const rsvpDueDate = eventDetails?.rsvpDueDate;
  const isRsvpDueDateSet = eventDetails?.isRsvpDueDateSet;
  const allowRsvpAfterDueDate = eventDetails?.allowRsvpAfterDueDate;
  const allowAdditionalAttendees = eventDetails?.allowAdditionalAttendees;
  const additionalAttendees = eventDetails?.additionalAttendees;
  const maximumCapacity = eventDetails?.maximumCapacity;

  const isEventLogoEnabled = customization?.isEventLogoEnabled;
  const isThemeBackgroundImageEnabled =
    customization?.isThemeBackgroundImageEnabled;
  const isFooterBackgroundImageEnabled =
    customization?.isFooterBackgroundImageEnabled;
  const isThumbnailImageEnabled = customization?.isThumbnailImageEnabled;
  const textColour = customization?.textColour;
  const headingFont = customization?.headingFont;
  const dateTimeLocationFont = customization?.dateTimeLocationFont;
  const descriptionFont = customization?.descriptionFont;
  const buttonFont = customization?.buttonFont;
  const buttonText = customization?.buttonText;
  const buttonColour = customization?.buttonColour;
  const buttonFormat = customization?.buttonFormat;
  const isAddToCalendar = customization?.isAddToCalendar;
  const reactToEvent = customization?.reactToEvent;
  const shareEvent = customization?.shareEvent;
  // const commentOnEvent = customization?.commentOnEvent;

  const registry = additionalFeatures?.registry;
  const accommodation = additionalFeatures?.accommodation;
  const travelSource = additionalFeatures?.travelSource;
  const travelSourceLink = additionalFeatures?.travelSourceLink;

  const createImageUrl = (image: any) =>
    typeof image === 'string'
      ? image
      : image
      ? URL.createObjectURL(image)
      : null;

  const eventLogo = createImageUrl(customization?.eventLogo);
  const themeBackgroundImage = createImageUrl(
    customization?.themeBackgroundImage
  );
  const footerBackgroundImage = createImageUrl(
    customization?.footerBackgroundImage
  );
  const thumbnailImage =
    createImageUrl(customization?.thumbnailImage) ||
    event?.video?.videos[event?.video?.videos?.length - 1]?.thumbnail;

  const videoUrl = event?.video?.videos[event?.video?.videos?.length - 1]?.url;

  return (
    <div
      className={cn('bg-cover bg-center bg-no-repeat p-10', className)}
      style={{
        backgroundImage: themeBackgroundImage
          ? `url(${themeBackgroundImage})`
          : 'none',
      }}
      key={themeBackgroundImage}
    >
      <div className=''>
        {/* Video Section */}
        <div className='relative max-w-[300px] mx-auto rounded-lg shadow-lg overflow-hidden'>
          <video
            className='w-full h-[450px] object-cover'
            poster={thumbnailImage || ''}
            loop
            playsInline
            controls
          >
            <source src={videoUrl} type='video/mp4' />
            Your browser does not support the video tag.
          </video>

          <div className='absolute top-3 right-3 bg-white text-black text-sm font-medium px-2 py-1 rounded-lg shadow-md'>
            <div className='text-center'>
              <p>{moment(eventDetails?.events?.[0]?.startDate).format('DD')}</p>
              <span>
                {moment(eventDetails?.events?.[0]?.startDate).format('MMM')}
              </span>
            </div>
          </div>

          <div className='flex gap-6 bg-white/80 backdrop-blur-md px-4 rounded-b-lg shadow-md'>
            {shareEvent && (
              <Button
                variant='special'
                className='flex items-center gap-2 text-gray-700 hover:text-black'
              >
                <Share2 className='size-4' />
                Share Event
              </Button>
            )}
            {reactToEvent && (
              <Button
                variant='special'
                className='flex items-center gap-2 text-gray-700 hover:text-black'
              >
                <Heart className='size-4' />
                Reaction
              </Button>
            )}
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
                latLng,
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
                    <Border />

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
                                format(new Date(startDate), 'dd/MM/yyyy')}{' '}
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
                          {isAddToCalendar && (
                            <a href='#' className='text-blue-500 text-base'>
                              Add to Calendar
                            </a>
                          )}
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
                            <a
                              href={`https://www.google.com/maps?q=${latLng?.lat},${latLng?.lng}`}
                              className='text-blue-500 text-base'
                            >
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

                    <Border />
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

          <div className='text-center'>
            {isRsvpDueDateSet && rsvpDueDate && (
              <>
                <Border />
                <p className='text-sm text-gray-500 pt-4'>
                  RSVP by {format(new Date(rsvpDueDate), 'dd MMMM yyyy')}
                </p>
              </>
            )}
            {requestRsvps && (
              <Button
                className={cn(
                  'max-w-[172px] w-full py-2 mt-2 text-white',
                  buttonFormat === 'rounded' && 'rounded-full'
                )}
                style={{
                  backgroundColor: buttonColour,
                }}
                onClick={() => setOpenRSVP(true)}
              >
                {buttonText || 'RSVP Now'}
              </Button>
            )}
            <RSVPSheet />
          </div>

          {/* Gift Section */}
          {registry &&
            registry.map((item: any, index: number) => (
              <div
                className='p-4 bg-gray-50 shadow-sm text-center space-y-4'
                key={index}
              >
                <img src='/gift.svg' alt='Gift' className='mx-auto h-10' />
                <h2 className='text-xl font-bold'>{item.title}</h2>
                <div
                  className='text-sm text-gray-500'
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
                {item.url && (
                  <Button
                    href={item.url}
                    target='_blank'
                    variant='outline'
                    className={cn(
                      'max-w-[172px] w-full py-2 mt-2 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-100',
                      buttonFormat === 'rounded' && 'rounded-full'
                    )}
                  >
                    Shop Gifts
                  </Button>
                )}
              </div>
            ))}

          {/* Custom Section */}
          {/* <div className='space-y-4 text-center'>
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
          </div> */}

          {/* Footer Icons */}
          {(accommodation || travelSource) && (
            <div className='flex flex-col justify-center gap-4 py-4 bg-gray-50 shadow-sm items-center'>
              {travelSource && (
                <Button
                  href={travelSourceLink}
                  target='_blank'
                  variant='special'
                  className='flex items-center gap-1 text-gray-700 hover:text-black hover:underline'
                >
                  <Car className='w-6 h-6 text-blue-600' />
                  <span className='text-sm text-gray-700'>{travelSource}</span>
                </Button>
              )}

              {accommodation?.length > 0 &&
                accommodation.map(
                  (item: any, index: number) =>
                    item?.accommodationName && (
                      <>
                        <div
                          className='flex flex-col items-center gap-1'
                          key={index}
                        >
                          <div className='flex items-center gap-1'>
                            <Hotel className='w-6 h-6 text-blue-600' />
                            <span className='text-sm text-gray-700'>
                              {item.accommodationName}, {item.location}
                            </span>
                          </div>

                          <div
                            className='text-sm text-gray-700'
                            dangerouslySetInnerHTML={{ __html: item.note }}
                          />
                        </div>
                      </>
                    )
                )}
            </div>
          )}
        </div>
        {footerBackgroundImage && isFooterBackgroundImageEnabled && (
          <Image
            src={footerBackgroundImage}
            alt='Footer'
            width={720}
            height={100}
            className='w-full h-[240px] mt-20 object-cover'
          />
        )}
        <div className='p-4 flex justify-center'>
          {eventLogo && isEventLogoEnabled && (
            <img src={eventLogo} alt='Event Logo' width={150} height={100} />
          )}
        </div>
      </div>
    </div>
  );
}

const Border = () => {
  return (
    <div className='border-t border-dashed border-gray-300 max-w-[300px] mx-auto w-full'></div>
  );
};
