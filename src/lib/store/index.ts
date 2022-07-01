import { ColorScheme } from '@mantine/core';
import { mapValues, pickBy } from 'lodash-es';
import create from 'zustand';
import collectionAdapter from './adapters/collections';
import settingsAdapter, { settingsDefault } from './adapters/settings';
import taskAdapter from './adapters/tasks';
import Collection, { Collections } from './structs/collection';
import Settings from './structs/settings';
import Task, { Tasks } from './structs/task';
import settingsChanged from '../helpers/settingsChanged';
import logger from '../logger';
import saveSettingsDebouncer from './debouncers/saveSettings';
import saveCollectionsDebouncer from './debouncers/saveCollections';
import saveTasksDebouncer from './debouncers/saveTasks';
import sleep from '../helpers/sleep';

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
  markChanged: (...keys: (keyof StoreState)[]) => void;

  // Collections
  setCollections: (collections: AllProps['collections']) => void;
  appendCollections: (...collections: Collection[]) => void;

  // Tasks
  setTasks: (tasks: AllProps['tasks']) => void;
  appendTasks: (...tasks: Task[]) => void;
} & Settings;

const store = create<StoreState>((set) => ({
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
  markChanged: (...keys) => set((state) => mapValues(
    pickBy(state, (v, k) => keys.includes(k as keyof StoreState) && typeof v === 'object'),
    (v) => Array.isArray(v) ? [...v] : ({ ...(v as object) })
  ) as Partial<StoreState>),

  // Variable setters
  setAll: (props) => set(props),

  // Collections
  setCollections: (collections) => set(({ collections })),
  appendCollections: (...collections) => set((state) => ({ collections: [...state.collections, ...collections] })),

  // Tasks
  setTasks: (tasks) => set(({ tasks })),
  appendTasks: (...tasks) => set((state) => ({ tasks: [...state.tasks, ...tasks] })),
}));

// Update color scheme
store.subscribe((state, prev) => {
  if (state.color === prev.color) return;

  const root = document.querySelector<HTMLElement>(':root');
  if (root) {
    root.style.setProperty('--color-scheme', state.color);
  }
});

// Startup
const init = async () => {
  const start = async () => {
    logger.info('initiating...');
    logger.trace('loading settings and collections');

    const [settings, collections] = await Promise.all([
      settingsAdapter.read(),
      collectionAdapter.read(),
    ]);

    store.setState({ ...settings, collections });
    logger.info('loaded settings and collections');
    logger.trace('loading other modules');

    const [tasks] = await Promise.all([
      taskAdapter.read(),
    ]);

    logger.info('loaded modules');
    store.setState({
      tasks,
    });
  };

  await Promise.all([
    start(),
    sleep(1000)
  ]);

  store.setState({ ready: true });

  // Listen for changes
  store.subscribe((state, prev) => {
    if (settingsChanged(state, prev)) saveSettingsDebouncer();
    if (!Object.is(state.collections, prev.collections)) saveCollectionsDebouncer();
    if (!Object.is(state.tasks, prev.tasks)) saveTasksDebouncer();
  });
};

init();

export default store;