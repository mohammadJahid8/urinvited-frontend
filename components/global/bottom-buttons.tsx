import { Button } from '@/components/ui/button';

export default function BottomButtons() {
  return (
    <div className='flex w-full items-center justify-center gap-4 sticky bottom-0 py-4 border-t bg-white'>
      <Button variant='outline' className='w-28'>
        Cancel
      </Button>
      <Button type='submit' className='w-28 bg-[#4A61FF]'>
        Next
      </Button>
    </div>
  );
}
