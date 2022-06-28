export interface TimestampsOptions {
  createdAt?: Date;
  updatedAt?: Date;
}

class Timestamps {
  public readonly createdAt: Date;

  public updatedAt: Date;

  constructor({ createdAt, updatedAt }: TimestampsOptions) {
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();

    Object.defineProperty(this, 'createdAt', {
      writable: false
    });
  }

  public update() {
    this.updatedAt = new Date();
  }
}

export default Timestamps;