"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoRecorderProps {
  onVideoRecorded: (videoUrl: string) => void;
  isRecording: boolean;
  onStartRecording: () => void;
}

export default function VideoRecorder({
  onVideoRecorded,
  isRecording,
  onStartRecording,
}: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return () => {
      // Clean up stream and interval when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      streamRef.current = stream;
      setIsLoading(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  const startRecording = () => {
    if (!streamRef.current) {
      setError("Camera not available. Please refresh and try again.");
      return;
    }

    onStartRecording();
    chunksRef.current = [];
    setRecordingDuration(0);

    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      onVideoRecorded(videoUrl);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };

    mediaRecorder.start();

    // Start interval to update recording duration
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-lg">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <span className="sr-only">Loading camera...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-900 text-white">
            <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
            <p className="text-center font-medium">{error}</p>
            <Button
              variant="outline"
              className="mt-4 text-white border-white hover:bg-white/10"
              onClick={startCamera}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full"
            />
            <div
              className={cn(
                "absolute inset-0 pointer-events-none transition-opacity duration-300",
                isRecording
                  ? "border-4 border-red-500/70 rounded-xl"
                  : "opacity-0"
              )}
            />
          </>
        )}

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-sm font-medium">
              {formatDuration(recordingDuration)}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="gap-2 px-6 py-5 text-base font-medium transition-all hover:scale-105"
            disabled={!!error || isLoading}
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="gap-2 px-6 py-5 text-base font-medium transition-all hover:scale-105 animate-pulse"
            size="lg"
          >
            <StopCircle className="h-5 w-5" />
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
}
