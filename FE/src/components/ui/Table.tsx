// src/components/ui/Table.tsx

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// FIX: Export Column và cho phép 'actions'
export interface Column<T> {
  key: keyof T | 'actions';
  header: string;
  render?: (item: T) => React.ReactNode; 
  sortable?: boolean; // Sửa lỗi UserList.tsx đã sử dụng 'sortable'
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: keyof T) => void;
  sortKey?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

// FIX: Sử dụng cú pháp Generic Functional Component chuẩn
// T extends object giúp TypeScript suy luận chính xác từ data={...}
const Table = <T extends object>({ 
  data, 
  columns, 
  onSort, 
  sortKey, 
  sortDirection 
}: TableProps<T>) => {
  
  // FIX: Sửa lỗi TS(2345) tại keyof T: Xử lý type guard cho 'actions'
  const handleSort = (key: keyof T | 'actions') => {
    if (onSort && key !== 'actions') {
      onSort(key as keyof T);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => column.sortable && handleSort(column.key)} 
              >
                <div className="flex items-center">
                  {column.header}
                  {/* Logic sắp xếp */}
                  {column.sortable && column.key !== 'actions' && ( 
                    <span className="ml-1">
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? (<ChevronUp className="w-3 h-3 text-blue-500" />) : (<ChevronDown className="w-3 h-3 text-blue-500" />)
                      ) : (<ChevronDown className="w-3 h-3 text-gray-300" />)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {column.render 
                      ? column.render(item) 
                      // FIX: Type Guard an toàn cho thuộc tính data
                      : column.key !== 'actions' 
                        ? String(item[column.key as keyof T] ?? '')
                        : ''
                    }
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                Không tìm thấy dữ liệu nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;