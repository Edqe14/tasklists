import { MouseEventHandler, useMemo } from 'react';
import { MdClose, MdMinimize } from 'react-icons/md';
import { FiMaximize } from 'react-icons/fi';
import { shell, window as tauriWindow } from '@tauri-apps/api';

const Titlebar = () => {
  const handleMouse: MouseEventHandler<HTMLElement> = async (ev) => {
    switch (ev.detail) {
      case 1: {
        await tauriWindow.appWindow.startDragging();

        break;
      }

      case 2: {
        await tauriWindow.appWindow.toggleMaximize();

        break;
      }

      default: break;
    }
  };

  const size = useMemo(() => 16, []);
  const clickable = useMemo(() => 'cursor-pointer z-10 opacity-50 transition-all duration-300 ease hover:opacity-80', []);

  return (
    <section
      aria-roledescription="titlebar"
      className="bg-gray-50 dark:bg-gray-800 dark:bg-opacity-25 px-3 py-[0.2rem] select-none flex"
    >
      <section onMouseDown={handleMouse} className="flex-grow">
        <h1
          className={`inline font-bold text-sm italic ${clickable}`}
          onClick={() => shell.open('https://github.com/edqe14/tasklists')}
        >
          Tasklists
        </h1>
      </section>

      <section className="flex gap-4 items-center">
        <MdMinimize size={size} className={clickable} onClick={() => tauriWindow.appWindow.minimize()} />
        <FiMaximize size={size - 2} className={clickable} onClick={() => tauriWindow.appWindow.toggleMaximize()} />
        <MdClose size={size} className={`hover:text-red-400 ${clickable}`} onClick={() => tauriWindow.appWindow.close()} />
      </section>
    </section>
  );
};

export default Titlebar;