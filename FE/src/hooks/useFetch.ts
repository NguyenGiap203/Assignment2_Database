// hooks/useFetch.ts

import { useState, useEffect } from 'react';
// import mockUsers from '../data/user.json'; // Bỏ import mock data
// import mockCourses from '../data/course.json';
// import mockExerciseAttempts from '../data/exerciseAttemp.json';
// import mockExercises from '../data/exercise.json';
import axiosClient from '../api/axiosClient'; // Import axiosClient

// Định nghĩa trạng thái fetch data
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// Hàm giả lập cho endpoint Báo cáo (Không có controller BE)
const mockReportApiCall = async (url: string) => {
    const data = [
        { Month: 1, Year: 2024, TotalRevenue: 150000000 },
        { Month: 2, Year: 2024, TotalRevenue: 180000000 },
        { Month: 3, Year: 2024, TotalRevenue: 220000000 },
        { Month: 4, Year: 2024, TotalRevenue: 195000000 },
        { Month: 5, Year: 2024, TotalRevenue: 250000000 },
        { Month: 6, Year: 2024, TotalRevenue: 210000000 },
    ];
    return {
        data: data,
        totalItems: data.length,
        totalPages: 1,
    };
};


export const useFetch = <T>(url: string): FetchState<T> & { totalItems: number, totalPages: number } => {
  const [state, setState] = useState<FetchState<T>>({ data: null, isLoading: true, error: null });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        let responseData;
        let totalItemsCount = 0;
        let totalPagesCount = 1;

        if (url.includes('/api/reports/monthly-revenue')) {
            // Trường hợp đặc biệt: Dùng mock cho báo cáo
            const mockResponse = await mockReportApiCall(url);
            responseData = mockResponse.data;
            totalItemsCount = mockResponse.totalItems;
            totalPagesCount = mockResponse.totalPages;
        } else {
            // FIX: Sử dụng axiosClient cho các API thực tế
            const response = await axiosClient.get(url);
            
            // Giả định API trả về mảng trực tiếp cho danh sách (UserTable, Course, Post...)
            responseData = response.data;

            // Xử lý Phân trang (Vì BE Controller không trả về metadata phân trang, ta dùng giả định)
            if (Array.isArray(responseData)) {
                totalItemsCount = responseData.length;
                totalPagesCount = Math.ceil(responseData.length / 10) || 1; 
            } else {
                totalItemsCount = 1; 
            }
        }
        
        if (isMounted) {
          setState({ data: responseData as T, isLoading: false, error: null });
          setTotalItems(totalItemsCount);
          setTotalPages(totalPagesCount);
        }
      } catch (err: any) {
        if (isMounted) {
          // Lấy thông báo lỗi cụ thể từ response nếu có
          const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu từ API.';
          setState({ data: null, isLoading: false, error: errorMessage });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { ...state, totalItems, totalPages };
};