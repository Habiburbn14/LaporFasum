import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SCALA_LAYERS = {
  arteriPrimer: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Arteri%20Primer.geojson',
    color: '#ef4444',
    name: 'Arteri Primer',
    weight: 3,
  },
  kolektorPrimer1: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Satu%20(JKP-1).geojson',
    color: '#3b82f6',
    name: 'Kolektor Primer 1',
    weight: 2.5,
  },
  kolektorPrimer2: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Dua%20(JKP-2).geojson',
    color: '#3b82f6',
    name: 'Kolektor Primer 2',
    weight: 2.5,
  },
  kolektorPrimer3: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Tiga%20(JKP-3).geojson',
    color: '#3b82f6',
    name: 'Kolektor Primer 3',
    weight: 2.5,
  },
  arteriSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Arteri%20Sekunder.geojson',
    color: '#f97316',
    name: 'Arteri Sekunder',
    weight: 2,
  },
  kolektorSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Kolektor%20Sekunder.geojson',
    color: '#f97316',
    name: 'Kolektor Sekunder',
    weight: 2,
  },
  lingkunganPrimary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Lingkungan%20Primer.geojson',
    color: '#10b981',
    name: 'Lingkungan Primer',
    weight: 1.5,
  },
  lingkunganSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Lingkungan%20Sekunder.geojson',
    color: '#10b981',
    name: 'Lingkungan Sekunder',
    weight: 1.5,
  },
  lokalPrimary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Lokal%20Primer.geojson',
    color: '#9ca3af',
    name: 'Lokal Primer',
    weight: 1,
  },
  lokalSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Lokal%20Sekunder.geojson',
    color: '#9ca3af',
    name: 'Lokal Sekunder',
    weight: 1,
  },
};

function CustomMap({ reports, activeLayers, baseMap, onMarkerClick, selectedReport }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({});
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([-6.8938, 112.2140], 12);
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layer and add new one
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

    // Add zoom controls
    if (!map.zoomControl) {
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    }

    return () => {
      // Cleanup on unmount
    };
  }, [baseMap]);

  // Load and manage GeoJSON layers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove all current layers
    Object.values(layersRef.current).forEach((layer) => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    layersRef.current = {};

    // Load active layers
    const loadedLayers = Object.keys(activeLayers).filter((key) => activeLayers[key]);

    loadedLayers.forEach((layerKey) => {
      const layerConfig = SCALA_LAYERS[layerKey];
      if (!layerConfig) return;

      fetch(layerConfig.url)
        .then((res) => res.json())
        .then((geojsonData) => {
          const geoJsonLayer = L.geoJSON(geojsonData, {
            style: {
              color: layerConfig.color,
              weight: layerConfig.weight,
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round',
            },
          });
          geoJsonLayer.addTo(map);
          layersRef.current[layerKey] = geoJsonLayer;
        })
        .catch((err) => console.error(`Error loading ${layerKey}:`, err));
    });
  }, [activeLayers]);

  // Add/update report markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove old markers
    markersRef.current.forEach((marker) => {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add new markers
    reports.forEach((report) => {
      const statusColor = {
        'Menunggu Verifikasi': '#f59e0b',
        'Diterima': '#3b82f6',
        'Selesai': '#10b981',
      }[report.status] || '#64748b';

      const markerIcon = L.divIcon({
        html: `<div style="
          width: 28px;
          height: 28px;
          background-color: ${statusColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 4px;
            height: 4px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>`,
        iconSize: [28, 28],
        className: 'custom-marker',
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: markerIcon });
      marker.on('click', () => onMarkerClick(report));
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [reports, onMarkerClick]);

  // Highlight selected report
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedReport) return;

    const map = mapInstanceRef.current;
    map.setView([selectedReport.latitude, selectedReport.longitude], 14, {
      animate: true,
    });
  }, [selectedReport]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}

export default CustomMap;
