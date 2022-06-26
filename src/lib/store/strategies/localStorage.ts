import Promisable from '@/lib/helpers/promisable';
import { Strategy } from '../structs/storeAdapter';

class LocalStorageStrategy<T, K = undefined> implements Strategy<T, K> {
  protected readonly defaults: T;

  constructor(defaults: T) {
    this.defaults = defaults;
  }

  set(name: string, data: T) {
    window.localStorage.setItem(name, this.serialize(data));

    return data;
  }

  read(name: string): T {
    const data = this.deserialize(window.localStorage.getItem(name)) ?? this.set(name, this.defaults);

    return data;
  }

  write(name: string, data: T): void {
    this.set(name, data);
  }

  serialize(data: T): string {
    return JSON.stringify(data);
  }

  deserialize(data: string | null): T | null {
    if (!data) return null;

    return JSON.parse(data);
  }
}

export default LocalStorageStrategy;