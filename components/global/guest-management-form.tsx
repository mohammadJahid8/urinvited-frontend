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
import { Input } from '../ui/input';

const GuestManagementForm = ({ form }: { form: any }) => {
  return (
    <div className='flex flex-col gap-6'>
      <FormField
        control={form.control}
        name={`allowAdditionalAttendees`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>
                Allow guest to bring additional attendees
              </FormLabel>

              <Switch
                id={`allowAdditionalAttendees`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`additionalAttendees`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          placeholder='Number of additional attendees'
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
        name={`isMaximumCapacitySet`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>Set maximum capacity</FormLabel>

              <Switch
                id={`isMaximumCapacitySet`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`maximumCapacity`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          type='number'
                          {...field}
                          placeholder='Maximum capacity'
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
        name={`trackAttendees`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>
                Track attendees: adults, children, infants
              </FormLabel>

              <Switch
                id={`trackAttendees`}
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
        name={`sendReminderToAttendees`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>
                Send reminder to guest who are attending{' '}
              </FormLabel>

              <Switch
                id={`sendReminderToAttendees`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>

            {field.value === true && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name={`attendingReminderDate`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <DateInput
                          field={field}
                          label='Number of days before the event'
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
        name={`allowUpdateRsvpAfterSubmission`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>
                Allow guests to update their RSVP after submitting
              </FormLabel>

              <Switch
                id={`allowUpdateRsvpAfterSubmission`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default GuestManagementForm;
