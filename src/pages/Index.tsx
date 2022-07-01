import shallow from 'zustand/shallow';
import { ColorInput } from '@mantine/core';
import useStore from '@/lib/store';
import Collection from '@/lib/store/structs/collection';

const Index = () => {
  const { collections, appendCollections, color, setColor } = useStore((state) => ({
    appendCollections: state.appendCollections,
    collections: state.collections,
    color: state.color,
    setColor: state.setColor,
  }), shallow);

  console.log(collections);

  return (
    <>
      <section className="mb-1">
        <button className="btn" onClick={() => appendCollections(new Collection({ name: 'WOEEE' }))}>test</button>
        <button className="btn" onClick={() => {collections[0].name = `WOEEE ${Date.now()}`; }}>CHANGE</button>
        {/* eslint-disable-next-line no-param-reassign */}
        <button className="btn" onClick={() => collections.forEach((v, i) => { v.name = `WOEEEE ${i + Math.floor(Math.random() * 10000)}`;})}>CHANGE ALL</button>
        {/* <button className="btn" onClick={}>FLASHSHEH</button> */}
      </section>

      <ColorInput value={color} onChange={setColor} />

      <section>
        {collections.map((v) => (<p key={v.id}>{v.toString()}</p>))}
      </section>
    </>
  );
};

export default Index;