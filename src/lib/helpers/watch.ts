/* eslint-disable @typescript-eslint/no-explicit-any */

const ignoreList = [
  'updatedAt', 'length', '__proto__', 'constructor',
];

const watch = (obj: any, handle: (val: { name: string; value: any }) => any, prefix?: string[]) => {
  const names = Object.getOwnPropertyNames(obj)
    .filter((name) => !ignoreList.includes(name) && !name.startsWith('_'));

  // eslint-disable-next-line no-restricted-syntax
  for (const name of names) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, name);

    // eslint-disable-next-line no-continue
    if (!descriptor || !descriptor?.writable) continue;
    if (typeof descriptor.value === 'object') watch(descriptor.value, handle, [...(prefix ?? []), name]);

    Object.defineProperty(obj, name, {
      // eslint-disable-next-line no-loop-func
      set(value) {
        if (value === this[name]) return;

        if (descriptor) {
          if (descriptor.set) descriptor.set.call(this, value);
          else descriptor.value = value;
        }

        if (typeof value === 'object') watch(value, handle, [...(prefix ?? []), name]);

        handle({
          name: [...(prefix ?? []), name].join('.'),
          value
        });
      },
      get() {
        if (descriptor) {
          if (descriptor.get) return descriptor.get?.call?.(obj);

          return descriptor.value;
        }
      },
      configurable: true,
    });
  }
};

export default watch;