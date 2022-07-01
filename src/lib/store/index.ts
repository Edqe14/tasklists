import { ColorScheme } from '@mantine/core';
import { debounce, pick } from 'lodash-es';
import create from 'zustand';
import consola from 'consola';
import collectionAdapter from './adapters/collections';
import settingsAdapter, { settingsDefault } from './adapters/settings';
import taskAdapter from './adapters/tasks';
import Collection, { Collections } from './structs/collection';
import Settings from './structs/settings';
import Task, { Tasks } from './structs/task';
import settingsChanged from '../helpers/settingsChanged';

interface AllProps {
  collections: Collections;
  tasks: Tasks;
}

export type StoreState = {
  ready: boolean;
  theme: ColorScheme;

  collections: AllProps['collections'];
  tasks: AllProps['tasks'];

  setReady: (state: boolean) => void;
  setTheme: (theme: ColorScheme) => void;
  setColor: (color: string) => void;
  setAll: (props: AllProps) => void;

  saveSettings: () => Promise<void>;

  // Collections
  setCollections: (collections: AllProps['collections']) => void;
  appendCollections: (...collections: Collection[]) => void;
  saveCollections: () => Promise<void>;

  // Tasks
  setTasks: (tasks: AllProps['tasks']) => void;
  appendTasks: (...tasks: Task[]) => void;
  saveTasks: () => Promise<void>;
} & Settings;

const store = create<StoreState>((set, get) => ({
  // Global
  ready: false,
  theme: 'dark',
  ...settingsDefault,

  // Variables
  collections: [],
  tasks: [],

  // Global methods
  setReady: (state) => set({ ready: state }),
  setTheme: (theme) => set({ theme }),
  setColor: (color) => set({ color }),

  // Variable setters
  setAll: (props) => set(props),

  saveSettings: async () => {
    const curr = pick(get(), Object.keys(settingsDefault));

    await settingsAdapter.write(curr as Settings);

    consola.success('saved settings', curr);
  },

  // Collections
  setCollections: (collections) => set(({ collections })),
  appendCollections: (...collections) => {
    set((state) => ({ collections: [...state.collections, ...collections] }));
    get().saveCollections();
  },
  saveCollections: async () => {
    const all = get().collections;

    set({ collections: [...all] });

    await collectionAdapter.write(all);

    consola.success('saved collections', all);
  },

  // Tasks
  setTasks: (tasks) => set(({ tasks })),
  appendTasks: (...tasks) => {
    set((state) => ({ tasks: [...state.tasks, ...tasks] }));
    get().saveTasks();
  },
  saveTasks: async () => {
    const all = get().tasks;

    set({ tasks: [...all] });

    await taskAdapter.write(all);

    consola.success('saved tasks', all);
  },
}));

// Apply color schemes
store.subscribe((state) => {
  const root = document.querySelector<HTMLElement>(':root');
  if (root) {
    root.style.setProperty('--color-scheme', state.color);
  }
});

const saveSettingsDebouncer = debounce(store.getState().saveSettings, 200);

const init = async () => {
  const [settings, collections] = await Promise.all([
    settingsAdapter.read(),
    collectionAdapter.read(),
  ]);
  store.setState({ ...settings, collections });

  const [tasks] = await Promise.all([
    taskAdapter.read(),
  ]);

  store.setState({
    ready: true,

    tasks,
  });

  // Listen for settings changes
  store.subscribe((state, prev) => {
    if (!settingsChanged(state, prev)) return;

    saveSettingsDebouncer();
  });
};

init();

export default store;