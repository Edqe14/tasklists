import { debounce } from 'lodash-es';
import logger from '@/lib/logger';
import store from '..';
import collectionAdapter from '../adapters/collections';

const debounceWait = 300;
const saveCollectionsDebouncer = debounce(async () => {
  logger.trace('saving collections');

  await collectionAdapter.write(store.getState().collections);

  logger.success('saved collections');
}, debounceWait);

export default saveCollectionsDebouncer;