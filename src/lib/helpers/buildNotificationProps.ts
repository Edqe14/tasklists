import { NotificationProps } from '@mantine/notifications';

const buildNotificationProps = (props: NotificationProps): NotificationProps => ({
  autoClose: 10_000,
  classNames: {
    root: 'bg-slate-50 text-gray-800 border-slate-200 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600',
    title: 'text-lg mb-0 font-bold font-jetBrainsMono',
    body: 'font-jetBrainsMono',
    description: 'font-jetBrainsMono'
  },
  sx: () => ({
    '::before': {
      backgroundColor: 'var(--color-scheme)'
    }
  }),
  ...props
});

export default buildNotificationProps;