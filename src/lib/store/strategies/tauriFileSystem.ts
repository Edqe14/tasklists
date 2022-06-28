import { fs, invoke, path } from '@tauri-apps/api';
import { Strategy } from '../structs/storeAdapter';

export interface TauriFileSystemStrategyOptions {
  dir: string[]; // Relative directory before the file name
}

class TauriFileSystemStrategy<T> implements Strategy<T, TauriFileSystemStrategyOptions> {
  protected readonly defaults: T;

  constructor(defaults: T) {
    this.defaults = defaults;
  }

  async read(name: string, options?: TauriFileSystemStrategyOptions): Promise<T> {
    try {
      const data = await fs.readTextFile([...(options?.dir ?? []), `${name}.json`].join(path.sep), {
        dir: fs.Dir.App
      });

      return this.deserialize(data) ?? this.defaults;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return this.defaults;
    }
  }

  async write(name: string, data: T, options?: TauriFileSystemStrategyOptions): Promise<void> {
    try {
      await fs.writeTextFile([...(options?.dir ?? []), `${name}.json`].join(path.sep), this.serialize(data), {
        dir: fs.Dir.App
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  serialize(data: T): string {
    return JSON.stringify(data);
  }

  deserialize(data: string | null): T | null {
    if (!data) return null;

    return JSON.parse(data);
  }
}

export default TauriFileSystemStrategy;