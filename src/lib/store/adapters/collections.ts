import { supportsTauri } from '@/lib/backend';
import LocalStorageStrategy from '../strategies/localStorage';
import TauriFileSystemStrategy, { TauriFileSystemStrategyOptions } from '../strategies/tauriFileSystem';
import { Collections } from '../structs/collection';
import StoreAdapter from '../structs/storeAdapter';

const adapter = new StoreAdapter<Collections, TauriFileSystemStrategyOptions>('test', {
  strategy: supportsTauri()
    ? new TauriFileSystemStrategy<Collections>({})
    : new LocalStorageStrategy<Collections>({}),
  data: {
    dir: ['data']
  },
});

export default adapter;