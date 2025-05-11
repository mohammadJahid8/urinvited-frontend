"use client";

import type React from "react";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Save, Play, Pause } from "lucide-react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useAppContext } from "@/lib/context";
import { useRouter } from "next/navigation";
// const ffmpeg = new FFmpeg();
interface VideoTrimmerProps {
  videoUrl: string;
  onReset: () => void;
}

export default function VideoTrimmer({ videoUrl, onReset }: VideoTrimmerProps) {
  const ffmpegRef = useRef(new FFmpeg());
  const ffmpeg = ffmpegRef.current;
  const { user, handleUploadVideo } = useAppContext();
  const router = useRouter();

  const [timelineWidth, setTimelineWidth] = useState(600);
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null);
  const framesRef = useRef<string[]>([]);
  const isDraggingRef = useRef<"start" | "end" | "playhead" | null>(null);

  // State
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // Default duration
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(10); // Default end time
  const [error, setError] = useState<string | null>(null);
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(timelineWidth);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [trimmedURL, setTrimmedURL] = useState<string | null>(null);
  const [isTrimming, setIsTrimming] = useState(false);

  // Use a separate state to force re-render of frames
  const [frameKey, setFrameKey] = useState(0);

  console.log({ timelineWidth });

  // Generate placeholder frames
  const generatePlaceholderFrames = useCallback((count: number) => {
    const placeholders = Array(count).fill(
      "/placeholder.svg?height=90&width=160"
    );
    framesRef.current = placeholders;
    setFrameCount(placeholders.length);
    setFrameKey((prev) => prev + 1);
  }, []);

  // Handle errors
  const handleError = useCallback(
    (message: string) => {
      console.error(message);
      setError(message);
      generatePlaceholderFrames(5);
      setIsLoading(false);
    },
    [generatePlaceholderFrames]
  );

  // Function to estimate video duration by seeking to the end
  const estimateVideoDuration = useCallback(
    (video: HTMLVideoElement): Promise<number> => {
      return new Promise((resolve, reject) => {
        // Set a timeout in case seeking doesn't work
        const timeoutId = setTimeout(() => {
          reject(new Error("Timeout estimating duration"));
        }, 5000);

        // Try to seek to a very large time
        try {
          // First check if duration is already valid
          if (isFinite(video.duration) && video.duration > 0) {
            clearTimeout(timeoutId);
            resolve(video.duration);
            return;
          }

          // Otherwise try to seek to the end
          video.currentTime = 1000000; // A very large value to seek to the end

          const handleSeeked = () => {
            clearTimeout(timeoutId);
            video.removeEventListener("seeked", handleSeeked);

            // After seeking to the "end", currentTime should be at the actual end
            const estimatedDuration = video.currentTime;
            resolve(estimatedDuration);
          };

          video.addEventListener("seeked", handleSeeked);
        } catch (err) {
          clearTimeout(timeoutId);
          reject(err);
        }
      });
    },
    []
  );

  // Extract a single frame at the specified time
  const extractSingleFrame = useCallback(
    (
      video: HTMLVideoElement,
      timePoint: number,
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D
    ): Promise<string | null> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Frame extraction timed out"));
        }, 1000);

        try {
          // Ensure time is valid
          if (!isFinite(timePoint) || timePoint < 0) {
            clearTimeout(timeoutId);
            reject(new Error("Invalid time point"));
            return;
          }

          video.currentTime = timePoint;

          const handleSeeked = () => {
            try {
              video.removeEventListener("seeked", handleSeeked);
              clearTimeout(timeoutId);

              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const frameData = canvas.toDataURL("image/jpeg", 0.5);
              resolve(frameData);
            } catch (err) {
              reject(err);
            }
          };

          video.addEventListener("seeked", handleSeeked);
        } catch (err) {
          clearTimeout(timeoutId);
          reject(err);
        }
      });
    },
    []
  );

  // Simplified frame extraction that's more reliable
  const extractFramesSimple = useCallback(
    async (video: HTMLVideoElement, videoDuration: number) => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          setIsLoading(false);
          return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
          setIsLoading(false);
          return;
        }

        // Set canvas dimensions
        const videoWidth = video.videoWidth || 320;
        const videoHeight = video.videoHeight || 240;
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // Determine how many frames to extract (fewer for longer videos)
        const frameCount = Math.min(
          8,
          Math.max(4, Math.ceil(videoDuration / 2))
        );
        const extractedFrames: string[] = [];

        console.log(`Extracting ${frameCount} frames...`);

        // Extract frames at regular intervals
        for (let i = 0; i < frameCount; i++) {
          const timePoint = (i / (frameCount - 1)) * videoDuration;
          const framePromise = extractSingleFrame(
            video,
            timePoint,
            canvas,
            context
          )
            .then((frameData) => {
              if (frameData) {
                extractedFrames.push(frameData);
              }
              return true;
            })
            .catch(() => false);

          // Add a timeout to prevent hanging
          const timeoutPromise = new Promise<boolean>((resolve) => {
            setTimeout(() => resolve(false), 1000);
          });

          // Use the result that comes first
          await Promise.race([framePromise, timeoutPromise]);
        }

        if (extractedFrames.length === 0) {
          console.log("No frames extracted, using placeholders");
          generatePlaceholderFrames(5);
        } else {
          console.log(
            `Successfully extracted ${extractedFrames.length} frames`
          );
          framesRef.current = extractedFrames;
          setFrameCount(extractedFrames.length);
          setFrameKey((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Error extracting frames:", err);
        generatePlaceholderFrames(5);
      } finally {
        setIsLoading(false);
      }
    },
    [extractSingleFrame, generatePlaceholderFrames]
  );

  // Initialize video
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    // Reset state
    setTrimStart(0);
    setTrimEnd(10);
    setStartPosition(0);
    setEndPosition(timelineWidth);
    setCurrentPosition(0);
    setCurrentTime(0);
    setDuration(10);

    // Generate initial placeholder frames
    generatePlaceholderFrames(5);

    // Create a hidden video element to work with
    const hiddenVideo = document.createElement("video");
    hiddenVideo.muted = true;
    hiddenVideo.preload = "metadata";
    hiddenVideoRef.current = hiddenVideo;

    // Set up timeout to prevent waiting indefinitely
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log("Video loading timed out, using default duration");
        if (videoRef.current) {
          videoRef.current.src = videoUrl;
        }
        setIsLoading(false);
      }
    }, 8000);

    // Load the video and try to determine its properties
    hiddenVideo.addEventListener("loadeddata", async () => {
      if (!mounted) return;

      try {
        // Set the source on the visible video element
        if (videoRef.current) {
          videoRef.current.src = videoUrl;
        }

        // Try to estimate duration by seeking to the end
        // This is more reliable than reading the duration property for WebM files
        await estimateVideoDuration(hiddenVideo)
          .then((estimatedDuration) => {
            if (!mounted) return;

            console.log("Estimated duration:", estimatedDuration);
            const validDuration =
              isFinite(estimatedDuration) && estimatedDuration > 0
                ? estimatedDuration
                : 10;

            setDuration(validDuration);
            setTrimEnd(validDuration);
            setEndPosition(timelineWidth);

            // Extract frames
            extractFramesSimple(hiddenVideo, validDuration);
          })
          .catch((err) => {
            console.error("Error estimating duration:", err);
            // Continue with default duration
            extractFramesSimple(hiddenVideo, 10);
          });
      } catch (err) {
        handleError(`Error processing video: ${err}`);
      }
    });

    hiddenVideo.addEventListener("error", () => {
      if (mounted) {
        handleError("Error loading video");
      }
    });

    // Start loading the video
    hiddenVideo.src = videoUrl;

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      if (hiddenVideoRef.current) {
        hiddenVideoRef.current.src = "";
        hiddenVideoRef.current = null;
      }
    };
  }, [
    videoUrl,
    estimateVideoDuration,
    extractFramesSimple,
    generatePlaceholderFrames,
    handleError,
    timelineWidth,
  ]);

  // Update current time during playback
  useEffect(() => {
    const updateTime = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);

        // Stop at trim end
        if (videoRef.current.currentTime >= trimEnd) {
          videoRef.current.pause();
          videoRef.current.currentTime = trimStart;
          setIsPlaying(false);
        }
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", updateTime);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", updateTime);
      }
    };
  }, [trimEnd, trimStart]);

  // Convert time to position
  const timeToPosition = useCallback(
    (time: number) => {
      return (time / duration) * timelineWidth;
    },
    [duration, timelineWidth]
  );

  // Convert position to time
  const positionToTime = useCallback(
    (position: number) => {
      return (position / timelineWidth) * duration;
    },
    [duration, timelineWidth]
  );

  // Update positions when duration or trim times change
  useEffect(() => {
    if (duration > 0) {
      setStartPosition(timeToPosition(trimStart));
      setEndPosition(timeToPosition(trimEnd));
      setCurrentPosition(timeToPosition(currentTime));
    }
  }, [duration, trimStart, trimEnd, currentTime, timeToPosition]);

  // Update current position during playback
  useEffect(() => {
    setCurrentPosition(timeToPosition(currentTime));
  }, [currentTime, timeToPosition]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      // If at the end of trim range, reset to start
      if (videoRef.current.currentTime >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      }

      // Use a promise with catch to handle play errors
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }

    setIsPlaying(!isPlaying);
  }, [isPlaying, trimEnd, trimStart]);

  // Handle timeline click
  const handleTimelineClick = useCallback(
    (e: React.MouseEvent) => {
      if (timelineContainerRef.current && !isDraggingRef.current) {
        const rect = timelineContainerRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;

        // Ensure position is within bounds
        const boundedPosition = Math.max(
          0,
          Math.min(clickPosition, timelineWidth)
        );
        const newTime = positionToTime(boundedPosition);

        if (videoRef.current) {
          try {
            videoRef.current.currentTime = newTime;
          } catch (err) {
            console.error("Error setting current time:", err);
          }
        }
      }
    },
    [positionToTime, timelineWidth]
  );

  const getClientX = (e: MouseEvent | TouchEvent): number => {
    if ("touches" in e) return e.touches[0].clientX;
    return e.clientX;
  };

  const handleStartDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      isDraggingRef.current = "start";

      const handleMove = (event: MouseEvent | TouchEvent) => {
        if (timelineContainerRef.current) {
          const rect = timelineContainerRef.current.getBoundingClientRect();
          let newPosition = getClientX(event) - rect.left;
          newPosition = Math.max(0, Math.min(newPosition, endPosition - 10));

          setStartPosition(newPosition);
          const newStartTime = positionToTime(newPosition);
          setTrimStart(newStartTime);
          if (videoRef.current) videoRef.current.currentTime = newStartTime;
        }
      };

      const handleUp = () => {
        isDraggingRef.current = null;
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", handleUp);
    },
    [endPosition, positionToTime]
  );

  const handleEndDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      isDraggingRef.current = "end";

      const handleMove = (event: MouseEvent | TouchEvent) => {
        if (timelineContainerRef.current) {
          const rect = timelineContainerRef.current.getBoundingClientRect();
          let newPosition = getClientX(event) - rect.left;
          newPosition = Math.max(
            startPosition + 10,
            Math.min(newPosition, timelineWidth)
          );

          setEndPosition(newPosition);
          const newEndTime = positionToTime(newPosition);
          setTrimEnd(newEndTime);
        }
      };

      const handleUp = () => {
        isDraggingRef.current = null;
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", handleUp);
    },
    [startPosition, positionToTime, timelineWidth]
  );

  const handlePlayheadDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      isDraggingRef.current = "playhead";

      const handleMove = (event: MouseEvent | TouchEvent) => {
        if (timelineContainerRef.current) {
          const rect = timelineContainerRef.current.getBoundingClientRect();
          let newPosition = getClientX(event) - rect.left;
          newPosition = Math.max(0, Math.min(newPosition, timelineWidth));

          setCurrentPosition(newPosition);
          const newTime = positionToTime(newPosition);
          if (videoRef.current) videoRef.current.currentTime = newTime;
        }
      };

      const handleUp = () => {
        isDraggingRef.current = null;
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", handleUp);
    },
    [positionToTime, timelineWidth]
  );

  // Save trimmed video
  const handleTrim = async () => {
    if (!videoUrl) return;
    if (!ffmpeg.loaded) {
      const baseURL = `https://unpkg.com/@ffmpeg/core@0.12.5/dist/umd`;

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
    }

    setIsTrimming(true);
    setTrimmedURL(null);

    const startTime = (startPosition / timelineWidth) * duration;
    const endTime = (endPosition / timelineWidth) * duration;

    const res = await fetch(videoUrl);
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

    const data: any = await ffmpeg.readFile("output.webm");
    const trimmedBlob = new Blob([data.buffer], { type: "video/webm" });
    const url = URL.createObjectURL(trimmedBlob);

    setTrimmedURL(url);
    setIsTrimming(false);
  };

  // Format time in short format (MM:SS.SS)
  const formatTimeShort = useCallback((seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) {
      seconds = 0;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toFixed(2).padStart(5, "0")}`;
  }, []);

  // Format time in MM:SS format
  const formatTime = useCallback((seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) {
      seconds = 0;
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Render frames from the ref
  const renderFrames = useCallback(() => {
    const frames = framesRef.current;

    return frames.map((src, idx) => (
      <div
        key={`${idx}-${frameKey}`}
        className="h-full relative border-r border-gray-200 last:border-r-0"
        style={{ width: `${timelineWidth / frames.length}px` }}
      >
        <img
          src={src || "/placeholder.svg"}
          className="h-full w-full object-cover opacity-90"
          alt={`frame-${idx}`}
        />
      </div>
    ));
  }, [frameKey, timelineWidth]);

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDraggingRef.current) e.preventDefault();
    };
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = Math.min(entry.contentRect.width, 800); // Cap at 800px
        setTimelineWidth(newWidth);
      }
    });

    if (timelineContainerRef.current) {
      observer.observe(timelineContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleUpload = async () => {
    if (user?.email) {
      setIsCreatingEvent(true);
      await handleUploadVideo(trimmedURL ?? videoUrl, user);
      setIsCreatingEvent(false);
    } else {
      return router.push("/login?video=" + (trimmedURL ?? videoUrl));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <video
          ref={videoRef}
          className="w-full h-full"
          controls={false}
          onError={() => setError("Error loading video")}
        />

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
            <p>{error}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayPause}
          disabled={!!error}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <div className="text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="text-sm">
          Trim: {formatTime(trimStart)} - {formatTime(trimEnd)}
        </div>
      </div>

      <div className="mb-6 mx-auto">
        {/* Timeline Container */}
        <div
          ref={timelineContainerRef}
          className="relative h-24 border border-gray-300 rounded w-full max-w-full lg:w-[800px]"
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
              {/* Frames */}
              <div ref={timelineRef} className="flex h-full bg-gray-100">
                {renderFrames()}
              </div>

              {/* Selection Box */}
              <div
                className="absolute top-0 h-full border-2 border-blue-500 bg-blue-400/20 z-10 pointer-events-none"
                style={{
                  left: `${startPosition}px`,
                  width: `${endPosition - startPosition}px`,
                }}
              ></div>

              {/* Start Handle */}
              <div
                className="absolute top-0 h-full z-20 cursor-ew-resize"
                style={{
                  left: `${startPosition}px`,
                  width: "20px",
                  marginLeft: "-10px",
                }}
                onMouseDown={handleStartDrag}
                onTouchStart={handleStartDrag}
              >
                <div className="absolute left-1/2 top-0 h-full w-1 bg-blue-600 transform -translate-x-1/2"></div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-full -translate-y-1/2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ◀
                </div>
              </div>

              {/* End Handle */}
              <div
                className="absolute top-0 h-full z-20 cursor-ew-resize"
                style={{
                  left: `${endPosition}px`,
                  width: "20px",
                  marginLeft: "-10px",
                }}
                onMouseDown={handleEndDrag}
                onTouchStart={handleEndDrag}
              >
                <div className="absolute left-1/2 top-0 h-full w-1 bg-blue-600 transform -translate-x-1/2"></div>
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
                onTouchStart={handlePlayheadDrag}
              >
                <div className="absolute left-1/2 top-0 h-full w-0.5 bg-black transform -translate-x-1/2"></div>
                <div className="absolute left-1/2 top-0 w-4 h-4 bg-black transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              </div>
            </>
          )}
        </div>

        {/* Time Indicator */}
        <div className="flex justify-between mt-1 w-full max-w-full lg:w-[800px]">
          <div className="text-xs text-blue-600 font-medium">
            {formatTimeShort(trimStart)}
          </div>
          <div className="text-xs text-blue-600 font-medium">
            {formatTimeShort(trimEnd)}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Record New Video
        </Button>

        {trimStart !== 0 || trimEnd !== duration ? (
          <Button
            onClick={handleTrim}
            className="gap-2"
            disabled={!!error || isCreatingEvent}
          >
            {isTrimming ? "Trimming..." : "✂️ Trim Video"}
          </Button>
        ) : (
          <Button
            className="gap-2"
            disabled={!!error || isCreatingEvent}
            onClick={handleUpload}
          >
            {isCreatingEvent ? "Creating Event..." : "Create Event"}
          </Button>
        )}
      </div>

      {trimmedURL && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold">🎬 Trimmed Output</h3>
          <video src={trimmedURL} controls className="max-w-96 border" />

          <Button
            className="gap-2"
            disabled={!!error || isCreatingEvent}
            onClick={handleUpload}
          >
            {isCreatingEvent ? "Creating Event..." : "Create Event"}
          </Button>
        </div>
      )}

      {/* Hidden canvas for frame extraction */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
