// src/components/ui/StatCardDetailed.tsx

import React from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    description?: string;
    iconBgColor: string; // e.g., 'bg-blue-100'
    iconColor: string; // e.g., 'text-blue-600'
}

const StatCardDetailed: React.FC<StatCardProps> = ({ 
    icon, 
    title, 
    value, 
    description, 
    iconBgColor, 
    iconColor 
}) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 ease-in-out">
    <div className={`flex-shrink-0 p-3 rounded-full ${iconBgColor} ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  </div>
);

export default React.memo(StatCardDetailed);