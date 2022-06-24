/* eslint-disable no-underscore-dangle */

declare global {
  interface Window {
    __TAURI__: typeof import('@tauri-apps/api');
  }
}

export const supportsTauri = () => !!window.__TAURI__;
export const apis = window.__TAURI__;

export default supportsTauri();