"use client";

import type React from "react";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Pencil, Video } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useAppContext } from "@/lib/context";
import LoadingOverlay from "@/components/global/loading-overlay";
import { Button } from "@/components/ui/button";

// Import ReactPlayer dynamically to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading player...</p>
    </div>
  ),
});

interface OutputPageProps {
  videoUrl?: string;
}

const OutputPage: React.FC<OutputPageProps> = () => {
  const { user, handleUploadVideo } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoUrl =
    searchParams.get("video") || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleUpload = async () => {
    if (user?.email) {
      setIsCreatingEvent(true);
      await handleUploadVideo(videoUrl, user);
      setIsCreatingEvent(false);
    } else {
      return router.push("/login?video=" + videoUrl);
    }
  };

  if (hasError || !videoUrl) return redirect("/record");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {isCreatingEvent && <LoadingOverlay />}
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
          <div className="w-full relative" style={{ aspectRatio: "16/9" }}>
            {hasError ? (
              <div className="absolute inset-0 bg-gray-100 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 text-gray-400">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 10h4.5a2 2 0 0 1 0 4H15v-4z"></path>
                    <path d="M3 8h.01M3 12h.01M3 16h.01"></path>
                    <path d="M9.5 10h.01M9.5 12h.01M9.5 16h.01"></path>
                    <path d="M14 16h.01"></path>
                    <path d="M21 16h.01"></path>
                    <rect width="18" height="12" x="3" y="6" rx="2"></rect>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  Video unavailable
                </h3>
                <p className="text-gray-500 mt-2">
                  The video could not be loaded. Please check the URL or try
                  again later.
                </p>
              </div>
            ) : !isReady ? (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <svg
                    className="animate-spin h-10 w-10 text-gray-400 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-gray-500">Loading video...</p>
                </div>
              </div>
            ) : null}
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls
              playing
              playsinline
              onReady={() => setIsReady(true)}
              onError={() => {
                setHasError(true);
                setIsReady(false);
              }}
              config={{
                file: {
                  attributes: {
                    disablePictureInPicture: true,
                  },
                },
              }}
              style={{
                aspectRatio: "16/9",
                display: isReady && !hasError ? "block" : "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="md:w-80 bg-gray-50 p-8 flex flex-col justify-center border-l border-gray-200">
        <div className="space-y-8">
          {/* Heading */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Cool, love your video!
            </h2>
            <p className="text-gray-600">
              Your video is ready for creating an event.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors shadow-md"
              onClick={handleUpload}
              disabled={isCreatingEvent}
            >
              {isCreatingEvent ? "Creating Event..." : "Create Event"}
            </Button>

            <Button
              className="w-full px-6 py-3 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              href="/record"
            >
              <Video size={18} />
              Record New Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputPage;
