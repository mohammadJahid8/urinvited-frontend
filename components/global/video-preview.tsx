'use client';
import { useAppContext } from '@/lib/context';
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

const VideoPreview = () => {
  const { event, isEventLoading } = useAppContext();
  const previousVideo = event?.video?.videos[event?.video?.videos?.length - 2];
  const currentVideo = event?.video?.videos[event?.video?.videos?.length - 1];

  if (isEventLoading) return <div>Loading...</div>;
  return (
    <div className='max-w-[375px] mx-auto'>
      {previousVideo ? (
        <Tabs defaultValue='current-video' className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger value='previous-video' className='w-full flex-1'>
              Previous Video
            </TabsTrigger>
            <TabsTrigger value='current-video' className='w-full flex-1'>
              Current Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value='previous-video'>
            <Video
              url={previousVideo?.url}
              thumbnail={previousVideo?.thumbnail}
            />
          </TabsContent>
          <TabsContent value='current-video'>
            <Video
              url={currentVideo?.url}
              thumbnail={currentVideo?.thumbnail}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Video url={currentVideo?.url} thumbnail={currentVideo?.thumbnail} />
      )}
    </div>
  );
};

export default VideoPreview;

const Video = ({ url, thumbnail }: { url: string; thumbnail: string }) => {
  return (
    <video
      className='w-full h-[710px] object-cover rounded-lg'
      loop
      playsInline
      controls
      poster={thumbnail}
    >
      <source src={url} type='video/mp4' />
    </video>
  );
};
