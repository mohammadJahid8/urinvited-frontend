"use client";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DetailsForm from "./details-form";
import { EventAccordion } from "./event-accordion";
import BottomButtons from "./bottom-buttons";
import useStore from "@/app/store/useStore";
import { useCallback, useEffect, useState } from "react";
import RsvpForm from "./rsvp-form";
import GuestManagementForm from "./guest-management-form";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/context";
import LoadingOverlay from "./loading-overlay";

const EventDetails = () => {
  const { updateFormData, formData } = useStore();
  const [hasEndDate, setHasEndDate] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
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
    hostedBy: z.string().min(1, { message: "Hosted by is required" }),
    events: z
      .array(
        z.object({
          title: z.any().optional(),
          startDate: z
            .any()
            .optional()
            .transform((date) => {
              if (!date) return undefined;
              const parsedDate = new Date(date);
              if (isNaN(parsedDate.getTime())) {
                throw new Error("Invalid start date format");
              }
              console.log("parsedDate", parsedDate.toISOString());
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
                throw new Error("Invalid start date format");
              }
              return parsedDate.toISOString();
            }),
          endTime: z.any().optional(),
          locationName: z.string().optional(),
          address: z.string().optional(),
          showGoogleMap: z.boolean().optional(),
          virtualPlatformName: z.string().optional(),
          virtualUrl: z.string().optional(),
          when: z.enum(["startDateTime", "tbd"]),
          locationType: z.enum(["in-person", "virtual"]),
          latLng: z.any().optional(),
        })
      )
      .superRefine((events, ctx) => {
        events.forEach((event, index) => {
          if (index === 0 && !event.title) {
            ctx.addIssue({
              code: "custom",
              path: [index, "title"],
              message: "Title is required",
            });
          }

          if (event.inviteDetails) {
            // console.log("inside inviteDetails", event.inviteDetails);
            if (
              (typeof event.inviteDetails === "string" &&
                !event.inviteDetails.trim()) ||
              event.inviteDetails === "<p><br></p>" ||
              event.inviteDetails === true ||
              event.inviteDetails === false
            ) {
              // console.log("inside inviteDetails.trim");
              ctx.addIssue({
                code: "custom",
                path: [index, "inviteDetails"],
                message: "Invite details are required",
              });
            }
          } else {
            // console.log("inside else", event.inviteDetails);
            delete event.inviteDetails;
          }
          if (index === 0 && event.when === "startDateTime") {
            if (!event.startDate) {
              ctx.addIssue({
                code: "custom",
                path: [index, "startDate"],
                message: "Start date is required",
              });
            }
            // if (!event.startTime) {
            //   ctx.addIssue({
            //     code: 'custom',
            //     path: [index, 'startTime'],
            //     message: 'Start time is required',
            //   });
            // }
            if (!event.timeZone) {
              ctx.addIssue({
                code: "custom",
                path: [index, "timeZone"],
                message: "Time zone is required",
              });
            }
          }

          if (event.locationType === "in-person") {
            if (index === 0 && !event.locationName) {
              // Require locationName only for the first event
              ctx.addIssue({
                code: "custom",
                path: [index, "locationName"],
                message: "Location name is required for the first event",
              });
            }
            delete event.virtualPlatformName;
            delete event.virtualUrl;
          }

          if (event.locationType === "virtual") {
            if (index === 0 && !event.virtualPlatformName) {
              ctx.addIssue({
                code: "custom",
                path: [index, "virtualPlatformName"],
                message: "Virtual platform name is required",
              });
            }
            if (index === 0 && !event.virtualUrl) {
              ctx.addIssue({
                code: "custom",
                path: [index, "virtualUrl"],
                message: "Virtual URL is required",
              });
            }

            delete event.locationName;
            delete event.address;
          }
        });
      }),

    // rsvps
    requestRsvps: z.boolean().optional(),
    isRsvpDueDateSet: z.boolean().optional(),
    isAutoReminderSet: z.boolean().optional(),
    rsvpDueDate: z
      .any()
      .optional()
      .transform((date) => {
        if (!date) return undefined;
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid start date format");
        }
        return parsedDate.toISOString();
      }),
    allowRsvpAfterDueDate: z.boolean().optional(),
    autoReminderDate: z
      .any()
      .optional()
      .transform((date) => {
        if (!date) return undefined;
        return new Date(date).toISOString();
      }),

    // guest management
    allowAdditionalAttendees: z.boolean().optional(),
    additionalAttendees: z.string().optional(),
    isMaximumCapacitySet: z.boolean().optional(),
    maximumCapacity: z.string().optional(),
  };

  const formSchema = z.object(schemaFields).superRefine((data, ctx) => {
    if (data.isRsvpDueDateSet) {
      if (!data.rsvpDueDate) {
        ctx.addIssue({
          code: "custom",
          path: ["rsvpDueDate"],
          message: "RSVP due date is required!",
        });
      }
    }
    if (data.isAutoReminderSet) {
      if (!data.autoReminderDate) {
        ctx.addIssue({
          code: "custom",
          path: ["autoReminderDate"],
          message: "Auto reminder date is required!",
        });
      }
    }
    if (data.allowAdditionalAttendees) {
      if (!data.additionalAttendees || data.additionalAttendees.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["additionalAttendees"],
          message: "Number of additional attendees is required!",
        });
      }
    } else {
      delete data.additionalAttendees;
    }
    if (data.isMaximumCapacitySet) {
      if (!data.maximumCapacity || data.maximumCapacity.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["maximumCapacity"],
          message: "Maximum capacity is required!",
        });
      }
    }
  });

  const defaultValues = {
    hostedBy: event?.hostedBy || "",
    events:
      eventDetails?.length > 0
        ? eventDetails
        : [
            {
              title: "",
              inviteDetails: true,
              startDate: undefined,
              startTime: undefined,
              timeZone: "",
              endDate: undefined,
              endTime: undefined,
              locationName: "",
              address: "",
              showGoogleMap: false,
              virtualPlatformName: "",
              virtualUrl: "",
              when: "startDateTime",
              locationType: "in-person",
              latLng: undefined,
            },
          ],
    requestRsvps: event?.eventDetails?.requestRsvps || true,
    isRsvpDueDateSet: event?.eventDetails?.isRsvpDueDateSet || true,
    rsvpDueDate: event?.eventDetails?.rsvpDueDate || undefined,
    allowRsvpAfterDueDate: event?.eventDetails?.allowRsvpAfterDueDate || true,

    isAutoReminderSet: event?.eventDetails?.isAutoReminderSet || true,
    autoReminderDate: event?.eventDetails?.autoReminderDate || undefined,
    // guest management
    allowAdditionalAttendees:
      event?.eventDetails?.allowAdditionalAttendees || false,
    additionalAttendees: event?.eventDetails?.additionalAttendees || "",
    isMaximumCapacitySet: event?.eventDetails?.isMaximumCapacitySet || false,
    maximumCapacity: event?.eventDetails?.maximumCapacity || "",
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
    name: "events",
  });

  const eventDetailsComponent = [
    {
      trigger: "Event Details",
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
      trigger: "RSVPs",
      content: <RsvpForm form={form} fields={fields} />,
    },
  ];

  const guestManagement = [
    {
      trigger: "Guest Management",
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

  console.log("form.formState.isDirty", form.formState.isDirty);

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

    if (id && id !== "null") {
      payload.eventId = id;
    }

    try {
      const promise = await api.patch(`/event/create`, payload);
      if (promise?.status === 200) {
        toast.success(`Event details updated`, {
          position: "top-center",
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
          position: "top-center",
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
        <div className="flex flex-col gap-6">
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
