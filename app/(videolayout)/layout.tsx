import Navbar from '@/components/global/navbar';
import VideoPreviewNav from '@/components/global/video-preview-nav';

const VideoLayout = ({ children }: any) => {
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
