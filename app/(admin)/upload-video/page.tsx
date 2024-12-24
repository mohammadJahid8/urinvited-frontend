'use client';
/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { XIcon } from 'lucide-react';
import Dropzone from '@/components/global/dropzone';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const videos = [
  {
    uploadedBy: 'John Doe',
    user: 'jahid@gmail.com',
    eventDate: '2024-01-01',
    status: 'Pending',
    comments:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    action: 'View',
  },
];

export default function VideoUpload() {
  const [files, setFiles] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);
  // const { user } = useContext(UserContext);
  const [fileInfo, setFileInfo] = useState(null);
  const [thInfo, setThInfo] = useState(null);
  const [date, setDate] = useState(null);
  const [email, setEmail] = useState('');
  const [canvaLink, setCanvaLink] = useState('');
  const [thumbnailKey, setThumbnailKey] = useState(Date.now());
  const [fileKey, setFileKey] = useState(Date.now());

  // const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   console.log(format(date, 'PPP'));
  //   if (!files) {
  //     return toast.error('Please upload a video!', {
  //       position: 'top-center',
  //     });
  //   }
  //   if (!date) {
  //     return toast.error('Please select a date!', {
  //       position: 'top-center',
  //     });
  //   }
  //   if (!email) {
  //     return toast.error('Please select a email!', {
  //       position: 'top-center',
  //     });
  //   }
  //   try {
  //     setLoading(true);

  //     const formData = new FormData();
  //     formData.append('file', files);
  //     formData.append('upload_preset', 'event-upload');
  //     //dci603uj0
  //     //dbpog1ckt
  //     const response = await axios.post(
  //       `https://api.cloudinary.com/v1_1/ddvrxtfbc/video/upload`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     const videourl = response?.data?.secure_url;

  //     const payload = {
  //       date: format(date, 'PPP'),
  //       uploadedFor: email,
  //       uploadedBy: user?._id,
  //       url: videourl,
  //       thumbnail,
  //       canvaLink,
  //     };

  //     const newFormData = new FormData();

  //     for (const key in payload) {
  //       if (Object.prototype.hasOwnProperty.call(payload, key)) {
  //         newFormData.append(key, payload[key]);
  //       }
  //     }

  //     console.log(newFormData);

  //     console.log(payload);

  //     if (videourl) {
  //       const promise = await axios.post(`/video/upload`, newFormData);
  //       if (promise.status === 200) {
  //         setFiles(null);
  //         setPreview('');
  //         setFileInfo('');
  //         setLoading(false);
  //         toast.success(`Video uploaded successfully!`);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //     return toast.error(
  //       error.response.data.message || `Something went wrong!`,
  //       {
  //         position: 'top-center',
  //       }
  //     );
  //   }
  // };

  // const handleFileDelete = async (e, type) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   try {
  //     if (type === 'video') {
  //       setFiles(null);
  //       setPreview(null);
  //       setFileInfo(null);
  //       setFileKey(Date.now());
  //     } else {
  //       setThumbnail(null);
  //       setThumbnailPreview(null);
  //       setThInfo(null);
  //       setThumbnailKey(Date.now());
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // console.log("thPrev", thumbnailPreview);
  // console.log("thumbnail", thumbnail);

  return (
    <div className='max-w-3xl flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <h1 className='text-xl font-semibold'>Upload Video</h1>

      <form
        // onSubmit={handleUpload}
        className='space-y-4'
      >
        <div>
          <Label>Enter user email address</Label>

          <Input
            type='email'
            className='max-w-96'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='border border-gray-200 rounded-lg overflow-x-auto'>
          <Table>
            <TableHeader className='bg-gray-100'>
              <TableRow>
                <TableHead className='w-[100px]'>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.uploadedBy}>
                  <TableCell className='font-medium'>
                    {video.uploadedBy}
                  </TableCell>
                  <TableCell>{video.user}</TableCell>
                  <TableCell>{video.eventDate}</TableCell>
                  <TableCell className='text-right'>{video.status}</TableCell>
                  <TableCell className='text-right'>{video.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dropzone
          key={fileKey}
          loading={loading}
          onChange={setFiles}
          className='w-full'
          type='video'
          setPreview={setPreview}
          fileInfo={fileInfo}
          setFileInfo={setFileInfo}
        />

        {preview && (
          <div className='relative w-96'>
            <video controls className='w-96 '>
              <source src={preview} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
            <button
              className='absolute -top-2 -right-1 bg-white rounded-full border border-black p-1'
              // onClick={(e) => handleFileDelete(e, 'video')}
            >
              <XIcon className='h-4 w-4 text-black ' />
            </button>
          </div>
        )}

        <div>
          <Label>Upload Video Thumbnail</Label>
          <Dropzone
            key={thumbnailKey}
            loading={loading}
            onChange={setThumbnail}
            className='w-full'
            type='image'
            setPreview={setThumbnailPreview}
            fileInfo={thInfo}
            setFileInfo={setThInfo}
          />
          {thumbnailPreview !== null && (
            <div className='relative w-80'>
              <img
                src={thumbnailPreview}
                alt='theme'
                className='w-80 rounded-sm'
              />
              <button
                className='absolute -top-2 -right-1 bg-white rounded-full border border-black p-1'
                // onClick={(e) => handleFileDelete(e, 'image')}
              >
                <XIcon className='h-4 w-4 text-black ' />
              </button>
            </div>
          )}
        </div>

        <div>
          <Label>Enter canva edit link</Label>

          <Input
            type='url'
            className='max-w-96'
            onChange={(e) => setCanvaLink(e.target.value)}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <Label>Enter event date</Label>
          <Input
            type='date'
            className='max-w-96'
            // onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button type='submit' size='sm' disabled={loading}>
          {loading ? 'Uploading..' : 'Upload'}
        </Button>
      </form>
    </div>
  );
}
