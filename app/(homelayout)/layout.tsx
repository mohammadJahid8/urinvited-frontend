import EventLayout from "@/components/global/event-layout";
import Navbar from "@/components/global/navbar";
import EventPreviewNav from "@/components/global/event-preview-nav";

const HomeLayout = ({ children }: any) => {
  return (
    <div className="">
      <div className="mt-16">
        {/* <Navbar /> */}
        <EventPreviewNav />
      </div>

      <EventLayout>{children}</EventLayout>
    </div>
  );
};

export default HomeLayout;
