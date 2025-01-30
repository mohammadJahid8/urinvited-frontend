import moment from 'moment';

const daysLeft = (date: any) => {
  const startDate = moment(date);
  const today = moment();
  const diffDays = startDate.diff(today, 'days');
  const diffHours = startDate.diff(today, 'hours');

  if (diffDays >= 1) {
    return `${diffDays} days left`;
  } else if (diffHours >= 0) {
    return `${diffHours} hours left`;
  } else {
    return `${Math.abs(diffDays)} days ago`;
  }
};

export default daysLeft;
