import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Camera, Map, User } from 'lucide-react';

function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  const navItems = [
    { to: '/', icon: Home, label: 'Beranda' },
    { to: '/tracking', icon: ClipboardList, label: 'Laporan' },
    { to: '/report', icon: Camera, label: 'Lapor', isCenter: true },
    { to: '/map', icon: Map, label: 'Peta' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  const handleCameraClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      navigate('/report', { state: { photoUrl, file } });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] px-2 pt-6 pb-[calc(0.5rem+env(safe-area-inset-bottom))] relative">
        <div className="flex items-end justify-between">
          {navItems.map(({ to, icon: Icon, label, isCenter }) => {
            const active = pathname === to;

            if (isCenter) {
              return (
                <div key={to} className="flex-1 flex justify-center">
                  <button
                    onClick={handleCameraClick}
                    className="flex flex-col items-center"
                  >
                    <span className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-600/50 ring-4 ring-white -mt-12 transition-transform active:scale-95">
                      <Icon className="w-6 h-6 text-white" />
                    </span>
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={to}
                to={to}
                className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl"
              >
                <Icon
                  className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-slate-400'}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-[11px] font-medium ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default BottomNav;
