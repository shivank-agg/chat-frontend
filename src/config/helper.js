export function timeAgo(date) {
  const utcDate = new Date(date);

  // Convert UTC → IST
  const indiaDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

  const seconds = Math.floor((new Date() - indiaDate) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let unit in intervals) {
    const value = Math.floor(seconds / intervals[unit]);

    if (value >= 1) {
      return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
