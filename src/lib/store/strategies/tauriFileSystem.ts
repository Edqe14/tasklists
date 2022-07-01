import { fs, path } from '@tauri-apps/api';
import getCircularReplacer from '@/lib/helpers/getCircularReplacer';
import { Strategy } from '../structs/adapter';
import Serializible from '@/lib/helpers/types/serializible';

export interface TauriFileSystemStrategyOptions<T> extends Serializible<T> {
  dir?: string[]; // Relative directory before the file name
}

class TauriFileSystemStrategy<T> implements Strategy<T, TauriFileSystemStrategyOptions<T>> {
  protected readonly defaults: T;

  protected readonly serializer: Serializible<T> = {};

  constructor(defaults: T, serializer: Serializible<T> = {}) {
    this.defaults = defaults;
    this.serializer = serializer;
  }

  async read(name: string, options?: TauriFileSystemStrategyOptions<T>): Promise<T> {
    try {
      const data = await fs.readTextFile([...(options?.dir ?? ['data']), `${name}.json`].join(path.sep), {
        dir: fs.Dir.App
      });

      return (options?.deserialize ? options.deserialize(data) : this.deserialize(data)) ?? this.defaults;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);

      return this.defaults;
    }
  }

  async write(name: string, data: T, options?: TauriFileSystemStrategyOptions<T>): Promise<void> {
    try {
      const strData = options?.serialize ? options.serialize(data) : this.serialize(data);
      await fs.writeTextFile([...(options?.dir ?? ['data']), `${name}.json`].join(path.sep), strData, {
        dir: fs.Dir.App
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  serialize(data: T): string {
    if (this.serializer.serialize) return this.serializer.serialize(data);

    return JSON.stringify(data, getCircularReplacer());
  }

  deserialize(data: string | null): T | null {
    if (!data) return null;
    if (this.serializer.deserialize) return this.serializer.deserialize(data);

    return JSON.parse(data);
  }
}

export default TauriFileSystemStrategy;