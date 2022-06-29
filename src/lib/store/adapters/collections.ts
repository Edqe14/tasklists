import { supportsTauri } from '@/lib/backend';
import store from '..';
import LocalStorageStrategy from '../strategies/localStorage';
import TauriFileSystemStrategy, { TauriFileSystemStrategyOptions } from '../strategies/tauriFileSystem';
import Collection, { CollectionOptions, Collections } from '../structs/collection';
import StoreAdapter from '../structs/storeAdapter';

const collectionAdapter = new StoreAdapter<Collections, TauriFileSystemStrategyOptions<Collections>>('collections', {
  strategy: supportsTauri()
    ? new TauriFileSystemStrategy<Collections>([], {
      deserialize(data) {
        const val = JSON.parse(data) as CollectionOptions[];

        return val.map((v) => {
          const coll = new Collection(v);
          coll.on('__save', () => store.getState().saveCollections());

          return coll;
        });
      },
    })
    : new LocalStorageStrategy<Collections>([]),
});

export default collectionAdapter;