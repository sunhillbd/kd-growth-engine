import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div 
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-[6px] border border-gray-200 overflow-hidden z-10 flex flex-col max-h-[90vh]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h3 id="modal-title" className="text-sm font-semibold text-gray-900">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-[4px] hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
