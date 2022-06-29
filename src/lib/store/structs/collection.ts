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

    this.on('__save', () => store.getState().saveCollections());
  }
}

export type Collections = Collection[];
export default Collection;