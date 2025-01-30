/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef } from 'react';
import { Checkbox } from '../ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

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
                  render={({ field: { value, onChange, ...fieldProps } }) => {
                    const inputRef = useRef<HTMLInputElement>(null);
                    return (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            ref={inputRef}
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
                        {value && (
                          <div className='flex items-center gap-2'>
                            <span>
                              {value.name} ({(value.size / 1024).toFixed(2)} KB)
                            </span>
                            <Button
                              variant='outline'
                              size='icon'
                              onClick={() => {
                                onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = '';
                                }
                              }}
                            >
                              <Trash2 className='w-4 h-4 text-red-500' />
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                id={`isThemeBackgroundImageEnabled`}
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
                  render={({ field: { value, onChange, ...fieldProps } }) => {
                    const inputRef = useRef<HTMLInputElement>(null);
                    return (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            ref={inputRef}
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
                        {value && (
                          <div className='flex items-center gap-2'>
                            <span>
                              {value.name} ({(value.size / 1024).toFixed(2)} KB)
                            </span>
                            <Button
                              variant='outline'
                              size='icon'
                              onClick={() => {
                                onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = '';
                                }
                              }}
                            >
                              <Trash2 className='w-4 h-4 text-red-500' />
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                  render={({ field: { value, onChange, ...fieldProps } }) => {
                    const inputRef = useRef<HTMLInputElement>(null);
                    return (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            ref={inputRef}
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
                        {value && (
                          <div className='flex items-center gap-2'>
                            <span>
                              {value.name} ({(value.size / 1024).toFixed(2)} KB)
                            </span>
                            <Button
                              variant='outline'
                              size='icon'
                              onClick={() => {
                                onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = '';
                                }
                              }}
                            >
                              <Trash2 className='w-4 h-4 text-red-500' />
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                  render={({ field: { value, onChange, ...fieldProps } }) => {
                    const inputRef = useRef<HTMLInputElement>(null);
                    return (
                      <FormItem className='w-full'>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            ref={inputRef}
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
                        {value && (
                          <div className='flex items-center gap-2'>
                            <span>
                              {value.name} ({(value.size / 1024).toFixed(2)} KB)
                            </span>
                            <Button
                              variant='outline'
                              size='icon'
                              onClick={() => {
                                onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = '';
                                }
                              }}
                            >
                              <Trash2 className='w-4 h-4 text-red-500' />
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
