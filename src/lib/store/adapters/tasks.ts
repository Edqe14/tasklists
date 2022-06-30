import getStrategy from '@/lib/helpers/getStrategy';
import { TauriFileSystemStrategyOptions } from '../strategies/tauriFileSystem';
import StoreAdapter from '../structs/adapter';
import Task, { TaskOptions, Tasks } from '../structs/task';

const taskAdapter = new StoreAdapter<Tasks, TauriFileSystemStrategyOptions<Tasks>>('tasks', {
  strategy: getStrategy<Tasks>([], {
    deserialize(data) {
      const val = JSON.parse(data) as TaskOptions[];

      return val.map((v) => new Task(v));
    },
  })
});

export default taskAdapter;