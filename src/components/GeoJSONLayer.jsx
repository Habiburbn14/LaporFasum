import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';

// Layer configuration dari SCALA
const GEOJSON_LAYERS = {
  arteriPrimer: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Arteri%20Primer.geojson',
    color: '#ef4444', // Red
    name: 'Jalan Arteri Primer',
    weight: 3,
  },
  kolektorPrimer1: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Satu%20(JKP-1).geojson',
    color: '#3b82f6', // Blue
    name: 'Jalan Kolektor Primer 1',
    weight: 2.5,
  },
  kolektorPrimer2: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Dua%20(JKP-2).geojson',
    color: '#3b82f6',
    name: 'Jalan Kolektor Primer 2',
    weight: 2.5,
  },
  kolektorPrimer3: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20240709_174127/Jalan%20Kolektor%20Primer%20Tiga%20(JKP-3).geojson',
    color: '#3b82f6',
    name: 'Jalan Kolektor Primer 3',
    weight: 2.5,
  },
  arteriSecondary: {
    url: 'https://skala.lamongankab.go.id/peta/geojsons/20260510_033012/Arteri%20Sekunder.geojson',
    color: '#f97316', // Orange
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
    color: '#10b981', // Green
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
    color: '#9ca3af', // Gray
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

function GeoJSONLayer({ layerKey, isVisible }) {
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isVisible || !layerKey) {
      setGeojsonData(null);
      return;
    }

    const layer = GEOJSON_LAYERS[layerKey];
    if (!layer) return;

    setLoading(true);
    fetch(layer.url)
      .then(res => res.json())
      .then(data => {
        setGeojsonData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(`Error loading ${layerKey}:`, err);
        setLoading(false);
      });
  }, [layerKey, isVisible]);

  if (!isVisible || !geojsonData || loading) return null;

  const layer = GEOJSON_LAYERS[layerKey];

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
