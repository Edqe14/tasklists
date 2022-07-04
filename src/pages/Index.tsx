import shallow from 'zustand/shallow';
import { ColorInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import useStore from '@/lib/store';
import Collection from '@/lib/store/structs/collection';
import Loading from '@/components/Loading';
import buildNotificationProps from '@/lib/helpers/buildNotificationProps';

const Index = () => {
  const { collections, appendCollections, color, setColor } = useStore((state) => ({
    appendCollections: state.appendCollections,
    collections: state.collections,
    color: state.configuration.color,
    setColor: state.setColor,
  }), shallow);

  return (
    <>
      <section className="mb-1">
        <button className="btn" onClick={() => appendCollections(new Collection({ name: 'WOEEE' }))}>test</button>
        <button className="btn" onClick={() => {collections[0].name = `WOEEE ${Date.now()}`; }}>CHANGE</button>
        {/* eslint-disable-next-line no-param-reassign */}
        <button className="btn" onClick={() => collections.forEach((v, i) => { v.name = `WOEEEE ${i + Math.floor(Math.random() * 10000)}`;})}>CHANGE ALL</button>
      </section>

      <ColorInput value={color} onChange={setColor} className="mb-1" />

      <section className="mb-1">
        <button className="btn" onClick={() => showNotification(buildNotificationProps({ message: 'epic', title: 'ree' }))}>test notif</button>
      </section>

      <section className="w-32 h-32 relative">
        <Loading visible={false} />
      </section>

      <section>
        {collections.map((v) => (<p key={v.id}>{v.toString()}</p>))}
      </section>
    </>
  );
};

export default Index;