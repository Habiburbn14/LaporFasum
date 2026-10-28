import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform();

export async function takePhoto(): Promise<Photo | null> {
  if (!isNative) {
    // Fallback for web
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          resolve({
            webPath: URL.createObjectURL(file),
            format: file.type.split('/')[1],
            saved: false,
          } as Photo);
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: false,
      width: 1920,
      height: 1080,
      preserveAspectRatio: true,
      correctOrientation: true,
    });
    return photo;
  } catch (e) {
    console.error('Camera error:', e);
    return null;
  }
}

export async function pickFromGallery(): Promise<Photo | null> {
  if (!isNative) {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          resolve({
            webPath: URL.createObjectURL(file),
            format: file.type.split('/')[1],
            saved: false,
          } as Photo);
        } else {
          resolve(null);
        }
      };
      input.click();
    });
  }

  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      saveToGallery: false,
    });
    return photo;
  } catch (e) {
    console.error('Gallery error:', e);
    return null;
  }
}

export async function getCurrentLocation(highAccuracy = true): Promise<Position | null> {
  try {
    if (isNative && platform === 'android') {
      const perm = await Geolocation.checkPermissions();
      if (perm.location === 'denied' || perm.coarseLocation === 'denied') {
        const requested = await Geolocation.requestPermissions();
        if (requested.location === 'denied' && requested.coarseLocation === 'denied') {
          return null;
        }
      } else if (perm.location === 'prompt' || perm.coarseLocation === 'prompt') {
        await Geolocation.requestPermissions();
      }
    }

    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: highAccuracy,
      timeout: 15000,
      maximumAge: 0,
    });
    return pos;
  } catch (e) {
    console.error('Geolocation error:', e);
    return null;
  }
}

export async function uriToFile(uri: string, baseName = 'laporan', maxWidth = 1200, quality = 0.7): Promise<File | null> {
  if (!uri) return null;
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Compress image via Canvas
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (compressedBlob) => {
            if (compressedBlob) {
              resolve(new File([compressedBlob], `${baseName}.jpg`, { type: 'image/jpeg' }));
            } else {
              resolve(new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        resolve(new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }));
      };
      img.src = URL.createObjectURL(blob);
    });
  } catch (e) {
    console.error('uriToFile error:', e);
    return null;
  }
}

export function watchLocation(callback: (pos: Position | null, err: Error | null) => void, highAccuracy = true): string {
  return Geolocation.watchPosition({ enableHighAccuracy: highAccuracy }, callback);
}

export function clearWatch(id: string) {
  Geolocation.clearWatch({ id });
}

export async function saveFileToCache(fileName: string, data: string | Blob, encoding: Encoding = Encoding.UTF8): Promise<string> {
  const result = await Filesystem.writeFile({
    path: fileName,
    data: data instanceof Blob ? await blobToBase64(data) : data,
    directory: Directory.Cache,
    encoding,
    recursive: true,
  });
  return result.uri;
}

export async function readFileFromCache(fileName: string): Promise<string | null> {
  try {
    const result = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    return result.data as string;
  } catch {
    return null;
  }
}

export async function deleteFileFromCache(fileName: string): Promise<void> {
  await Filesystem.deleteFile({
    path: fileName,
    directory: Directory.Cache,
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function vibrate(style: ImpactStyle = ImpactStyle.Medium) {
  if (isNative) {
    await Haptics.impact({ style });
  }
}

export async function getNetworkStatus(): Promise<{ connected: boolean; connectionType: string }> {
  const status = await Network.getStatus();
  return { connected: status.connected, connectionType: status.connectionType };
}

export async function addNetworkListener(callback: (status: { connected: boolean; connectionType: string }) => void) {
  return Network.addListener('networkStatusChange', (status) => callback(status));
}

export async function setPreference(key: string, value: string): Promise<void> {
  await Preferences.set({ key, value });
}

export async function getPreference(key: string): Promise<string | null> {
  const { value } = await Preferences.get({ key });
  return value ?? null;
}

export async function removePreference(key: string): Promise<void> {
  await Preferences.remove({ key });
}

export async function hideSplashScreen() {
  if (isNative) {
    await SplashScreen.hide();
  }
}

export async function setStatusBarStyle(style: Style = Style.Dark) {
  if (isNative) {
    await StatusBar.setStyle({ style });
    await StatusBar.setBackgroundColor({ color: '#2563eb' });
  }
}

export async function showStatusBar() {
  if (isNative) {
    await StatusBar.show();
  }
}

export async function hideStatusBar() {
  if (isNative) {
    await StatusBar.hide();
  }
}