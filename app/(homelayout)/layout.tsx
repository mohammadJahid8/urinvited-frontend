import EventLayout from '@/components/global/event-layout';
import Navbar from '@/components/global/navbar';
import EventPreviewNav from '@/components/global/event-preview-nav';

const HomeLayout = ({ children }: any) => {
  return (
    <div className=''>
      <div className='fixed top-0 w-full z-50'>
        <Navbar />
        <EventPreviewNav />
      </div>

      <EventLayout>{children}</EventLayout>
    </div>
  );
};

export default HomeLayout;
