'use client';
import Navbar from '@/components/global/navbar';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/context';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const PublicLayout = ({ children }: any) => {
  const { user } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preview = searchParams.get('preview');
  return (
    <div className=''>
      {user && <Navbar />}
      {preview && (
        <Button
          variant='special'
          className='flex items-center gap-2'
          onClick={() => router.back()}
        >
          <ArrowLeft />
          <span>Go Back</span>
        </Button>
      )}
      <div className='h-[calc(100vh-64px)] overflow-y-auto'>{children}</div>
    </div>
  );
};

export default PublicLayout;
