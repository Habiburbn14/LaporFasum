const KECAMATAN_LIST = [
  { id_kecamatan: 1, nama_kecamatan: 'Sukorame' },
  { id_kecamatan: 2, nama_kecamatan: 'Bluluk' },
  { id_kecamatan: 3, nama_kecamatan: 'Modo' },
  { id_kecamatan: 4, nama_kecamatan: 'Ngimbang' },
  { id_kecamatan: 5, nama_kecamatan: 'Babat' },
  { id_kecamatan: 6, nama_kecamatan: 'Kedungpring' },
  { id_kecamatan: 7, nama_kecamatan: 'Brondong' },
  { id_kecamatan: 8, nama_kecamatan: 'Laren' },
  { id_kecamatan: 9, nama_kecamatan: 'Sekaran' },
  { id_kecamatan: 10, nama_kecamatan: 'Maduran' },
  { id_kecamatan: 11, nama_kecamatan: 'Sambeng' },
  { id_kecamatan: 12, nama_kecamatan: 'Sugio' },
  { id_kecamatan: 13, nama_kecamatan: 'Pucuk' },
  { id_kecamatan: 14, nama_kecamatan: 'Paciran' },
  { id_kecamatan: 15, nama_kecamatan: 'Solokuro' },
  { id_kecamatan: 16, nama_kecamatan: 'Mantup' },
  { id_kecamatan: 17, nama_kecamatan: 'Sukodadi' },
  { id_kecamatan: 18, nama_kecamatan: 'Karanggeneng' },
  { id_kecamatan: 19, nama_kecamatan: 'Kembangbahu' },
  { id_kecamatan: 20, nama_kecamatan: 'Kalitengah' },
  { id_kecamatan: 21, nama_kecamatan: 'Turi' },
  { id_kecamatan: 22, nama_kecamatan: 'Lamongan' },
  { id_kecamatan: 23, nama_kecamatan: 'Tikung' },
  { id_kecamatan: 24, nama_kecamatan: 'Karangbinangun' },
  { id_kecamatan: 25, nama_kecamatan: 'Deket' },
  { id_kecamatan: 26, nama_kecamatan: 'Glagah' },
  { id_kecamatan: 27, nama_kecamatan: 'Sarirejo' },
];

const KECAMATAN_BY_NAME = KECAMATAN_LIST.reduce((acc, item) => {
  acc[item.nama_kecamatan.toLowerCase()] = item;
  return acc;
}, {});

let geojsonCache = null;
let centroidCache = null;

export function getKecamatanByName(nama) {
  if (!nama) return null;
  return KECAMATAN_BY_NAME[String(nama).trim().toLowerCase()] || null;
}

export function getKecamatanIdFromKode(kode) {
  if (!kode) return null;
  const parts = String(kode).split('.');
  const id = parseInt(parts[parts.length - 1], 10);
  return Number.isNaN(id) ? null : id;
}

async function loadKecamatanGeoJSON() {
  if (geojsonCache) return geojsonCache;
  const res = await fetch('/kecamatan_lamongan.geojson');
  if (!res.ok) throw new Error(`Gagal memuat batas kecamatan (HTTP ${res.status})`);
  geojsonCache = await res.json();
  return geojsonCache;
}

async function loadCentroids() {
  if (centroidCache) return centroidCache;
  const res = await fetch('/kecamatan_lamongan.json');
  if (!res.ok) throw new Error(`Gagal memuat pusat kecamatan (HTTP ${res.status})`);
  centroidCache = await res.json();
  return centroidCache;
}

function pointInRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

function pointInPolygon(x, y, polygon) {
  const [outer, ...holes] = polygon;
  if (!pointInRing(x, y, outer)) return false;
  return !holes.some((hole) => pointInRing(x, y, hole));
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export async function findKecamatanByCoords(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  try {
    const geojson = await loadKecamatanGeoJSON();
    for (const feature of geojson.features) {
      const { geometry, properties } = feature;
      if (!geometry) continue;
      const polygons =
        geometry.type === 'Polygon'
          ? [geometry.coordinates]
          : geometry.type === 'MultiPolygon'
          ? geometry.coordinates
          : [];

      for (const polygon of polygons) {
        if (pointInPolygon(lng, lat, polygon)) {
          return {
            id_kecamatan:
              getKecamatanIdFromKode(properties.kode) ||
              getKecamatanByName(properties.nama_kecamatan)?.id_kecamatan ||
              null,
            nama_kecamatan: properties.nama_kecamatan,
            match: 'polygon',
          };
        }
      }
    }
  } catch (e) {
    console.error('Gagal mendeteksi kecamatan via polygon:', e);
  }

  try {
    const centroids = await loadCentroids();
    let nearest = null;
    let minDist = Infinity;
    for (const item of centroids) {
      const dist = haversine(lat, lng, item.lat, item.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = item;
      }
    }
    if (nearest) {
      return {
        id_kecamatan:
          getKecamatanIdFromKode(nearest.kode) ||
          getKecamatanByName(nearest.nama_kecamatan)?.id_kecamatan ||
          null,
        nama_kecamatan: nearest.nama_kecamatan,
        match: 'nearest',
      };
    }
  } catch (e) {
    console.error('Gagal mendeteksi kecamatan via centroid:', e);
  }

  return null;
}

export { KECAMATAN_LIST };