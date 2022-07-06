import { NotificationProps, showNotification } from '@mantine/notifications';
import { window as tauriWindow } from '@tauri-apps/api';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';
import { UserAttentionType } from '@tauri-apps/api/window';
import { supportsTauri } from '../backend';
import store from '../store';
import buildNotificationProps from './buildNotificationProps';
import playAudio from './playAudio';

export type NotificationContext = 'deadline' | 'routine';

const displayNotification = async (props: NotificationProps, context?: NotificationContext) => {
  const config = store.getState().configuration;
  if (!config.notifications.enabled) return;

  const notification = showNotification(buildNotificationProps(props));

  if (!context ? true : config.notifications.sound[context]) {
    let src = '/src/assets/audio/notification.mp3';

    if (context && typeof config.notifications.sound[context] === 'string') {
      src = config.notifications.sound[context] as string;
    }

    playAudio(src);
  }

  if (supportsTauri() && config.notifications.flashTaskbar) await tauriWindow.appWindow.requestUserAttention(UserAttentionType.Informational);
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