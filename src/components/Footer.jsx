import React from 'react';
import { AlertCircle, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-100 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold">Lapor Warga</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform pelaporan masalah publik berbasis peta untuk warga Kota Surabaya yang transparan dan responsif.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Navigasi</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">Beranda</a></li>
              <li><a href="/report" className="text-slate-400 hover:text-emerald-400 transition-colors">Buat Laporan</a></li>
              <li><a href="/tracking" className="text-slate-400 hover:text-emerald-400 transition-colors">Lacak Laporan</a></li>
              <li><a href="/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Informasi</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Syarat Layanan</a></li>
              <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-emerald-500" />
                <a href="mailto:lapor@surabaya.go.id" className="text-slate-400 hover:text-emerald-400 transition-colors">lapor@surabaya.go.id</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-500" />
                <a href="tel:+6231123456" className="text-slate-400 hover:text-emerald-400 transition-colors">(031) 123-4567</a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5" />
                <span className="text-slate-400">Jl. Taman Surya, Surabaya</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2026 Lapor Warga Surabaya. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Facebook</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
