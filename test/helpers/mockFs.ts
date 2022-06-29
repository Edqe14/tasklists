import { mockIPC } from '@tauri-apps/api/mocks';

interface TauriFsMessage {
  cmd: string;
  path: string;
  contents: number[];
  options: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store: Record<string, number[]> = {};

const mockFs = () => mockIPC((cmd, args) => {
  // eslint-disable-next-line no-underscore-dangle
  if (cmd === 'tauri' && args.__tauriModule === 'Fs') {
    const { message } = args as { message: TauriFsMessage };

    switch(message.cmd) {
      case 'writeFile': {
        store[message.path] = message.contents;
        break;
      }

      case 'readFile': {
        return store[message.path];
      }

      case 'readTextFile': {
        return store[message.path]?.map((v) => String.fromCharCode(v))?.join('');
      }

      default: break;
    }
  }
});

export default mockFs;