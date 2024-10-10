export default function dateFormatter(jobListing) {
  //Convert joblistng unix timestamps to month/day/year
  const timestamp = jobListing.job_posted_at_timestamp;
  const jobDate = new Date(timestamp * 1000); // Convert to milliseconds
  const currentDate = new Date(); // Get current date

  // Calculate the difference in time (in milliseconds)
  const timeDifference = currentDate - jobDate;

  // Convert the difference to days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference === 0) {
    return "Today";
  } else if (daysDifference === 1) {
    return "1 day ago";
  } else if (daysDifference < 7) {
    return `${daysDifference} days ago`;
  } else if (daysDifference < 30) {
    const weeksDifference = Math.floor(daysDifference / 7);
    return weeksDifference === 1
      ? "1 week ago"
      : `${weeksDifference} weeks ago`;
  } else {
    const monthsDifference = Math.floor(daysDifference / 30);
    return monthsDifference === 1
      ? "1 month ago"
      : `${monthsDifference} months ago`;
  }
}
