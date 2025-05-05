"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Download,
  Upload,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import Timeline from "./timeline";

export default function VideoTrimmer() {
  // FFmpeg state
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
  const [ready, setReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Loading FFmpeg...");

  // Video state
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  // Timeline state
  const [frames, setFrames] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [thumbnailsGenerated, setThumbnailsGenerated] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Load FFmpeg
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingMessage("Loading FFmpeg core...");

        // Create a new FFmpeg instance
        const ffmpegInstance = new FFmpeg();

        // Set up progress handler
        ffmpegInstance.on("progress", ({ progress }) => {
          setProcessingProgress(Math.round(progress * 100));
        });

        // Set up log handler
        ffmpegInstance.on("log", ({ message }) => {
          console.log(message);
        });

        setFfmpeg(ffmpegInstance);

        // Load FFmpeg core
        setLoadingMessage(
          "Downloading FFmpeg core (this may take a moment)..."
        );

        // In a production environment, you should host these files on your own domain
        // to avoid CORS issues
        const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd";

        // Load the core files
        await ffmpegInstance.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
          ),
          workerURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.worker.js`,
            "text/javascript"
          ),
          // In a production environment, you should set the correct CORS settings
          // corePath: "/ffmpeg-core.js",
          // wasmPath: "/ffmpeg-core.wasm",
          // workerPath: "/ffmpeg-core.worker.js",
        });

        setReady(true);
      } catch (error) {
        console.error("Error loading FFmpeg:", error);
        setLoadingMessage(
          `Error loading FFmpeg: ${error}. Try hosting the FFmpeg files on your own domain.`
        );
      }
    };

    load();
  }, []);

  // Handle file upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setThumbnailsGenerated(false);
      setFrames([]);
      setStartTime(0);
      setEndTime(0);
      setProcessingProgress(0);
    }
  };

  // Generate thumbnails for the timeline
  const generateThumbnails = useCallback(async () => {
    if (!video || !ready || !ffmpeg || !videoRef.current || thumbnailsGenerated)
      return;

    setProcessing(true);
    setProcessingProgress(0);
    setLoadingMessage("Generating thumbnails...");

    try {
      const totalDuration = videoRef.current.duration;
      setDuration(totalDuration);
      setEndTime(totalDuration);

      // Generate thumbnails evenly distributed across the video
      const numThumbnails = 10;
      const interval = totalDuration / numThumbnails;

      // Write input file to FFmpeg's virtual file system
      await ffmpeg.writeFile("input.mp4", await fetchFile(video));

      const thumbnailPromises = Array.from({ length: numThumbnails }).map(
        async (_, i) => {
          const time = i * interval;
          const outputName = `thumbnail_${i}.png`;

          // Run FFmpeg command to extract a frame at the specified time
          await ffmpeg.exec([
            "-ss",
            time.toString(),
            "-i",
            "input.mp4",
            "-vframes",
            "1",
            "-q:v",
            "2",
            outputName,
          ]);

          // Read the output file
          const data = await ffmpeg.readFile(outputName);
          const blob = new Blob([data.buffer], { type: "image/png" });
          return URL.createObjectURL(blob);
        }
      );

      const thumbnails = await Promise.all(thumbnailPromises);
      setFrames(thumbnails);
      setThumbnailsGenerated(true);
    } catch (error) {
      console.error("Error generating thumbnails:", error);
      setLoadingMessage(`Error generating thumbnails: ${error}`);
    } finally {
      setProcessing(false);
    }
  }, [video, ready, ffmpeg, thumbnailsGenerated]);

  // Generate thumbnails when video is loaded
  useEffect(() => {
    if (videoRef.current && videoUrl && ready && !thumbnailsGenerated) {
      videoRef.current.onloadedmetadata = () => {
        generateThumbnails();
      };
    }
  }, [videoUrl, ready, generateThumbnails, thumbnailsGenerated]);

  // Update current time during playback
  useEffect(() => {
    const updateTime = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    };

    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  // Play/pause video
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  // Seek to position
  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // Trim video
  const trimVideo = async () => {
    if (!video || !ready || !ffmpeg) return;

    setProcessing(true);
    setProcessingProgress(0);
    setLoadingMessage("Trimming video...");

    try {
      // Write the input file to FFmpeg's virtual file system
      await ffmpeg.writeFile("input.mp4", await fetchFile(video));

      // Run FFmpeg command to trim the video
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-ss",
        startTime.toString(),
        "-to",
        endTime.toString(),
        "-c",
        "copy",
        "output.mp4",
      ]);

      // Read the output file
      const data = await ffmpeg.readFile("output.mp4");

      // Create a download link
      const blob = new Blob([data.buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trimmed_video.mp4";
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error trimming video:", error);
      setLoadingMessage(`Error trimming video: ${error}`);
    } finally {
      setProcessing(false);
    }
  };

  // Format time as MM:SS:ms
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
  };

  // If FFmpeg is not ready, show loading state
  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-600 rounded-lg">
        <Loader2 className="h-12 w-12 mb-4 text-gray-400 animate-spin" />
        <span className="text-lg font-medium">{loadingMessage}</span>
        {loadingProgress > 0 && (
          <div className="w-full max-w-xs mt-4">
            <Progress value={loadingProgress} className="h-2" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {!video ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-600 rounded-lg">
          <label htmlFor="video-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 mb-4 text-gray-400" />
              <span className="text-lg font-medium">Upload a video file</span>
              <span className="text-sm text-gray-400 mt-1">
                MP4, WebM, or MOV
              </span>
            </div>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      ) : (
        <>
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              muted={muted}
              crossOrigin="anonymous"
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {!playing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-black/50 text-white pointer-events-auto"
                  onClick={togglePlay}
                >
                  <Play className="h-8 w-8" />
                </Button>
              )}
            </div>

            <div className="absolute top-4 right-4 text-white text-lg font-mono">
              {formatTime(currentTime)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white"
            >
              {playing ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white"
            >
              {muted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>

            <div className="flex-1">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration}
                step={0.01}
                onValueChange={handleSeek}
                className="cursor-pointer"
              />
            </div>

            <div className="text-white font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="border border-blue-500 rounded-lg overflow-hidden">
            <div className="bg-blue-900/30 px-4 py-2 flex justify-between items-center">
              <div className="text-blue-300 font-mono">
                Clip {formatTime(endTime - startTime)}
              </div>
            </div>

            <Timeline
              frames={frames}
              duration={duration}
              currentTime={currentTime}
              startTime={startTime}
              endTime={endTime}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              loading={processing}
            />

            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <div className="text-white font-mono">
                {formatTime(startTime)}
              </div>
            </div>
          </div>

          {processing && (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">{loadingMessage}</span>
                <span className="text-sm text-gray-400">
                  {processingProgress}%
                </span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setVideo(null);
                setVideoUrl("");
                setFrames([]);
                setThumbnailsGenerated(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={trimVideo}
              disabled={processing || !thumbnailsGenerated}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {processing ? "Processing..." : "Export Trimmed Video"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
