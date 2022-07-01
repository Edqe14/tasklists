import { TauriFileSystemStrategyOptions } from '../strategies/tauriFileSystem';
import StoreAdapter from '../structs/adapter';
import getStrategy from '@/lib/helpers/getStrategy';
import Settings from '../structs/settings';

export const settingsDefault: Settings = {
  color: '#3f74e7',
  deadline: {
    enabled: true,
    // 24h, 12h, 6h, 2h, 30min
    threshold: [86400000, 43200000, 21600000, 7200000, 1800000]
  },
  focusMode: {
    automaticallyMarkAsDone: true,
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakAfter: 2
  },
  routine: {
    hour12: true,
    defaultImportant: true
  },
  notifications: {
    enabled: true,
    flashTaskbar: true,
    showNativeNotification: true,

    sound: {
      deadline: true,
      enabled: true,
      routine: true
    }
  }
};

const settingsAdapter = new StoreAdapter<Settings, TauriFileSystemStrategyOptions<Settings>>('settings', {
  strategy: getStrategy<Settings>(settingsDefault),
  data: {
    dir: []
  },
});

export default settingsAdapter;