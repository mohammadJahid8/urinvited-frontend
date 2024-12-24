'use client';

import * as z from 'zod';
import { toast } from 'sonner';
import { useAppContext } from '@/lib/context';
import { useRouter, useSearchParams } from 'next/navigation';
import Auth from '@/components/auth/auth';
import AuthForm from '@/components/auth/auth-form';
import api from '@/utils/axiosInstance';
const loginFields = [
  {
    name: 'password',
    label: 'New Password',
    type: 'password',
    placeholder: 'Enter your password...',
    validation: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  },
];

export default function ResetPassword() {
  const router = useRouter();
  const { userRefetch, setUserRefetch } = useAppContext();

  const params = useSearchParams();
  const email = params.get('email');

  const handleSubmit = async (data: any) => {
    data.email = email;
    try {
      const promise = await api.post(`/auth/reset-password`, data);
      if (promise.status === 200) {
        setUserRefetch(!userRefetch);
        toast.success(
          `Password reset successful. Login with your new password`,
          {
            position: 'top-center',
          }
        );
        router.push('/login');
      }
    } catch (error: any) {
      console.log(error);

      return toast.error(
        error.response.data.message || `Reset password failed`
      );
    }
  };

  return (
    <Auth
      title={'Reset Password'}
      subtitle='Enter your new reset password'
      type='reset-password'
    >
      <AuthForm
        inputFields={loginFields}
        onSubmit={handleSubmit}
        submitButtonText='Submit'
      />
    </Auth>
  );
}
