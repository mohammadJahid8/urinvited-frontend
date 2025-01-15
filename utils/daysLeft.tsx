import moment from 'moment';

const daysLeft = (date: any) => {
  const startDate = moment(date);
  const today = moment();
  const diff = startDate.diff(today, 'days');
  return diff >= 0 ? `${diff} days left` : `${Math.abs(diff)} days ago`;
};

export default daysLeft;
