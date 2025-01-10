import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Switch } from '../ui/switch';

import { Checkbox } from '../ui/checkbox';

import DateInput from './date-input';

const RsvpForm = ({ form, fields }: { form: any; fields: any }) => {
  return (
    <div className='flex flex-col gap-6'>
      <FormField
        control={form.control}
        name={`requestRsvps`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <div>
                <FormLabel className='font-bold'>Request RSVPs</FormLabel>
                <FormDescription>
                  Collect Yes/ No RSVPs from your guest
                </FormDescription>
              </div>
              <Switch
                id={`requestRsvps`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`isRsvpDueDateSet`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>Set the RSVP due date</FormLabel>

              <Switch
                id={`requestRsvps`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`rsvpDueDate`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <DateInput field={field} label='Pick a date' />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`allowRsvpAfterDueDate`}
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center gap-2'>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id={`allowRsvpAfterDueDate`}
                        />
                        <label
                          htmlFor={`allowRsvpAfterDueDate`}
                          className='font-semibold text-[13px]'
                        >
                          Allow RSVPs after the due date
                        </label>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </FormItem>
        )}
      />
      {/* <FormField
        control={form.control}
        name={`isAutoReminderSet`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <div>
                <FormLabel className='font-bold'>
                  Set the auto reminder date
                </FormLabel>
                <FormDescription>
                  Send an automatic reminder to guest who have not responded
                </FormDescription>
              </div>

              <Switch
                id={`isAutoReminderSet`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`autoReminderDate`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <DateInput field={field} label='Pick a date' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </FormItem>
        )}
      /> */}
    </div>
  );
};

export default RsvpForm;
