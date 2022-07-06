import { JSONContent } from '@tiptap/react';
import { nanoid } from 'nanoid';
import store from '..';
import Base, { BaseOptions } from './base';
import Collection from './collection';
import { TimestampsOptions } from './timestamps';

export interface TaskOptions extends TimestampsOptions, BaseOptions {
  name: string;
  id?: string;
  description?: JSONContent;
  collections?: string[];
  order?: Record<string, number>; // Order mapped by collection id, defaults to 0
  starred?: boolean;
  deadline?: Date;
}

export class Task extends Base {
  public readonly id: string;

  public name: string;

  public description?: JSONContent;

  public collections: Collection[] = [];

  public order: Record<string, number> = {};

  public starred = false;

  public deadline?: Date;

  constructor({ autoAppend = true, id, name, description, collections, order, starred, deadline, ...timestamps }: TaskOptions) {
    super(timestamps);

    this.id = id ?? nanoid();
    this.name = name;
    this.description = description;
    this.collections = (collections ?? [])
      .map((v) => Collection.resolve(v, true));
    this.order = order ?? {};
    this.starred = starred ?? false;
    this.deadline = deadline;

    if (autoAppend) store.getState().appendTasks(this);

    // Always call this
    super.watch();

    this.on('__save', () => store.getState().markChanged('tasks'));
  }

  public toJSON() {
    return {
      ...this,
      collections: this.collections.map((c) => c.id)
    };
  }

  static resolve(resolvable: string, createOnNotFound = false): Collection | undefined {
    const state = store.getState();
    const task = state.tasks.find((c) => c.id === resolvable || c.name === resolvable);

    if (!task && createOnNotFound) {
      const temp = new Task({ name: resolvable });
      state.appendTasks(temp);

      return temp;
    }

    return task;
  }
}

export type Tasks = Task[];
export default Task;