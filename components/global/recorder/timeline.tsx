"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface TimelineProps {
  frames: string[];
  duration: number;
  currentTime: number;
  startTime: number;
  endTime: number;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  loading: boolean;
}

export default function Timeline({
  frames,
  duration,
  currentTime,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  loading,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const startHandleRef = useRef<HTMLDivElement>(null);
  const endHandleRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);

  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [dragEndTime, setDragEndTime] = useState(0);
  const [selectionWidth, setSelectionWidth] = useState(0);

  // Calculate position from time
  const timeToPosition = (time: number): number => {
    if (!timelineRef.current) return 0;
    const width = timelineRef.current.clientWidth;
    return (time / duration) * width;
  };

  // Calculate time from position
  const positionToTime = (position: number): number => {
    if (!timelineRef.current) return 0;
    const width = timelineRef.current.clientWidth;
    return (position / width) * duration;
  };

  // Update selection position and width
  useEffect(() => {
    if (!timelineRef.current || !selectionRef.current) return;

    const startPos = timeToPosition(startTime);
    const endPos = timeToPosition(endTime);
    const width = endPos - startPos;

    selectionRef.current.style.left = `${startPos}px`;
    selectionRef.current.style.width = `${width}px`;
    setSelectionWidth(width);
  }, [startTime, endTime, duration]);

  // Handle mouse down on start handle
  const handleStartHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingStart(true);
    setDragStartX(e.clientX);
    setDragStartTime(startTime);
  };

  // Handle mouse down on end handle
  const handleEndHandleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingEnd(true);
    setDragStartX(e.clientX);
    setDragEndTime(endTime);
  };

  // Handle mouse down on selection
  const handleSelectionMouseDown = (e: React.MouseEvent) => {
    if (e.target === selectionRef.current) {
      e.preventDefault();
      setIsDraggingSelection(true);
      setDragStartX(e.clientX);
      setDragStartTime(startTime);
      setDragEndTime(endTime);
    }
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;

      const deltaX = e.clientX - dragStartX;

      if (isDraggingStart) {
        const newStartTime = Math.max(
          0,
          Math.min(endTime - 0.1, dragStartTime + positionToTime(deltaX))
        );
        onStartTimeChange(newStartTime);
      } else if (isDraggingEnd) {
        const newEndTime = Math.max(
          startTime + 0.1,
          Math.min(duration, dragEndTime + positionToTime(deltaX))
        );
        onEndTimeChange(newEndTime);
      } else if (isDraggingSelection) {
        const deltaTime = positionToTime(deltaX);
        let newStartTime = dragStartTime + deltaTime;
        let newEndTime = dragEndTime + deltaTime;

        // Keep selection within bounds
        if (newStartTime < 0) {
          const shift = -newStartTime;
          newStartTime = 0;
          newEndTime = Math.min(duration, dragEndTime + deltaTime + shift);
        } else if (newEndTime > duration) {
          const shift = newEndTime - duration;
          newEndTime = duration;
          newStartTime = Math.max(0, dragStartTime + deltaTime - shift);
        }

        onStartTimeChange(newStartTime);
        onEndTimeChange(newEndTime);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
      setIsDraggingSelection(false);
    };

    if (isDraggingStart || isDraggingEnd || isDraggingSelection) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDraggingStart,
    isDraggingEnd,
    isDraggingSelection,
    dragStartX,
    dragStartTime,
    dragEndTime,
    startTime,
    endTime,
    duration,
    onStartTimeChange,
    onEndTimeChange,
  ]);

  // Current time indicator
  const currentTimePosition = timeToPosition(currentTime);

  return (
    <div
      className="relative h-24 bg-gray-800 overflow-hidden"
      ref={timelineRef}
    >
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : frames.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Loading frames...
        </div>
      ) : (
        <>
          {/* Frames */}
          <div className="flex h-full">
            {frames.map((frame, index) => (
              <div
                key={index}
                className="h-full flex-1 border-r border-gray-700 last:border-r-0"
                style={{ minWidth: `${100 / frames.length}%` }}
              >
                <img
                  src={frame || "/placeholder.svg"}
                  alt={`Frame ${index}`}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            ))}
          </div>

          {/* Selection overlay */}
          <div
            ref={selectionRef}
            className="absolute top-0 h-full bg-blue-500/30 border-2 border-blue-500 cursor-move"
            onMouseDown={handleSelectionMouseDown}
          >
            {/* Start handle */}
            <div
              ref={startHandleRef}
              className="absolute top-0 bottom-0 left-0 w-4 bg-blue-500 cursor-ew-resize flex items-center justify-center"
              onMouseDown={handleStartHandleMouseDown}
              style={{ transform: "translateX(-50%)" }}
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </div>

            {/* End handle */}
            <div
              ref={endHandleRef}
              className="absolute top-0 bottom-0 right-0 w-4 bg-blue-500 cursor-ew-resize flex items-center justify-center"
              onMouseDown={handleEndHandleMouseDown}
              style={{ transform: "translateX(50%)" }}
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Current time indicator */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
            style={{ left: `${currentTimePosition}px` }}
          />
        </>
      )}
    </div>
  );
}
