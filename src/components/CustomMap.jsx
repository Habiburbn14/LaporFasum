import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons if needed in future
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

function CustomMap({ activeLayers = {}, baseMap = 'openstreetmap', onResetFocus }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({});
  const boundaryLayerRef = useRef(null);

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

        // Hapus boundary layer sebelumnya jika ada
        if (boundaryLayerRef.current && map.hasLayer(boundaryLayerRef.current)) {
          map.removeLayer(boundaryLayerRef.current);
        }

        // Buat layer batas wilayah garis merah
        const boundaryLayer = L.geoJSON(geojsonData, {
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

        // Peta otomatis fit bounds pas pada batas Kabupaten Lamongan
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

  // Expose reset focus handler jika di-trigger oleh parent
  useEffect(() => {
    if (onResetFocus && boundaryLayerRef.current && mapInstanceRef.current) {
      const bounds = boundaryLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [20, 20],
          animate: true,
        });
      }
    }
  }, [onResetFocus]);

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
      // Jika layer sudah terpasang, lewati
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
          // Pastikan masih aktif saat respons diterima
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

  return <div ref={mapRef} className="w-full h-full" />;
}

export default CustomMap;
