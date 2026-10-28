import { Geolocation } from '@capacitor/geolocation';

export const getGeolocation = async () => {
  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp,
    };
  } catch (error) {
    throw error;
  }
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
    const data = await response.json();
    return {
      address: data.address || {},
      display_name: data.display_name || 'Lokasi tidak diketahui',
      city: data.address?.suburb || data.address?.city_district || data.address?.city || data.address?.town || data.address?.village || '',
      region: data.address?.suburb || data.address?.city_district || data.address?.city || data.address?.town || data.address?.village || 'Lokasi Tidak Diketahui',
    };
  } catch (error) {
    return { address: {}, display_name: 'Lokasi tidak diketahui', city: '', region: 'Lokasi Tidak Diketahui' };
  }
};
