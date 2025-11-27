// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import './index.css';

// Lấy element root trong index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* App.tsx là component gốc chứa Routing và Layout */}
      <App />
    </React.StrictMode>
  );
} else {
    console.error("Failed to find the root element.");
}