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
import api from '@/utils/axiosInstance';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import LoadingOverlay from './loading-overlay';
import { useQuery } from '@tanstack/react-query';

const Customization = () => {
  const { updateFormData, formData } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refetchEvents, refetchEvent, event, isEventLoading } =
    useAppContext();

  const customization = event?.customization;

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
    isEventLogoEnabled: customization?.isEventLogoEnabled || true,
    eventLogo: customization?.eventLogo || null,
    isThemeBackgroundImageEnabled:
      customization?.isThemeBackgroundImageEnabled || true,
    themeBackgroundImage: customization?.themeBackgroundImage || null,
    isFooterBackgroundImageEnabled:
      customization?.isFooterBackgroundImageEnabled || true,
    footerBackgroundImage: customization?.footerBackgroundImage || null,
    isThumbnailImageEnabled: customization?.isThumbnailImageEnabled || true,
    thumbnailImage: customization?.thumbnailImage || null,
    textColour: customization?.textColour || '#000000',
    headingFont: customization?.headingFont || 'Lato',
    dateTimeLocationFont: customization?.dateTimeLocationFont || 'Lato',
    descriptionFont: customization?.descriptionFont || 'Lato',
    buttonFont: customization?.buttonFont || 'Lato',
    buttonText: customization?.buttonText || 'RSVP',
    buttonColour: customization?.buttonColour || '#000000',
    buttonFormat: customization?.buttonFormat || 'rectangular',
    isAddToCalendar: customization?.isAddToCalendar || false,
    reactToEvent: customization?.reactToEvent || false,
    shareEvent: customization?.shareEvent || false,
    commentOnEvent: customization?.commentOnEvent || false,
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

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

  console.log('form.formState.isDirty', form.formState.isDirty);

  const handleSubmit = async (data: any) => {
    if (!form.formState.isDirty) {
      return router.push(`/additional-features?id=${id}`);
    }
    setIsSubmitting(true);

    const {
      eventLogo,
      themeBackgroundImage,
      footerBackgroundImage,
      thumbnailImage,
    } = data;

    const formData = new FormData();
    if (typeof eventLogo === 'object') {
      formData.append('eventLogo', eventLogo);
    }
    if (typeof themeBackgroundImage === 'object') {
      formData.append('themeBackgroundImage', themeBackgroundImage);
    }
    if (typeof footerBackgroundImage === 'object') {
      formData.append('footerBackgroundImage', footerBackgroundImage);
    }
    if (typeof thumbnailImage === 'object') {
      formData.append('thumbnailImage', thumbnailImage);
    }
    formData.append('data', JSON.stringify(data));

    console.log('formData', data);
    try {
      const promise = await api.patch(`/event/customization/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (promise?.status === 200) {
        toast.success(`Event customization updated`, {
          position: 'top-center',
        });
        refetchEvents();
        refetchEvent();
        router.push(`/additional-features?id=${id}`);
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error(error);

      return toast.error(
        error?.response?.data?.message || `Event customization failed`,
        {
          position: 'top-center',
        }
      );
    }
  };

  useEffect(() => {
    if (customization) {
      form.reset(customization);
    }
  }, [customization, form.reset]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      {isSubmitting && <LoadingOverlay />}
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
