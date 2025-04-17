import { formatInTimeZone } from "date-fns-tz";

const dateFormatter = (date: string) => {
  return formatInTimeZone(date.split("T")[0], "UTC", "MMMM d, yyyy");
};

export default dateFormatter;
