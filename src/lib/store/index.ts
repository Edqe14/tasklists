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
import applySettingsDebouncer from './debouncers/applySettings';
import applyCollectionsDebouncer from './debouncers/applyCollections';
import applyTasksDebouncer from './debouncers/applyTasks';
import sleep from '../helpers/sleep';
import Schedule from '../schedulers/structs/schedule';

interface AllProps {
  collections: Collections;
  tasks: Tasks;
}

export type StoreState = {
  ready: boolean;
  theme: ColorScheme;
  configuration: Settings;

  collections: AllProps['collections'];
  tasks: AllProps['tasks'];
  schedules: Schedule[];

  setReady: (state: boolean) => void;
  setTheme: (theme: ColorScheme) => void;
  setColor: (color: string) => void;
  markChanged: (...keys: (keyof StoreState)[]) => void;

  // Setters
  setAll: (props: AllProps) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appendSchedules: (...schedules: Schedule<any>[]) => void;

  // Collections
  setCollections: (collections: AllProps['collections']) => void;
  appendCollections: (...collections: Collection[]) => void;

  // Tasks
  setTasks: (tasks: AllProps['tasks']) => void;
  appendTasks: (...tasks: Task[]) => void;
};

const store = create<StoreState>((set) => ({
  // Global
  ready: false,
  theme: 'dark',
  configuration: settingsDefault,

  // Variables
  collections: [],
  tasks: [],
  schedules: [],

  // Global methods
  setReady: (state) => set({ ready: state }),
  setTheme: (theme) => set({ theme }),
  setColor: (color) => set((state) => ({ configuration: { ...state.configuration, color } })),
  markChanged: (...keys) => set((state) => mapValues(
    pickBy(state, (v, k) => keys.includes(k as keyof StoreState) && typeof v === 'object'),
    (v) => Array.isArray(v) ? [...v] : ({ ...(v as object) })
  ) as Partial<StoreState>),

  // Variable setters
  setAll: (props) => set(props),
  appendSchedules: (...schedules) => set((state) => ({ schedules: [...state.schedules, ...schedules] })),

  // Collections
  setCollections: (collections) => set(({ collections })),
  appendCollections: (...collections) => set((state) => ({ collections: [...state.collections, ...collections] })),

  // Tasks
  setTasks: (tasks) => set(({ tasks })),
  appendTasks: (...tasks) => set((state) => ({ tasks: [...state.tasks, ...tasks] })),
}));

// Update color scheme
store.subscribe((state, prev) => {
  if (state.configuration.color === prev.configuration.color) return;

  const root = document.querySelector<HTMLElement>(':root');
  if (root) {
    root.style.setProperty('--color-scheme', state.configuration.color);
  }
});

// Startup
const init = async () => {
  const start = async () => {
    logger.info('initiating...');
    logger.trace('loading settings and collections');

    const [configuration, collections] = await Promise.all([
      settingsAdapter.read(),
      collectionAdapter.read(),
    ]);

    store.setState({ configuration, collections });
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
    if (settingsChanged(state, prev)) applySettingsDebouncer();
    if (!Object.is(state.collections, prev.collections)) applyCollectionsDebouncer();
    if (!Object.is(state.tasks, prev.tasks)) applyTasksDebouncer();
  });
};

init();

export default store;