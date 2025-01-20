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
import { useAppContext } from '@/lib/context';
import { googleFonts } from '@/public/fonts';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '../ui/command';
import { cn } from '@/lib/utils';
import FontSelector from './fonts-selector';

const DetailsCustomizationForm = ({ form }: { form: any }) => {
  // const { googleFonts } = useAppContext();

  function loadFont(fontFamily: string) {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      ' ',
      '+'
    )}&display=swap`;

    // Remove existing font link (if any)
    const existingLink = document.getElementById('dynamic-font');
    if (existingLink) {
      existingLink.remove();
    }

    // Add new font link
    const link = document.createElement('link');
    link.id = 'dynamic-font';
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);
  }

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
          <FontSelector field={field} form={form} label='Heading Font' />
        )}
      />

      <FormField
        control={form.control}
        name='dateTimeLocationFont'
        render={({ field }) => (
          <FontSelector
            field={field}
            form={form}
            label='Date/Time/Location Font'
          />
        )}
      />
      <FormField
        control={form.control}
        name='descriptionFont'
        render={({ field }) => (
          <FontSelector field={field} form={form} label='Description Font' />
        )}
      />
    </div>
  );
};

export default DetailsCustomizationForm;
