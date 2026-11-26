import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { getAdminIdentity } from '../../utils/adminIdentity';

export function AdminUserBadge() {
  const user = useAuthStore((state) => state.user);
  const identity = getAdminIdentity(user);

  return (
    <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
        {identity.initials.charAt(0)}
      </div>
      <div className="hidden md:block">
        <p className="text-xs font-semibold text-slate-900 leading-tight">
          {identity.title}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <p className="text-[10px] text-slate-500">{identity.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminUserBadge;

