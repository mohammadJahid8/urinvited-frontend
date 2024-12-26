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

const EventDetails = () => {
  const { updateFormData, formData } = useStore();
  const [hasEndDate, setHasEndDate] = useState(false);
  console.log({ formData });

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
            ctx.addIssue({
              code: 'custom',
              path: ['inviteDetails'],
              message: 'Invite details is required',
            });
          }

          if (data.locationType === 'in-person') {
            if (!data.locationName) {
              ctx.addIssue({
                code: 'custom',
                path: ['locationName'],
                message: 'Location name is required',
              });
            }
            if (!data.address) {
              ctx.addIssue({
                code: 'custom',
                path: ['address'],
                message: 'Address is required',
              });
            }

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
    // requestRsvps: z.boolean().optional(),
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
    hostedBy: '',
    events: [
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
      },
    ],
    // requestRsvps: true,
    isRsvpDueDateSet: true,
    rsvpDueDate: undefined,
    allowRsvpAfterDueDate: true,
    // autoReminder: false,
    // guest management
    allowAdditionalAttendees: true,
    additionalAttendees: '1',
    isMaximumCapacitySet: true,
    maximumCapacity: '1',
    // trackAttendees: true,
    // sendReminderToAttendees: true,
    // attendingReminderDate: undefined,
    // allowUpdateRsvpAfterSubmission: true,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'events',
  });

  const eventDetails = [
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

  const handleSubmit = async (data: any) => {
    // console.log({ data });
    data.userEmail = 'mohammadjahid0007@gmail.com';
    try {
      const promise = await api.patch(`/event/create`, data);
      if (promise?.status === 200) {
        toast.success(`Event details updated`, {
          position: 'top-center',
        });
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

  // console.log('form.watch', form.watch('events'));

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log({ value });
      onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex flex-col gap-6'>
          <EventAccordion items={eventDetails} />
          <EventAccordion items={rsvps} />
          <EventAccordion items={guestManagement} />
          <BottomButtons />
        </div>
      </form>
    </Form>
  );
};

export default EventDetails;
