// @vitest-environment jsdom

import { clearMocks } from '@tauri-apps/api/mocks';
import { afterAll, expect, describe, test } from 'vitest';
import { writeTextFile, Dir, readTextFile } from '@tauri-apps/api/fs';
import mockFs from './helpers/mockFs';

afterAll(() => {
  clearMocks();
});

describe('mock fs', () => {
  const payload = JSON.stringify({ __MOCK: true });

  test('write', () => {
    mockFs();

    expect(writeTextFile('test.json', payload)).resolves.toBeUndefined();
  });

  test('read', () => {
    mockFs();

    expect(readTextFile('test.json')).resolves.toBe(payload);
  });
});