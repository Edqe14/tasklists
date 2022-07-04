import { debounce } from 'lodash-es';
import logger from '@/lib/logger';
import store from '..';
import settingsAdapter from '../adapters/settings';

const debounceWait = 300;
const saveSettingsDebouncer = debounce(async () => {
  const curr = store.getState().configuration;

  await settingsAdapter.write(curr);

  logger.success('saved settings', curr);
}, debounceWait);

export default saveSettingsDebouncer;