// components/ui/Modal.tsx

import React from 'react';
import { X } from 'lucide-react';
import Button from './Button'; // Import Button component đã tạo

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  // Ngăn chặn đóng modal khi click vào bên trong nội dung
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    // Overlay nền (đóng modal khi click ra ngoài)
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-100 flex flex-col max-h-full"
        onClick={handleContentClick}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close Modal">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Body Modal */}
        <div className="p-6 overflow-y-auto max-h-[80vh] flex-grow">
          {children}
        </div>

        {/* Footer Modal (Tùy chọn) */}
        {footer && (
          <div className="p-5 border-t border-gray-200 flex justify-end space-x-3">
            {footer}
            {/* Ví dụ: có thể đặt <Button variant="secondary" onClick={onClose}>Hủy</Button> tại đây nếu không dùng prop footer */}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Modal);