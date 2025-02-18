import { format, parse } from 'date-fns';

const convertTime = (timeString: string) => {
  // Parse the time string into a Date object
  const time = parse(timeString, 'HH:mm', new Date());
  // Format the time into a readable format
  return format(time, 'hh:mm a');
};

export default convertTime;
