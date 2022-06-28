/* eslint-disable no-underscore-dangle */

export type Promisable<T> = T | Promise<T>;

export interface Strategy<T, K = undefined> {
  read(name: string, options?: K): Promisable<T>;
  write(name: string, data: T, options?: K): Promisable<void>;
}

export interface StoreAdapterOptions<T, K = undefined> {
  strategy: Strategy<T, K>;
  autoSave?: number | false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoSaveHandler?: () => any;
  data?: K;
}

/**
 * T is the read & write data type
 * K is extra data that can be used by the strategy
 */
class StoreAdapter<T, K = undefined> {
  public readonly name: string;

  public readonly options: StoreAdapterOptions<T, K>;

  public readonly strategy: Strategy<T, K>;

  protected _autoSave: number | false = false;

  public get autoSave() {
    return this._autoSave;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected autoSaveHandler?: () => any;

  private timer: NodeJS.Timeout | null = null;

  constructor(name: string, options: StoreAdapterOptions<T, K>) {
    this.name = name;
    this.options = options;
    this.strategy = options.strategy;

    if (typeof options.autoSave === 'number') {
      if (!options.autoSaveHandler) throw new Error('"autoSaveHandler" is required when autoSave is a number');

      this.autoSaveHandler = options.autoSaveHandler;
      this.enableAutoSave(options.autoSave);
    }
  }

  setAutoSaveInterval(interval: number | false) {
    if (interval === false) return this.disableAutoSave();

    return this.enableAutoSave(interval);
  }

  enableAutoSave(interval: number) {
    if (typeof interval !== 'number') throw new TypeError('"interval" only accepts a number');
    if (this.timer !== null) clearTimeout(this.timer);

    this._autoSave = interval;

    const handler = async () => {
      if (!this.autoSaveHandler) throw new Error('Missing "autoSaveHandler"');

      await this.autoSaveHandler();

      this.timer = setTimeout(handler, this._autoSave as number);
    };

    this.timer = setTimeout(handler, this._autoSave as number);
  }

  disableAutoSave() {
    this._autoSave = false;

    if (this.timer !== null) clearTimeout(this.timer);
  }

  read(options?: K & { name: string }) {
    // eslint-disable-next-line prefer-object-spread
    return this.strategy.read(options?.name ?? this.name, Object.assign({}, this.options.data, options));
  }

  write(data: T, options?: K & { name: string }) {
    // eslint-disable-next-line prefer-object-spread
    return this.strategy.write(options?.name ?? this.name, data, Object.assign({}, this.options.data, options));
  }

  use(name?: string, data?: K) {
    return new StoreAdapter(name ?? this.name, {
      ...this.options,
      data: data ?? this.options.data
    });
  }
}

export default StoreAdapter;