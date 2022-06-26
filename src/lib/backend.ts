/* eslint-disable no-underscore-dangle */

declare global {
  interface Window {
    __TAURI__: typeof import('@tauri-apps/api');
  }
}

export const supportsTauri = () => !!window.__TAURI__ && !!window.__TAURI_IPC__;

export default supportsTauri();