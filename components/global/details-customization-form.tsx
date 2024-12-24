import React from 'react';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const DetailsCustomizationForm = ({ form }: { form: any }) => {
  return (
    <div className='flex flex-col gap-6'>
      <FormField
        control={form.control}
        name='textColour'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <div className='flex flex-col gap-1'>
              <FormLabel className='font-bold'>Text Colour</FormLabel>
              <FormDescription className='text-[13px]'>
                Select the color of the text
              </FormDescription>
            </div>
            <FormControl>
              <Input type='color' placeholder='Enter Text Colour' {...field} />
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='headingFont'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <FormLabel className='font-bold'>Heading Font</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Heading Font' />
                </SelectTrigger>
                <SelectContent>
                  {['Lato', 'Poppins'].map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='dateTimeLocationFont'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <FormLabel className='font-bold'>Date/Time/Location Font</FormLabel>

            <FormControl>
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Date/Time/Location Font' />
                </SelectTrigger>
                <SelectContent>
                  {['Lato', 'Poppins'].map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='descriptionFont'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <FormLabel className='font-bold'>Description Font</FormLabel>

            <FormControl>
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Description Font' />
                </SelectTrigger>
                <SelectContent>
                  {['Lato', 'Poppins'].map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DetailsCustomizationForm;
