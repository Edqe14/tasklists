import { EventEmitter } from 'eventemitter3';
import { nanoid } from 'nanoid';
import TypedEventEmitter from 'typed-emitter';
import { omit } from 'lodash-es';
import { BaseOptions } from '@/lib/store/structs/base';
import store from '@/lib/store';
import getCircularReplacer from '@/lib/helpers/getCircularReplacer';

export type ScheduleEvents<T> = {
  run: (reference?: T) => void;
};

export interface ScheduleOptions<T = unknown> extends BaseOptions {
  time: number | Date;
  reference?: T;
  reoccuring?: boolean;
  relative?: boolean;
  execute?: ScheduleEvents<T>['run'];
}

class Schedule<T = unknown> extends (EventEmitter as new () => TypedEventEmitter<ScheduleEvents<unknown>>) {
  protected _enabled = true;

  get enabled() {
    // eslint-disable-next-line no-underscore-dangle
    return this._enabled;
  }

  public readonly id = nanoid();

  public reference?: T;

  public reoccuring: boolean;

  public time: number;

  public relative: boolean;

  public execute?: ScheduleEvents<T>['run'];

  private _destroyed = false;

  get destroyed() {
    // eslint-disable-next-line no-underscore-dangle
    return this._destroyed;
  }

  private timeout: NodeJS.Timeout | null = null;

  constructor({ autoAppend = true, reference, reoccuring, time, relative, execute }: ScheduleOptions<T>) {
    if ((reoccuring || relative) && time instanceof Date) throw new TypeError('Reoccuring or relative schedules must be given a time in milliseconds');

    super();

    this.reference = reference;
    this.reoccuring = reoccuring ?? false;
    this.relative = reoccuring ? true : relative ?? false;
    this.time = time instanceof Date ? time.getTime() : time;
    this.execute = execute;

    if (autoAppend) store.getState().appendSchedules(this);

    this.schedule();
  }

  public setEnabled(value: boolean) {
    // eslint-disable-next-line no-underscore-dangle
    this._enabled = value;

    if (!value && this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;

      return;
    }

    if (value && !this.timeout) return this.schedule();
  }

  public reschedule(time: ScheduleOptions['time']) {
    if ((this.reoccuring || this.relative) && time instanceof Date) throw new TypeError('Reoccuring or relative schedules must be given a time in milliseconds');

    this.time = time instanceof Date ? time.getTime() : time;
    this.schedule();
  }

  protected schedule() {
    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.emit('run', this.reference);
      this?.execute?.(this.reference);

      if (this.reoccuring) this.schedule();
      else this.destroy();
    }, this.relative ? this.time : this.time - Date.now());
  }

  public destroy() {
    // eslint-disable-next-line no-underscore-dangle
    this._destroyed = true;

    store.setState((state) => ({ schedules: state.schedules.filter((v) => v !== this) }));

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  public toString() {
    return JSON.stringify(omit(this, 'timeout'), getCircularReplacer());
  }
}

export default Schedule;