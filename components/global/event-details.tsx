'use client';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DetailsForm from './details-form';
import { EventAccordion } from './event-accordion';
import BottomButtons from './bottom-buttons';
import useStore from '@/app/store/useStore';
import { useCallback, useEffect, useState } from 'react';
import RsvpForm from './rsvp-form';
import GuestManagementForm from './guest-management-form';
import api from '@/utils/axiosInstance';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import LoadingOverlay from './loading-overlay';

const EventDetails = () => {
  const { updateFormData, formData } = useStore();
  const [hasEndDate, setHasEndDate] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { refetchEvents, event, isEventLoading, refetchEvent } =
    useAppContext();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>({
    lat: null,
    lng: null,
  });
  const eventDetails = event?.eventDetails?.events;

  const schemaFields: Record<string, z.ZodTypeAny> = {
    // event details
    hostedBy: z.string().min(1, { message: 'Hosted by is required' }),
    events: z.array(
      z
        .object({
          title: z.string().min(1, { message: 'Title is required' }),
          startDate: z
            .any()
            .optional()
            .transform((date) => {
              if (!date) return undefined;
              const parsedDate = new Date(date);
              if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid start date format');
              }
              return parsedDate.toISOString();
            }),
          inviteDetails: z.any().optional(),
          startTime: z.any().optional(),
          timeZone: z.any().optional(),
          endDate: z
            .any()
            .optional()
            .transform((date) => {
              if (!date) return undefined;
              const parsedDate = new Date(date);
              if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid start date format');
              }
              return parsedDate.toISOString();
            }),
          endTime: z.any().optional(),
          locationName: z.string().optional(),
          address: z.string().optional(),
          showGoogleMap: z.boolean().optional(),
          virtualPlatformName: z.string().optional(),
          virtualUrl: z.string().optional(),
          when: z.enum(['startDateTime', 'tbd']),
          locationType: z.enum(['in-person', 'virtual']),
          latLng: z.any().optional(),
        })
        .superRefine((data, ctx) => {
          // Conditional validation for startDate
          if (data.when === 'startDateTime') {
            if (!data.startDate) {
              ctx.addIssue({
                code: 'custom',
                path: ['startDate'],
                message: 'Start date is required',
              });
            }
            if (!data.startTime) {
              ctx.addIssue({
                code: 'custom',
                path: ['startTime'],
                message: 'Start time is required',
              });
            }
            if (!data.timeZone) {
              ctx.addIssue({
                code: 'custom',
                path: ['timeZone'],
                message: 'Time zone is required',
              });
            }
          } else {
            delete data.startDate;
            delete data.startTime;
            delete data.timeZone;

            delete data.endDate;
            delete data.endTime;
          }

          if (data.inviteDetails === true) {
            if (typeof data.inviteDetails !== 'string') {
              ctx.addIssue({
                code: 'custom',
                path: ['inviteDetails'],
                message: 'Invite details is required',
              });
            } else {
              delete data.inviteDetails;
            }
          } else {
            if (typeof data.inviteDetails !== 'string') {
              delete data.inviteDetails;
            }
          }

          if (data.locationType === 'in-person') {
            if (!data.locationName) {
              ctx.addIssue({
                code: 'custom',
                path: ['locationName'],
                message: 'Location name is required',
              });
            }
            // if (!data.address) {
            //   ctx.addIssue({
            //     code: 'custom',
            //     path: ['address'],
            //     message: 'Address is required',
            //   });
            // }

            delete data.virtualPlatformName;
            delete data.virtualUrl;
          }

          if (data.locationType === 'virtual') {
            if (!data.virtualPlatformName) {
              ctx.addIssue({
                code: 'custom',
                path: ['virtualPlatformName'],
                message: 'Virtual platform name is required',
              });
            }
            if (!data.virtualUrl) {
              ctx.addIssue({
                code: 'custom',
                path: ['virtualUrl'],
                message: 'Virtual URL is required',
              });
            }

            delete data.locationName;
            delete data.address;
          }
        })
    ),
    // rsvps
    requestRsvps: z.boolean().optional(),
    isRsvpDueDateSet: z.boolean().optional(),
    rsvpDueDate: z
      .any()
      .optional()
      .transform((date) => {
        if (!date) return undefined;
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid start date format');
        }
        return parsedDate.toISOString();
      }),
    allowRsvpAfterDueDate: z.boolean().optional(),
    // isAutoReminderSet: z.boolean().optional(),
    // autoReminder: z.boolean().optional(),

    // guest management
    allowAdditionalAttendees: z.boolean().optional(),
    additionalAttendees: z.string().optional(),

    isMaximumCapacitySet: z.boolean().optional(),
    maximumCapacity: z.string().optional(),

    // trackAttendees: z.boolean().optional(),

    // sendReminderToAttendees: z.boolean().optional(),
    // attendingReminderDate: z.any().optional(),

    // allowUpdateRsvpAfterSubmission: z.boolean().optional(),
  };

  const formSchema = z.object(schemaFields).superRefine((data, ctx) => {
    if (data.isRsvpDueDateSet) {
      if (!data.rsvpDueDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['rsvpDueDate'],
          message: 'RSVP due date is required!',
        });
      }
    }
    if (data.allowAdditionalAttendees) {
      if (!data.additionalAttendees || data.additionalAttendees.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['additionalAttendees'],
          message: 'Number of additional attendees is required!',
        });
      }
    } else {
      delete data.additionalAttendees;
    }
    if (data.isMaximumCapacitySet) {
      if (!data.maximumCapacity || data.maximumCapacity.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          path: ['maximumCapacity'],
          message: 'Maximum capacity is required!',
        });
      }
    }
  });

  const defaultValues = {
    hostedBy: event?.hostedBy || '',
    events:
      eventDetails?.length > 0
        ? eventDetails
        : [
            {
              title: '',
              inviteDetails: true,
              startDate: undefined,
              startTime: undefined,
              timeZone: '',
              endDate: undefined,
              endTime: undefined,
              locationName: '',
              address: '',
              showGoogleMap: false,
              virtualPlatformName: '',
              virtualUrl: '',
              when: 'startDateTime',
              locationType: 'in-person',
              latLng: undefined,
            },
          ],
    requestRsvps: event?.eventDetails?.requestRsvps || true,
    isRsvpDueDateSet: event?.eventDetails?.isRsvpDueDateSet || true,
    rsvpDueDate: event?.eventDetails?.rsvpDueDate || undefined,
    allowRsvpAfterDueDate: event?.eventDetails?.allowRsvpAfterDueDate || true,
    // autoReminder: false,
    // guest management
    allowAdditionalAttendees:
      event?.eventDetails?.allowAdditionalAttendees || false,
    additionalAttendees: event?.eventDetails?.additionalAttendees || '',
    isMaximumCapacitySet: event?.eventDetails?.isMaximumCapacitySet || false,
    maximumCapacity: event?.eventDetails?.maximumCapacity || '',
    // trackAttendees: true,
    // sendReminderToAttendees: true,
    // attendingReminderDate: undefined,
    // allowUpdateRsvpAfterSubmission: true,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (
      event &&
      event?.eventDetails &&
      event?.eventDetails?.events?.length > 0
    ) {
      form.reset({
        ...event,
        ...event?.eventDetails,
      });
    }
  }, [event, form.reset]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'events',
  });

  const eventDetailsComponent = [
    {
      trigger: 'Event Details',
      content: (
        <DetailsForm
          form={form}
          fields={fields}
          append={append}
          remove={remove}
          hasEndDate={hasEndDate}
          setHasEndDate={setHasEndDate}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      ),
    },
  ];

  const rsvps = [
    {
      trigger: 'RSVPs',
      content: <RsvpForm form={form} fields={fields} />,
    },
  ];

  const guestManagement = [
    {
      trigger: 'Guest Management',
      content: <GuestManagementForm form={form} />,
    },
  ];

  const onChange = useCallback(
    (data: any) => {
      updateFormData({
        ...formData,
        eventDetails: data,
      });
    },
    [updateFormData, formData]
  );

  console.log('form.formState.isDirty', form.formState.isDirty);

  const handleSubmit = async (data: any) => {
    if (!form.formState.isDirty) {
      return router.push(`/customization?id=${id}`);
    }
    setIsSubmitting(true);

    const { hostedBy, ...eventDetails } = data;

    const payload: any = {
      hostedBy,
      eventDetails,
    };

    if (id && id !== 'null') {
      payload.eventId = id;
    }

    try {
      const promise = await api.patch(`/event/create`, payload);
      if (promise?.status === 200) {
        toast.success(`Event details updated`, {
          position: 'top-center',
        });
        refetchEvents();
        refetchEvent();
        router.push(`/customization?id=${id || promise?.data?.data?._id}`);
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error(error);

      return toast.error(
        error?.response?.data?.message || `Event details failed`,
        {
          position: 'top-center',
        }
      );
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  if (isEventLoading && id) return <div>Loading...</div>;

  return (
    <Form {...form}>
      {isSubmitting && <LoadingOverlay />}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex flex-col gap-6'>
          <EventAccordion items={eventDetailsComponent} />
          <EventAccordion items={rsvps} />
          <EventAccordion items={guestManagement} />
          <BottomButtons />
        </div>
      </form>
    </Form>
  );
};

export default EventDetails;
