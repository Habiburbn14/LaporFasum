import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRoadNetwork } from '../services/userApi';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const ROAD_LAYERS = {
  // Old endpoints (keep for backward compatibility)
  nasional: {
    color: '#dc2626',
    name: 'Jalan Nasional',
    weight: 4,
    count: '—',
    endpoint: 'nasional',
  },
  provinsi: {
    color: '#3b82f6',
    name: 'Jalan Provinsi',
    weight: 3,
    count: '—',
    endpoint: 'provinsi',
  },
  kabupaten: {
    color: '#f97316',
    name: 'Jalan Kabupaten',
    weight: 2.5,
    count: '—',
    endpoint: 'kabupaten',
  },
  kecamatan: {
    color: '#10b981',
    name: 'Jalan Kecamatan',
    weight: 2,
    count: '—',
    endpoint: 'kecamatan',
  },
  // New 11 endpoints
  'arteri-primer': {
    color: '#dc2626',
    name: 'Jalan Arteri Primer',
    weight: 4,
    count: '—',
    endpoint: 'arteri-primer',
  },
  'kolektor-primer-1': {
    color: '#ef4444',
    name: 'Jalan Kolektor Primer 1',
    weight: 3.5,
    count: '—',
    endpoint: 'kolektor-primer-1',
  },
  'kolektor-primer-2': {
    color: '#f97316',
    name: 'Jalan Kolektor Primer 2',
    weight: 3.5,
    count: '—',
    endpoint: 'kolektor-primer-2',
  },
  'kolektor-primer-3': {
    color: '#fb923c',
    name: 'Jalan Kolektor Primer 3',
    weight: 3,
    count: '—',
    endpoint: 'kolektor-primer-3',
  },
  'arteri-sekunder': {
    color: '#f59e0b',
    name: 'Jalan Arteri Sekunder',
    weight: 3,
    count: '—',
    endpoint: 'arteri-sekunder',
  },
  'kolektor-primer-4': {
    color: '#fde047',
    name: 'Jalan Kolektor Primer 4',
    weight: 2.5,
    count: '—',
    endpoint: 'kolektor-primer-4',
  },
  'kolektor-sekunder': {
    color: '#a3e635',
    name: 'Jalan Kolektor Sekunder',
    weight: 2.5,
    count: '—',
    endpoint: 'kolektor-sekunder',
  },
  'lingkungan-primer': {
    color: '#4ade80',
    name: 'Jalan Lingkungan Primer',
    weight: 2,
    count: '—',
    endpoint: 'lingkungan-primer',
  },
  'lingkungan-sekunder': {
    color: '#22c55e',
    name: 'Jalan Lingkungan Sekunder',
    weight: 2,
    count: '—',
    endpoint: 'lingkungan-sekunder',
  },
  'lokal-primer': {
    color: '#06b6d4',
    name: 'Jalan Lokal Primer',
    weight: 1.5,
    count: '—',
    endpoint: 'lokal-primer',
  },
  'lokal-sekunder': {
    color: '#0ea5e9',
    name: 'Jalan Lokal Sekunder',
    weight: 1.5,
    count: '—',
    endpoint: 'lokal-sekunder',
  },
};

