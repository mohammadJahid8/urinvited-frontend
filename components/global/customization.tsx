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

const Customization = () => {
  const { updateFormData, formData } = useStore();
  console.log({ formData });

  const schemaFields: Record<string, z.ZodTypeAny> = {
    isEventLogoEnabled: z.boolean().optional(),
    eventLogo: z.any().optional(),
    isThemeBackgroundImageEnabled: z.boolean().optional(),
    themeBackgroundImage: z.any().optional(),
    isFooterBackgroundImageEnabled: z.boolean().optional(),
    footerBackgroundImage: z.any().optional(),
    isThumbnailImageEnabled: z.boolean().optional(),
    thumbnailImage: z.any().optional(),
    textColour: z.string().optional(),
    headingFont: z.string().optional(),
    dateTimeLocationFont: z.string().optional(),
    descriptionFont: z.string().optional(),
    buttonFont: z.string().optional(),
    buttonText: z.string().optional(),
    buttonColour: z.string().optional(),
    buttonFormat: z.enum(['rectangular', 'rounded']).optional(),
    isAddToCalendar: z.boolean().optional(),
    reactToEvent: z.boolean().optional(),
    shareEvent: z.boolean().optional(),
    commentOnEvent: z.boolean().optional(),
  };

  const formSchema = z.object(schemaFields);

  const defaultValues = {
    isEventLogoEnabled: true,
    eventLogo: null,
    isThemeBackgroundImageEnabled: true,
    themeBackgroundImage: null,
    isFooterBackgroundImageEnabled: true,
    footerBackgroundImage: null,
    isThumbnailImageEnabled: true,
    thumbnailImage: null,
    textColour: '#000000',
    headingFont: 'Lato',
    dateTimeLocationFont: 'Lato',
    descriptionFont: 'Lato',
    buttonFont: 'Lato',
    buttonText: 'RSVP',
    buttonColour: '#000000',
    buttonFormat: 'rectangular',
    isAddToCalendar: true,
    reactToEvent: true,
    shareEvent: true,
    commentOnEvent: true,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: 'events',
  // });

  const addImages = [
    {
      trigger: 'Add Images',
      content: <AddImages form={form} />,
    },
  ];

  const detailsCustomization = [
    {
      trigger: 'Details Customization',
      content: <DetailsCustomizationForm form={form} />,
    },
  ];

  const buttonCustomization = [
    {
      trigger: 'Button Customization',
      content: <ButtonCustomizationForm form={form} />,
    },
  ];
  const guestEngagement = [
    {
      trigger: 'Guest Engagement',
      content: <GuestEngagementForm form={form} />,
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
          <EventAccordion items={addImages} />
          <EventAccordion items={detailsCustomization} />
          <EventAccordion items={buttonCustomization} />
          <EventAccordion items={guestEngagement} />
          <BottomButtons />
        </div>
      </form>
    </Form>
  );
};

export default Customization;
