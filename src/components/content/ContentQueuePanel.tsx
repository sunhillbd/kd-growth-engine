import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, Clock, 
  HelpCircle, MessageSquare, PenTool, Calendar, ArrowRight
} from 'lucide-react';
import { ContentItem, ContentStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { PLATFORM_ICONS, DESTINATIONS } from '../../mock/destinations';

interface ContentQueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'approval' | 'ideas' | 'drafts';
  onTabChange: (tab: 'approval' | 'ideas' | 'drafts') => void;
  onOpenDrawer: (item: ContentItem, section?: 'content' | 'destinations' | 'results' | 'activity') => void;
  onOpenWeeklyQuestions: () => void;
  highlightedIds?: string[];
}

export const ContentQueuePanel: React.FC<ContentQueuePanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onOpenDrawer,
  onOpenWeeklyQuestions,
  highlightedIds = []
}) => {
  const { content, approvePost, changePostStatus, userRole } = useStore();
  const isViewer = userRole === 'Viewer';
  const [isDragging, setIsDragging] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const needsApprovalItems = content.filter(c => c.status === 'Needs approval');
  const ideaItems = content.filter(c => c.status === 'Idea');
  const draftItems = content.filter(c => c.status === 'Draft');

  const handleDragStart = (e: React.DragEvent, item: ContentItem) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: item.id, status: item.status }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Sliding Modal Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-2xs transition-opacity duration-200 ${
          isDragging ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        onClick={onClose}
      />

      {/* Sliding Modal Container (Slide-over from right) */}
      <aside 
        className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-white border-l border-gray-200 shadow-2xl flex flex-col select-none transition-transform duration-200 ease-in-out animate-in slide-in-from-right"
        role="dialog"
        aria-modal="true"
        aria-label="Content Queue Modal"
      >
        {/* Header with Title, Count, Esc indicator, and Close Button */}
        <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">
              Queue
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gray-200/70 text-gray-700 font-semibold">
              {needsApprovalItems.length + ideaItems.length + draftItems.length}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
              Esc to close
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
              title="Close Queue modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-gray-200 bg-white text-xs text-center font-medium">
          <button
            onClick={() => onTabChange('approval')}
            className={`py-2 px-1 border-b-2 transition-colors relative flex items-center justify-center gap-1 ${
              activeTab === 'approval'
                ? 'border-amber-600 text-amber-900 font-bold bg-amber-50/20'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Approval</span>
            <span className={`text-[10px] font-mono px-1 rounded ${
              needsApprovalItems.length > 0 ? 'bg-amber-100 text-amber-800 font-bold' : 'text-gray-400'
            }`}>
              {needsApprovalItems.length}
            </span>
          </button>

          <button
            onClick={() => onTabChange('ideas')}
            className={`py-2 px-1 border-b-2 transition-colors relative flex items-center justify-center gap-1 ${
              activeTab === 'ideas'
                ? 'border-blue-600 text-blue-900 font-bold bg-blue-50/20'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Ideas</span>
            <span className="text-[10px] font-mono text-gray-400">
              {ideaItems.length}
            </span>
          </button>

          <button
            onClick={() => onTabChange('drafts')}
            className={`py-2 px-1 border-b-2 transition-colors relative flex items-center justify-center gap-1 ${
              activeTab === 'drafts'
                ? 'border-indigo-600 text-indigo-900 font-bold bg-indigo-50/20'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Drafts</span>
            <span className="text-[10px] font-mono text-gray-400">
              {draftItems.length}
            </span>
          </button>
        </div>

        {/* Tab Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/40">

          {/* 1. NEEDS APPROVAL TAB */}
          {activeTab === 'approval' && (
            <>
              {needsApprovalItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 space-y-2">
                  <p>No posts waiting for approval.</p>
                  <button
                    onClick={() => onTabChange('drafts')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Schedule a draft to send for approval
                  </button>
                </div>
              ) : (
                needsApprovalItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={e => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className={`p-3.5 rounded-[6px] border bg-white shadow-2xs hover:shadow-xs transition-all space-y-2.5 cursor-grab active:cursor-grabbing ${
                      highlightedIds.includes(item.id)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 
                        onClick={() => onOpenDrawer(item, 'content')}
                        className="text-xs font-semibold text-gray-900 leading-snug hover:text-blue-600 cursor-pointer"
                      >
                        {item.topic}
                      </h4>
                    </div>

                    {item.whyThisPost && (
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {item.whyThisPost}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1.5 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs">
                        {item.selectedDestinations.map(d => (
                          <span key={d} title={d}>
                            {PLATFORM_ICONS[d.startsWith('linkedin') ? 'LinkedIn' : d === 'facebook_page' ? 'Facebook' : d === 'x_profile' ? 'X' : 'Website']}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-gray-600">
                        {item.scheduledDate || item.scheduledDay} · {item.scheduledTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => onOpenDrawer(item, 'content')}
                        className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => approvePost(item.id)}
                        disabled={isViewer}
                        title={isViewer ? "Viewers can't do this" : "Approve and schedule"}
                        className={`px-3 py-1 text-xs font-semibold text-white rounded transition-colors ${
                          isViewer ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* 2. IDEAS TAB */}
          {activeTab === 'ideas' && (
            <>
              {/* Top Card: "3 questions for this week" */}
              <div className="p-3.5 rounded-[6px] border border-blue-200 bg-blue-50/60 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    3 questions for this week
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                    Studio prompt
                  </span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Reflect on this week’s client bottlenecks and discoveries to extract 2 high-intent hooks.
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={onOpenWeeklyQuestions}
                    className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Answer
                  </button>
                </div>
              </div>

              {ideaItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 space-y-2">
                  <p>No ideas currently queued.</p>
                  <button
                    onClick={onOpenWeeklyQuestions}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Answer weekly questions to add ideas
                  </button>
                </div>
              ) : (
                ideaItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={e => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className={`p-3.5 rounded-[6px] border bg-white shadow-2xs hover:shadow-xs transition-all space-y-2.5 cursor-grab active:cursor-grabbing ${
                      highlightedIds.includes(item.id)
                        ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 
                        onClick={() => onOpenDrawer(item, 'content')}
                        className="text-xs font-semibold text-gray-900 leading-snug hover:text-blue-600 cursor-pointer"
                      >
                        {item.topic}
                      </h4>
                    </div>

                    <div className="text-[11px] text-gray-600 space-y-1">
                      <div className="leading-snug">
                        <span className="text-gray-400 font-mono text-[10px] uppercase">Pain:</span>{' '}
                        <span className="text-gray-700">{item.painAddressed}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1">
                        <span className="text-gray-700 font-medium bg-gray-100 px-1.5 py-0.5 rounded">
                          {item.pattern || 'Contrarian'}
                        </span>
                        <span>#{item.targetKeyword.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                      <span className="text-[10px] font-mono text-gray-400">
                        {item.source || 'Drafted by agent'}
                      </span>
                      <button
                        onClick={() => {
                          changePostStatus(item.id, 'Draft');
                          onOpenDrawer(item, 'content');
                        }}
                        disabled={isViewer}
                        className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                      >
                        Write draft
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* 3. DRAFTS TAB */}
          {activeTab === 'drafts' && (
            <>
              {draftItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 space-y-2">
                  <p>No drafts. Write one from an idea.</p>
                  <button
                    onClick={() => onTabChange('ideas')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View Ideas tab
                  </button>
                </div>
              ) : (
                draftItems.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={e => handleDragStart(e, item)}
                    onDragEnd={handleDragEnd}
                    className={`p-3.5 rounded-[6px] border bg-white shadow-2xs hover:shadow-xs transition-all space-y-2.5 cursor-grab active:cursor-grabbing ${
                      highlightedIds.includes(item.id)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 
                        onClick={() => onOpenDrawer(item, 'content')}
                        className="text-xs font-semibold text-gray-900 leading-snug hover:text-blue-600 cursor-pointer"
                      >
                        {item.topic}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1.5 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs">
                        {item.selectedDestinations.map(d => (
                          <span key={d} title={d}>
                            {PLATFORM_ICONS[d.startsWith('linkedin') ? 'LinkedIn' : d === 'facebook_page' ? 'Facebook' : d === 'x_profile' ? 'X' : 'Website']}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-gray-400">
                        {item.baseText.length} chars
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => onOpenDrawer(item, 'destinations')}
                        className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

        </div>
      </aside>
    </>
  );
};
