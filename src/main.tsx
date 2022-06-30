import './index.css';

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import shallow from 'zustand/shallow';
import { ColorScheme, MantineProvider } from '@mantine/core';
import Index from './pages/Index';
import isTauri from './lib/backend';
import Titlebar from './components/Titlebar';
import Container from './components/Container';
import useStore from './lib/store';

const updateTheme = () => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

updateTheme();

const Entry = () => {
  const [theme] = useLocalStorage({ key: 'theme', defaultValue: 'dark', serialize: (v) => v });
  const [storeTheme, setStoreTheme] = useStore((state) => [state.theme, state.setTheme], shallow);

  useEffect(() => {
    updateTheme();
  }, [theme, storeTheme]);

  useEffect(() => {
    setStoreTheme(theme as ColorScheme);
  }, [theme]);

  return (
    (
      <>
        {isTauri && <Titlebar />}

        <MantineProvider
          theme={{
            colorScheme: storeTheme,
          }}
          emotionOptions={{ key: 'mantine', prepend: false }}
        >
          <Container>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
              </Routes>
            </BrowserRouter>
          </Container>
        </MantineProvider>
      </>
    )
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Entry />
  </React.StrictMode>
);
