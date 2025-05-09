"use client";

import React, { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

const TIMELINE_WIDTH = 400;

const formatTimeShort = (seconds: number) => {
  if (!isFinite(seconds) || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const VideoTrimmerApp: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [trimmedURL, setTrimmedURL] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(5);
  const [isTrimming, setIsTrimming] = useState(false);

  const [frames, setFrames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(TIMELINE_WIDTH);
  const [currentPosition, setCurrentPosition] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"start" | "end" | "playhead" | null>(null);

  useEffect(() => {
    if (recording) {
      durationTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(durationTimerRef.current as NodeJS.Timeout);
      setRecordingDuration(0);
    }

    return () => {
      clearInterval(durationTimerRef.current as NodeJS.Timeout);
    };
  }, [recording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.controls = false;
      videoRef.current.play();
    }

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    recordedChunksRef.current = [];

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) recordedChunksRef.current.push(event.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob([...recordedChunksRef.current], {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.controls = true;
        videoRef.current.muted = false;

        // Wait for metadata to load
        videoRef.current.onloadedmetadata = async () => {
          const dur = videoRef.current?.duration || 5;
          setDuration(dur);
          setStartPosition(0);
          setEndPosition(TIMELINE_WIDTH);

          console.log("url", url);
          console.log("dur", dur);

          // await extractFrames(url, dur); // <-- Call after duration is valid
        };

        videoRef.current.play();
      }

      setVideoURL(url);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const extractFrames = async (videoUrl: string, videoDuration: number) => {
    try {
      if (!ffmpeg.loaded) await ffmpeg.load();

      setIsLoading(true);
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      await ffmpeg.writeFile("frames.webm", await fetchFile(blob));

      const frameCount = 10;
      const newFrames: string[] = [];

      for (let i = 0; i < frameCount; i++) {
        const seekTime = (i * videoDuration) / frameCount;
        const output = `frame-${i}.jpg`;

        try {
          await ffmpeg.exec([
            "-y",
            "-i",
            "frames.webm",
            "-ss",
            `${seekTime}`,
            "-frames:v",
            "1",
            "-q:v",
            "2",
            output,
          ]);

          const data = await ffmpeg.readFile(output);
          const imageBlob = new Blob([data.buffer], { type: "image/jpeg" });
          newFrames.push(URL.createObjectURL(imageBlob));
        } catch (error) {
          console.error(`Frame ${i} extraction failed:`, error);
        }
      }

      setFrames(newFrames);
    } catch (err) {
      console.error("Frame extraction error:", err);
      alert("Failed to extract frames. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrim = async () => {
    if (!videoURL) return;
    if (!ffmpeg.loaded) await ffmpeg.load();

    setIsTrimming(true);
    setTrimmedURL(null);

    const startTime = (startPosition / TIMELINE_WIDTH) * duration;
    const endTime = (endPosition / TIMELINE_WIDTH) * duration;

    const res = await fetch(videoURL);
    const blob = await res.blob();
    await ffmpeg.writeFile("input.webm", await fetchFile(blob));

    await ffmpeg.exec([
      "-i",
      "input.webm",
      "-ss",
      `${startTime}`,
      "-to",
      `${endTime}`,
      "-c:v",
      "libvpx",
      "-c:a",
      "libvorbis",
      "output.webm",
    ]);

    const data = await ffmpeg.readFile("output.webm");
    const trimmedBlob = new Blob([data.buffer], { type: "video/webm" });
    const url = URL.createObjectURL(trimmedBlob);

    setTrimmedURL(url);
    setIsTrimming(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current || !timelineContainerRef.current) return;

    const rect = timelineContainerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, TIMELINE_WIDTH));

    if (draggingRef.current === "start") {
      setStartPosition(Math.min(x, endPosition - 10));
    } else if (draggingRef.current === "end") {
      setEndPosition(Math.max(x, startPosition + 10));
    } else if (draggingRef.current === "playhead") {
      setCurrentPosition(x);
    }
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleStartDrag = () => {
    draggingRef.current = "start";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleEndDrag = () => {
    draggingRef.current = "end";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handlePlayheadDrag = () => {
    draggingRef.current = "playhead";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineContainerRef.current) return;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), TIMELINE_WIDTH);
    setCurrentPosition(x);
  };

  const startTime = (startPosition / TIMELINE_WIDTH) * duration;
  const endTime = (endPosition / TIMELINE_WIDTH) * duration;

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">🎥 Video Trimmer (Custom UI)</h2>

      {/* Video preview with overlay */}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full border rounded"
        />
        {recording && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-sm px-3 py-1 rounded shadow-lg z-10">
            🔴 {recordingDuration}s
          </div>
        )}
      </div>

      {/* Record buttons */}
      <div className="flex gap-2">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Stop Recording
          </button>
        )}
      </div>

      {/* Timeline UI */}
      {videoURL && (
        <div className="mb-6">
          <div
            ref={timelineContainerRef}
            className="relative h-24 border border-gray-300 rounded"
            style={{ width: TIMELINE_WIDTH }}
            onClick={handleTimelineClick}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    Extracting frames...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div ref={timelineRef} className="flex h-full bg-gray-100">
                  {frames.map((src, idx) => (
                    <div
                      key={idx}
                      className="h-full relative border-r border-gray-200 last:border-r-0"
                      style={{ width: `${TIMELINE_WIDTH / frames.length}px` }}
                    >
                      <img
                        src={src}
                        className="h-full w-full object-cover opacity-90"
                        alt={`frame-${idx}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Selection box */}
                <div
                  className="absolute top-0 h-full border-2 border-blue-500 bg-blue-400/20 z-10 pointer-events-none"
                  style={{
                    left: `${startPosition}px`,
                    width: `${endPosition - startPosition}px`,
                  }}
                />

                {/* Start & end handles */}
                <div
                  className="absolute top-0 h-full z-20 cursor-ew-resize"
                  style={{
                    left: `${startPosition}px`,
                    width: "20px",
                    marginLeft: "-10px",
                  }}
                  onMouseDown={handleStartDrag}
                >
                  <div className="absolute left-1/2 top-0 h-full w-1 bg-blue-600 transform -translate-x-1/2" />
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-full -translate-y-1/2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ◀
                  </div>
                </div>

                <div
                  className="absolute top-0 h-full z-20 cursor-ew-resize"
                  style={{
                    left: `${endPosition}px`,
                    width: "20px",
                    marginLeft: "-10px",
                  }}
                  onMouseDown={handleEndDrag}
                >
                  <div className="absolute left-1/2 top-0 h-full w-1 bg-blue-600 transform -translate-x-1/2" />
                  <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ▶
                  </div>
                </div>

                {/* Playhead */}
                <div
                  className="absolute top-0 h-full z-30 cursor-pointer"
                  style={{
                    left: `${currentPosition}px`,
                    width: "12px",
                    marginLeft: "-6px",
                  }}
                  onMouseDown={handlePlayheadDrag}
                >
                  <div className="absolute left-1/2 top-0 h-full w-0.5 bg-black transform -translate-x-1/2" />
                  <div className="absolute left-1/2 top-0 w-4 h-4 bg-black transform -translate-x-1/2 -translate-y-1/2 rounded-full" />
                </div>
              </>
            )}
          </div>

          <div
            className="flex justify-between mt-1"
            style={{ width: TIMELINE_WIDTH }}
          >
            <div className="text-xs text-blue-600 font-medium">
              {formatTimeShort(startTime)}
            </div>
            <div className="text-xs text-blue-600 font-medium">
              {formatTimeShort(endTime)}
            </div>
          </div>

          <button
            onClick={handleTrim}
            disabled={isTrimming}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isTrimming ? "Trimming..." : "✂️ Trim Video"}
          </button>
        </div>
      )}

      {/* Output */}
      {trimmedURL && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">🎬 Trimmed Output</h3>
          <video src={trimmedURL} controls className="w-full border" />
        </div>
      )}
    </div>
  );
};

export default VideoTrimmerApp;
