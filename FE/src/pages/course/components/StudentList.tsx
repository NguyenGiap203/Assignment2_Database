import React, { useState } from 'react';
import Table, { Column } from '../../../components/ui/Table';
import { useFetch } from '../../../hooks/useFetch';
import { formatDate } from '../../../utils/format';

interface StudentListProps {
    courseId: string;
}

interface Enrollment {
    userID: string;
    user?: { fullName: string; email: string };
    enrollmentDate: string;
}

const StudentList: React.FC<StudentListProps> = ({ courseId }) => {
    const [sortKey, setSortKey] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data: enrollments, isLoading } = useFetch<Enrollment[]>(
        `/Enrollment/course/${courseId}?sortBy=${sortKey}&sortOrder=${sortOrder}`
    );

    const handleSort = (key: string) => {
        if (key === 'enrollmentDate') {
            setSortKey('date');
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        }
    };

    const columns: Column<Enrollment>[] = [
        { key: 'userID', header: 'ID Học viên' },
        { key: 'user', header: 'Họ tên', render: (e) => e.user?.fullName || 'N/A' },
        { key: 'user', header: 'Email', render: (e) => e.user?.email || 'N/A' },
        { 
            key: 'enrollmentDate', 
            header: 'Ngày đăng ký', 
            render: (e) => formatDate(e.enrollmentDate),
            sortable: true 
        },
    ];

    if (isLoading) return <div className="text-center p-4">Đang tải dữ liệu...</div>;

    return (
        <Table<Enrollment> 
            data={enrollments || []} 
            columns={columns}
            sortKey={sortKey === 'date' ? 'enrollmentDate' : undefined}
            sortDirection={sortOrder}
            onSort={(k) => handleSort(k as string)}
        />
    );
};

export default StudentList;