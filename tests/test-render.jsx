global.localStorage = { getItem: () => null, setItem: () => {} };
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';
import './src/i18n';

try {
  console.log('Rendering...');
  renderToString(<App />);
  console.log('Render Success!');
} catch (e) {
  console.error('RENDER ERROR:', e);
}
