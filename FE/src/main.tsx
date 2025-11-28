// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx'; // Chú ý chữ thường/hoa tùy file thực tế của bạn
import './index.css';
import { AuthProvider } from './context/AuthContext'; // Import mới

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    // <React.StrictMode> // Có thể tạm tắt StrictMode nếu muốn debug dễ hơn (không bắt buộc)
      <AuthProvider> {/* Bọc App trong AuthProvider */}
        <App />
      </AuthProvider>
    // </React.StrictMode>
  );
} else {
    console.error("Failed to find the root element.");
}