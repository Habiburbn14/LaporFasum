import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const SCALA_LAYERS = {
  arteriPrimer: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Arteri%20Primer.geojson',
    color: '#ef4444',
    name: 'Arteri Primer',
    weight: 3.5,
  },
  kolektorPrimer1: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Satu%20(JKP-1).geojson',
    color: '#3b82f6',
    name: 'Kolektor Primer 1',
    weight: 3,
  },
  kolektorPrimer2: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Dua%20(JKP-2).geojson',
    color: '#2563eb',
    name: 'Kolektor Primer 2',
    weight: 2.5,
  },
  kolektorPrimer3: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Tiga%20(JKP-3).geojson',
    color: '#1d4ed8',
    name: 'Kolektor Primer 3',
    weight: 2.5,
  },
  arteriSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Arteri%20Sekunder.geojson',
    color: '#f97316',
    name: 'Arteri Sekunder',
    weight: 2.5,
  },
  kolektorSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Kolektor%20Sekunder.geojson',
    color: '#ea580c',
    name: 'Kolektor Sekunder',
    weight: 2.5,
  },
  lingkunganPrimary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Lingkungan%20Primer.geojson',
    color: '#10b981',
    name: 'Lingkungan Primer',
    weight: 2,
  },
  lingkunganSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Lingkungan%20Sekunder.geojson',
    color: '#059669',
    name: 'Lingkungan Sekunder',
    weight: 2,
  },
  lokalPrimary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Lokal%20Primer.geojson',
    color: '#64748b',
    name: 'Lokal Primer',
    weight: 1.5,
  },
  lokalSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Lokal%20Sekunder.geojson',
    color: '#475569',
    name: 'Lokal Sekunder',
    weight: 1.5,
  },
};

