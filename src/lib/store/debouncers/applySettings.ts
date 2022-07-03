import { debounce, pick } from 'lodash-es';
import logger from '@/lib/logger';
import store from '..';
import settingsAdapter, { settingsDefault } from '../adapters/settings';
import Settings from '../structs/settings';

const debounceWait = 300;
const saveSettingsDebouncer = debounce(async () => {
  const curr = pick(store.getState(), Object.keys(settingsDefault));

  await settingsAdapter.write(curr as Settings);

  logger.success('saved settings', curr);
}, debounceWait);

export default saveSettingsDebouncer;