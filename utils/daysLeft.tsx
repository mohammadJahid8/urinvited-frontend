import moment from "moment";

const daysLeft = (date: any) => {
  if (!date) return null;
  const startDate = moment(date);
  const today = moment();
  const diffDays = startDate.diff(today, "days");
  const diffHours = startDate.diff(today, "hours");

  if (diffDays >= 1) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
  } else if (diffHours >= 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} left`;
  } else {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago`;
  }
};

export default daysLeft;
