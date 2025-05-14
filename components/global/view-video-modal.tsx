"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

export function ViewVideoModal({ videoUrl }: { videoUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <PlayCircle className="size-4" />
          View Video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Video</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {videoUrl ? (
            <video controls className="rounded-md max-w-72 mx-auto w-full">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p>No video available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
