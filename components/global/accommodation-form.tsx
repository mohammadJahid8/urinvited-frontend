import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Editor } from '@tinymce/tinymce-react';

import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';

const AccommodationForm = ({
  form,
  fields,
  append,
  remove,
}: {
  form: any;
  fields: any;
  append: any;
  remove: any;
}) => {
  return (
    <div className='flex flex-col gap-6'>
      {fields.map((accommodation: any, index: number) => (
        <EachAccommodation
          form={form}
          key={index}
          index={index}
          remove={remove}
        />
      ))}

      <div
        className='w-full border-dashed border border-gray-300 rounded-lg py-3 text-sm flex items-center justify-center gap-2 cursor-pointer'
        onClick={() =>
          append({
            accommodationName: '',
            location: '',
            note: '',
          })
        }
      >
        <Plus className='w-4 h-4' />
        Add Another Registry
      </div>
    </div>
  );
};

export default AccommodationForm;

const EachAccommodation = ({ form, index, remove }: any) => {
  return (
    <>
      <FormField
        control={form.control}
        name={`accommodation.${index}.accommodationName`}
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <div className='flex items-center justify-between'>
              <FormLabel className='font-bold'>Accommodation Name</FormLabel>
              {index > 0 && (
                <Button
                  variant='outline'
                  size='icon'
                  className=''
                  onClick={() => remove(index)}
                >
                  <Trash2 className='w-4 h-4 text-red-500' />
                </Button>
              )}
            </div>
            <FormControl>
              <Input type='text' placeholder='E.g., Hotel Name' {...field} />
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`accommodation.${index}.location`}
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <FormLabel className='font-bold'>Location</FormLabel>
            <FormControl>
              <Input type='text' placeholder='Select Address' {...field} />
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`accommodation.${index}.note`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-bold'>Note</FormLabel>
            <FormControl>
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY as string}
                value={field.value}
                init={{
                  height: 200,
                  menubar: false,
                  branding: false,
                  statusbar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                    'fontsize textcolor',
                  ],
                  toolbar:
                    'undo redo | formatselect fontselect fontfamily fontsize | bold italic backcolor forecolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help',
                }}
                onEditorChange={(content) => field.onChange(content)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};