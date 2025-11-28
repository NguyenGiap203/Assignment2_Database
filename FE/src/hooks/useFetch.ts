// hooks/useFetch.ts

import { useState, useEffect } from 'react';
import mockUsers from '../data/user.json';
import mockCourses from '../data/course.json';
import mockExerciseAttempts from '../data/exerciseAttemp.json';
import mockExercises from '../data/exercise.json';

// Định nghĩa trạng thái fetch data
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// Hàm giả lập gọi API và trả về dữ liệu dựa trên URL
const simulateApiCall = async (url: string) => {
  // await new Promise(resolve => setTimeout(resolve, 500)); 

  let data: any[] = [];
  let totalItems = 0;

  if (url.includes('/users')) {
    data = mockUsers;
  } else if (url.includes('/courses')) {
    data = mockCourses;
  } else if (url.includes('/exercises/attempts')) {
    data = mockExerciseAttempts;
  } else if (url.includes('/exercises')) {
    data = mockExercises;
  } else if (url.includes('/posts')) {
    data = mockUsers.slice(0, 3).map(u => ({ ...u, PostID: u.UserID.replace('USR', 'POST'), Title: `Bài chia sẻ về ${u.FullName}` })); 
  } else if (url.includes('/api/reports/monthly-revenue')) { // <<< THÊM LOGIC BÁO CÁO
      // Dữ liệu giả lập từ Stored Procedure
      data = [
        { Month: 1, Year: 2024, TotalRevenue: 150000000 },
        { Month: 2, Year: 2024, TotalRevenue: 180000000 },
        { Month: 3, Year: 2024, TotalRevenue: 220000000 },
        { Month: 4, Year: 2024, TotalRevenue: 195000000 },
        { Month: 5, Year: 2024, TotalRevenue: 250000000 },
        { Month: 6, Year: 2024, TotalRevenue: 210000000 },
      ];
      totalItems = data.length;
  }
  
  totalItems = data.length;
  const totalPages = Math.ceil(totalItems / 10) || 1; 

  return {
    data: data,
    totalItems: totalItems,
    totalPages: totalPages,
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
        const response = await simulateApiCall(url);
        if (isMounted) {
          setState({ data: response.data as T, isLoading: false, error: null });
          setTotalItems(response.totalItems);
          setTotalPages(response.totalPages);
        }
      } catch (err) {
        if (isMounted) {
          setState({ data: null, isLoading: false, error: 'Lỗi khi tải dữ liệu Mock.' });
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