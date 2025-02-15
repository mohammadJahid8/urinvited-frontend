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
import { useAppContext } from '@/lib/context';
import api from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';

const videos = [
  {
    uploadedBy: 'John Doe',
    user: 'jahid@gmail.com',
    eventDate: '2024-01-01',
    status: 'Pending',
    comments:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
];

export default function VideoUpload() {
  const { user } = useAppContext();
  const [files, setFiles] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [thInfo, setThInfo] = useState(null);
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [canvaLink, setCanvaLink] = useState('');
  const [thumbnailKey, setThumbnailKey] = useState(Date.now());
  const [fileKey, setFileKey] = useState(Date.now());
  const router = useRouter();

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!files) {
      return toast.error('Please upload a video!', {
        position: 'top-center',
      });
    }
    if (!date) {
      return toast.error('Please select a date!', {
        position: 'top-center',
      });
    }
    if (!email) {
      return toast.error('Please select a email!', {
        position: 'top-center',
      });
    }
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', files);
      formData.append('upload_preset', 'event-upload');
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/ddvrxtfbc/video/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const videourl = response?.data?.secure_url;

      const payload = {
        eventDate: new Date(date).toISOString(),
        userEmail: email,
        uploadedBy: user?._id,
        canvaLink,
        thumbnail,
        url: videourl,
      };

      const newFormData = new FormData();

      for (const key in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
          newFormData.append(key, payload[key as keyof typeof payload]);
        }
      }

      if (videourl) {
        const promise = await api.post(`/video/upload`, newFormData);
        if (promise.status === 200) {
          router.push(`/event-details?id=${promise.data.data.eventId}`);
          setFiles(null);
          setPreview(null);
          setFileInfo(null);
          setThumbnail(null);
          setThumbnailPreview(null);
          setThInfo(null);
          setLoading(false);
          toast.success(`Video uploaded successfully!`);
        }
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      return toast.error(
        error.response.data.message || `Something went wrong!`,
        {
          position: 'top-center',
        }
      );
    }
  };

  const handleFileDelete = async (e: any, type: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (type === 'video') {
        setFiles(null);
        setPreview(null);
        setFileInfo(null);
        setFileKey(Date.now());
      } else {
        setThumbnail(null);
        setThumbnailPreview(null);
        setThInfo(null);
        setThumbnailKey(Date.now());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='max-w-5xl flex-1 space-y-4'>
      <h1 className='text-xl font-semibold'>Upload Video</h1>

      <form onSubmit={handleUpload} className='space-y-4'>
        <div>
          <Label>Enter user email address</Label>

          <Input
            type='email'
            className=''
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />
        </div>

        {/* <div className='border border-gray-200 rounded-lg overflow-x-auto'>
          <Table>
            <TableHeader className='bg-gray-100'>
              <TableRow>
                <TableHead className=''>Uploaded By</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead className=''>Status</TableHead>
                <TableHead className=''>Action</TableHead>
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
                  <TableCell className=''>{video.status}</TableCell>
                  <TableCell className=''>
                    <Button variant='outline' size='sm' href={video.url}>
                      View video
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div> */}

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
              onClick={(e) => handleFileDelete(e, 'video')}
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
        </div>
        {thumbnailPreview !== null && (
          <div className='relative w-80'>
            <img
              src={thumbnailPreview}
              alt='theme'
              className='w-80 rounded-sm'
            />
            <button
              className='absolute -top-2 -right-1 bg-white rounded-full border border-black p-1'
              onClick={(e) => handleFileDelete(e, 'image')}
            >
              <XIcon className='h-4 w-4 text-black ' />
            </button>
          </div>
        )}
        <div>
          <Label>Enter canva edit link</Label>

          <Input
            type='url'
            className=''
            onChange={(e) => setCanvaLink(e.target.value)}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <Label>Enter event date</Label>
          <Input
            type='date'
            className=''
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Button type='submit' size='sm' disabled={loading}>
          {loading ? 'Uploading..' : 'Upload'}
        </Button>
      </form>
    </div>
  );
}
