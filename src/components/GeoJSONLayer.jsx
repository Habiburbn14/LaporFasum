import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';

// Mock GeoJSON data untuk presentasi
const MOCK_GEOJSON_DATA = {
  arteriPrimer: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Jalan Raya Lamongan Utama' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2100, -6.9000], [112.2200, -6.8900], [112.2300, -6.8800]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Jalan Raya Lamongan - Gresik' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2400, -6.8700], [112.2500, -6.8600], [112.2600, -6.8500]]
        }
      }
    ]
  },
  kolektorPrimer1: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Jalan Kolektor Primer 1' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2050, -6.9050], [112.2150, -6.8950], [112.2250, -6.8850]]
        }
      }
    ]
  },
  kolektorPrimer2: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Jalan Kolektor Primer 2' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.1950, -6.9150], [112.2050, -6.9050], [112.2150, -6.8950]]
        }
      }
    ]
  },
  kolektorPrimer3: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Jalan Kolektor Primer 3' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2200, -6.9200], [112.2300, -6.9100], [112.2400, -6.9000]]
        }
      }
    ]
  },
  arteriSecondary: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Arteri Sekunder Lamongrejo' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2150, -6.8850], [112.2250, -6.8750], [112.2350, -6.8650]]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Arteri Sekunder Sambirejo' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2700, -6.9100], [112.2800, -6.9000], [112.2900, -6.8900]]
        }
      }
    ]
  },
  kolektorSecondary: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Kolektor Sekunder' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2050, -6.8950], [112.2150, -6.8850], [112.2250, -6.8750]]
        }
      }
    ]
  },
  lingkunganPrimary: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Lingkungan Primer' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2100, -6.8900], [112.2150, -6.8850], [112.2200, -6.8800]]
        }
      }
    ]
  },
  lingkunganSecondary: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Lingkungan Sekunder' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2200, -6.8800], [112.2250, -6.8750], [112.2300, -6.8700]]
        }
      }
    ]
  },
  lokalPrimary: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Lokal Primer' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2120, -6.8880], [112.2170, -6.8830], [112.2220, -6.8780]]
        }
      }
    ]
  },
  lokalSecondary: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Lokal Sekunder' },
        geometry: {
          type: 'LineString',
          coordinates: [[112.2230, -6.8770], [112.2280, -6.8720], [112.2330, -6.8670]]
        }
      }
    ]
  }
};

// Layer configuration
const GEOJSON_LAYERS = {
  arteriPrimer: {
    name: 'Jalan Arteri Primer',
    color: '#ef4444',
    weight: 3,
  },
  kolektorPrimer1: {
    name: 'Jalan Kolektor Primer 1',
    color: '#3b82f6',
    weight: 2.5,
  },
  kolektorPrimer2: {
    name: 'Jalan Kolektor Primer 2',
    color: '#3b82f6',
    weight: 2.5,
  },
  kolektorPrimer3: {
    name: 'Jalan Kolektor Primer 3',
    color: '#3b82f6',
    weight: 2.5,
  },
  arteriSecondary: {
    name: 'Arteri Sekunder',
    color: '#f97316',
    weight: 2,
  },
  kolektorSecondary: {
    name: 'Kolektor Sekunder',
    color: '#f97316',
    weight: 2,
  },
  lingkunganPrimary: {
    name: 'Lingkungan Primer',
    color: '#10b981',
    weight: 1.5,
  },
  lingkunganSecondary: {
    name: 'Lingkungan Sekunder',
    color: '#10b981',
    weight: 1.5,
  },
  lokalPrimary: {
    name: 'Lokal Primer',
    color: '#9ca3af',
    weight: 1,
  },
  lokalSecondary: {
    name: 'Lokal Sekunder',
    color: '#9ca3af',
    weight: 1,
  },
};

function GeoJSONLayer({ layerKey, isVisible }) {
  if (!isVisible || !layerKey) return null;

  const layer = GEOJSON_LAYERS[layerKey];
  const geojsonData = MOCK_GEOJSON_DATA[layerKey];

  if (!layer || !geojsonData) return null;

  return (
    <GeoJSON
      data={geojsonData}
      style={{
        color: layer.color,
        weight: layer.weight,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
}

export { GeoJSONLayer, GEOJSON_LAYERS };
