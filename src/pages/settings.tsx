import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@mantine/core';
import shallow from 'zustand/shallow';
import PageTransition from '@/components/PageTransition';
import store from '@/lib/store';
import { supportsTauri } from '@/lib/backend';

const Settings = () => {
  const navigate = useNavigate();
  const [config, mergeConfiguration] = store((state) => [state.configuration, state.mergeConfiguration], shallow);

  return (
    <PageTransition>
      <section className="mb-1">
        <button className="btn" onClick={() => navigate('/')}>go bacc</button>
      </section>

      <section className="mb-1">
        <Checkbox label="Enable reduced motion" checked={config.reduceMotion} onChange={(ev) => mergeConfiguration({ reduceMotion: ev.currentTarget.checked })} />
        <Checkbox label="Show native notification" checked={config.notifications.showNativeNotification} onChange={(ev) => mergeConfiguration({ notifications: { showNativeNotification: ev.currentTarget.checked } })} />
        <Checkbox label="FLASHHHH" disabled={!supportsTauri()} checked={config.notifications.flashTaskbar} onChange={(ev) => mergeConfiguration({ notifications: { flashTaskbar: ev.currentTarget.checked } })} />
      </section>
    </PageTransition>
  );
};

export default Settings;