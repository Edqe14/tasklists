import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <section className="mb-1">
        <button className="btn" onClick={() => navigate('/')}>go bacc</button>
      </section>
    </PageTransition>
  );
};

export default Settings;