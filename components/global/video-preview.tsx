import React from 'react';

const VideoPreview = () => {
  return (
    <div className='max-w-[375px] mx-auto'>
      <video
        className='w-full h-[710px] object-cover rounded-lg'
        loop
        playsInline
        controls
      >
        <source src='/preview-video.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPreview;
