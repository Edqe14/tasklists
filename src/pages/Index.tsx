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
      </section>

      <section>
        {collections.map((v) => (<p key={v.id}>{v.toString()}</p>))}
      </section>
    </>
  );
};

export default Index;