import { ColorScheme } from '@mantine/core';
import create from 'zustand';
import LocalStorageStrategy from './strategies/localStorage';
import StoreAdapter from './structs/storeAdapter';

interface TestData {
  foo: string;
}

export interface StoreState {
  theme: ColorScheme;
  adapter: StoreAdapter<TestData>;
  setTheme: (theme: ColorScheme) => void;
}

const testAdapter = new StoreAdapter<TestData>('test', { strategy: new LocalStorageStrategy<TestData>({ foo: 'bar' }) });

const useStore = create<StoreState>()((set) => ({
  theme: 'dark',
  adapter: testAdapter,

  setTheme: (theme) => set({ theme }),
}));

export default useStore;