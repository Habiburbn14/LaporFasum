import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, AlertCircle } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-sm">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent hidden sm:inline">
              Lapor Warga
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className="px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              Beranda
            </Link>
            <Link 
              to="/report" 
              className="px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              Buat Laporan
            </Link>
            <Link 
              to="/tracking" 
              className="px-4 py-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              Lacak Laporan
            </Link>
            <div className="pl-4 border-l border-slate-200">
              <Link 
                to="/login" 
                className="btn-primary"
              >
                Masuk
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-emerald-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              to="/report"
              className="block px-4 py-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Buat Laporan
            </Link>
            <Link
              to="/tracking"
              className="block px-4 py-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Lacak Laporan
            </Link>
            <Link
              to="/login"
              className="block px-4 py-2 btn-primary text-center"
              onClick={() => setIsOpen(false)}
            >
              Masuk
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
