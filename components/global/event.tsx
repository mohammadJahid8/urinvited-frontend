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
import React, { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import RSVPSheet from './rsvp-sheet';
import api from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';

import moment from 'moment';
import { useAppContext } from '@/lib/context';
import { toast } from 'sonner';
import { shareUrl } from '@/lib/shareUrl';
import PickEmoji from './emoji-picker';

const convertTime = (timeString: string) => {
  // Parse the time string into a Date object
  const time = parse(timeString, 'HH:mm', new Date());
  // Format the time into a readable format
  return format(time, 'hh:mm a');
};

export default function Event({ className }: any) {
  const { formData } = useStore();
  const { setOpenRSVP, event, isEventLoading } = useAppContext();
  const [reaction, setReaction] = useState('');

  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');
  const name = searchParams.get('n');
  const email = searchParams.get('e');
  const { id: paramsId } = useParams();
  const id = urlId || paramsId;

  const {
    isLoading: isRsvpLoading,
    refetch: refetchRsvp,
    data: rsvp,
  } = useQuery({
    queryKey: [`rsvp`, id, email],
    queryFn: async () => {
      const response = await api.get(`/rsvp/${id}?contact=${email}`);
      return response?.data?.data;
    },
  });

  useEffect(() => {
    if (rsvp) {
      setReaction(rsvp?.reaction || '');
    }
  }, [rsvp]);

  const eventDetails = formData?.eventDetails || event?.eventDetails;
  const customization = formData?.customization || event?.customization;
  const additionalFeatures =
    formData?.additionalFeatures || event?.additionalFeatures;

  console.log({ eventDetails, event });

  const events = eventDetails?.events;
  const hostedBy = eventDetails?.hostedBy;
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
  useEffect(() => {
    // Helper function to dynamically load a font
    const loadFont = (fontFamily: string, id: string) => {
      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
        ' ',
        '+'
      )}&display=swap`;

      // Remove existing font link with the same id
      const existingLink = document.getElementById(id);
      if (existingLink) {
        existingLink.remove();
      }

      // Add new font link
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    };

    // Load each font with a unique ID
    if (headingFont) {
      loadFont(headingFont, 'dynamic-heading-font');
    }
    if (descriptionFont) {
      loadFont(descriptionFont, 'dynamic-description-font');
    }
    if (dateTimeLocationFont) {
      loadFont(dateTimeLocationFont, 'dynamic-datetime-font');
    }
    if (buttonFont) {
      loadFont(buttonFont, 'dynamic-button-font');
    }
  }, [headingFont, descriptionFont, dateTimeLocationFont, buttonFont]);

  if (isEventLoading) {
    return <div>Loading...</div>;
  }

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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl(id as string))
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link.');
      });
  };

  const onIconSelect = (icon: string) => {
    setReaction(icon);
  };

  const combineDateTime = (date: string, time: string) => {
    if (!date || !time) return '';
    const [hours, minutes] = time?.split(':') || [];
    const dateObject = new Date(date);
    dateObject.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0); // Set hours and minutes
    return dateObject.toISOString().replace(/-|:|\.\d{3}/g, '');
  };

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
        {videoUrl && (
          <div className='relative max-w-[300px] mx-auto rounded-lg shadow-lg overflow-hidden'>
            {/* <Video videoUrl={videoUrl} thumbnailImage={thumbnailImage} /> */}
            <video
              className='w-auto h-auto'
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
                <p>
                  {moment(eventDetails?.events?.[0]?.startDate).format('DD')}
                </p>
                <span>
                  {moment(eventDetails?.events?.[0]?.startDate).format('MMM')}
                </span>
              </div>
            </div>

            <div className='flex gap-6 bg-white/80 backdrop-blur-md px-4 rounded-b-lg shadow-md'>
              {shareEvent && (
                <Button
                  onClick={handleCopyLink}
                  variant='special'
                  className='flex items-center gap-2 text-gray-700 hover:text-black'
                >
                  <Share2 className='size-4' />
                  Share Event
                </Button>
              )}
              {reactToEvent && (
                <>
                  <PickEmoji onChange={onIconSelect}>
                    <Button
                      variant='special'
                      className='flex items-center gap-2 text-gray-700 hover:text-black'
                    >
                      {reaction ? (
                        <span className='text-3xl'>{reaction}</span>
                      ) : (
                        <>
                          <Heart className='size-4' />
                          Reaction
                        </>
                      )}
                    </Button>
                  </PickEmoji>
                </>
              )}
            </div>
          </div>
        )}

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
                  <h1
                    className='text-4xl font-semibold text-gray-800'
                    style={{
                      color: textColour,
                      fontFamily: headingFont,
                      transition: 'font-family 0.3s ease',
                    }}
                  >
                    {title}
                  </h1>
                  {typeof inviteDetails === 'string' && (
                    <p
                      className='text-lg text-gray-600'
                      style={{
                        color: textColour,
                        fontFamily: descriptionFont,
                      }}
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
                          <div
                            className='flex sm:flex-row flex-col items-center justify-center gap-2 text-lg text-gray-700 font-semibold'
                            style={{
                              color: textColour,
                              fontFamily: dateTimeLocationFont,
                            }}
                          >
                            <Calendar
                              className='w-5 h-5'
                              style={{ color: textColour || 'blue' }}
                            />
                            {/* {console.log({ startDate, startTime })} */}
                            <span>
                              {startDate &&
                                format(
                                  new Date(startDate),
                                  'MMMM d, yyyy'
                                )}{' '}
                              {startTime &&
                                startTime &&
                                `| ${convertTime(startTime)}`}{' '}
                              {endDate &&
                                endDate &&
                                `to ${format(
                                  new Date(endDate),
                                  'MMMM d, yyyy'
                                )}`}{' '}
                              {endTime &&
                                endTime &&
                                `| ${convertTime(endTime)}`}{' '}
                              {timeZone && `| ${timeZone}`}
                            </span>
                          </div>
                          {isAddToCalendar && (
                            <a
                              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                                title
                              )}&dates=${combineDateTime(
                                startDate,
                                startTime
                              )}/${combineDateTime(
                                endDate,
                                endTime
                              )}&details=${encodeURIComponent(
                                inviteDetails || ''
                              )}&location=${encodeURIComponent(
                                locationName
                              )}&timezone=${timeZone}`}
                              target='_blank'
                              className='text-blue-500 text-base'
                              style={{
                                fontFamily: dateTimeLocationFont,
                              }}
                            >
                              Add to Calendar
                            </a>
                          )}
                        </div>
                      )}

                    {(address || locationName) &&
                      locationType === 'in-person' && (
                        <div className='space-y-1'>
                          <div
                            className='flex sm:flex-row flex-col items-center justify-center gap-2 text-lg text-gray-700 font-semibold'
                            style={{
                              color: textColour,
                              fontFamily: dateTimeLocationFont,
                            }}
                          >
                            <MapPin
                              className='w-5 h-5'
                              style={{ color: textColour || 'blue' }}
                            />
                            <span>
                              {locationName && `${locationName}, `}
                              {address}
                            </span>
                          </div>
                          {showGoogleMap && (
                            <a
                              href={`https://www.google.com/maps?q=${latLng?.lat},${latLng?.lng}`}
                              className='text-blue-500 text-base'
                              style={{
                                fontFamily: dateTimeLocationFont,
                              }}
                              target='_blank'
                            >
                              View Map
                            </a>
                          )}
                        </div>
                      )}

                    {(virtualPlatformName || virtualUrl) &&
                      locationType === 'virtual' && (
                        <div className='space-y-1'>
                          <div
                            className='flex items-center justify-center gap-2 text-lg text-gray-700 font-semibold'
                            style={{
                              color: textColour,
                              fontFamily: dateTimeLocationFont,
                            }}
                          >
                            <Plane className='w-5 h-5 text-blue-600' />
                            <span>{virtualPlatformName}</span>
                          </div>
                          {virtualUrl && (
                            <a
                              target='_blank'
                              href={virtualUrl}
                              className='text-blue-500 text-base'
                              style={{
                                fontFamily: dateTimeLocationFont,
                              }}
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
            <p
              className='text-xl text-gray-500 text-center'
              style={{
                color: textColour,
                fontFamily: descriptionFont,
              }}
            >
              Hosted By: {hostedBy}
            </p>
          )}

          <div className='text-center'>
            {isRsvpDueDateSet && rsvpDueDate && (
              <>
                <Border />
                <p
                  className='text-sm text-gray-500 pt-4'
                  style={{
                    color: textColour,
                    fontFamily: descriptionFont,
                  }}
                >
                  RSVP by {format(new Date(rsvpDueDate), 'MMMM d, yyyy')}
                </p>
              </>
            )}
            {requestRsvps && (
              <Button
                className={cn(
                  'max-w-[172px] w-full py-2 mt-2',
                  buttonFormat === 'rounded' && 'rounded-full'
                )}
                style={{
                  backgroundColor: buttonColour,
                  fontFamily: buttonFont,
                  // color: textColour || 'white',
                }}
                onClick={() => setOpenRSVP(true)}
              >
                {buttonText || 'RSVP Now'}
              </Button>
            )}
            <RSVPSheet
              reaction={reaction}
              rsvp={rsvp}
              email={email}
              name={name}
              id={id}
            />
          </div>

          {/* Gift Section */}
          {registry &&
            registry.map((item: any, index: number) => (
              <div
                className='p-4 bg-gray-50 shadow-sm text-center space-y-4'
                key={index}
              >
                <img src='/gift.svg' alt='Gift' className='mx-auto h-10' />
                <h2
                  className='text-xl font-bold'
                  style={{
                    color: textColour,
                    fontFamily: descriptionFont,
                  }}
                >
                  {item.title}
                </h2>
                <div
                  className='text-sm text-gray-500'
                  style={{
                    fontFamily: descriptionFont,
                    color: textColour,
                  }}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
                {item.url && (
                  <Button
                    href={item.url}
                    target='_blank'
                    style={{
                      fontFamily: buttonFont,
                    }}
                    variant='outline'
                    className={cn(
                      'max-w-[172px] w-full py-2 mt-2 border rounded-lg text-blue-600 border-blue-600 hover:bg-blue-100',
                      buttonFormat === 'rounded' && 'rounded-full'
                    )}
                  >
                    {item.buttonText || 'Shop Gifts'}
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
                  style={{
                    fontFamily: buttonFont,
                    color: textColour,
                  }}
                >
                  <Car className='w-6 h-6 text-blue-600' />
                  <span
                    className='text-sm text-gray-700'
                    style={{ color: textColour }}
                  >
                    {travelSource}
                  </span>
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
                          style={{
                            fontFamily: descriptionFont,
                          }}
                        >
                          <div className='flex sm:flex-row flex-col items-center justify-center gap-1 text-center'>
                            <Hotel className='w-6 h-6 text-blue-600' />
                            <span
                              className='text-sm text-gray-700'
                              style={{ color: textColour }}
                            >
                              {item.accommodationName}, {item.location}
                            </span>
                          </div>

                          <div
                            className='text-sm text-gray-700'
                            style={{ color: textColour }}
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
