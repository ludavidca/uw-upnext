export function formatUnixTime(unixTime: number) {
  const date = new Date(unixTime * 1000);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function getDaySuffix(day: number) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const month = months[date.getMonth()];
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes with leading zero if needed
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const daySuffix = getDaySuffix(day);

  return `${month} ${day}${daySuffix} ${hours}:${formattedMinutes}${ampm}`;
}
