import { Maximize, Volume2 } from 'lucide-react';
import { VolumeX } from 'lucide-react';
import { Play } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Pause } from 'lucide-react';
import { motion } from 'framer-motion';

const Video = ({ videoUrl, thumbnailImage }: any) => {
  const videoRef = useRef(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const handlePlayClick = () => {
    setIsVideoVisible(true);
    videoRef.current.play();
  };

  return (
    <motion.div
      className='relative w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-xl bg-black'
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!isVideoVisible && (
        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-60'>
          <Button
            onClick={handlePlayClick}
            size='lg'
            className='text-white bg-opacity-80 rounded-full p-4'
          >
            <Play size={48} />
          </Button>
        </div>
      )}

      <motion.video
        ref={videoRef}
        src={videoUrl} // Replace with your video URL
        className={`w-full h-auto bg-black rounded-lg ${
          isVideoVisible ? 'block' : 'hidden'
        }`}
        poster={thumbnailImage || ''} // Replace with your thumbnail URL
        controls
      />
    </motion.div>
  );
};

export default Video;
