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

const EventDetails = () => {
  const { updateFormData, formData } = useStore();
  console.log({ formData });

  const schemaFields: Record<string, z.ZodTypeAny> = {
    // event details
    hostedBy: z.string().optional(),
    events: z.array(
      z
        .object({
          title: z.string().min(1, { message: 'Title is required' }),
          startDate: z.any().optional(),
          startTime: z.any().optional(),
          timeZone: z.any().optional(),
          endDate: z.any().optional(),
          endTime: z.any().optional(),
          locationName: z.string().optional(),
          address: z.string().optional(),
          showGoogleMap: z.boolean().optional(),
          virtualPlatformName: z.string().optional(),
          virtualUrl: z.string().optional(),
          when: z.enum(['startDateTime', 'toBeDetermined']),
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
          }
        })
    ),
    // rsvps
    requestRsvps: z.boolean().optional(),
    isRsvpDueDateSet: z.boolean().optional(),
    rsvpDueDate: z.any().optional(),
    allowRsvpAfterDueDate: z.boolean().optional(),
    isAutoReminderSet: z.boolean().optional(),
    autoReminder: z.boolean().optional(),
    // guest management
    allowAdditionalAttendees: z.boolean().optional(),
    additionalAttendees: z.number().optional(),

    isMaximumCapacitySet: z.boolean().optional(),
    maximumCapacity: z.number().optional(),

    trackAttendees: z.boolean().optional(),

    sendReminderToAttendees: z.boolean().optional(),
    attendingReminderDate: z.any().optional(),

    allowUpdateRsvpAfterSubmission: z.boolean().optional(),
  };

  const formSchema = z.object(schemaFields);

  const defaultValues = {
    hostedBy: '',
    events: [
      {
        title: '',
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
    requestRsvps: true,
    isRsvpDueDateSet: true,
    rsvpDueDate: undefined,
    allowRsvpAfterDueDate: true,
    autoReminder: false,
    // guest management
    allowAdditionalAttendees: true,
    additionalAttendees: 1,
    isMaximumCapacitySet: true,
    maximumCapacity: 1,
    trackAttendees: true,
    sendReminderToAttendees: true,
    attendingReminderDate: undefined,
    allowUpdateRsvpAfterSubmission: true,
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

  const handleSubmit = (data: any) => {
    console.log({ data });
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
