interface Settings {
  color: string;

  deadline: {
    enabled: boolean; // Whether to check for deadlines
    threshold: number[]; // In miliseconds, threshold to test for near deadlines
  };
  routine: {
    hour12: boolean;
    defaultImportant: boolean;
  };
  focusMode: {
    pomodoroLength: number; // In minutes
    shortBreakLength: number; // In minutes
    longBreakLength: number; // In minutes
    longBreakAfter: number; // In pomodoros
    automaticallyMarkAsDone: boolean;
  };

  notifications: {
    enabled: boolean;
    showNativeNotification: boolean;
    flashTaskbar: boolean;
    reduceMotion: boolean;

    sound: {
      enabled: boolean;

      deadline: boolean | string;
      routine: boolean | string;
    };
  };
}

export default Settings;