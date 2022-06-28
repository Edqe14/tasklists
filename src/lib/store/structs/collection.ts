import { nanoid } from 'nanoid';
import Base from './base';
import { TimestampsOptions } from './timestamps';

export interface CollectionOptions extends TimestampsOptions {
  name: string;
  id?: string;
}

export class Collection extends Base {
  public readonly id: string;

  public readonly name: string;

  constructor({ id, name, createdAt, updatedAt }: CollectionOptions) {
    super({ createdAt, updatedAt });

    this.id = id ?? nanoid();
    this.name = name;
  }
}

export type Collections = Record<string, Collection>;
export default Collection;