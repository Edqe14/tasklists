import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="mb-1">
        <button className="btn" onClick={() => navigate('/')}>go bacc</button>
      </section>
    </>
  );
};

export default Settings;