import shallow from 'zustand/shallow';
import { ColorInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import useStore from '@/lib/store';
import Collection from '@/lib/store/structs/collection';
import Schedule from '@/lib/schedulers/structs/schedule';
import displayNotification from '@/lib/helpers/displayNotification';
import PageTransition from '@/components/PageTransition';

const Index = () => {
  const navigate = useNavigate();
  const { collections, schedules, color, setColor } = useStore((state) => ({
    collections: state.collections,
    schedules: state.schedules,
    color: state.configuration.color,
    setColor: state.setColor,
  }), shallow);

  return (
    <PageTransition>
      <section className="mb-1">
        <button className="btn" onClick={() => new Collection({ name: 'WOEEE' })}>test</button>
        <button className="btn" onClick={() => {collections[0].name = `WOEEE ${Date.now()}`; }}>CHANGE</button>
        {/* eslint-disable-next-line no-param-reassign */}
        <button className="btn" onClick={() => collections.forEach((v, i) => { v.name = `WOEEEE ${i + Math.floor(Math.random() * 10000)}`;})}>CHANGE ALL</button>
        <button className="btn" onClick={() => navigate('/settings')}>go to settings</button>
      </section>

      <ColorInput value={color} onChange={setColor} className="mb-1" />

      <section className="mb-1">
        <button className="btn" onClick={() => displayNotification({ message: 'epic', title: 'ree' })}>test notif</button>
        <button className="btn" onClick={() => new Schedule({ time: 2_000, reoccuring: true, execute: () => displayNotification({ message: 'schedules', title: 'poggers' }) })}>test sched notif</button>
        <button className="btn" onClick={() => schedules.forEach((v) => v.reoccuring && v.destroy())}>destroy all reoccuring scheds</button>
      </section>

      <section className="mb-2">
        {collections.map((v) => (<p key={v.id}>{v.toString()}</p>))}
      </section>

      <section className="mb-2">
        {schedules.map((v) => (<p key={v.id}>{v.toString()}</p>))}
      </section>
    </PageTransition>
  );
};

export default Index;