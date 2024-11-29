import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HelloWorld from './HelloWorld';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HelloWorld />
  </React.StrictMode>
);
