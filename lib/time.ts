/**
 * Formats a date string or Date object into a readable date string (e.g., 01 January 2026).
 */
export const formatDate = (
  date: string | Date,
  locale = "id-ID"
) => {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

/**
 * Formats a date string or Date object into a readable date and time string.
 */
export const formatDateTime = (
  date: string | Date,
  locale = "id-ID"
) => {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

/**
 * Calculates and returns a relative time string (e.g., "5 menit lalu").
 */
export const relativeTime = (date: string | Date) => {
  const now = new Date().getTime();
  const target = new Date(date).getTime();

  const diff = Math.floor((now - target) / 1000);

  if (diff < 60) return `${diff} detik lalu`;

  if (diff < 3600)
    return `${Math.floor(diff / 60)} menit lalu`;

  if (diff < 86400)
    return `${Math.floor(diff / 86400)} hari lalu`;

  return formatDate(date);
};

export const formatInterviewTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${hours}:${minutes} | ${day}/${month}/${year}`;
  } catch {
    return isoString;
  }
};