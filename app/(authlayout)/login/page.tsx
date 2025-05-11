"use client";

import * as z from "zod";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import Auth from "@/components/auth/auth";
import AuthForm from "@/components/auth/auth-form";
import api from "@/utils/axiosInstance";
import { useAppContext } from "@/lib/context";
import { useRouter, useSearchParams } from "next/navigation";
const loginFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email...",
    validation: z
      .string()
      .min(1, { message: "Email has to be filled." })
      .email({ message: "Enter a valid email address" }),
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password...",
    validation: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  },
];

export default function Login() {
  const router = useRouter();
  const { refetchUser, handleUploadVideo } = useAppContext();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const querySuffix = queryString ? `?${queryString}` : "";
  const video = searchParams.get("video");
  console.log({ video });

  const handleSubmit = async (data: any) => {
    try {
      const promise = await api.post(`/auth/login`, data);
      if (promise.status === 200) {
        const accessToken = promise.data.data.accessToken;
        const role = promise.data.data.role;
        window.localStorage.setItem("rmToken", accessToken);
        refetchUser();
        toast.success(`Logged in`, {
          position: "top-center",
        });

        if (video) {
          const decoded = jwtDecode(accessToken);

          return await handleUploadVideo(video, decoded);
        }

        if (querySuffix) {
          return router.push(`/video-preview${querySuffix}`);
        }

        if (role === "admin") {
          return router.push("/manage-events");
        } else {
          return router.push("/events");
        }
      }
    } catch (error: any) {
      console.log(error);

      return toast.error(error.response.data.message || `Log in failed`, {
        position: "top-center",
      });
    }
  };

  return (
    <Auth title={"Login"} subtitle={" "} type="login" querySuffix={querySuffix}>
      <AuthForm
        inputFields={loginFields}
        onSubmit={handleSubmit}
        submitButtonText="Login"
      />
    </Auth>
  );
}
