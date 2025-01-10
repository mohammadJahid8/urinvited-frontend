/* eslint-disable react/prop-types */

import api from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const UserContext = createContext<any>({});

export function useAppContext() {
  return useContext(UserContext);
}

const ContextProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);

  const [openEmailPreview, setOpenEmailPreview] = useState(false);
  const [openRSVP, setOpenRSVP] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const queryString = searchParams.toString();
  const querySuffix = queryString ? `?${queryString}` : '';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    title: '',
    state: '',
    zip: '',
    smsAlerts: false,
    summary: '',
    workExperience: '',
    education: '',
    skills: '',
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
        if (error.response.data.message === 'Invalid Token!') {
          localStorage.removeItem('rmToken');
        }
      }
    },
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
  });

  const {
    isLoading: isEventLoading,
    refetch: refetchEvent,
    data: event,
  } = useQuery({
    queryKey: [`event`, id],
    queryFn: async () => {
      const response = await api.get(`/event/${id}`);
      return response?.data?.data;
    },
  });

  console.log('event', event);

  if (isLoading)
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        Loading...
      </div>
    );

  const publicRoutes = ['/login', '/signup', '/preview'];

  console.log('pathname', pathname);

  if (!user?.email && !publicRoutes.includes(pathname)) {
    return redirect(`/login${querySuffix}`);
  }

  // console.log({ user });
  const logout = () => {
    window.localStorage.removeItem('rmToken');
    refetchUser();
  };

  const handleResendOTP = async (data: any) => {
    try {
      const promise = await api.post(`/auth/forgot-password`, data);
      if (promise.status === 200) {
        refetchUser();
        toast.success(`OTP sent to your email.`, {
          position: 'top-center',
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
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to release memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const authInfo = {
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
  };

  return (
    <UserContext.Provider value={authInfo}>{children}</UserContext.Provider>
  );
};

export default ContextProvider;
