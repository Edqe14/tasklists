import TauriAPI from '@tauri-apps/api';

declare global {
  interface Window {
    __TAURI__: typeof TauriAPI;
  }
}

// eslint-disable-next-line no-underscore-dangle
const isTauriEnvironment = !!window.__TAURI__;

export default isTauriEnvironment;