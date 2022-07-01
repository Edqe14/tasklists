import { nanoid } from 'nanoid';
import store from '..';
import Base from './base';
import { TimestampsOptions } from './timestamps';

export interface CollectionOptions extends TimestampsOptions {
  name: string;
  id?: string;
}

export class Collection extends Base {
  public readonly id: string;

  public name: string;

  constructor({ id, name, ...timestamps }: CollectionOptions) {
    super(timestamps);

    this.id = id ?? nanoid();
    this.name = name;

    // Always call this
    super.watch();

    this.on('__save', () => store.getState().markChanged('collections'));
  }

  static resolve(resolvable: string, createOnNotFound: true): Collection;

  static resolve(resolvable: string, createOnNotFound: false): Collection | undefined;

  static resolve(resolvable: string, createOnNotFound = false): Collection | undefined {
    const state = store.getState();
    const collection = state.collections.find((c) => c.id === resolvable || c.name === resolvable);

    if (!collection && createOnNotFound) {
      const coll = new Collection({ name: resolvable });
      state.appendCollections(coll);

      return coll;
    }

    return collection;
  }
}

export type Collections = Collection[];
export default Collection;