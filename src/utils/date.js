// WIB timezone offset: UTC+7
const WIB_OFFSET = 7 * 60 * 60 * 1000; // 7 hours in milliseconds

export function toWIB(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  
  // Check if the date string explicitly indicates UTC (Z suffix)
  const isUtc = /Z$/.test(dateStr);
  
  // Check for explicit offset like +00:00, +07:00, etc.
  const hasOffset = /[+-]\d{2}:?\d{2}$/.test(dateStr);
  
  if (isUtc || hasOffset) {
    // Has explicit timezone (Z or offset) - Date constructor handled conversion to local (WIB)
    return date;
  }
  
  // No timezone indicator - check if the time appears to be in UTC
  // If the time is exactly on the hour (e.g., 02:00:00), it's likely UTC
  // WIB times would typically not be exactly on UTC hour boundaries
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // If time is exactly on UTC hour boundary (00:00:00, 01:00:00, etc.) 
  // and it's not midnight WIB, likely it's UTC
  if (minutes === 0 && seconds === 0 && hours !== 0 && hours !== 7) {
    // Likely UTC time - convert to WIB
    return new Date(date.getTime() + WIB_OFFSET);
  }
  
  // No timezone indicator - assume backend already sends WIB
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