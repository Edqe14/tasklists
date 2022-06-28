import { nanoid } from 'nanoid';

const Index = () => (
  <>
    <section className="mb-1">
      <button className="btn" onClick={async () => console.log(nanoid())}>generate id</button>
    </section>
  </>
);

export default Index;