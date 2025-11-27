// components/ui/Pagination.tsx

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from './Button'; // Giả định đã import Button component

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const MAX_PAGE_LINKS = 5; // Số lượng nút trang tối đa hiển thị

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  // Tính toán phạm vi các nút trang hiển thị
  const pageNumbers = useMemo(() => {
  const pages = [];
  const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_LINKS / 2));
  const endPage = Math.min(totalPages, startPage + MAX_PAGE_LINKS - 1);

	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}
	return pages;
}, [currentPage, totalPages]);

  const startIndex = Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1);
  const endIndex = Math.min(totalItems, currentPage * itemsPerPage);

  return (
    <div className="flex items-center justify-between mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
		{/* Thông tin hiển thị */}
		<div className="text-sm text-gray-600">
			Hiển thị <span className="font-semibold">{startIndex}</span> đến <span className="font-semibold">{endIndex}</span> trong tổng số <span className="font-semibold">{totalItems}</span> mục
		</div>

		{/* Các nút phân trang */}
		<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
			
			{/* Nút Về trang Đầu tiên */}
			<Button 
				variant="ghost" 
				size="sm"
				onClick={() => onPageChange(1)}
				disabled={currentPage === 1}
				className="rounded-r-none"
			>
				<ChevronsLeft className="w-4 h-4" />
			</Button>

			{/* Nút Trang Trước */}
			<Button 
				variant="ghost" 
				size="sm"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="rounded-none border-l-0"
			>
				<ChevronLeft className="w-4 h-4" />
			</Button>

			{/* Các nút số trang */}
			{pageNumbers.map((page) => (
				<Button
					key={page}
					variant={page === currentPage ? 'primary' : 'ghost'}
					size="sm"
					onClick={() => onPageChange(page)}
					className="rounded-none border-l-0 min-w-[36px]"
				>
					{page}
				</Button>
			))}
			
			{/* Nút Trang Tiếp theo */}
			<Button 
				variant="ghost" 
				size="sm"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="rounded-none border-l-0"
			>
				<ChevronRight className="w-4 h-4" />
			</Button>

			{/* Nút Đến trang Cuối cùng */}
			<Button 
				variant="ghost" 
				size="sm"
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
				className="rounded-l-none border-l-0"
			>
				<ChevronsRight className="w-4 h-4" />
			</Button>

		</nav>
    </div>
  );
};

export default Pagination;