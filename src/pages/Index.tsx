import Collection from '@/lib/store/structs/collection';

const a = new Collection({ name: 'a' });
a.on('changed', console.log);

const Index = () => (
  <>
    <section className="mb-1">
      <button className="btn" onClick={async () => {
        a.name = `test ${ Date.now()}`;
      }}>test</button>
    </section>
  </>
);

export default Index;