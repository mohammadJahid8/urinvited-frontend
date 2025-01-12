import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { shareUrl } from '@/lib/shareUrl';
import { toast } from 'sonner';

const ShareSocial = ({ id }: { id: string }) => {
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl(id))
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch(() => {
        toast.error('Failed to copy link.');
      });
  };
  return (
    <div className='w-full max-w-full sm:max-w-[900px] mx-auto bg-white rounded-lg overflow-hidden shadow-sm border'>
      <div className='bg-gray-100 p-4 border-b'>
        <h2 className='text-lg sm:text-xl font-bold'>Share On Social Media</h2>
      </div>
      <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
        <p className='text-sm sm:text-base font-semibold'>
          Share event details on social media platform
        </p>

        <div className='flex flex-wrap gap-2 sm:gap-3 w-full'>
          {[
            {
              src: '/linkedin.svg',
              alt: 'Share on LinkedIn',
              name: 'LinkedIn',
              url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl(
                id
              )}&title=testing&summary=testing&source=LinkedIn`,
            },
            {
              src: '/facebook.svg',
              alt: 'Share on Facebook',
              name: 'Facebook',
              url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl(
                id
              )}`,
            },
            {
              src: '/x.svg',
              alt: 'Share on Twitter',
              name: 'Twitter',
              url: `https://x.com/share?url=${shareUrl(id)}`,
            },
            {
              src: '/whatsapp.svg',
              alt: 'Share on WhatsApp',
              name: 'WhatsApp',
              url: `https://wa.me/?text=${shareUrl(id)}`,
            },
            {
              src: '/gmail.svg',
              alt: 'Share via Gmail',
              name: 'Gmail',
              url: `mailto:?subject=testing&body=${shareUrl(id)}`,
            },
            {
              src: '/gmail.svg',
              alt: 'Share on Instagram',
              name: 'Instagram',
              url: `https://www.instagram.com/share?url=${shareUrl(id)}`,
            },
            {
              src: '/messenger.svg',
              alt: 'Share on Messenger',
              name: 'Messenger',
              url: `https://www.messenger.com/new?text=${shareUrl(id)}`,
            },
          ].map((item, index) => (
            <Button
              key={index}
              href={item.url}
              target='_blank'
              variant='outline'
              className='p-2 h-auto bg-gray-50 flex items-center gap-2 px-4 sm:px-8'
            >
              <Image src={item.src} alt={item.alt} width={20} height={20} />{' '}
              <span className='text-xs sm:text-sm'>{item.name}</span>
            </Button>
          ))}
        </div>

        <div className='space-y-1 sm:space-y-2'>
          <label className='text-sm sm:text-base font-semibold'>
            Share link
          </label>
          <div className='flex flex-col sm:flex-row gap-2'>
            <Input value={shareUrl(id)} readOnly className='flex-grow' />
            <Button onClick={handleCopyLink} className='whitespace-nowrap'>
              Copy link
            </Button>
          </div>
        </div>

        <div className='space-y-1 sm:space-y-2'>
          <label className='text-sm sm:text-base font-semibold'>
            Download As
          </label>
          <div className='flex flex-col sm:flex-row gap-2'>
            <Select>
              <SelectTrigger className='w-full sm:w-[380px]'>
                <SelectValue placeholder='Select format' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pdf'>PDF</SelectItem>
                <SelectItem value='docx'>DOCX</SelectItem>
                <SelectItem value='txt'>TXT</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='outline' className='border-primary text-primary'>
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareSocial;
