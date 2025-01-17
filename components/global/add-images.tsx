import React from 'react';
import { Checkbox } from '../ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import DateInput from './date-input';
import { Input } from '../ui/input';

const AddImages = ({ form }: { form: any }) => {
  return (
    <div className='flex flex-col gap-6'>
      <FormField
        control={form.control}
        name={`isEventLogoEnabled`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-start gap-2'>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id={`isEventLogoEnabled`}
              />
              <div className='flex flex-col gap-1'>
                <FormLabel
                  htmlFor={`isEventLogoEnabled`}
                  className='font-semibold'
                >
                  Event Logo/Monogram
                </FormLabel>
                <FormDescription className='text-[13px]'>
                  Recommended Image Size: 150*100
                </FormDescription>
              </div>
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`eventLogo`}
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          placeholder='Picture'
                          type='file'
                          accept='image/*, application/pdf'
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`isThemeBackgroundImageEnabled`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-start gap-2'>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id={`isEventLogoEnabled`}
              />
              <div className='flex flex-col gap-1'>
                <FormLabel
                  htmlFor={`isThemeBackgroundImageEnabled`}
                  className='font-semibold'
                >
                  Theme Background Image
                </FormLabel>
                <FormDescription className='text-[13px]'>
                  Recommended Image Size: 150*100
                </FormDescription>
              </div>
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`themeBackgroundImage`}
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          placeholder='Picture'
                          type='file'
                          accept='image/*, application/pdf'
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`isFooterBackgroundImageEnabled`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-start gap-2'>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id={`isFooterBackgroundImageEnabled`}
              />
              <div className='flex flex-col gap-1'>
                <FormLabel
                  htmlFor={`isFooterBackgroundImageEnabled`}
                  className='font-semibold'
                >
                  Footer Background Image
                </FormLabel>
                <FormDescription className='text-[13px]'>
                  Recommended Image Size: 150*100
                </FormDescription>
              </div>
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`footerBackgroundImage`}
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          placeholder='Picture'
                          type='file'
                          accept='image/*, application/pdf'
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`isThumbnailImageEnabled`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-start gap-2'>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id={`isThumbnailImageEnabled`}
              />
              <div className='flex flex-col gap-1'>
                <FormLabel
                  htmlFor={`isThumbnailImageEnabled`}
                  className='font-semibold'
                >
                  Thumbnail Image
                </FormLabel>
                <FormDescription className='text-[13px]'>
                  Recommended Image Size: 150*100
                </FormDescription>
              </div>
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`thumbnailImage`}
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          placeholder='Picture'
                          type='file'
                          accept='image/*, application/pdf'
                          onChange={(event) =>
                            onChange(
                              event.target.files && event.target.files[0]
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default AddImages;
