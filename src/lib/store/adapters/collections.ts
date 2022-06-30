import { TauriFileSystemStrategyOptions } from '../strategies/tauriFileSystem';
import Collection, { CollectionOptions, Collections } from '../structs/collection';
import StoreAdapter from '../structs/adapter';
import getStrategy from '@/lib/helpers/getStrategy';

const collectionAdapter = new StoreAdapter<Collections, TauriFileSystemStrategyOptions<Collections>>('collections', {
  strategy: getStrategy<Collections>([], {
    deserialize(data) {
      const val = JSON.parse(data) as CollectionOptions[];

      return val.map((v) => new Collection(v));
    },
  })
});

export default collectionAdapter;