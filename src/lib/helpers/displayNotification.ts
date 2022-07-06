import { NotificationProps, showNotification } from '@mantine/notifications';
import { window as tauriWindow } from '@tauri-apps/api';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { UserAttentionType } from '@tauri-apps/api/window';
import store from '../store';
import buildNotificationProps from './buildNotificationProps';
import playAudio from './playAudio';

export type NotificationContext = 'deadline' | 'routine';

export const AUDIO_SRCS = {
  default: '/src/assets/audio/notification.mp3',
  deadline: null,
  routine: null
};

const displayNotification = async (props: NotificationProps, context?: NotificationContext) => {
  const config = store.getState().configuration;

  if (!config.notifications.enabled) return;

  const notification = showNotification(buildNotificationProps(props));

  // TODO: customizable audio and per context audio
  if (config.notifications.sound.enabled) playAudio(AUDIO_SRCS[context ?? 'default'] ?? AUDIO_SRCS.default);

  if (config.notifications.flashTaskbar) await tauriWindow.appWindow.requestUserAttention(UserAttentionType.Informational);
  if (
    config.notifications.showNativeNotification &&
    (
      await isPermissionGranted().catch(() => false) ||
      await requestPermission() === 'granted'
    )
  ) {
    sendNotification({ title: 'Tasklists', body: (props.message ?? undefined) as string | undefined });
  }

  return notification;
};

export default displayNotification;