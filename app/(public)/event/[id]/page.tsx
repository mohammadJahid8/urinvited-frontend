import Event from "@/components/global/event";
import api from "@/utils/axiosInstance";
import convertTime from "@/utils/convertTime";
import { createImageUrl } from "@/utils/createImageUrl";
import dateFormatter from "@/utils/dateFormatter";
import { Metadata } from "next";
import React from "react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  console.log("id from params", id);
  const response = await api.get(`/event/${id}`);

  const event = response?.data?.data;
  const customization = event?.customization;
  console.log("🚀 ~ generateMetadata ~ customization:", customization);
  const eventDetails = event?.eventDetails?.events?.[0];
  const title = eventDetails?.title;
  const startDate = eventDetails?.startDate;
  const startTime = eventDetails?.startTime;
  const description = eventDetails?.inviteDetails?.replace(/<[^>]*>?/g, "");
  const thumbnailImage =
    createImageUrl(customization?.thumbnailImage) ||
    event?.video?.videos[event?.video?.videos?.length - 1]?.thumbnail;
  const hostedBy = event?.hostedBy;

  const metadata: Metadata = {};

  if (title && hostedBy) {
    metadata.title = `${title} - ${hostedBy}`;
  }

  if (startDate && startTime) {
    metadata.description = `${dateFormatter(startDate)} @ ${convertTime(
      startTime
    )}${description ? ` : ${description}` : ""}`;
  }

  if (thumbnailImage) {
    metadata.openGraph = {
      images: [thumbnailImage],
    };
  }

  return metadata;
}

const PublicPreviewPage = () => {
  return (
    <div>
      <Event />
    </div>
  );
};

export default PublicPreviewPage;
