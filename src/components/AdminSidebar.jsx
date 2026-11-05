import React from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/admin/master', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/triage', label: 'Triage Reports', icon: ClipboardList },
  { path: '/admin/gis', label: 'GIS Map View', icon: Map },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({ activePath, onLogout }) {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
          L
        </div>
        <div>
          <h2 className="text-white font-bold text-base leading-tight">LaporFasum</h2>
          <p className="text-xs text-slate-400">Lamongan Admin</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 text-red-400 font-medium text-sm transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;