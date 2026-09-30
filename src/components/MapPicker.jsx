import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationMarker({ position, setPosition, setRegion }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`)
        .then(res => res.json())
        .then(data => {
          const region = data.address?.suburb || data.address?.city_district || data.address?.city || 'Lokasi Tidak Diketahui';
          setRegion(region);
        });
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
    </Marker>
  );
}

function MapPicker({ center, onLocationSelect }) {
  const [position, setPosition] = React.useState(center);
  const [region, setRegion] = React.useState('');

  React.useEffect(() => {
    setPosition(center);
  }, [center]);

  React.useEffect(() => {
    if (position) {
      onLocationSelect({ 
        latitude: position[0], 
        longitude: position[1], 
        region 
      });
    }
  }, [position, region, onLocationSelect]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker 
          position={position} 
          setPosition={setPosition}
          setRegion={setRegion}
        />
      </MapContainer>
      <div className="bg-gray-50 p-3 border-t">
        <p className="text-sm text-gray-600">
          Klik pada peta untuk menentukan lokasi tepat. {region && `Lokasi: ${region}`}
        </p>
      </div>
    </div>
  );
}

export default MapPicker;
