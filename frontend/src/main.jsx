/**
 * @file main.jsx
 * @description React application entry point.
 *
 * - Mounts App inside HashRouter (for Electron compatibility)
 * - Registers PWA Service Worker on page load
 * - Wraps in React.StrictMode for development checks
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import { HashRouter } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}
