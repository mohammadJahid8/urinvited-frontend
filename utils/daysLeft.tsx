const daysLeft = (date: string | Date, time: string): string | null => {
  if (!date || !time) return null;

  // Ensure date is a string in readable format (e.g., "June 28, 2025")
  const dateString = typeof date === "string" ? date : date.toDateString();
  const fullDateStr = `${dateString}, ${time}`;
  const targetDate = new Date(fullDateStr);
  const now = new Date();

  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) return "Time has already passed";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  let result = "";

  if (days > 0) {
    result += `${days} day${days === 1 ? "" : "s"}`;
  }

  if (hours > 0) {
    if (result) result += " ";
    result += `${hours} hour${hours === 1 ? "" : "s"}`;
  } else if (days === 0 && minutes > 0) {
    if (result) result += " ";
    result += `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  return result + " left";
};

export default daysLeft;
