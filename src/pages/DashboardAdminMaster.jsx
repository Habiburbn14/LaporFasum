import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { INITIAL_REPORTS, MOCK_KECAMATAN } from '../utils/mockData';
import { Search, Filter, BarChart3, MapPin } from 'lucide-react';

function DashboardAdminMaster() {
  const [reports, setReports] = React.useState(INITIAL_REPORTS);
  const [filterStatus, setFilterStatus] = React.useState('');
  const [filterKecamatan, setFilterKecamatan] = React.useState('');

  const filteredReports = reports.filter(r => 
    (!filterStatus || r.status === filterStatus) &&
    (!filterKecamatan || r.kecamatan === filterKecamatan)
  );

  const stats = {
    total: reports.length,
    menunggu: reports.filter(r => r.status === 'Menunggu Verifikasi').length,
    diterima: reports.filter(r => r.status === 'Diterima').length,
    selesai: reports.filter(r => r.status === 'Selesai').length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin Master - Kabupaten Lamongan</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Laporan</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Menunggu Verifikasi</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.menunggu}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Sedang Diproses</p>
            <p className="text-3xl font-bold text-blue-600">{stats.diterima}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Selesai</p>
            <p className="text-3xl font-bold text-green-600">{stats.selesai}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-2">Filter Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Semua Status</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Diterima">Diterima</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-2">Filter Kecamatan</label>
              <select 
                value={filterKecamatan} 
                onChange={(e) => setFilterKecamatan(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Semua Kecamatan</option>
                {MOCK_KECAMATAN.map(kec => (
                  <option key={kec.id} value={kec.nama}>{kec.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Kode Tiket</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Judul</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Kecamatan</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tanggal</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-blue-600">{report.ticket_code}</td>
                  <td className="px-6 py-4">{report.judul}</td>
                  <td className="px-6 py-4">{report.kecamatan}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      report.status === 'Menunggu Verifikasi' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'Diterima' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(report.tanggal).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline text-sm">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default DashboardAdminMaster;
