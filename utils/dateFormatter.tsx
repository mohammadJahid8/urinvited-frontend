import { formatInTimeZone } from "date-fns-tz";

const dateFormatter = (date = "2025-06-28T00:00:00.000Z") => {
  return formatInTimeZone(date.split("T")[0], "UTC", "MMMM d, yyyy");
};

export default dateFormatter;
