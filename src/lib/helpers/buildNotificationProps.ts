import { NotificationProps } from '@mantine/notifications';

const buildNotificationProps = (props: NotificationProps): NotificationProps => ({
  autoClose: 8_000,
  classNames: {
    title: 'text-lg mb-0 font-bold',
  },
  sx: () => ({
    '::before': {
      backgroundColor: 'var(--color-scheme)'
    }
  }),
  ...props
});

export default buildNotificationProps;