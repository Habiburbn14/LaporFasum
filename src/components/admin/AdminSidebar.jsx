import React from 'react';
import { LayoutDashboard, ClipboardList, Map, BarChart3, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminSidebar() {
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
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
          <ClipboardList className="w-5 h-5" />
          Triage Reports
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
          <Map className="w-5 h-5" />
          GIS Map View
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
          <BarChart3 className="w-5 h-5" />
          Analytics
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </a>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => navigate('/admin-login')}
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
