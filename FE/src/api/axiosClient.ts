// api/axiosClient.ts
// Đây là nơi cấu hình Axios client (baseURL, interceptors)

import axios from 'axios';

const axiosClient = axios.create({
  // FIX: Thay thế bằng URL Backend thực tế theo BE/README_API_INTEGRATION.md
  baseURL: 'http://localhost:5185/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý lỗi hoặc thêm Token
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // FIX: Thêm Authorization Header theo định dạng Bearer
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

axiosClient.interceptors.response.use(
  response => response,
  error => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized, redirecting to login...');
      // FIX: Xóa token và chuyển hướng khi nhận 401
      localStorage.removeItem('authToken'); 
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;