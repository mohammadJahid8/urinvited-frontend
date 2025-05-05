"use client";

import React, { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

const VideoTrimmerApp: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [trimmedURL, setTrimmedURL] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  const [duration, setDuration] = useState<number>(5);
  const [isTrimming, setIsTrimming] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (videoURL && videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        const dur = videoRef.current?.duration || 5;
        setDuration(dur);
        setStartTime(0);
        setEndTime(dur);
      };
    }
  }, [videoURL]);

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

    recorder.onstop = () => {
      const chunks = [...recordedChunksRef.current];
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.controls = true;
        videoRef.current.muted = false;
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

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setRecording(false);
  };

  const handleTrim = async () => {
    if (!videoURL) return;
    if (!ffmpeg.loaded) await ffmpeg.load();

    setIsTrimming(true);
    setTrimmedURL(null);

    const res = await fetch(videoURL);
    const blob = await res.blob();
    const file = new File([blob], "input.webm", { type: "video/webm" });

    await ffmpeg.writeFile("input.webm", await fetchFile(file));

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

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">🎥 Video Trimmer (TypeScript)</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full border rounded"
      />

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

      {videoURL && (
        <>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">🎛️ Trim Range</h3>

            <label>Start: {startTime.toFixed(2)}s</label>
            <input
              type="range"
              min={0}
              max={endTime - 0.5}
              step={0.1}
              value={startTime}
              onChange={(e) =>
                setStartTime(Math.min(Number(e.target.value), endTime - 0.1))
              }
              className="w-full"
            />

            <label>End: {endTime.toFixed(2)}s</label>
            <input
              type="range"
              min={startTime + 0.1}
              max={duration}
              step={0.1}
              value={endTime}
              onChange={(e) =>
                setEndTime(Math.max(Number(e.target.value), startTime + 0.1))
              }
              className="w-full"
            />

            <button
              onClick={handleTrim}
              disabled={isTrimming}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
            >
              {isTrimming ? "Trimming..." : "✂️ Trim Video"}
            </button>
          </div>
        </>
      )}

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
