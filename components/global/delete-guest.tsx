import { toast } from 'sonner';
import api from '@/utils/axiosInstance';
import { useAppContext } from '@/lib/context';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

const DeleteGuest = ({ row }: { row: any }) => {
  const { refetchEvent, refetchEvents } = useAppContext();
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this guest?')) {
      try {
        const promise = api.delete(`/rsvp/${row._id}`);
        toast.promise(promise, {
          loading: 'Deleting guest...',
          success: () => {
            refetchEvent();
            refetchEvents();
            return 'Guest deleted successfully';
          },
          error: 'Guest deletion failed',
          position: 'top-center',
        });
      } catch (error: any) {
        console.error(error);

        return toast.error(
          error?.response?.data?.message || `Guest deletion failed`,
          {
            position: 'top-center',
          }
        );
      }
    }
  };

  return (
    <Button size='icon' variant='ghost' onClick={handleDelete}>
      <Trash2 className='h-4 w-4 text-red-600' />
    </Button>
  );
};

export default DeleteGuest;
