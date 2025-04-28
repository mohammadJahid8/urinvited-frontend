"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Video } from "lucide-react";

const RecordVideo: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMediaStream(stream);

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(blob);

      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const saveChanges = () => {
    console.log("Video saved", videoBlob);
    console.log("Caption:", caption);
  };

  // When videoBlob is ready, set the srcObject to null and use src instead
  useEffect(() => {
    if (videoRef.current) {
      if (videoBlob) {
        videoRef.current.srcObject = null;
        videoRef.current.src = URL.createObjectURL(videoBlob);
      }
    }
  }, [videoBlob]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Video Preview - Always show one video tag */}
      <div className="relative w-full max-w-md">
        {recording && (
          <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
            <span className="text-red-600 font-semibold text-sm">
              Recording...
            </span>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          muted={recording}
          controls={!recording && videoBlob !== null}
          playsInline
          className="w-full rounded-lg shadow-md bg-black"
        />
      </div>

      {/* Start/Stop Button */}
      {!videoBlob && (
        <Button
          onClick={recording ? stopRecording : startRecording}
          className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold h-12"
        >
          <Video className="w-6 h-6" />
          {recording ? "Stop Recording" : "Record Your Invite"}
        </Button>
      )}

      {/* After Recording */}
      {videoBlob && (
        <div className="w-full max-w-md p-4 rounded-xl shadow-md bg-white">
          <h2 className="text-xl font-bold mb-4">Preview, Trim</h2>

          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Join us for a celebration!"
            className="w-full p-2 border rounded mb-4"
          />

          <div className="flex flex-col gap-2 mb-4">
            <button className="text-left w-full p-3 border rounded">
              Caption
            </button>
            <button className="text-left w-full p-3 border rounded">
              Thumbnail
            </button>
            <button className="text-left w-full p-3 border rounded">
              Background Music
            </button>
          </div>

          <Button
            onClick={saveChanges}
            className="w-full bg-blue-700 text-white hover:bg-blue-800 h-12 font-semibold"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecordVideo;
