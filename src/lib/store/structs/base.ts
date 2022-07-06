import { EventEmitter } from 'eventemitter3';
import { Mixin } from 'ts-mixer';
import TypedEventEmitter from 'typed-emitter';
import watch from '@/lib/helpers/watch';
import Timestamps from './timestamps';
import getCircularReplacer from '@/lib/helpers/getCircularReplacer';

export type BaseEvents = {
  __save: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changed: (value?: { name: string; value: any }) => any;
};

export interface BaseOptions {
  autoAppend?: boolean;
}

class Base extends Mixin(Timestamps, EventEmitter as new () => TypedEventEmitter<BaseEvents>) {
  protected watch() {
    watch(this, (val) => {
      this.update();
      this.emit('changed', val);
      this.emit('__save');
    });
  }

  public markChanged() {
    this.update();
    this.emit('changed');
    this.emit('__save');
  }

  public toString() {
    return JSON.stringify(this, getCircularReplacer());
  }
}

export default Base;