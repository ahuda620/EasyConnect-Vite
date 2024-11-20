export default function normalizeDate(date) {
  if (!date) {
    //Return a very old date for missing dates
    return new Date(0); // Default to epoch (Jan 1, 1970)
  }

  if (typeof date === "number") {
    //If it's a Unix timestamp, convert to Date object
    return new Date(date);
  }

  if (typeof date === "string") {
    //Handle human-readable dates ("7 days ago")
    if (date.includes("ago")) {
      const [value, unit] = date.split(" ");
      const amount = parseInt(value, 10);

      if (unit.includes("day")) {
        return new Date(Date.now() - amount * 24 * 60 * 60 * 1000);
      }
      if (unit.includes("month")) {
        return new Date(Date.now() - amount * 30 * 24 * 60 * 60 * 1000);
      }
      if (unit.includes("year")) {
        return new Date(Date.now() - amount * 365 * 24 * 60 * 60 * 1000);
      }
    }
  }

  //Otherwise, attempt to parse it as a date string
  return new Date(date);
}
