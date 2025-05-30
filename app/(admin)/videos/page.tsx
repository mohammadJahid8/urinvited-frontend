"use client";
import { DataTable } from "@/components/global/data-table";
import { Button } from "@/components/ui/button";
import api from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { FeedbackDialog } from "@/components/global/feedback-dialog";
import { EditVideoDialog } from "@/components/global/edit-video-dialog";
import { ViewVideoModal } from "@/components/global/view-video-modal";

const VideosPage = () => {
  const {
    isLoading,
    data: videos,
    refetch,
  } = useQuery({
    queryKey: [`videos`],
    queryFn: async () => {
      const response = await api.get(`/video`);
      return response?.data?.data;
    },
  });

  const columns = [
    {
      accessorKey: "updatedAt",
      header: "Uploaded On",
      cell: ({ row }: any) => {
        const updatedAt = row.getValue("updatedAt");
        return (
          <div className=" font-medium">
            {moment(updatedAt).format("MMMM Do, YYYY hh:mm A")}
          </div>
        );
      },
    },
    {
      accessorKey: "uploadedBy.email",
      header: "Uploaded By",
    },
    {
      accessorKey: "userEmail",
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: any) => (
        <div className="lowercase">{row.getValue("userEmail")}</div>
      ),
    },
    {
      accessorKey: "eventDate",
      header: () => <div className="">Event Date</div>,
      cell: ({ row }: any) => {
        const eventDate = row.getValue("eventDate");
        return (
          <div className=" font-medium">
            {moment(eventDate).format("MMMM Do, YYYY hh:mm A")}
          </div>
        );
      },
    },
    // {
    //   accessorKey: 'status',
    //   header: () => <div className=''>Status</div>,
    //   cell: ({ row }: any) => {
    //     const status = row.getValue('status');
    //     return <div className=' font-medium'>{status}</div>;
    //   },
    // },
    {
      id: "actions",
      header: () => <div className="text-">Actions</div>,
      cell: ({ row }: any) => {
        const video = row.original;
        return (
          <div className="flex gap-2">
            <FeedbackDialog
              feedbacks={video.feedbacks}
              userEmail={video.userEmail}
            />
            <ViewVideoModal
              videoUrl={video?.videos[video?.videos?.length - 1]?.url}
            />

            <EditVideoDialog video={video} refetch={refetch} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl font-semibold">All Videos</h1>
        <Button
          className="bg-primary text-white w-full md:w-auto"
          href="/upload-video"
        >
          Upload New Video
        </Button>
      </div>

      {!isLoading && (
        <DataTable columns={columns} data={videos} statusFilter={true} />
      )}
    </div>
  );
};

export default VideosPage;
