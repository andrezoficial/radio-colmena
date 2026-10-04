import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // ← Esta línea es crucial
import Root from './Root';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);