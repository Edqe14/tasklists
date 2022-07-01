import getCircularReplacer from '@/lib/helpers/getCircularReplacer';
import Serializible from '@/lib/helpers/types/serializible';
import { Strategy } from '../structs/adapter';

class LocalStorageStrategy<T> implements Strategy<T, Serializible<T>> {
  protected readonly defaults: T;

  protected readonly serializer: Serializible<T> = {};

  constructor(defaults: T, serializer: Serializible<T> = {}) {
    this.defaults = defaults;
    this.serializer = serializer;
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
    if (this.serializer.serialize) return this.serializer.serialize(data);

    return JSON.stringify(data, getCircularReplacer());
  }

  deserialize(data: string | null): T | null {
    if (!data) return null;
    if (this.serializer.deserialize) return this.serializer.deserialize(data);

    return JSON.parse(data);
  }
}

export default LocalStorageStrategy;