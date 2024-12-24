/* eslint-disable react/prop-types */

import api from '@/utils/axiosInstance';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const UserContext = createContext<any>({});

export function useAppContext() {
  return useContext(UserContext);
}

const ContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [userRefetch, setUserRefetch] = useState(false);

  const [usersRefetch, setUsersRefetch] = useState(false);
  const [openEmailPreview, setOpenEmailPreview] = useState(false);

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

  useEffect(() => {
    const getProfile = async () => {
      setIsLoading(true);

      try {
        const promise = await api.get(`/user/profile`);

        setUser(promise.data.data);
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        setIsLoading(false);
        if (error.response.data.message === 'Invalid Token!') {
          localStorage.removeItem('rmToken');
        }
      }
    };

    getProfile();
  }, [userRefetch]);

  console.log({ user });
  const logout = () => {
    window.localStorage.removeItem('rmToken');
    setUser({});
  };

  const handleResendOTP = async (data: any) => {
    try {
      const promise = await api.post(`/auth/forgot-password`, data);
      if (promise.status === 200) {
        setUserRefetch(!userRefetch);
        toast.success(`OTP sent to your email.`, {
          position: 'top-center',
        });
      }
    } catch (error: any) {
      console.log(error);
      return toast.error(error.response.data.message || `Failed`);
    }
  };

  const authInfo = {
    isLoading,
    userRefetch,
    setUserRefetch,
    setIsLoading,
    user,
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
  };

  return (
    <UserContext.Provider value={authInfo}>{children}</UserContext.Provider>
  );
};

export default ContextProvider;
