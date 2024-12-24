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
import AddImages from './add-images';
import DetailsCustomizationForm from './details-customization-form';
import ButtonCustomizationForm from './button-customization-form';
import GuestEngagementForm from './guest-engagement';
import GiftRegistryForm from './gift-registry-form';
import CustomInputForm from './custom-input-form';
import AccommodationForm from './accommodation-form';
import TravelForm from './travel-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AdditionalFeatures = () => {
  const { updateFormData, formData } = useStore();
  console.log({ formData });
  const router = useRouter();

  const schemaFields: Record<string, z.ZodTypeAny> = {
    registry: z.array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        url: z.string().optional(),
      })
    ),
    customFields: z.array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        buttonText: z.string().optional(),
        buttonUrl: z.string().optional(),
        date: z.any().optional(),
        time: z.any().optional(),
      })
    ),
    travelSource: z.string().optional(),
    link: z.string().optional(),
  };

  const formSchema = z.object(schemaFields);

  const defaultValues = {
    registry: [
      {
        title: '',
        description: '',
        url: '',
      },
    ],
    customFields: [
      {
        title: '',
        description: '',
        buttonText: '',
        buttonUrl: '',
        date: '',
        time: '',
      },
    ],
    accommodation: [
      {
        accommodationName: '',
        location: '',
        note: '',
      },
    ],
    travelSource: '',
    link: '',
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    fields: customFields,
    append: appendCustomFields,
    remove: removeCustomFields,
  } = useFieldArray({
    control: form.control,
    name: 'customFields',
  });
  const {
    fields: accommodationFields,
    append: appendAccommodationFields,
    remove: removeAccommodationFields,
  } = useFieldArray({
    control: form.control,
    name: 'accommodation',
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'registry',
  });

  const giftRegistry = [
    {
      trigger: 'Gift Registry',
      content: (
        <GiftRegistryForm
          form={form}
          fields={fields}
          append={append}
          remove={remove}
        />
      ),
    },
  ];

  const customField = [
    {
      trigger: 'Custom Field',
      content: (
        <CustomInputForm
          form={form}
          fields={customFields}
          append={appendCustomFields}
          remove={removeCustomFields}
        />
      ),
    },
  ];

  const accommodation = [
    {
      trigger: 'Accommodation',
      content: (
        <AccommodationForm
          form={form}
          fields={accommodationFields}
          append={appendAccommodationFields}
          remove={removeAccommodationFields}
        />
      ),
    },
  ];
  const travel = [
    {
      trigger: 'Travel',
      content: <TravelForm form={form} />,
    },
  ];
  const onChange = useCallback(
    (data: any) => {
      updateFormData({
        ...formData,
        customization: data,
      });
    },
    [updateFormData, formData]
  );

  const handleSubmit = (data: any) => {
    toast.success('Invite saved successfully', {
      position: 'top-center',
    });
    router.push('/share');
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
          <EventAccordion items={giftRegistry} />
          <EventAccordion items={customField} />
          <EventAccordion items={accommodation} />
          <EventAccordion items={travel} />
          <BottomButtons />
        </div>
      </form>
    </Form>
  );
};

export default AdditionalFeatures;
