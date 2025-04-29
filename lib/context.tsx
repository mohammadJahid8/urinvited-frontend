/* eslint-disable react/prop-types */

import api from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  redirect,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const UserContext = createContext<any>({});

export function useAppContext() {
  return useContext(UserContext);
}

const ContextProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [input, setInput] = useState("email");
  const [openEmailPreview, setOpenEmailPreview] = useState(false);
  const [openRSVP, setOpenRSVP] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsId = searchParams.get("id");
  const { id: urlId } = useParams();
  const id = paramsId || urlId;
  const queryString = searchParams.toString();
  const querySuffix = queryString ? `?${queryString}` : "";

  const [guests, setGuests] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    title: "",
    state: "",
    zip: "",
    smsAlerts: false,
    summary: "",
    workExperience: "",
    education: "",
    skills: "",
  });

  const {
    isLoading,
    refetch: refetchUser,
    data: user,
  } = useQuery({
    queryKey: [`user`],
    queryFn: async () => {
      try {
        const response = await api.get(`/user/profile`);
        return response?.data?.data;
      } catch (error: any) {
        console.log(error);
        if (error.response.data.message === "Invalid Token!") {
          localStorage.removeItem("rmToken");
        }
      }
    },

    refetchOnWindowFocus: false,
  });

  const {
    isLoading: isEventsLoading,
    refetch: refetchEvents,
    data: events,
  } = useQuery({
    queryKey: [`events`, user?.email],
    queryFn: async () => {
      const response = await api.get(`/event`);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
  });

  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
    to: user?.email,
  });
  // const { isLoading: isGoogleFontsLoading, data: googleFonts } = useQuery({
  //   queryKey: [`googleFonts`],
  //   queryFn: async () => {
  //     const response = await axios.get(
  //       `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY} `
  //     );
  //     return response?.data?.items;
  //   },
  //   staleTime: 1000 * 60 * 60 * 24,
  // });

  // console.log('googleFonts', googleFonts);

  const {
    isLoading: isEventLoading,
    refetch: refetchEvent,
    data: event,
  } = useQuery({
    queryKey: [`event`, id],
    queryFn: async () => {
      if (id) {
        const response = await api.get(`/event/${id}`);
        return response?.data?.data;
      }
    },
  });

  const { refetch: refetchShare, data: share } = useQuery({
    queryKey: [`share`, id],
    queryFn: async () => {
      if (id) {
        const response = await api.get(`/share/${id}`);
        return response?.data?.data;
      }
    },
  });

  const hasMaximumCapacity =
    event?.eventDetails?.isMaximumCapacitySet &&
    event?.eventDetails?.maximumCapacity;

  const allowAdditionalAttendees =
    event?.eventDetails?.allowAdditionalAttendees;
  const additionalAttendees = event?.eventDetails?.additionalAttendees || 1;

  const maximumCapacity = Number(event?.eventDetails?.maximumCapacity);

  if (isLoading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const publicRoutes = [
    "/login",
    "/signup",
    "/event",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  if (
    !user?.email &&
    !publicRoutes.includes(pathname) &&
    !pathname.startsWith("/event/")
  ) {
    return redirect(`/login${querySuffix}`);
  }

  const logout = () => {
    window.localStorage.removeItem("rmToken");
    refetchUser();
    window.location.href = "/login";
  };

  const handleResendOTP = async (data: any) => {
    try {
      const promise = await api.post(`/auth/forgot-password`, data);
      if (promise.status === 200) {
        refetchUser();
        toast.success(`OTP sent to your email.`, {
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.log(error);
      return toast.error(error.response.data.message || `Failed`);
    }
  };

  const downloadFile = async (file: any, name: any) => {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to release memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const calculateConfirmedGuests = (guests: any) =>
    guests.reduce(
      (total: any, guest: any) =>
        guest.isConfirmed
          ? total + 1 + (guest?.extraGuests?.length || 0)
          : total,
      0
    );

  const totalGuestAdded = calculateConfirmedGuests(guests);

  const authInfo = {
    totalGuestAdded,
    isLoading,
    user,
    refetchUser,
    loading,
    setLoading,
    logout,
    formData,
    setFormData,
    openFeedback,
    setOpenFeedback,
    openEmailPreview,
    setOpenEmailPreview,
    handleResendOTP,
    events,
    isEventsLoading,
    refetchEvents,
    openRSVP,
    setOpenRSVP,
    event,
    isEventLoading,
    refetchEvent,
    downloadFile,
    guests,
    setGuests,
    emailData,
    setEmailData,
    share,
    refetchShare,
    // googleFonts,
    maximumCapacity,
    hasMaximumCapacity,
    allowAdditionalAttendees,
    additionalAttendees,
    id,
    input,
    setInput,
  };

  return (
    <UserContext.Provider value={authInfo}>{children}</UserContext.Provider>
  );
};

export default ContextProvider;
