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
import { pick } from 'lodash-es';
import { NotificationsProvider } from '@mantine/notifications';
import Index from './pages';
import isTauri from './lib/backend';
import Titlebar from './components/Titlebar';
import Container from './components/Container';
import useStore from './lib/store';
import Loading from './components/Loading';
import Settings from './pages/settings';

const updateTheme = () => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

updateTheme();

const Entry = () => {
  const [storedTheme] = useLocalStorage({ key: 'theme', defaultValue: 'dark', serialize: (v) => v });
  const {
    theme,
    setTheme,
    ready
  } = useStore((state) => pick(state, ['theme', 'setTheme', 'ready']), shallow);

  useEffect(() => {
    updateTheme();
  }, [storedTheme, theme]);

  useEffect(() => {
    setTheme(storedTheme as ColorScheme);
  }, [storedTheme]);

  return (
    (
      <>
        {isTauri && <Titlebar />}

        <MantineProvider
          theme={{
            colorScheme: theme,
            colors: {
              dark: [
                '#ffffff',
                '#d6d6d6',
                '#adadad',
                '#848484',
                '#5b5b5b',
                '#323232',
                '#282828',
                '#1e1e1e',
                '#141414',
                '#0a0a0a'
              ]
            }
          }}
        >
          <Container>
            <NotificationsProvider position="top-right" className={isTauri ? 'pt-8' : ''}>
              <Loading visible={!ready} />

              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </BrowserRouter>
            </NotificationsProvider>
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
