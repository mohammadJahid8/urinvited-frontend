import Navbar from '@/components/global/navbar';

const PublicLayout = ({ children }: any) => {
  return (
    <div className=''>
      <Navbar />
      {/* <VideoPreviewNav /> */}

      <div className='h-[calc(100vh-64px)] overflow-y-auto'>{children}</div>
    </div>
  );
};

export default PublicLayout;
