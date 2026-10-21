import { isTauri, invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';

export const desktop = isTauri();
export type AccentColors = { theme: 'dark' | 'light'; background: string; foreground: string; accent: string; light: string; dark: string };
export async function systemAccent() {
  return desktop ? invoke<AccentColors>('system_accent') : null;
}
let micaRequest = 0;
export async function setMica(dark: boolean) {
  if (!desktop) return;
  const request = ++micaRequest;
  try {
    const backdrop = await invoke<number>('set_mica', { dark });
    if (request !== micaRequest) return;
    document.documentElement.dataset.nativeBackdrop = String(backdrop);
    delete document.documentElement.dataset.micaError;
    document.documentElement.classList.add('native-mica');
  } catch (error) {
    if (request !== micaRequest) return;
    document.documentElement.dataset.micaError = String(error);
    delete document.documentElement.dataset.nativeBackdrop;
    document.documentElement.classList.remove('native-mica');
    console.warn('Mica unavailable; using solid background', error);
  }
}
export async function windowAction(action: 'minimize' | 'toggleMaximize' | 'close') {
  if (desktop) await getCurrentWindow()[action]();
}
