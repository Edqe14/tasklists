import { debounce } from 'lodash-es';
import logger from '@/lib/logger';
import store from '..';
import taskAdapter from '../adapters/tasks';

const debounceWait = 300;
const saveTasksDebouncer = debounce(async () => {
  logger.trace('saving tasks');

  await taskAdapter.write(store.getState().tasks);

  logger.success('saved tasks');
}, debounceWait);

export default saveTasksDebouncer;