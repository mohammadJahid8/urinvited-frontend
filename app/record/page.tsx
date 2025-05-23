"use client";

import NoSsrWrapper from "@/components/global/no-ssr-wrapper";
import VideoRecorder from "@/components/global/recorder/video-recorder";
import VideoTrimmer from "@/components/global/recorder/video-trimmer";

import { useState } from "react";

export default function Home() {
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleVideoRecorded = (videoUrl: string) => {
    setRecordedVideo(videoUrl);
    setIsRecording(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedVideo(null);
  };

  const handleReset = () => {
    setRecordedVideo(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between mt-20 md:mt-0 p-4 md:p-24">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {recordedVideo ? "Prview Your Video" : "Record Your Invite"}
        </h1>

        {!recordedVideo ? (
          <VideoRecorder
            onVideoRecorded={handleVideoRecorded}
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
          />
        ) : (
          <NoSsrWrapper>
            <VideoTrimmer videoUrl={recordedVideo} onReset={handleReset} />
          </NoSsrWrapper>
        )}
      </div>
    </main>
  );
}
