import EventLayout from "@/components/global/event-layout";
import Navbar from "@/components/global/navbar";
import EventPreviewNav from "@/components/global/event-preview-nav";

const HomeLayout = ({ children }: any) => {
  return (
    <div className="">
      <EventLayout>{children}</EventLayout>
    </div>
  );
};

export default HomeLayout;
