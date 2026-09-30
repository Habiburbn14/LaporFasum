import React from 'react';
import { ChevronRight } from 'lucide-react';

function MenuItem({ icon: Icon, title, subtitle, onClick, hasArrow = true, danger = false }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${danger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
          <Icon className="w-5 h-5" />
        </span>
        <div className="text-left">
          <p className={`font-medium ${danger ? 'text-red-700' : 'text-slate-900'}`}>{title}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {hasArrow && <ChevronRight className="w-4 h-4 text-slate-400" />}
    </button>
  );
}

export default MenuItem;
