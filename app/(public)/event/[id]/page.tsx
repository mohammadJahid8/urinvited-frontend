import Event from "@/components/global/event";
import api from "@/utils/axiosInstance";
import convertTime from "@/utils/convertTime";
import dateFormatter from "@/utils/dateFormatter";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  console.log("id from params", id);
  const response = await api.get(`/event/${id}`);

  const event = response?.data?.data;
  const eventDetails = event?.eventDetails?.events?.[0];
  const title = eventDetails?.title;
  const startDate = eventDetails?.startDate;
  const startTime = eventDetails?.startTime;
  // const endDate = eventDetails?.endDate;
  // const endTime = eventDetails?.endTime;
  const description = eventDetails?.inviteDetails?.replace(/<[^>]*>?/g, "");
  const thumbnailImage =
    event?.video?.videos[event?.video?.videos?.length - 1]?.thumbnail;
  const hostedBy = event?.hostedBy;

  return {
    title: `${title} - ${hostedBy}`,
    description: `${dateFormatter(startDate)} @ ${convertTime(startTime)}${
      description ? ` : ${description}` : ""
    }`,
    openGraph: {
      images: [thumbnailImage],
    },
  };
}

const PublicPreviewPage = () => {
  return (
    <div>
      <Event />
    </div>
  );
};

export default PublicPreviewPage;
