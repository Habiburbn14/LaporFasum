import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';

const READ_STORAGE_KEY = 'laporfasum_read_notifs';

export function loadReadNotificationIds() {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.map(String)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveReadNotificationIds(idSet) {
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(idSet).slice(-200)));
  } catch {
    // ignore storage errors
  }
}

export function normalizeNotifications(payload) {
  const raw = payload?.data?.data ?? payload?.data ?? payload ?? [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.notifikasi)) return raw.notifikasi;
  if (Array.isArray(raw?.notifications)) return raw.notifications;
  return [];
}

export function getNotificationKey(n, index = 0) {
  return String(
    n.id_notifikasi ?? n.id ?? `${n.id_laporan || ''}-${n.created_at || n.waktu || index}`
  );
}

export function getNotificationReportId(n) {
  const direct = n?.id_laporan ?? n?.laporan_id ?? n?.report_id;
  if (direct !== undefined && direct !== null && String(direct).trim() !== '') {
    return String(direct).trim();
  }
  const text = `${n?.judul || ''} ${n?.pesan || ''} ${n?.message || ''}`;
  const match = text.match(/#(\d+)/);
  return match ? match[1] : null;
}

export function notificationTitle(n) {
  return n?.judul || n?.title || n?.nama_notifikasi || n?.message || n?.pesan || 'Notifikasi';
}

export function notificationMessage(n) {
  const title = notificationTitle(n);
  const msg = n?.pesan || n?.message || n?.deskripsi || n?.keterangan || '';
  return msg === title ? '' : msg;
}

export function formatRelativeTime(n) {
  const raw = n?.created_at || n?.waktu || n?.tanggal || n?.timestamp || null;
  if (!raw) return '';
  const date = new Date(raw);
  if (isNaN(date.getTime())) return String(raw);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return `${diffHours} jam lalu`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Kemarin';
  }

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export function isNotificationUnread(n, readIds, key) {
  if (readIds && key && readIds.has(String(key))) return false;
  if (typeof n?.is_read === 'boolean') return !n.is_read;
  if (typeof n?.sudah_dibaca === 'boolean') return !n.sudah_dibaca;
  if (typeof n?.read === 'boolean') return !n.read;
  return true;
}

export function getNotificationVisual(n) {
  const text = `${n?.tipe_notifikasi || ''} ${n?.judul || ''} ${n?.pesan || ''}`.toLowerCase();

  if (text.includes('tolak')) {
    return {
      Icon: XCircle,
      badgeClass: 'bg-rose-50 text-rose-600 ring-1 ring-rose-100',
    };
  }
  if (text.includes('selesai') || text.includes('diterima') || text.includes('setuju')) {
    return {
      Icon: CheckCircle2,
      badgeClass: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
    };
  }
  if (text.includes('verifikasi') || text.includes('proses') || text.includes('tindak')) {
    return {
      Icon: Clock,
      badgeClass: 'bg-amber-50 text-amber-600 ring-1 ring-amber-100',
    };
  }
  return {
    Icon: FileText,
    badgeClass: 'bg-blue-50 text-blue-600 ring-1 ring-blue-100',
  };
}

