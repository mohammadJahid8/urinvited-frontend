import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '../ui/form';
import { Switch } from '../ui/switch';

const GuestEngagementForm = ({ form }: { form: any }) => {
  return (
    <div className='flex flex-col gap-6'>
      <FormField
        control={form.control}
        name={`isAddToCalendar`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>Add to calendar</FormLabel>

              <Switch
                id={`isAddToCalendar`}
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
        name={`reactToEvent`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>
                Allow guest to react the invitation
              </FormLabel>

              <Switch
                id={`reactToEvent`}
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
        name={`shareEvent`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center gap-2 justify-between'>
              <FormLabel className='font-bold'>
                Allow guest to share the invitation
              </FormLabel>

              <Switch
                id={`shareEvent`}
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
        name={`commentOnEvent`}
        render={({ field }) => (
          <FormItem>
            <div className='flex items-start gap-2 justify-between'>
              <div>
                <FormLabel className='font-bold'>
                  Allow guests to leave a comment on the RSVP page
                </FormLabel>
                <FormDescription>
                  If not enabled, this message will only be visible to you on
                  the track RSVP page
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
    </div>
  );
};

export default GuestEngagementForm;
