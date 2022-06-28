import useStore from '@/lib/store';

const Index = () => {
  const adapter = useStore((state) => state.adapter);

  return (
    <>
      <section className="mb-1">
        <button className="btn" onClick={async () => console.log(await adapter.read())}>read</button>
        <button className="btn" onClick={() => adapter.write({ foo: `baz ${Date.now()}` })}>write</button>
        <button className="btn" onClick={() => adapter.write({ foo: `settiings ${Date.now()}` }, { name: 'settings', dir: [] })}>write settings</button>
      </section>

      <section>
        <button className="btn" onClick={() => adapter.enableAutoSave(5000)}>enable auto save</button>
        <button className="btn" onClick={() => adapter.disableAutoSave()}>disable auto save</button>
        <button className="btn" onClick={() => adapter.setAutoSaveInterval(5000)}>set to 5s</button>
      </section>
    </>
  );
};

export default Index;