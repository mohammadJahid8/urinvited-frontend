import { Calendar } from '../ui/calendar';

import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

import { FormControl, FormMessage } from '../ui/form';

import { FormItem } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const DateInput = ({ field, label }: { field: any; label: string }) => (
  <FormItem className='w-full'>
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn(
              'w-full pl-3 text-left font-normal',
              !field.value && 'text-muted-foreground'
            )}
          >
            {field.value ? format(field.value, 'PPP') : <span>{label}</span>}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0' align='start'>
        <Calendar
          mode='single'
          selected={field.value}
          onSelect={field.onChange}
          disabled={(date) => date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    <FormMessage />
  </FormItem>
);

export default DateInput;
