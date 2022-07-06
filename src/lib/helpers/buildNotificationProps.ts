import { NotificationProps } from '@mantine/notifications';

const buildNotificationProps = (props: NotificationProps): NotificationProps => ({
  autoClose: 10_000,
  classNames: {
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