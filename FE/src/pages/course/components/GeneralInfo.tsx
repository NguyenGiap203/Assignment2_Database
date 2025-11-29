// src/pages/course/components/GeneralInfo.tsx
import React from 'react';

interface GeneralInfoProps {
    course: any;
    currentStatus: string;
    onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ course, currentStatus, onStatusChange }) => {
    const teacherName = course.teacher?.user?.fullName || 'Chưa cập nhật';
    const teacherEmail = course.teacher?.user?.email || '';

    const getStatusColor = (status: string) => {
        if (status === 'Đang mở') return 'bg-green-100 text-green-800 border-green-300';
        if (status === 'Sắp ra mắt') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        return 'bg-red-100 text-red-800 border-red-300';
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                <div className="space-y-3">
                    <p className="flex items-center"><span className="font-bold w-32">Mã khóa học:</span> <span>{course.courseID}</span></p>
                    <p className="flex items-center"><span className="font-bold w-32">Giảng viên:</span> <span>{teacherName}</span></p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center">
                        <span className="font-bold w-24">Trạng thái:</span> 
                        <select 
                            value={currentStatus}
                            onChange={onStatusChange}
                            className={`ml-2 px-3 py-1.5 rounded-lg border text-sm font-bold focus:outline-none cursor-pointer ${getStatusColor(currentStatus)}`}
                        >
                            <option value="Đang mở">Đang mở</option>
                            <option value="Sắp ra mắt">Sắp ra mắt</option>
                            <option value="Đã đóng">Đã đóng</option>
                        </select>
                    </div>
                    <p className="flex items-center"><span className="font-bold w-24">Email GV:</span> <span>{teacherEmail}</span></p>
                </div>
            </div>
        </div>
    );
};
export default GeneralInfo;