function CustomMap({
  reports = [],
  activeLayers = {},
  baseMap = 'openstreetmap',
  onResetFocus,
  onMarkerClick,
  selectedReport,
  onLocationFound,
  onLocationError,
  onLayerLoadingChange,
  kecamatanGeoJSON = null,
  selectedKecamatan = null,
  onKecamatanSelect,
  userCoords = null,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({});
  const boundaryLayerRef = useRef(null);
  const markersRef = useRef([]);
  const userLocationMarkerRef = useRef(null);
  const lastFocusTriggerRef = useRef(null);
  const [internalUserCoords, setInternalUserCoords] = useState(null);

  // Pantau lokasi GPS pengguna secara live (Real-time GPS User Dot)
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setInternalUserCoords({
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
    const currentCoords = userCoords || internalUserCoords;
    if (!mapInstanceRef.current || !currentCoords) return;
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

    const markerCoords = userCoords || internalUserCoords;
    const marker = L.marker([markerCoords.lat, markerCoords.lng], {
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
  }, [userCoords, internalUserCoords]);

  // Inisialisasi peta Leaflet
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Titik pusat Kabupaten Lamongan
      const center = [-7.169249504786527, 112.33849173392773];
      const bounds = L.latLngBounds(
        [-7.5, 111.8],  // Southwest (lebih lebar dari Lamongan)
        [-6.8, 113.0]   // Northeast (lebih lebar dari Lamongan)
      );

      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0, // Mencegah drag keluar batas
        minZoom: 10,
      }).setView(center, 11);

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
            color: '#2563eb',       // Garis biru mencolok (sesuai theme)
            weight: 3.5,            // Ketebalan garis
            opacity: 1,             // Garis solid
            fillColor: '#2563eb',   // Warna dalam area
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

  // Load Kecamatan Boundaries (Arsir/Block Warna)
  const kecamatanLayerRef = useRef(null);
  useEffect(() => {
    if (!mapInstanceRef.current || !kecamatanGeoJSON) return;
    const map = mapInstanceRef.current;

    if (kecamatanLayerRef.current && map.hasLayer(kecamatanLayerRef.current)) {
      map.removeLayer(kecamatanLayerRef.current);
    }

    const kecamatanLayer = L.geoJSON(kecamatanGeoJSON, {
      filter: (feature) => feature.geometry && feature.geometry.type !== 'Point',
      style: (feature) => {
        const isSelected = selectedKecamatan && feature.properties.nama_kecamatan === selectedKecamatan.nama_kecamatan;
        return {
          color: isSelected ? '#2563eb' : '#64748b',
          weight: isSelected ? 3 : 1.5,
          opacity: isSelected ? 1 : 0.8,
          fillColor: isSelected ? '#2563eb' : '#94a3b8',
          fillOpacity: isSelected ? 0.25 : 0.08,
          lineCap: 'round',
          lineJoin: 'round',
        };
      },
      onEachFeature: (feature, layer) => {
        if (onKecamatanSelect) {
          layer.on('click', () => {
            onKecamatanSelect(feature.properties);
          });
          
          // Highlight on hover
          layer.on('mouseover', () => {
            layer.setStyle({
              weight: 3,
              fillOpacity: 0.2,
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          });
          
          layer.on('mouseout', () => {
            const isSelected = selectedKecamatan && feature.properties.nama_kecamatan === selectedKecamatan.nama_kecamatan;
            layer.setStyle({
              weight: isSelected ? 3 : 1.5,
              fillOpacity: isSelected ? 0.25 : 0.08,
            });
          });
        }
        
        // Tooltip
        layer.bindTooltip(feature.properties.nama_kecamatan, {
          direction: 'center',
          className: 'bg-slate-900 text-white text-xs px-2 py-1 rounded shadow font-sans',
          sticky: true,
        });
      },
    });

    kecamatanLayer.addTo(map);
    kecamatanLayerRef.current = kecamatanLayer;
  }, [kecamatanGeoJSON, selectedKecamatan, onKecamatanSelect]);

  // Expose reset focus handler jika di-trigger oleh parent (Tombol Crosshair)
  useEffect(() => {
    if (!onResetFocus || !mapInstanceRef.current) return;
    
    // Prevent duplicate triggers
    if (lastFocusTriggerRef.current === onResetFocus) return;
    lastFocusTriggerRef.current = onResetFocus;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setInternalUserCoords({ lat, lng });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16, { animate: true });
          }
          if (onLocationFound) {
            onLocationFound({ lat, lng });
          }
        },
        (err) => {
          console.warn('Gagal mendapatkan lokasi akurat:', err.message);
          const fallbackCoords = userCoords || internalUserCoords;
          if (fallbackCoords?.lat && fallbackCoords?.lng && mapInstanceRef.current) {
            mapInstanceRef.current.setView([fallbackCoords.lat, fallbackCoords.lng], 16, { animate: true });
            if (onLocationFound) {
              onLocationFound(fallbackCoords);
            }
          } else {
            if (onLocationError) {
              onLocationError(err);
            }
            if (boundaryLayerRef.current && mapInstanceRef.current) {
              const bounds = boundaryLayerRef.current.getBounds();
              if (bounds.isValid()) {
                mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20], animate: true });
              }
            }
          }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
      );
    } else if ((userCoords || internalUserCoords)?.lat && (userCoords || internalUserCoords)?.lng) {
      const fallbackCoords = userCoords || internalUserCoords;
      mapInstanceRef.current.setView([fallbackCoords.lat, fallbackCoords.lng], 16, { animate: true });
    }
  }, [onResetFocus]);

  // Load dan Kelola Layer Jalan (Fetch dari API)
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

      const layerConfig = ROAD_LAYERS[layerKey];
      if (!layerConfig) return;

      if (onLayerLoadingChange) {
        onLayerLoadingChange(layerKey, true);
      }

      getRoadNetwork(layerKey)
        .then((result) => {
          if (!mapInstanceRef.current) return;
          if (!activeLayers[layerKey]) return;

          if (result.success && result.data) {
            const jalanData = result.data;
            
            if (Array.isArray(jalanData) && jalanData.length > 0) {
              const layerGroup = L.featureGroup();
              
              jalanData.forEach((jalan) => {
                if (jalan.koordinat && Array.isArray(jalan.koordinat) && jalan.koordinat.length > 0) {
                  const latlngs = jalan.koordinat
                    .map((koord) => {
                      const lat = parseFloat(koord.latitude);
                      const lng = parseFloat(koord.longitude);
                      return [lat, lng];
                    })
                    .filter((coord) => !isNaN(coord[0]) && !isNaN(coord[1]));
                  
                  if (latlngs.length < 2) return;
                  
                  const line = L.polyline(latlngs, {
                    color: layerConfig.color,
                    weight: layerConfig.weight,
                    opacity: 0.85,
                    lineCap: 'round',
                    lineJoin: 'round',
                  });
                  
                  line.bindTooltip(jalan.nama_jalan || jalan.detail || 'Jalan', {
                    direction: 'top',
                    offset: [0, -10],
                    className: 'bg-slate-900 text-white text-xs px-2 py-1 rounded shadow font-sans'
                  });
                  
                  line.addTo(layerGroup);
                }
              });
              
              layerGroup.addTo(map);
              layersRef.current[layerKey] = layerGroup;
            }
          }

          if (onLayerLoadingChange) {
            onLayerLoadingChange(layerKey, false);
          }
        })
        .catch((err) => {
          console.warn(`Layer jalan ${layerConfig.name} tidak dapat dimuat:`, err);
          if (onLayerLoadingChange) {
            onLayerLoadingChange(layerKey, false);
          }
        });
    });
  }, [activeLayers, onLayerLoadingChange]);

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
