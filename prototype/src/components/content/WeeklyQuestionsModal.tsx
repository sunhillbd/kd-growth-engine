import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface WeeklyQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const WeeklyQuestionsModal: React.FC<WeeklyQuestionsModalProps> = ({
  isOpen,
  onClose,
  onSubmitted
}) => {
  const { addIdeasFromWeeklyQuestions } = useStore();
  const [q1, setQ1] = useState('Stripe webhook concurrency and race conditions during high-volume month-end billing');
  const [q2, setQ2] = useState('Will external studio developers introduce ongoing code maintenance and technical debt?');
  const [q3, setQ3] = useState('Cut freight invoice audit turnaround from 36 hours to 4 minutes with zero data loss');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIdeasFromWeeklyQuestions([q1, q2, q3]);
    if (onSubmitted) onSubmitted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-[6px] border border-gray-200 shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              3 Questions for This Week
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Answer quick reflection prompts to generate 2 high-intent studio content ideas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              1. What technical problem or bottleneck took longer than expected to solve this week?
            </label>
            <textarea
              value={q1}
              onChange={e => setQ1(e.target.value)}
              rows={2}
              required
              className="w-full text-xs rounded border border-gray-300 p-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="e.g. Uncaught deadlocks in our background worker queue..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              2. What skepticism or objection did a prospect raise on a discovery call?
            </label>
            <textarea
              value={q2}
              onChange={e => setQ2(e.target.value)}
              rows={2}
              required
              className="w-full text-xs rounded border border-gray-300 p-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="e.g. How do we know an agency won't deliver unmaintainable code?..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              3. What measurable outcome or performance win did we deliver for a client?
            </label>
            <textarea
              value={q3}
              onChange={e => setQ3(e.target.value)}
              rows={2}
              required
              className="w-full text-xs rounded border border-gray-300 p-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="e.g. Reduced invoice processing time from 36 hours to 4 minutes..."
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
            >
              Add 2 ideas to Ideas tab
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
