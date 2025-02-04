'use client';

import * as z from 'zod';

import { toast } from 'sonner';
import Auth from '@/components/auth/auth';
import AuthForm from '@/components/auth/auth-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import api from '@/utils/axiosInstance';
const registerFields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter your name...',
    validation: z.string().min(1, { message: 'Name has to be filled.' }),
  },

  {
    name: 'phone',
    label: 'Phone number',
    type: 'number',
    placeholder: 'Enter Phone number...',
    validation: z.string().optional(),
  },
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
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password...',
    validation: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Enter confirm password...',
    validation: z.string().min(6, {
      message: 'Confirm Password must be at least 6 characters long',
    }),
  },
];

export default function Signup() {
  const router = useRouter();
  const { refetchUser } = useAppContext();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const querySuffix = queryString ? `?${queryString}` : '';

  const handleSubmit = async (data: any) => {
    try {
      const promise = await api.post(`/user/signup`, data);
      if (promise?.status === 200) {
        window.localStorage.setItem('rmToken', promise?.data?.data ?? '');
        refetchUser();
        setTimeout(() => {
          toast.success(`Signed up`, {
            position: 'top-center',
          });
          router.push(`/login${querySuffix}`);
        }, 1000);
      }
    } catch (error: any) {
      console.error(error);

      return toast.error(error?.response?.data?.message || `Sign up failed`, {
        position: 'top-center',
      });
    }
  };

  return (
    <Auth
      title={'Signup'}
      subtitle={' '}
      type='signup'
      querySuffix={querySuffix}
    >
      <AuthForm
        inputFields={registerFields}
        onSubmit={handleSubmit}
        submitButtonText='Signup'
      />
    </Auth>
  );
}
