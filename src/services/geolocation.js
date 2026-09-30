export const getGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung browser Anda'));
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const reverseGeocode = (latitude, longitude) => {
  return new Promise((resolve) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
      .then(res => res.json())
      .then(data => {
        resolve({
          address: data.address || {},
          display_name: data.display_name || 'Lokasi tidak diketahui',
        });
      })
      .catch(() => {
        resolve({ address: {}, display_name: 'Lokasi tidak diketahui' });
      });
  });
};
