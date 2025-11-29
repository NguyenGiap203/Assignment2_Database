// src/pages/Statistics.tsx

import React, { useState, useMemo } from 'react';
import { Users, GraduationCap, Medal, BookOpen, Trophy, Loader2 } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import DetailSection from '../components/layout/DetailSection';
import Table, { Column } from '../components/ui/Table';
import StatCardDetailed from '../components/ui/StatCardDetailed';
import { useFetch } from '../hooks/useFetch';

// 1. Interface khớp với TopStudentDto trong StatisticsController.cs
interface TopStudentDto {
    userID: string;
    fullName: string;
    email: string;
    totalTestsTaken: number;
    averageScore: number;
}

// 2. Interface cho Giảng viên (lấy từ TeacherController)
interface TeacherStat {
    teacherID: string;
    user: {
        fullName: string;
        email: string;
    };
    courses: any[]; // Mảng khóa học đã tạo
}

const Statistics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');

    // --- FETCH DATA ---

    // 1. Tab Học viên: Gọi API GetTopStudents từ StatisticsController
    // Truyền minScore=0 để lấy danh sách tất cả học viên đã làm bài
    const { data: students, isLoading: loadingStudents } = useFetch<TopStudentDto[]>('/Statistics/TopStudents?minScore=0');

    // 2. Tab Giảng viên: Gọi API Teacher để lấy danh sách giảng viên
    // (StatisticsController không có API lấy danh sách tất cả GV, chỉ có lấy chi tiết khóa học theo GV)
    const { data: teachers, isLoading: loadingTeachers } = useFetch<TeacherStat[]>('/Teacher');


    // --- LOGIC XỬ LÝ DATA ---

    // Lọc ra Top 3 sinh viên có điểm trung bình cao nhất
    const top3Students = useMemo(() => {
        if (!students) return [];
        // Dữ liệu từ API có thể chưa sort hoặc sort theo tiêu chí khác, ta sort lại cho chắc chắn
        return [...students]
            .sort((a, b) => b.averageScore - a.averageScore)
            .slice(0, 3);
    }, [students]);

    // Chuẩn bị dữ liệu cho bảng Giảng viên
    const teacherTableData = useMemo(() => {
        if (!teachers) return [];
        return teachers.map(t => ({
            id: t.teacherID,
            name: t.user?.fullName || 'N/A',
            email: t.user?.email || 'N/A',
            courseCount: t.courses ? t.courses.length : 0 // Đếm số lượng khóa học
        }));
    }, [teachers]);


    // --- CẤU HÌNH CỘT CHO BẢNG ---

    // Cột cho bảng Học viên (Khớp với TopStudentDto)
    const studentColumns: Column<TopStudentDto>[] = [
        { key: 'userID', header: 'ID' },
        { key: 'fullName', header: 'Họ tên', sortable: true },
        { key: 'email', header: 'Email' },
        { key: 'totalTestsTaken', header: 'Bài kiểm tra đã làm', sortable: true },
        { 
            key: 'averageScore', 
            header: 'Điểm TB', 
            sortable: true,
            render: (s) => (
                <span className={`font-bold ${s.averageScore >= 8.0 ? 'text-green-600' : s.averageScore >= 5.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {s.averageScore.toFixed(2)}
                </span>
            )
        },
    ];

    // Cột cho bảng Giảng viên
    const teacherColumns: Column<any>[] = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Giảng viên', sortable: true },
        { key: 'email', header: 'Email' },
        { 
            key: 'courseCount', 
            header: 'Tổng khóa học', 
            sortable: true,
            render: (t) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t.courseCount} khóa
                </span>
            )
        },
    ];

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Thống kê hệ thống</h1>

            {/* --- TABS NAVIGATION --- */}
            <div className="flex space-x-1 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('student')}
                    className={`flex items-center px-6 py-3 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
                        activeTab === 'student'
                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <Users className="w-4 h-4 mr-2" />
                    Thống kê Học viên
                </button>
                <button
                    onClick={() => setActiveTab('teacher')}
                    className={`flex items-center px-6 py-3 font-medium text-sm rounded-t-lg transition-colors border-b-2 ${
                        activeTab === 'teacher'
                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Thống kê Giảng viên
                </button>
            </div>

            {/* --- NỘI DUNG TAB HỌC VIÊN --- */}
            {activeTab === 'student' && (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* SECTION: TOP STUDENTS (3 Khối nổi bật) */}
                    <DetailSection title="Top Sinh viên xuất sắc nhất">
                        {loadingStudents ? (
                             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" /></div>
                        ) : top3Students.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {top3Students.map((student, index) => {
                                    // Style riêng cho Top 1, 2, 3
                                    let style = {
                                        bg: "bg-gray-50",
                                        border: "border-gray-200",
                                        text: "text-gray-700",
                                        icon: <Medal className="w-8 h-8 text-gray-400" />,
                                        rank: "Hạng Ba"
                                    };

                                    if (index === 0) {
                                        style = {
                                            bg: "bg-yellow-50",
                                            border: "border-yellow-300",
                                            text: "text-yellow-800",
                                            icon: <Trophy className="w-8 h-8 text-yellow-500" />,
                                            rank: "Quán Quân"
                                        };
                                    } else if (index === 1) {
                                        style = {
                                            bg: "bg-gray-100",
                                            border: "border-gray-400",
                                            text: "text-gray-800",
                                            icon: <Medal className="w-8 h-8 text-gray-500" />,
                                            rank: "Á Quân"
                                        };
                                    } else if (index === 2) {
                                        style = {
                                            bg: "bg-orange-50",
                                            border: "border-orange-300",
                                            text: "text-orange-800",
                                            icon: <Medal className="w-8 h-8 text-orange-500" />,
                                            rank: "Hạng Ba"
                                        };
                                    }

                                    return (
                                        <div key={student.userID} className={`relative p-6 rounded-xl border-2 shadow-sm ${style.bg} ${style.border}`}>
                                            <div className="flex items-center space-x-4">
                                                <div className="p-3 bg-white rounded-full shadow-sm">
                                                    {style.icon}
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-bold uppercase tracking-wide opacity-80 ${style.text}`}>{style.rank}</p>
                                                    <h3 className="text-lg font-bold truncate text-gray-900">{student.fullName}</h3>
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-2xl font-black mr-1">{student.averageScore.toFixed(1)}</span>
                                                        <span className="text-xs text-gray-500">điểm TB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-black/5 text-sm text-gray-600 flex justify-between">
                                                <span>Số bài kiểm tra:</span>
                                                <span className="font-semibold">{student.totalTestsTaken}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center p-6 text-gray-500">Chưa có dữ liệu xếp hạng.</div>
                        )}
                    </DetailSection>

                    {/* SECTION: BẢNG CHI TIẾT HỌC VIÊN */}
                    <DetailSection title="Bảng điểm chi tiết">
                        {loadingStudents ? (
                             <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" /></div>
                        ) : (
                            <Table<TopStudentDto> 
                                data={students || []} 
                                columns={studentColumns}
                                sortKey="averageScore" // Mặc định sort theo điểm
                                sortDirection="desc"
                            />
                        )}
                    </DetailSection>
                </div>
            )}

            {/* --- NỘI DUNG TAB GIẢNG VIÊN --- */}
            {activeTab === 'teacher' && (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* SECTION: TỔNG QUAN GIẢNG VIÊN */}
                    <DetailSection title="Tổng quan Giảng dạy">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StatCardDetailed 
                                icon={<Users className="w-6 h-6" />} 
                                title="Tổng số Giảng viên" 
                                value={teachers?.length || 0} 
                                iconBgColor="bg-blue-100" 
                                iconColor="text-blue-600"
                                description="Đang hoạt động"
                            />
                             <StatCardDetailed 
                                icon={<BookOpen className="w-6 h-6" />} 
                                title="Tổng số khóa học" 
                                value={teachers?.reduce((sum, t) => sum + (t.courses?.length || 0), 0) || 0} 
                                iconBgColor="bg-green-100" 
                                iconColor="text-green-600" 
                                description="Trên toàn hệ thống"
                            />
                        </div>
                    </DetailSection>

                    {/* SECTION: DANH SÁCH GIẢNG VIÊN & SỐ KHÓA HỌC */}
                    <DetailSection title="Danh sách Giảng viên">
                        {loadingTeachers ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-600" /></div>
                        ) : (
                            <Table 
                                data={teacherTableData} 
                                columns={teacherColumns}
                                sortKey="courseCount"
                                sortDirection="desc"
                            />
                        )}
                    </DetailSection>
                </div>
            )}

        </MainLayout>
    );
};

export default Statistics;