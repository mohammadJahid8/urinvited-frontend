import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { googleFonts } from '@/public/fonts';

interface FontSelectorProps {
  field: any;
  form: any;
  label?: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  field,
  form,
  label = 'Select Font',
}) => {
  const [open, setOpen] = React.useState(false);

  const memoizedGoogleFonts = React.useMemo(() => googleFonts, []);

  return (
    <div className='flex flex-col gap-2 space-y-0'>
      {label && <label className='font-bold text-sm'>{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            className={cn(
              'justify-between',
              !field.value && 'text-muted-foreground'
            )}
          >
            {field.value
              ? memoizedGoogleFonts.find((font) => font.family === field.value)
                  ?.family
              : 'Select Font'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandInput placeholder='Search font...' />

            <CommandList>
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup>
                {memoizedGoogleFonts.map((font: any) => (
                  <CommandItem
                    value={font.family}
                    key={font.family}
                    onSelect={() => {
                      form.setValue(field.name, font.family);
                    }}
                  >
                    {font.family}
                    <Check
                      className={cn(
                        'ml-auto',
                        font.family === field.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FontSelector;
