import shallow from 'zustand/shallow';
import useStore from '@/lib/store';
import Collection from '@/lib/store/structs/collection';

const Index = () => {
  const { collections, appendCollections } = useStore((state) => ({ appendCollections: state.appendCollections, collections: state.collections }), shallow);

  console.log(collections);

  return (
    <>
      <section className="mb-1">
        <button className="btn" onClick={() => appendCollections(new Collection({ name: 'WOEEE' }))}>test</button>
        <button className="btn" onClick={() => {collections[0].name = `WOEEE ${Date.now()}`; }}>CHANGE</button>
        {/* eslint-disable-next-line no-param-reassign */}
        <button className="btn" onClick={() => collections.forEach((v, i) => { v.name = `WOEEEE ${i + Math.floor(Math.random() * 10000)}`;})}>CHANGE ALL</button>
      </section>

      <section>
        {collections.map((v) => (<p key={v.id}>{v.toString()}</p>))}
      </section>
    </>
  );
};

export default Index;