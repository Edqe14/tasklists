/* eslint-disable @typescript-eslint/no-explicit-any */

import { EventEmitter } from 'eventemitter3';
import { Mixin } from 'ts-mixer';
import TypedEventEmitter from 'typed-emitter';
import Timestamps from './timestamps';

const ignoreList = [
  'updatedAt',
];

type BaseEvents = {
  changed: (value: { name: string; value: any }) => any;
};


class Base extends Mixin(Timestamps, EventEmitter as new () => TypedEventEmitter<BaseEvents>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected watch(extraHandler?: (name: string, value: any) => any) {
    const names = Object.getOwnPropertyNames(this)
      .filter((name) => !ignoreList.includes(name) && !name.startsWith('_'));

    // eslint-disable-next-line no-restricted-syntax
    for (const name of names) {
      const descriptor = Object.getOwnPropertyDescriptor(this, name);

      // eslint-disable-next-line no-continue
      if (!descriptor || !descriptor?.writable) continue;

      Object.defineProperty(this, name, {
        // eslint-disable-next-line no-loop-func
        set(value) {
          if (value === this[name]) {
            return;
          }

          if (descriptor) {
            if (descriptor.set) descriptor.set.call(this, value);
            else descriptor.value = value;
          }

          this.update();
          this.emit('changed', { name, value });

          if (extraHandler) extraHandler(name, value);
        },
        get() {
          if (descriptor) {
            if (descriptor.get) return descriptor.get?.call?.(this);

            return descriptor.value;
          }
        },
        configurable: true,
      });
    }
  }
}

export default Base;