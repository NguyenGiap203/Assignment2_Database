// api/axiosClient.ts
// Đây là nơi cấu hình Axios client (baseURL, interceptors)

import axios from 'axios';

const axiosClient = axios.create({
  // Thay thế bằng URL Backend thực tế khi có
  baseURL: 'http://localhost:8080/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý lỗi hoặc thêm Token
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
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
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;