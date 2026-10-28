import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEBOUNCE_MS = 300;

function LocationMarker({ position, setPosition, setRegion }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

function ReverseGeocode({ position, setRegion }) {
  const timeoutRef = React.useRef(null);
  const cacheRef = React.useRef(new Map());

  const fetchRegion = useCallback(async (pos) => {
    if (!pos) return;
    
    const key = `${pos[0].toFixed(4)},${pos[1].toFixed(4)}`;
    const cached = cacheRef.current.get(key);
    if (cached) {
      setRegion(cached);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos[0]}&lon=${pos[1]}&format=json&addressdetails=1`
        );
        const data = await res.json();
        const region = data.address?.suburb || 
                      data.address?.city_district || 
                      data.address?.city || 
                      data.address?.town || 
                      data.address?.village || 
                      'Lokasi Tidak Diketahui';
        cacheRef.current.set(key, region);
        setRegion(region);
      } catch {
        setRegion('Gagal mendapatkan nama lokasi');
      }
    }, DEBOUNCE_MS);
  }, [setRegion]);

  useEffect(() => {
    fetchRegion(position);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [position, fetchRegion]);

  return null;
}

export function MapPicker({ center, onLocationSelect }) {
  const [position, setPosition] = useState(center);
  const [region, setRegion] = useState('');
  const prevRegionRef = useRef('');
  const prevPositionRef = useRef(null);

  useEffect(() => {
    setPosition(center);
    setRegion('');
  }, [center]);

  useEffect(() => {
    if (position) {
      const posChanged = prevPositionRef.current === null || 
        prevPositionRef.current[0] !== position[0] || 
        prevPositionRef.current[1] !== position[1];
      const regionChanged = prevRegionRef.current !== region;
      
      if (posChanged || regionChanged) {
        prevPositionRef.current = position;
        prevRegionRef.current = region;
        onLocationSelect({ 
          latitude: position[0], 
          longitude: position[1], 
          region 
        });
      }
    }
  }, [position, region, onLocationSelect]);

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-md bg-slate-100">
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        touchZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <LocationMarker 
          position={position} 
          setPosition={setPosition}
          setRegion={setRegion}
        />
      </MapContainer>
      <ReverseGeocode position={position} setRegion={setRegion} />
      <div className="bg-slate-50 p-3 border-t flex items-center justify-between">
        <p className="text-xs text-slate-600">
          {region ? `Lokasi: ${region}` : 'Klik peta untuk pilih lokasi'}
        </p>
        <span className="text-xs text-slate-500 font-mono">
          {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </span>
      </div>
    </div>
  );
}

export default MapPicker;