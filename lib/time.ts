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