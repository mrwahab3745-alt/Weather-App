function getLocalDate(timestamp, timezoneOffset) {
  return new Date((timestamp + timezoneOffset) * 1000);
}

export function formatClockTime(timestamp, timezoneOffset) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(getLocalDate(timestamp, timezoneOffset));
}

export function formatLocalDateTime(timestamp, timezoneOffset) {
  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).formatToParts(getLocalDate(timestamp, timezoneOffset));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return `${values.weekday}, ${values.day} ${values.month}, ${values.hour}:${values.minute} ${values.dayPeriod}`;
}
