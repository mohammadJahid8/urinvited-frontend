'use client';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAppContext } from '@/lib/context';
import Auth from '@/components/auth/auth';
import AuthForm from '@/components/auth/auth-form';
import api from '@/utils/axiosInstance';
import { useRouter, useSearchParams } from 'next/navigation';
const loginFields = [
  {
    name: 'otp',
    label: 'Verification Code',
    type: 'otp',
    placeholder: 'Enter your OTP...',
    validation: z
      .string()
      .min(6, { message: 'OTP has to be 6 digits/characters.' }),
  },
];

export default function ForgotPassword() {
  const { refetchUser } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('qemail');

  const handleSubmit = async (data: any) => {
    try {
      const promise = await api.post(`/auth/verify-otp`, {
        otp: data.otp,
        email: email,
      });
      if (promise.status === 200) {
        refetchUser();
        toast.success(`OTP verified successfully.`, {
          position: 'top-center',
        });
        router.push(`/reset-password?email=${email}`);
      }
    } catch (error: any) {
      console.log(error);
      return toast.error(error.response.data.message || `Failed`, {
        position: 'top-center',
      });
    }
  };

  return (
    <Auth
      title={'Verify OTP'}
      subtitle='Enter your OTP below to verify your account'
      type='verify-otp'
    >
      <AuthForm
        inputFields={loginFields}
        onSubmit={handleSubmit}
        submitButtonText='Submit'
      />
    </Auth>
  );
}
