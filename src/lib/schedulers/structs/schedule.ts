import { EventEmitter } from 'eventemitter3';
import { nanoid } from 'nanoid';
import { Mixin } from 'ts-mixer';
import TypedEventEmitter from 'typed-emitter';
import Timestamps from '@/lib/store/structs/timestamps';

export type ScheduleEvents<T> = {
  run: (reference?: T) => void;
};

export interface ScheduleOptions<T = unknown> {
  time: number | Date;
  reference?: T;
  reoccuring?: boolean;
  relative?: boolean;
}

class Schedule<T = unknown> extends Mixin(Timestamps, EventEmitter as new () => TypedEventEmitter<ScheduleEvents<unknown>>) {
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

  private timeout: NodeJS.Timeout | null = null;

  constructor({ reference, reoccuring, time, relative }: ScheduleOptions<T>) {
    if ((reoccuring || relative) && time instanceof Date) throw new TypeError('Reoccuring or relative schedules must be given a time in milliseconds');

    super();

    this.reference = reference;
    this.reoccuring = reoccuring ?? false;
    this.relative = relative ?? false;
    this.time = time instanceof Date ? time.getTime() : time;

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

      if (this.reoccuring) this.schedule();
    }, this.relative ? this.time : this.time - Date.now());
  }
}

export default Schedule;