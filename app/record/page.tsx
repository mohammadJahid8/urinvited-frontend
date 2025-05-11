"use client";

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
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Record Your Invite
        </h1>

        {!recordedVideo ? (
          <VideoRecorder
            onVideoRecorded={handleVideoRecorded}
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
          />
        ) : (
          <VideoTrimmer videoUrl={recordedVideo} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
