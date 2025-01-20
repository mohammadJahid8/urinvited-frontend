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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import FontSelector from './fonts-selector';

const ButtonCustomizationForm = ({ form }: { form: any }) => {
  return (
    <div className='flex flex-col gap-6'>
      <FormField
        control={form.control}
        name='buttonText'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <FormLabel className='font-bold'>Button Text</FormLabel>

            <FormControl>
              <Input type='text' placeholder='Enter Button Text' {...field} />
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='buttonFont'
        render={({ field }) => (
          <FontSelector field={field} form={form} label='Button Font' />
        )}
      />

      <FormField
        control={form.control}
        name='buttonColour'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <div className='flex flex-col gap-1'>
              <FormLabel className='font-bold'>Button Colour</FormLabel>
              <FormDescription className='text-[13px]'>
                Select the background color of the button
              </FormDescription>
            </div>

            <FormControl>
              <Input
                type='color'
                placeholder='Enter Button Colour'
                {...field}
              />
            </FormControl>

            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='buttonFormat'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <div className='flex flex-col gap-1'>
              <FormLabel className='font-bold'>Button Format</FormLabel>
              <FormDescription className='text-[13px]'>
                Select button format
              </FormDescription>
            </div>

            <FormControl>
              <RadioGroup
                defaultValue='rectangular'
                onValueChange={field.onChange}
                value={field.value}
                className='flex items-center gap-8'
              >
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-2'>
                    <RadioGroupItem value='rectangular' id='rectangular' />
                    <Label htmlFor='rectangular'>Rectangular</Label>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    className='text-xs bg-gray-100'
                  >
                    Rectangular Button
                  </Button>
                </div>
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='rounded' id='rounded' />
                    <Label htmlFor='rounded'>Rounded</Label>
                  </div>
                  <Button
                    size='sm'
                    variant='outline'
                    className='text-xs bg-gray-100 rounded-full'
                  >
                    Rounded Button
                  </Button>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ButtonCustomizationForm;
