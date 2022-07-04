import { LoadingOverlay , LoadingOverlayProps } from '@mantine/core';
import shallow from 'zustand/shallow';
import store from '@/lib/store';

interface Props extends LoadingOverlayProps {
  visible: boolean;
}

const Loading = ({ visible, ...rest }: Props) => {
  const [theme, color] = store((state) => [state.theme, state.configuration.color], shallow);

  return (
    <LoadingOverlay
      visible={visible}
      exitTransitionDuration={400}
      transitionDuration={300}
      style={{ transitionTimingFunction: 'cubic-bezier(.67,-0.01,.35,1)' }}
      overlayOpacity={1}
      overlayColor={theme === 'dark' ? '#1b1b1b' : '#ffffff'}
      loaderProps={{
        color,
        size: 'xl',
        sx: () => ({
          g: {
            strokeWidth: '1'
          }
        })
      }}
      {...rest}
    />
  );
};

export default Loading;