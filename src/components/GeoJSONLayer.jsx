import React from 'react';
import { GeoJSON } from 'react-leaflet';

function GeoJSONLayer({ data, isVisible, style }) {
  if (!isVisible || !data) return null;

  return (
    <GeoJSON
      data={data}
      style={style || {
        color: '#3b82f6',
        weight: 2,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
}

export { GeoJSONLayer };
