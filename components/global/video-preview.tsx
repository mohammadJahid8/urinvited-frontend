"use client";
import { useAppContext } from "@/lib/context";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Separator } from "../ui/separator";

const VideoPreview = () => {
  const { event, isEventLoading } = useAppContext();
  const previousVideo = event?.video?.videos[event?.video?.videos?.length - 2];
  const currentVideo = event?.video?.videos[event?.video?.videos?.length - 1];

  if (isEventLoading) return <div>Loading...</div>;
  return (
    <div className="max-w-[375px] mx-auto">
      {previousVideo ? (
        <Tabs defaultValue="current-video" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="previous-video" className="w-full flex-1">
              Previous Video
            </TabsTrigger>
            <TabsTrigger value="current-video" className="w-full flex-1">
              Current Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value="previous-video">
            <Video
              url={previousVideo?.url}
              thumbnail={previousVideo?.thumbnail}
            />
          </TabsContent>
          <TabsContent value="current-video">
            <Video
              url={currentVideo?.url}
              thumbnail={currentVideo?.thumbnail}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Video url={currentVideo?.url} thumbnail={currentVideo?.thumbnail} />
      )}
      {/* Divider and Banner */}
      <div className="my-4">
        <Separator />
        <div className="mt-3 text-center text-sm text-muted-foreground bg-muted rounded-md py-2 px-3">
          <div>Want to change event details?</div>
          <div>Use the ‘Edit Event Info’ button above.</div>
          <div>For changes to the video, click ‘Video Feedback.’</div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;

const Video = ({ url, thumbnail }: { url: string; thumbnail: string }) => {
  return (
    <video className="rounded-lg" loop playsInline controls poster={thumbnail}>
      <source src={url} type="video/mp4" />
    </video>
  );
};
