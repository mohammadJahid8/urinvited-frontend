import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function BottomButtons() {
  const router = useRouter();
  return (
    <div className='flex w-full items-center justify-center gap-4 sticky bottom-0 py-4 border-t bg-white'>
      <Button onClick={() => router.back()} variant='outline' className='w-28'>
        Previous
      </Button>
      <Button type='submit' className='w-28 bg-[#4A61FF]'>
        Next
      </Button>
    </div>
  );
}
