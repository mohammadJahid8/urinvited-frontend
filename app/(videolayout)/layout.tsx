'use client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/global/navbar';
import VideoPreviewNav from '@/components/global/video-preview-nav';
import api from '@/utils/axiosInstance';
import { useParams, useSearchParams } from 'next/navigation';

const VideoLayout = ({ children }: any) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // console.log('event', event);

  // const videoData = event?.video;

  return (
    <div className=''>
      <Navbar />
      <VideoPreviewNav />

      <div className='h-[calc(100vh-120px)] overflow-y-auto p-10'>
        {children}
      </div>
    </div>
  );
};

export default VideoLayout;
