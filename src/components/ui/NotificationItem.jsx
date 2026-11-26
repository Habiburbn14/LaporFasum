import React from 'react';
import {
  formatRelativeTime,
  getNotificationVisual,
  notificationMessage,
  notificationTitle,
} from '../../utils/notificationHelpers';

export function NotificationItem({ notification, unread, onClick }) {
  const { Icon, badgeClass } = getNotificationVisual(notification);
  const title = notificationTitle(notification);
  const message = notificationMessage(notification);
  const time = formatRelativeTime(notification);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 flex items-start gap-3.5 hover:bg-slate-50/90 active:bg-slate-100/80 transition-colors border-b border-slate-100/80 last:border-b-0 cursor-pointer group"
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${badgeClass}`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors truncate">
          {title}
        </p>
        {message && (
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
            {message}
          </p>
        )}
        {time && (
          <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
            {time}
          </p>
        )}
      </div>

      {unread && (
        <span
          className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2 ring-2 ring-blue-100"
          aria-label="Belum dibaca"
        />
      )}
    </button>
  );
}

export default NotificationItem;

