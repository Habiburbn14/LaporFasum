import React from 'react';
import { 
  LayoutDashboard, ClipboardList, BarChart3, Map, Settings, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logoapk from '../assets/Logoapk.svg';

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
    <aside className="w-64 bg-[#0B0F17] text-slate-300 flex flex-col fixed inset-y-0 z-30 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
            <img src={Logoapk} alt="LaporFasum" className="w-full h-full object-cover rounded-[10px]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-base tracking-tight leading-tight">LaporFasum</h2>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">Kabupaten Lamongan</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Pengawasan
        </p>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30 shadow-sm shadow-blue-950/50'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-medium text-sm transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
