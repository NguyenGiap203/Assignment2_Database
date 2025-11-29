// src/pages/course/components/modals/StudentListModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/ui/Modal';
import Table, { Column } from '../../../../components/ui/Table';
import Button from '../../../../components/ui/Button';
import { useFetch } from '../../../../hooks/useFetch';
import { formatDate } from '../../../../utils/format';

interface StudentListModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}

interface Enrollment {
    userID: string;
    user?: { fullName: string; email: string };
    enrollmentDate: string;
}

const StudentListModal: React.FC<StudentListModalProps> = ({ isOpen, onClose, courseId }) => {
    // State quản lý sắp xếp gọi API
    const [sortKey, setSortKey] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Gọi API với tham số sort (Server-side sorting)
    const { data: enrollments, isLoading } = useFetch<Enrollment[]>(
        isOpen ? `/Enrollment/course/${courseId}?sortBy=${sortKey}&sortOrder=${sortOrder}` : ''
    );

    const handleSort = (key: string) => {
        // Chỉ hỗ trợ sort theo date vì Controller hiện tại chỉ support date
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
            sortable: true // Chỉ cột này có icon sort
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Danh sách Học viên`}>
            {isLoading ? (
                <div className="text-center p-4">Đang tải dữ liệu...</div>
            ) : (
                <Table<Enrollment> 
                    data={enrollments || []} 
                    columns={columns}
                    sortKey={sortKey === 'date' ? 'enrollmentDate' : undefined}
                    sortDirection={sortOrder}
                    onSort={(k) => handleSort(k as string)}
                />
            )}
            <div className="mt-4 flex justify-end">
                <Button variant="secondary" onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
};

export default StudentListModal;