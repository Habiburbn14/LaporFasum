import React from 'react';
import { Search, Bell } from 'lucide-react';

function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10 ml-64">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticket ID, location, or keyword..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            alt="Admin"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Admin Kabupaten</p>
            <p className="text-[11px] text-slate-500">Dinas PUPR Lamongan</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
