import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const TravelForm = ({ form }: { form: any }) => {
  return (
    <div className='flex flex-col gap-6'>
      <FormField
        control={form.control}
        name={`travelSource`}
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <FormLabel className='font-bold'>Travel Source</FormLabel>
            <FormControl>
              <Input type='text' placeholder='E.g., Cab' {...field} />
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`travelSourceLink`}
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <FormLabel className='font-bold'>Link</FormLabel>
            <FormControl>
              <Input type='url' placeholder='Link' {...field} />
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TravelForm;
