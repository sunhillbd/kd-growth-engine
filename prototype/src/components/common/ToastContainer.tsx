import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, CheckCircle2 } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 bg-gray-900 text-white text-xs sm:text-sm px-4 py-3 rounded-[6px] border border-gray-800 shadow-sm"
          role="status"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={1.5} />
            <span className="leading-snug">{toast.message}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {toast.undoAction && (
              <button
                onClick={() => {
                  toast.undoAction?.();
                  removeToast(toast.id);
                }}
                className="text-xs font-semibold uppercase tracking-wider text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-gray-800 transition-colors"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
