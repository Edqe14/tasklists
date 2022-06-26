import useStore from '@/lib/store';

const Index = () => {
  const adapter = useStore((state) => state.adapter);

  return (
    <>
      <button className="btn" onClick={async () => console.log(await adapter.read())}>read</button>
      <button className="btn" onClick={() => adapter.write({ foo: `baz ${Date.now()}` })}>write</button>
    </>
  );
};

export default Index;