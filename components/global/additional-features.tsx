'use client';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EventAccordion } from './event-accordion';
import BottomButtons from './bottom-buttons';
import useStore from '@/app/store/useStore';
import { useCallback, useEffect, useState } from 'react';
import GiftRegistryForm from './gift-registry-form';
import CustomInputForm from './custom-input-form';
import AccommodationForm from './accommodation-form';
import TravelForm from './travel-form';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import api from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import LoadingOverlay from './loading-overlay';

const AdditionalFeatures = () => {
  const { updateFormData, formData } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refetchEvents, user, event, isEventLoading, refetchEvent } =
    useAppContext();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const additionalFeatures = event?.additionalFeatures;

  const schemaFields: Record<string, z.ZodTypeAny> = {
    registry: z.array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        url: z.string().url().optional(),
      })
    ),
    accommodation: z.array(
      z.object({
        accommodationName: z.string().optional(),
        location: z.string().optional(),
        note: z.string().optional(),
      })
    ),
    // customFields: z.array(
    //   z.object({
    //     title: z.string().optional(),
    //     description: z.string().optional(),
    //     buttonText: z.string().optional(),
    //     buttonUrl: z.string().url().optional(),
    //     date: z.any().optional(),
    //     time: z.any().optional(),
    //   })
    // ),
    travelSource: z.string().optional(),
    travelSourceLink: z.string().url().optional(),
  };

  const formSchema = z.object(schemaFields);

  const defaultValues = {
    registry:
      additionalFeatures?.registry?.length > 0
        ? additionalFeatures?.registry
        : [
            {
              title: '',
              description: '',
              url: '',
            },
          ],
    // customFields:
    //   additionalFeatures?.customFields?.length > 0
    //     ? additionalFeatures?.customFields
    //     : [
    //         {
    //           title: '',
    //           description: '',
    //           buttonText: '',
    //           buttonUrl: '',
    //           date: '',
    //           time: '',
    //         },
    //       ],
    accommodation:
      additionalFeatures?.accommodation?.length > 0
        ? additionalFeatures?.accommodation
        : [
            {
              accommodationName: '',
              location: '',
              note: '',
            },
          ],
    travelSource: additionalFeatures?.travelSource || '',
    travelSourceLink: additionalFeatures?.travelSourceLink || '',
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

  // const customField = [
  //   {
  //     trigger: 'Custom Field',
  //     content: (
  //       <CustomInputForm
  //         form={form}
  //         fields={customFields}
  //         append={appendCustomFields}
  //         remove={removeCustomFields}
  //       />
  //     ),
  //   },
  // ];

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
        additionalFeatures: data,
      });
    },
    [updateFormData, formData]
  );

  console.log('form.formState.isDirty', form.formState.isDirty);

  const handleSubmit = async (data: any) => {
    const path = user?.role === 'admin' ? '/manage-events' : '/share';

    if (!form.formState.isDirty) {
      return router.push(path);
    }

    if (user?.role === 'admin') {
      const isUserConfirmed = window.confirm(
        'Are you sure? User will be notified.'
      );
      if (!isUserConfirmed) {
        return;
      }
    }

    setIsSubmitting(true);

    const payload: any = {
      additionalFeatures: data,
    };

    if (id) {
      payload.eventId = id;
    }

    try {
      const promise = await api.patch(`/event/create`, payload);
      if (promise?.status === 200) {
        console.log('promise', promise.data.data);
        const isUserNotified = promise?.data?.data?.isUserNotified;
        const isAdmin = user?.role === 'admin';
        if (!isUserNotified && isAdmin) {
          await api.post(`/event/send-invite`, {
            eventId: id,
            previewLink: `${window.location.origin}/video-preview?id=${id}`,
          });
        }
        toast.success(`Event additional features updated`, {
          position: 'top-center',
        });
        refetchEvents();
        refetchEvent();
        router.push(path);
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error(error);

      return toast.error(
        error?.response?.data?.message ||
          `Event additional features failed to update`,
        {
          position: 'top-center',
        }
      );
    }
  };

  useEffect(() => {
    if (
      additionalFeatures?.registry?.length > 0 ||
      additionalFeatures?.accommodation?.length > 0 ||
      additionalFeatures?.travelSource ||
      additionalFeatures?.travelSourceLink
    ) {
      form.reset(additionalFeatures);
    }
  }, [additionalFeatures, form.reset]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log({ value });
      onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  if (isEventLoading) return <div>Loading...</div>;

  return (
    <Form {...form}>
      {isSubmitting && <LoadingOverlay />}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='flex flex-col gap-6'>
          <EventAccordion items={giftRegistry} />
          {/* <EventAccordion items={customField} /> */}
          <EventAccordion items={accommodation} />
          <EventAccordion items={travel} />
          <BottomButtons />
        </div>
      </form>
    </Form>
  );
};

export default AdditionalFeatures;
