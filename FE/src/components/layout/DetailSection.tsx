// src/components/layout/DetailSection.tsx

import React from 'react';

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
  borderTop?: boolean; // Tùy chọn thêm đường kẻ ngang phía trên
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children, borderTop = false }) => (
  <div className={`space-y-6 ${borderTop ? 'pt-8 mt-8 border-t border-gray-200' : ''}`}>
    <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-100 pb-3">
      {title}
    </h2>
    {children}
  </div>
);

export default DetailSection;