import './index.css';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Index from './pages/Index';
import isTauri from './lib/backend';
import Titlebar from './components/Titlebar';
import Container from './components/Container';

const Entry = () => {
  useEffect(() => {
    // Set dark theme if applicable
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    (
      <>
        {isTauri && <Titlebar />}

        <Container>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </>
    )
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Entry />
  </React.StrictMode>
);
