import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Bell, BellOff, ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../../services/userApi';
import NotificationItem from './NotificationItem';
import {
  getNotificationKey,
  getNotificationReportId,
  isNotificationUnread,
  loadReadNotificationIds,
  normalizeNotifications,
  saveReadNotificationIds,
} from '../../utils/notificationHelpers';

function NotificationPopupUser() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(loadReadNotificationIds);
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
        setNotifications((prev) => [...prev, ...normalized]);
      } else {
        setNotifications(normalized);
      }
      setHasMore(pageNum < totalPages);
    } catch {
      setError('Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  useEffect(() => {
    if (open) fetchNotifications(1, false);
  }, [open, fetchNotifications]);

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
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    if (page > 1) {
      fetchNotifications(page, true);
    }
  }, [page, fetchNotifications]);

  const markAsRead = (keys) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => next.add(String(k)));
      saveReadNotificationIds(next);
      return next;
    });
  };

  const handleItemClick = (n, key) => {
    markAsRead([key]);
    setOpen(false);
    const reportId = getNotificationReportId(n);
    if (reportId) {
      navigate(`/tracking/${encodeURIComponent(reportId)}`);
    } else {
      navigate('/tracking');
    }
  };

  const handleMarkAllRead = () => {
    const allKeys = notifications.map((n, i) => getNotificationKey(n, i));
    markAsRead(allKeys);
  };

  const unreadCount = notifications.filter((n, i) =>
    isNotificationUnread(n, readIds, getNotificationKey(n, i))
  ).length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer"
        aria-label="Notifikasi"
        aria-expanded={open}
      >
        <Bell className="w-4.5 h-4.5 text-white" size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-blue-600" />
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[1199] bg-slate-900/25 backdrop-blur-[1px] pointer-events-auto"
            onClick={() => setOpen(false)}
            style={{ touchAction: 'none' }}
          />

          <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-[1200] bg-white rounded-t-3xl shadow-[0_-12px_40px_rgba(15,23,42,0.16)] border-t border-slate-100 animate-in slide-in-from-bottom-4 duration-200 max-h-[82vh] flex flex-col pointer-events-auto overflow-hidden">
            <div className="pt-2.5 pb-1 flex justify-center bg-white">
              <span className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Notifikasi</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {unreadCount} baru
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Tandai dibaca
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-white pb-[env(safe-area-inset-bottom)]" ref={listRef} onScroll={handleScroll}>
              {loading && notifications.length === 0 && (
                <div className="py-10 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              )}

              {!loading && error && (
                <div className="py-10 px-4 text-center">
                  <p className="text-xs text-red-600">{error}</p>
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
                <div className="py-10 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center mb-2.5">
                    <BellOff className="w-5 h-5 text-slate-300" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">Belum ada notifikasi</p>
                </div>
              )}

              {!loading && !error && notifications.map((n, index) => {
                const key = getNotificationKey(n, index);
                return (
                  <NotificationItem
                    key={key}
                    notification={n}
                    unread={isNotificationUnread(n, readIds, key)}
                    onClick={() => handleItemClick(n, key)}
                  />
                );
              })}

              {hasMore && !loading && (
                <div className="px-4 py-3 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => prev + 1)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center justify-center gap-1"
                  >
                    <ChevronDown className="w-3 h-3" />
                    Muat lebih banyak
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationPopupUser;
