import { ColorScheme } from '@mantine/core';
import create from 'zustand';
import collectionAdapter from './adapters/collections';
import Collection, { Collections } from './structs/collection';

interface AllProps {
  collections: Collections;
}

export type StoreState = {
  ready: boolean;
  theme: ColorScheme;

  collections: AllProps['collections'];

  setReady: (state: boolean) => void;
  setTheme: (theme: ColorScheme) => void;

  setAll: (props: AllProps) => void;
  setCollections: (collections: AllProps['collections']) => void;
  appendCollections: (...collections: Collection[]) => void;

  saveCollections: () => void;
};

const store = create<StoreState>((set, get) => ({
  // Global
  ready: false,
  theme: 'dark',

  // Variables
  collections: [],

  // Global methods
  setReady: (state) => set({ ready: state }),
  setTheme: (theme) => set({ theme }),

  // Variable setters
  setAll: (props) => set(props),
  setCollections: (collections) => {
    set((state) => {
      collections.forEach((v) => v
        .removeAllListeners('__save')
        .on('__save', () => state.saveCollections())
      );

      return ({ collections });
    });
  },
  appendCollections: (...collections) => {
    set((state) => {
      collections.forEach((v) => v
        .removeAllListeners('__save')
        .on('__save', () => state.saveCollections())
      );

      return ({ collections: [...state.collections, ...collections] });
    });

    get().saveCollections();
  },

  saveCollections: () => {
    const all = get().collections;

    set({ collections: [...all] });
    collectionAdapter.write(all);
  },
}));

const init = async () => {
  const [collections] = await Promise.all([
    collectionAdapter.read()
  ]);

  const state = store.getState();
  state.setAll({ collections });
  state.setReady(true);
};

init();

export default store;