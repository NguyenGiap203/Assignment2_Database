// src/components/ui/StatCardDetailed.tsx

import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    description?: string;
    iconBgColor: string; 
    iconColor: string;
    className?: string; // 1. Thêm prop này để tùy chỉnh chiều cao từ bên ngoài
}

const StatCardDetailed: React.FC<StatCardProps> = ({ 
    icon, 
    title, 
    value, 
    description, 
    iconBgColor, 
    iconColor,
    className = '' 
}) => (
  // 2. Thêm 'w-full' để rộng hết cỡ, 'items-center' để căn giữa icon và text
  // 3. Chèn biến ${className} để nhận chiều cao cố định (ví dụ h-32)
  <div className={`bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 ease-in-out w-full ${className}`}>
    <div className={`flex-shrink-0 p-3 rounded-full ${iconBgColor} ${iconColor}`}>
      {icon}
    </div>
    <div className="flex-1"> {/* flex-1 giúp nội dung text chiếm phần còn lại */}
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-900 mt-1 truncate">{value}</p> {/* truncate để cắt chữ nếu quá dài */}
      {description && <p className="text-xs text-gray-400 mt-0.5 truncate">{description}</p>}
    </div>
  </div>
);

export default React.memo(StatCardDetailed);