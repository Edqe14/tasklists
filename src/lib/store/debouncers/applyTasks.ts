import { debounce } from 'lodash-es';
import logger from '@/lib/logger';
import store from '..';
import taskAdapter from '../adapters/tasks';

const debounceWait = 300;

export const scheduleTasks = () => {
  const { tasks, schedules, configuration } = store.getState();

  if (!configuration.deadline.enabled) return;

  const { threshold } = configuration.deadline;
  const allTasks = tasks.filter((t) => t.deadline && !t.finished);

  allTasks.forEach((task) => {
    const preschedule = schedules.find((s) => s.reference === task);
    if (preschedule) preschedule.destroy();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const dist = task.deadline!.getTime() - Date.now();
    if (dist <= 0) return;

    const nearest = threshold.find((t) => dist < t);
    console.log(nearest);
  });
};

const save = async () => {
  logger.trace('saving tasks');

  await taskAdapter.write(store.getState().tasks);

  logger.success('saved tasks');
};

const saveTasksDebouncer = debounce(() => {
  save();
  scheduleTasks();
}, debounceWait);

export default saveTasksDebouncer;