import { fs, invoke, path } from '@tauri-apps/api';
import { Strategy } from '../structs/storeAdapter';

class TauriFileSystemStrategy<T, K = undefined> implements Strategy<T, K> {
  protected readonly defaults: T;

  constructor(defaults: T) {
    this.defaults = defaults;
  }

  async read(name: string): Promise<T> {
    try {
      const data = await fs.readTextFile(`data#${name}.json`.replace(/#/gi, path.sep), {
        dir: fs.Dir.App
      });

      return this.deserialize(data) ?? this.defaults;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);

      return this.defaults;
    }
  }

  async write(name: string, data: T): Promise<void> {
    try {
      await invoke('write_store', { name, data: this.serialize(data) });
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