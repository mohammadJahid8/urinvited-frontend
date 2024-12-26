import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Editor } from '@tinymce/tinymce-react';
import { Switch } from '../ui/switch';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '../ui/checkbox';

import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import DateInput from './date-input';

const timeZones = ['Indian Standard Time', 'GMT', 'UTC', 'EST', 'PST'];

const DetailsForm = ({
  form,
  fields,
  append,
  remove,
  hasEndDate,
  setHasEndDate,
}: {
  form: any;
  fields: any;
  append: any;
  remove: any;
  hasEndDate: boolean;
  setHasEndDate: (value: boolean) => void;
}) => {
  const [inviteDetails, setInviteDetails] = useState(false);

  return (
    <div className='flex flex-col gap-6'>
      <FormField
        control={form.control}
        name='hostedBy'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <FormLabel className='font-bold'>Hosted By</FormLabel>
            <FormControl>
              <Input type='text' placeholder='Enter Hosted By' {...field} />
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />

      {fields.map((event: any, index: number) => (
        <EachEvent
          form={form}
          setInviteDetails={setInviteDetails}
          inviteDetails={inviteDetails}
          setHasEndDate={setHasEndDate}
          hasEndDate={hasEndDate}
          key={index}
          index={index}
          remove={remove}
        />
      ))}

      <div
        className='w-full border-dashed border border-gray-300 rounded-lg py-3 text-sm flex items-center justify-center gap-2 cursor-pointer'
        onClick={() =>
          append({
            title: '',
            inviteDetails: false,
            startDate: undefined,
            startTime: undefined,
            timeZone: '',
            endDate: undefined,
            endTime: undefined,
            locationName: '',
            address: '',
            showGoogleMap: false,
            virtualPlatformName: '',
            virtualUrl: '',
            when: 'startDateTime',
            locationType: 'in-person',
          })
        }
      >
        <Plus className='w-4 h-4' />
        Add Another Event
      </div>
    </div>
  );
};

export default DetailsForm;

const EachEvent = ({ form, setHasEndDate, hasEndDate, index, remove }: any) => {
  return (
    <>
      <FormField
        control={form.control}
        name={`events.${index}.title`}
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2 space-y-0'>
            <div className='flex items-center justify-between'>
              <FormLabel className='font-bold'>
                Event Title <span className='text-red-500'>*</span>
              </FormLabel>
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
              <Input type='text' placeholder='Enter Event Title' {...field} />
            </FormControl>
            <FormMessage className='mt-0' />
          </FormItem>
        )}
      />

      {/* Invite Details Section */}
      <FormField
        control={form.control}
        name={`events.${index}.inviteDetails`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>Invite Details</FormLabel>
              <Switch
                id={`events.${index}.inviteDetails`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
            {field.value && (
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
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      {/* When Section */}
      <FormField
        control={form.control}
        name={`events.${index}.when`}
        render={({ field }) => (
          <div className=''>
            <FormLabel className='font-bold'>
              When <span className='text-red-500'>*</span>
            </FormLabel>

            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className='mt-2 flex flex-col gap-4'
            >
              <div className='flex items-center gap-2'>
                <RadioGroupItem
                  value='startDateTime'
                  id={`startDateTime-${index}`}
                />
                <Label
                  htmlFor={`startDateTime-${index}`}
                  className='font-normal'
                >
                  Start date and time
                </Label>
              </div>
              {field.value !== 'tbd' && (
                <div className='flex flex-col gap-2'>
                  <FormField
                    control={form.control}
                    name={`events.${index}.startDate`}
                    render={({ field }) => (
                      <DateInput field={field} label='Pick a date' />
                    )}
                  />
                  <div className='flex gap-4'>
                    <FormField
                      control={form.control}
                      name={`events.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormControl>
                            <Input type='time' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`events.${index}.timeZone`}
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder='Select time zone' />
                            </SelectTrigger>
                            <SelectContent>
                              {timeZones.map((tz) => (
                                <SelectItem key={tz} value={tz}>
                                  {tz}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Add End Date/Time or To Be Determined */}
              {field.value !== 'tbd' && (
                <div className=''>
                  <button
                    type='button'
                    className='text-blue-500 hover:underline font-normal'
                    onClick={() => setHasEndDate((prev: boolean) => !prev)}
                  >
                    Add end date/time (Optional)
                  </button>
                  {hasEndDate && (
                    <div className='flex gap-4 mt-2'>
                      <FormField
                        control={form.control}
                        name={`events.${index}.endDate`}
                        render={({ field }) => (
                          <DateInput field={field} label='Pick a date' />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`events.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormControl>
                              <Input type='time' {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className='flex items-center gap-2'>
                <RadioGroupItem value='tbd' id={`tbd-${index}`} />
                <Label htmlFor={`tbd-${index}`} className='font-normal'>
                  To be determined
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      />

      {/* Location Section */}
      <FormField
        control={form.control}
        name={`events.${index}.locationType`}
        render={({ field }) => (
          <div className=''>
            <FormLabel className='font-bold'>
              Location <span className='text-red-500'>*</span>
            </FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className='mt-2 flex flex-col gap-4'
            >
              <div className='flex items-center gap-2'>
                <RadioGroupItem value='in-person' id={`in-person-${index}`} />
                <Label htmlFor={`in-person-${index}`} className='font-normal'>
                  In person
                </Label>
              </div>
              {field.value === 'in-person' && (
                <div className='flex flex-col gap-2'>
                  <FormField
                    control={form.control}
                    name={`events.${index}.locationName`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder='Location Name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`events.${index}.address`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder='Address' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`events.${index}.showGoogleMap`}
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex items-center gap-2'>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id={`showGoogleMap-${index}`}
                          />
                          <label
                            htmlFor={`showGoogleMap-${index}`}
                            className='font-semibold text-[13px]'
                          >
                            Show Google Map Link
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className='flex items-center gap-2'>
                <RadioGroupItem value='virtual' id={`virtual-${index}`} />
                <Label htmlFor={`virtual-${index}`} className='font-normal'>
                  Virtual
                </Label>
              </div>
              {field.value === 'virtual' && (
                <div className='flex flex-col gap-2 mt-2'>
                  <FormField
                    control={form.control}
                    name={`events.${index}.virtualPlatformName`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            placeholder='Virtual Platform Name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`events.${index}.virtualUrl`}
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input placeholder='URL' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </RadioGroup>
          </div>
        )}
      />
    </>
  );
};
