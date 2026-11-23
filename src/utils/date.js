// WIB timezone offset: UTC+7
const WIB_OFFSET = 7 * 60 * 60 * 1000; // 7 hours in milliseconds

export function toWIB(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  // If the date string has timezone info (Z or offset), 
  // new Date() already converts to local timezone (WIB).
  // Only add offset if there's NO timezone info (naive datetime).
  const hasTimezone = /Z|[+-]\d{2}:?\d{2}$/.test(dateStr);
  if (!hasTimezone) {
    // Naive datetime - assume it's UTC, convert to WIB
    return new Date(date.getTime() + WIB_OFFSET);
  }
  // Has timezone (Z or offset) - already converted to local by Date constructor
  return date;
}

export function timeAgo(dateStr) {
  if (!dateStr) return '-';
  const date = toWIB(dateStr);
  if (!date) return '-';
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export function formatDateFull(dateStr) {
  if (!dateStr) return '-';
  const date = toWIB(dateStr);
  if (!date) return '-';
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dayName}, ${day} ${month} ${year} - ${hours}:${minutes} WIB`;
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '-';
  const date = toWIB(dateStr);
  if (!date) return '-';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const date = toWIB(dateStr);
  if (!date) return '-';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} WIB`;
}