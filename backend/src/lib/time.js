const TIME_ZONE = "Asia/Seoul";

function getSeoulParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((p) => [p.type, p.value])
  );
  return {
    dateStr: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour) % 24,
  };
}

export function getTodaySeoul(date = new Date()) {
  const { dateStr, hour } = getSeoulParts(date);
  const period = hour < 12 ? "AM" : "PM";
  return { dateStr, period };
}
