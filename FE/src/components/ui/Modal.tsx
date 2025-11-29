// src/components/ui/Modal.tsx

import React from 'react';
import { X } from 'lucide-react';

// Định nghĩa các size cho modal
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: ModalSize; // Thêm prop này
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = 'lg' // Mặc định là lg (như cũ)
}) => {
  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  // Map prop maxWidth sang Tailwind class
  const maxWidthClass = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',       // ~512px (Hiện tại)
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',     // ~672px (+30%)
    '3xl': 'max-w-3xl',     // ~768px (+50%)
    '4xl': 'max-w-4xl',     // ~896px (+75%)
    '5xl': 'max-w-5xl',
    'full': 'max-w-full mx-4'
  }[maxWidth];

  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        // Thay class cứng 'max-w-lg' bằng biến 'maxWidthClass'
        className={`bg-white rounded-xl shadow-2xl w-full ${maxWidthClass} mx-auto transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]`}
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t border-gray-200 flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Modal);