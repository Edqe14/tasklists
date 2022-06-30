import { ColorScheme } from '@mantine/core';
import create from 'zustand';
import collectionAdapter from './adapters/collections';
import taskAdapter from './adapters/tasks';
import Collection, { Collections } from './structs/collection';
import Task, { Tasks } from './structs/task';

interface AllProps {
  collections: Collections;
  tasks: Tasks;
}

export type StoreState = {
  ready: boolean;
  theme: ColorScheme;
  color: string;

  collections: AllProps['collections'];
  tasks: AllProps['tasks'];

  setReady: (state: boolean) => void;
  setTheme: (theme: ColorScheme) => void;
  setColor: (color: string) => void;

  setAll: (props: AllProps) => void;

  // Collections
  setCollections: (collections: AllProps['collections']) => void;
  appendCollections: (...collections: Collection[]) => void;
  saveCollections: () => void;

  // Tasks
  setTasks: (tasks: AllProps['tasks']) => void;
  appendTasks: (...tasks: Task[]) => void;
  saveTasks: () => void;
};

const store = create<StoreState>((set, get) => ({
  // Global
  ready: false,
  theme: 'dark',
  color: '#3f74e7',

  // Variables
  collections: [],
  tasks: [],

  // Global methods
  setReady: (state) => set({ ready: state }),
  setTheme: (theme) => set({ theme }),
  setColor: (color) => set({ color }),

  // Variable setters
  setAll: (props) => set(props),

  // Collections
  setCollections: (collections) => set(({ collections })),
  appendCollections: (...collections) => {
    set((state) => ({ collections: [...state.collections, ...collections] }));
    get().saveCollections();
  },
  saveCollections: () => {
    const all = get().collections;

    set({ collections: [...all] });
    collectionAdapter.write(all);
  },

  // Tasks
  setTasks: (tasks) => set(({ tasks })),
  appendTasks: (...tasks) => {
    set((state) => ({ tasks: [...state.tasks, ...tasks] }));
    get().saveTasks();
  },
  saveTasks: () => {
    const all = get().tasks;

    set({ tasks: [...all] });
    taskAdapter.write(all);
  },
}));

store.subscribe((state) => {
  const root = document.querySelector<HTMLElement>(':root');
  if (root) {
    root.style.setProperty('--color-scheme', state.color);
  }
});

const init = async () => {
  const collections = await collectionAdapter.read();
  store.setState({ collections });

  const [tasks] = await Promise.all([
    taskAdapter.read(),
  ]);

  store.setState({
    ready: true,

    tasks,
  });
};

init();

export default store;