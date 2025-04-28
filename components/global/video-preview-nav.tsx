"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, Smartphone, ChevronDown, ArrowLeft } from "lucide-react";
import { FeedbackSheet } from "./feedback-sheet";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { useAppContext } from "@/lib/context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";

export default function VideoPreviewNav() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState("Desktop");
  const {
    openFeedback,
    setOpenFeedback,
    event,
    isEventLoading,
    downloadFile,
    user,
  } = useAppContext();
  const isAdmin = user?.role === "admin";
  const videoData = event?.video?.videos[event?.video?.videos?.length - 1];

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const promise = await api.patch(`/video/approve`, {
        videoId: event?.video?._id,
      });
      if (promise.status === 200) {
        setIsLoading(false);
        toast.success(`Video approved successfully.`, {
          position: "top-center",
        });
        router.push(`/event-details?id=${event?._id}`);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      return toast.error(error.response.data.message || `Failed`);
    }
  };

  return (
    <header className="flex sm:flex-row flex-col sm:h-14 sm:py-0 py-3 gap-2 sm:gap-0 sm:items-center justify-between border-b bg-white px-4 shadow-sm">
      <p
        className="flex items-center gap-1 text-base font-semibold text-[#2E333B] cursor-pointer"
        onClick={() => router.push(isAdmin ? "/manage-events" : "/events")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to events
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={() => downloadFile(videoData?.url, "download")}
          variant="outline"
          className="flex items-center gap-2 border-primary text-primary sm:text-sm text-xs px-2 sm:px-4"
        >
          Download
        </Button>

        <Button
          onClick={() => setOpenFeedback(true)}
          variant="outline"
          className="text-primary border-primary sm:text-sm text-xs px-2 sm:px-4"
        >
          Suggest Feedback
        </Button>

        <FeedbackSheet />

        <Button
          href={`/event-details?id=${event?._id}`}
          className="bg-[#4A61FF] text-white hover:bg-[#4338CA] sm:text-sm text-xs px-2 sm:px-4"
        >
          Event Details
        </Button>
      </div>
    </header>
  );
}
