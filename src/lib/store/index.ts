import { ColorScheme } from '@mantine/core';
import create from 'zustand';

export interface StoreState {
  theme: ColorScheme;
  setTheme: (theme: ColorScheme) => void;
}

const useStore = create<StoreState>()((set) => ({
  theme: 'dark',

  setTheme: (theme) => set({ theme }),
}));

export default useStore;