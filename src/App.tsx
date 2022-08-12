import React from 'react';

import { GlobalStyles } from './global';
import { Routes } from './routes';

const App: React.FC = () => {
  return (
    <>
      <Routes />

      <GlobalStyles />
    </>
  );
};

export { App };
