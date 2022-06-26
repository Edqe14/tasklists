export type Promisable<T> = T | Promise<T>;

export interface Strategy<T, K = undefined> {
  read(name: string, options?: K): Promisable<T>;
  write(name: string, data: T, options?: K): Promisable<void>;
}

export interface StoreAdapterOptions<T, K = undefined> {
  strategy: Strategy<T, K>;
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

  constructor(name: string, options: StoreAdapterOptions<T, K>) {
    this.name = name;
    this.options = options;
    this.strategy = options.strategy;
  }

  read() {
    return this.strategy.read(this.name, this.options.data);
  }

  write(data: T) {
    return this.strategy.write(this.name, data, this.options.data);
  }

  use(strategy: Strategy<T, K>) {
    return new StoreAdapter(this.name, { ...this.options, strategy });
  }
}

export default StoreAdapter;