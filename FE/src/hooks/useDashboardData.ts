// src/hooks/useDashboardData.ts
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

interface DashboardData {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalPosts: number;
    topStudents: any[];
    popularCourses: any[];
    recentUsers: any[];
    loading: boolean;
}

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData>({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalPosts: 0,
        topStudents: [],
        popularCourses: [],
        recentUsers: [],
        loading: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi song song các API để tiết kiệm thời gian
                const [
                    usersRes, 
                    teachersRes, 
                    coursesRes, 
                    postsRes,
                    topStudentsRes
                ] = await Promise.all([
                    axiosClient.get('/UserTable?sortBy=date&sortOrder=desc'), // Lấy user mới nhất
                    axiosClient.get('/Teacher'),
                    axiosClient.get('/Course?sortBy=students&sortOrder=desc'), // Lấy khóa học đông học viên nhất
                    axiosClient.get('/Post?sortBy=date&sortOrder=desc'), // Lấy bài viết mới nhất
                    axiosClient.get('/Statistics/TopStudents?minScore=0') // Lấy top sinh viên
                ]);

                setData({
                    totalStudents: usersRes.data.length - teachersRes.data.length, // Tổng user - Tổng teacher = Số học viên
                    totalTeachers: teachersRes.data.length,
                    totalCourses: coursesRes.data.length,
                    totalPosts: postsRes.data.length,
                    recentUsers: usersRes.data.slice(0, 5), // Lấy 5 user mới nhất
                    topStudents: topStudentsRes.data.slice(0, 5), // Top 5 sinh viên giỏi
                    popularCourses: coursesRes.data.slice(0, 5), // Top 5 khóa học hot
                    loading: false
                });
            } catch (error) {
                console.error("Error loading dashboard data", error);
                setData(prev => ({ ...prev, loading: false }));
            }
        };

        fetchData();
    }, []);

    return data;
};