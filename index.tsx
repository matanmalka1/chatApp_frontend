
import React from 'react';
import ReactDOM from 'react-dom/client';
// @ts-ignore: react-router-dom exports are incorrectly reported as missing in this environment
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <Toaster position="top-right" />
    </HashRouter>
  </React.StrictMode>
);