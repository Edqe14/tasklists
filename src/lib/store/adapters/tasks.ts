import { supportsTauri } from '@/lib/backend';
import LocalStorageStrategy from '../strategies/localStorage';
import TauriFileSystemStrategy, { TauriFileSystemStrategyOptions } from '../strategies/tauriFileSystem';
import StoreAdapter from '../structs/adapter';
import Task, { TaskOptions, Tasks } from '../structs/task';

const taskAdapter = new StoreAdapter<Tasks, TauriFileSystemStrategyOptions<Tasks>>('tasks', {
  strategy: supportsTauri()
    ? new TauriFileSystemStrategy<Tasks>([], {
      deserialize(data) {
        const val = JSON.parse(data) as TaskOptions[];

        return val.map((v) => new Task(v));
      },
    })
    : new LocalStorageStrategy<Tasks>([]),
});

export default taskAdapter;