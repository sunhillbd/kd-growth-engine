import React from 'react';
import { X } from 'lucide-react';
import { ContentItem } from '../../types';

interface MoveDestinationModalProps {
  isOpen: boolean;
  item: ContentItem | null;
  targetDate: string;
  onClose: () => void;
  onConfirmMoveAll: () => void;
  onConfirmMoveSingle: () => void;
}

export const MoveDestinationModal: React.FC<MoveDestinationModalProps> = ({
  isOpen,
  item,
  targetDate,
  onClose,
  onConfirmMoveAll,
  onConfirmMoveSingle
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-[6px] border border-gray-200 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">
            Reschedule Destinations
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-700 leading-relaxed">
            This post is scheduled across multiple destinations. Do you want to move all destinations to <span className="font-semibold text-gray-900">{targetDate}</span> or only <span className="font-semibold text-gray-900">LinkedIn · Personal</span>?
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={onConfirmMoveAll}
              className="w-full text-left p-2.5 rounded border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors"
            >
              <div className="text-xs font-semibold text-blue-900">
                Move all destinations
              </div>
              <div className="text-[11px] text-blue-700 mt-0.5">
                Reschedules LinkedIn, Facebook, X, and Website together.
              </div>
            </button>

            <button
              onClick={onConfirmMoveSingle}
              className="w-full text-left p-2.5 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="text-xs font-semibold text-gray-900">
                Only LinkedIn · Personal
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Keeps other platform schedules unchanged.
              </div>
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
