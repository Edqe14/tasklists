/* eslint-disable import/first */
// @vitest-environment jsdom

import { clearMocks } from '@tauri-apps/api/mocks';
import { expect, describe, test, afterAll } from 'vitest';
import mockFs from './helpers/mockFs';

mockFs();

import Collection from '../src/lib/store/structs/collection';
import store from '../src/lib/store';
import collectionAdapter from '../src/lib/store/adapters/collections';
import Task from '../src/lib/store/structs/task';
import taskAdapter from '../src/lib/store/adapters/tasks';


afterAll(() => {
  clearMocks();
});

describe('collections', () => {
  const coll = new Collection({ name: `MOCK_${Date.now()}` });

  test('append', () => {
    store.getState().appendCollections(coll);

    expect(store.getState().collections[0]).toBe(coll);
  });

  test('read', () => {
    expect(collectionAdapter.read()).resolves.toSatisfy((v) => Array.isArray(v) && v[0] instanceof Collection && v[0].name === coll.name);
  });

  test('write', () => collectionAdapter.write([])?.then(() => {
    expect(collectionAdapter.read()).resolves.toHaveLength(0);
  }));

  test('change name', () => {
    coll.name = `MOCK__CHANGE_${Date.now()}`;

    expect(collectionAdapter.read()).resolves.toSatisfy((v) => Array.isArray(v) && v[0] instanceof Collection && v[0].name === coll.name);
  });
});

describe('tasks', () => {
  const task = new Task({ name: `MOCK__${Date.now()}` });

  test('append', () => {
    store.getState().appendTasks(task);

    expect(store.getState().tasks[0]).toBe(task);
  });

  test('read', () => {
    expect(taskAdapter.read()).resolves.toSatisfy((v) => Array.isArray(v) && v[0] instanceof Task && v[0].name === task.name);
  });

  test('write', () => taskAdapter.write([])?.then(() => {
    expect(taskAdapter.read()).resolves.toHaveLength(0);
  }));

  test('change name', () => {
    task.name = `MOCK__CHANGE__${Date.now()}`;
    expect(taskAdapter.read()).resolves.toSatisfy((v) => Array.isArray(v) && v[0].name === task.name);
  });

  test('change collections', () => {
    const coll = new Collection({ name: 'MOCK__COLLECTION' });
    store.getState().appendCollections(coll);

    task.collections.push(coll);
    task.markChanged();

    expect(taskAdapter.read()).resolves.toSatisfy((v) => Array.isArray(v)
      && v[0].name === task.name
      && v[0].collections.length === task.collections.length
      && v[0].collections[0].name === coll.name
    );
  });
});