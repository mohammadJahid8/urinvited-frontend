'use client';
import * as z from 'zod';
import { toast } from 'sonner';
import { useAppContext } from '@/lib/context';
import Auth from '@/components/auth/auth';
import AuthForm from '@/components/auth/auth-form';
import api from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
const loginFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email...',
    validation: z
      .string()
      .min(1, { message: 'Email has to be filled.' })
      .email({ message: 'Enter a valid email address' }),
  },
];

export default function ForgotPassword() {
  const { refetchUser } = useAppContext();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const promise = await api.post(`/auth/forgot-password`, data);
      if (promise.status === 200) {
        refetchUser();
        toast.success(`Reset password link sent to your email.`, {
          position: 'top-center',
        });
        router.push(`/verify-otp?qemail=${data.email}`);
      }
    } catch (error: any) {
      console.log(error);
      return toast.error(error.response.data.message || `Failed`);
    }
  };

  return (
    <Auth
      title={'Forgot Password'}
      subtitle='Enter your email below to send reset password link'
      type='forgot-password'
    >
      <AuthForm
        inputFields={loginFields}
        onSubmit={handleSubmit}
        submitButtonText='Submit'
      />
    </Auth>
  );
}