function CustomMap({
  reports = [],
  activeLayers = {},
  baseMap = 'openstreetmap',
  onResetFocus,
  onMarkerClick,
  selectedReport,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({});
  const boundaryLayerRef = useRef(null);
  const markersRef = useRef([]);
  const userLocationMarkerRef = useRef(null);
  const [userCoords, setUserCoords] = useState(null);

  // Pantau lokasi GPS pengguna secara live (Real-time GPS User Dot)
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Render Marker Posisi Pengguna Saat Ini (Pulsing Blue Dot)
  useEffect(() => {
    if (!mapInstanceRef.current || !userCoords) return;
    const map = mapInstanceRef.current;

    if (userLocationMarkerRef.current && map.hasLayer(userLocationMarkerRef.current)) {
      map.removeLayer(userLocationMarkerRef.current);
    }

    const userMarkerIcon = L.divIcon({
      html: `
        <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            width: 38px;
            height: 38px;
            background: rgba(37, 99, 235, 0.25);
            border-radius: 50%;
            animation: user-radar 2s ease-out infinite;
          "></div>
          <div style="
            width: 18px;
            height: 18px;
            background-color: #2563eb;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(37, 99, 235, 0.5);
            position: relative;
            z-index: 2;
          "></div>
        </div>
      `,
      className: 'user-current-gps-pin',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    const marker = L.marker([userCoords.lat, userCoords.lng], {
      icon: userMarkerIcon,
      zIndexOffset: 1000,
    });

    marker.bindTooltip('Posisi Anda Saat Ini', {
      direction: 'top',
      offset: [0, -12],
      className: 'bg-slate-900 text-white text-xs px-2 py-1 rounded shadow font-sans',
    });

    marker.addTo(map);
    userLocationMarkerRef.current = marker;
  }, [userCoords]);

  // Inisialisasi peta Leaflet
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Titik pusat Kabupaten Lamongan
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
      }).setView([-7.1199, 112.3385], 11);

      // Tambahkan zoom control di kanan bawah
      L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Ganti Tile Layer (Peta Dasar)
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (baseMap === 'satellite') {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
    }
  }, [baseMap]);

  // Load Batas Wilayah Kabupaten Lamongan (Garis Merah)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    let isMounted = true;

    fetch('/lamongan.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat batas wilayah');
        return res.json();
      })
      .then((geojsonData) => {
        if (!isMounted || !mapInstanceRef.current) return;

        if (boundaryLayerRef.current && map.hasLayer(boundaryLayerRef.current)) {
          map.removeLayer(boundaryLayerRef.current);
        }

        const boundaryLayer = L.geoJSON(geojsonData, {
          filter: (feature) => {
            // HANYA ambil garis batas wilayah (Polygon / MultiPolygon)
            // Abaikan node Point pusat kota agar tidak memunculkan pin leaflet palsu di Tumenggungan/Lamongan
            return feature.geometry && feature.geometry.type !== 'Point';
          },
          style: {
            color: '#ef4444',       // Garis merah mencolok
            weight: 3.5,            // Ketebalan garis
            opacity: 1,             // Garis solid
            fillColor: '#ef4444',   // Warna dalam area
            fillOpacity: 0.03,      // Transparan lembut agar peta tetap bersih dan jelas
            lineCap: 'round',
            lineJoin: 'round',
          },
        });

        boundaryLayer.addTo(map);
        boundaryLayerRef.current = boundaryLayer;

        const bounds = boundaryLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [20, 20],
            maxZoom: 13,
          });
        }
      })
      .catch((err) => {
        console.error('Error memuat batas Lamongan:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Expose reset focus handler jika di-trigger oleh parent (Tombol Crosshair)
  useEffect(() => {
    if (!onResetFocus || !mapInstanceRef.current) return;

    if (userCoords?.lat && userCoords?.lng) {
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 16, {
        animate: true,
      });
      return;
    }

    if (boundaryLayerRef.current) {
      const bounds = boundaryLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [20, 20],
          animate: true,
        });
      }
    }
  }, [onResetFocus, userCoords]);

  // Load dan Kelola Layer Jalan SCALA (Navigasi Jalan)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Hapus layer jalan yang tidak aktif lagi
    Object.keys(layersRef.current).forEach((layerKey) => {
      if (!activeLayers[layerKey]) {
        if (map.hasLayer(layersRef.current[layerKey])) {
          map.removeLayer(layersRef.current[layerKey]);
        }
        delete layersRef.current[layerKey];
      }
    });

    // Tambahkan layer jalan yang aktif
    const activeKeys = Object.keys(activeLayers).filter((key) => activeLayers[key]);

    activeKeys.forEach((layerKey) => {
      if (layersRef.current[layerKey]) return;

      const layerConfig = SCALA_LAYERS[layerKey];
      if (!layerConfig) return;

      fetch(layerConfig.url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((geojsonData) => {
          if (!mapInstanceRef.current) return;
          if (!activeLayers[layerKey]) return;

          const roadLayer = L.geoJSON(geojsonData, {
            style: {
              color: layerConfig.color,
              weight: layerConfig.weight,
              opacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round',
            },
          });

          roadLayer.addTo(map);
          layersRef.current[layerKey] = roadLayer;
        })
        .catch((err) => {
          console.warn(`Layer jalan ${layerConfig.name} tidak dapat dimuat:`, err);
        });
    });
  }, [activeLayers]);

  // Titik Lokasi Laporan Warga (Interactive Pulse Markers)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Hapus marker lama
    markersRef.current.forEach((marker) => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Tambahkan marker laporan baru
    (reports || []).forEach((report) => {
      const lat = parseFloat(report.lat);
      const lng = parseFloat(report.lng);
      if (isNaN(lat) || isNaN(lng)) return;

      const statusColor = {
        'Menunggu Verifikasi': '#f59e0b',
        'Diterima': '#3b82f6',
        'Sedang Diproses': '#8b5cf6',
        'Selesai': '#10b981',
        'Ditolak': '#ef4444',
      }[report.status] || '#3b82f6';

      const isSelected = selectedReport && (selectedReport.id === report.id || selectedReport.ticket_code === report.ticket_code);

      const pinHtml = `
        <div style="
          width: ${isSelected ? '36px' : '30px'};
          height: ${isSelected ? '44px' : '38px'};
          position: relative;
          cursor: pointer;
          transform: ${isSelected ? 'scale(1.15) translateY(-4px)' : 'scale(1)'};
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
        ">
          <svg viewBox="0 0 24 32" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="${statusColor}"/>
            <circle cx="12" cy="11" r="5" fill="#ffffff"/>
            <circle cx="12" cy="11" r="2.5" fill="${statusColor}"/>
          </svg>
        </div>
      `;

      const markerIcon = L.divIcon({
        html: pinHtml,
        iconSize: [isSelected ? 36 : 30, isSelected ? 44 : 38],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 44 : 38],
        className: 'custom-report-pin',
      });

      const marker = L.marker([lat, lng], { icon: markerIcon });
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(report));
      }
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [reports, selectedReport, onMarkerClick]);

  // Focus ke titik laporan yang dipilih
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedReport) return;
    const lat = parseFloat(selectedReport.lat);
    const lng = parseFloat(selectedReport.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
    }
  }, [selectedReport]);

  return <div ref={mapRef} className="w-full h-full" />;
}

export default CustomMap;
