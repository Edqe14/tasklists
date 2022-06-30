// @vitest-environment jsdom

import { clearMocks } from '@tauri-apps/api/mocks';
import { expect, describe, test, afterAll, beforeAll } from 'vitest';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import mockFs from './helpers/mockFs';

beforeAll(() => {
  mockFs();
});

afterAll(() => {
  clearMocks();
});

describe('mock fs', () => {
  const payload = JSON.stringify({ __MOCK: true });

  test('write', () => {
    expect(writeTextFile('test.json', payload)).resolves.toBeUndefined();
  });

  test('read', () => {
    expect(readTextFile('test.json')).resolves.toBe(payload);
  });
});