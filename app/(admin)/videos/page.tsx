'use client';
import { DataTable } from '@/components/global/data-table';
import { Button } from '@/components/ui/button';
import api from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FeedbackDialog } from '@/components/global/feedback-dialog';
import { EditVideoDialog } from '@/components/global/edit-video-dialog';

// const videos = [
//   {
//     uploadedBy: 'John Doe',
//     user: 'jahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Admin',
//     user: 'admin@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'Nahid',
//     user: 'nahid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
//   {
//     uploadedBy: 'test',
//     user: 'nahtestid@gmail.com',
//     eventDate: '2024-01-01',
//     status: 'Pending',
//     comments:
//       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
//     url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
//   },
// ];

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
      accessorKey: 'createdAt',
      header: 'Uploaded On',
      cell: ({ row }: any) => {
        const createdAt = row.getValue('createdAt');
        return (
          <div className=' font-medium'>
            {moment(createdAt).format('DD-MM-YYYY hh:mm A')}
          </div>
        );
      },
    },
    {
      accessorKey: 'uploadedBy.email',
      header: 'Uploaded By',
    },
    {
      accessorKey: 'userEmail',
      header: ({ column }: any) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }: any) => (
        <div className='lowercase'>{row.getValue('userEmail')}</div>
      ),
    },
    {
      accessorKey: 'eventDate',
      header: () => <div className=''>Event Date</div>,
      cell: ({ row }: any) => {
        const eventDate = row.getValue('eventDate');
        return (
          <div className=' font-medium'>
            {moment(eventDate).format('DD-MM-YYYY hh:mm A')}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: () => <div className=''>Status</div>,
      cell: ({ row }: any) => {
        const status = row.getValue('status');
        return <div className=' font-medium'>{status}</div>;
      },
    },
    {
      id: 'actions',
      header: () => <div className='text-'>Actions</div>,
      cell: ({ row }: any) => {
        const video = row.original;
        return (
          <div className='flex gap-2'>
            <FeedbackDialog
              feedbacks={video.feedbacks}
              userEmail={video.userEmail}
            />
            <Button
              variant='outline'
              size='sm'
              href={video?.videos[video?.videos?.length - 1]?.url}
              target='_blank'
            >
              View Video
            </Button>

            <EditVideoDialog video={video} refetch={refetch} />
          </div>
        );
      },
    },
  ];

  return (
    <div className=''>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <h1 className='text-xl font-semibold'>All Videos</h1>
        <Button
          className='bg-primary text-white w-full md:w-auto'
          href='/upload-video'
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
