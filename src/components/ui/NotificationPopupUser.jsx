import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Bell, BellOff, ChevronDown, Loader2 } from 'lucide-react';
import { getNotifications } from '../../services/userApi';

const normalizeNotifications = (payload) => {
  const raw = payload?.data?.data ?? payload?.data ?? payload ?? [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.notifikasi)) return raw.notifikasi;
  if (Array.isArray(raw?.notifications)) return raw.notifications;
  return [];
};

const notificationTitle = (n) =>
  n.judul || n.title || n.nama_notifikasi || n.message || n.pesan || 'Notifikasi';

const notificationMessage = (n) =>
  n.pesan || n.message || n.deskripsi || n.keterangan || '';

const notificationTime = (n) => {
  const raw = n.created_at || n.waktu || n.tanggal || n.timestamp || null;
  if (!raw) return '';
  const date = new Date(raw);
  if (isNaN(date.getTime())) return String(raw);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isUnread = (n) => {
  if (typeof n.is_read === 'boolean') return !n.is_read;
  if (typeof n.sudah_dibaca === 'boolean') return !n.sudah_dibaca;
  if (typeof n.read === 'boolean') return !n.read;
  return true;
};

function NotificationPopupUser() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications();
      const normalized = normalizeNotifications(res.data);
      const pagination = res.data?.pagination || res.data?.meta || {};
      const totalPages = pagination.total_pages || pagination.last_page || 1;
      
      if (append) {
        setNotifications(prev => [...prev, ...normalized]);
      } else {
        setNotifications(normalized);
      }
      setHasMore(pageNum < totalPages);
    } catch (err) {
      setError('Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount for badge count
  useEffect(() => {
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  // Fetch fresh data when opening
  useEffect(() => {
    if (open) fetchNotifications(1, false);
  }, [open, fetchNotifications]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
      fetchNotifications(page, true);
    }
  }, [page, fetchNotifications]);

  const unreadCount = notifications.filter(isUnread).length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        aria-label="Notifikasi"
        aria-expanded={open}
      >
        <Bell className="w-4.5 h-4.5 text-white" size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-blue-600" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 z-[1200] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Notifikasi</h3>
            {unreadCount > 0 && (
              <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {unreadCount} baru
              </span>
            )}
          </div>

          <div className="max-h-[70vh] min-h-[400px] overflow-y-auto" ref={listRef} onScroll={handleScroll}>
            {loading && notifications.length === 0 && (
              <div className="py-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            )}

            {!loading && error && (
              <div className="py-8 px-4 text-center">
                <p className="text-xs text-red-500">{error}</p>
                <button
                  type="button"
                  onClick={() => fetchNotifications(1, false)}
                  className="mt-2 text-xs font-medium text-blue-600 hover:underline"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="py-8 flex flex-col items-center justify-center text-center px-4">
                <BellOff className="w-7 h-7 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">Belum ada notifikasi</p>
              </div>
            )}

            {!loading && !error && notifications.map((n, index) => (
              <div
                key={n.id_notifikasi || n.id || index}
                className="px-4 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  {isUnread(n) && (
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {notificationTitle(n)}
                    </p>
                    {notificationMessage(n) && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {notificationMessage(n)}
                      </p>
                    )}
                    {notificationTime(n) && (
                      <p className="text-[11px] text-slate-400 mt-1">{notificationTime(n)}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {hasMore && !loading && (
              <div className="px-4 py-3 text-center border-t border-slate-100">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
                >
                  <ChevronDown className="w-3 h-3" />
                  Muat lebih banyak
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPopupUser;