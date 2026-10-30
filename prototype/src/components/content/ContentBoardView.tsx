import React, { useState } from 'react';
import { ContentItem, ContentStatus } from '../../types';
import { PLATFORM_ICONS } from '../../mock/destinations';
import { useStore } from '../../context/StoreContext';
import { Ban } from 'lucide-react';

interface ContentBoardViewProps {
  items: ContentItem[];
  onOpenDrawer: (item: ContentItem, section?: 'content' | 'destinations' | 'results' | 'activity') => void;
  onMoveColumn: (itemId: string, newStatus: ContentStatus) => void;
}

const COLUMNS: { status: ContentStatus; label: string; description: string }[] = [
  { status: 'Idea', label: 'Idea', description: 'Raw concepts, angles & weekly questions' },
  { status: 'Draft', label: 'Draft', description: 'In-progress writing & channel overrides' },
  { status: 'Needs approval', label: 'Needs approval', description: 'Awaiting human review & approval' },
  { status: 'Scheduled', label: 'Scheduled', description: 'Approved and waiting for queue release' },
  { status: 'Published', label: 'Published', description: 'Live posts with performance tracking' }
];

export const ContentBoardView: React.FC<ContentBoardViewProps> = ({
  items,
  onOpenDrawer,
  onMoveColumn
}) => {
  const { userRole, showToast } = useStore();
  const isViewer = userRole === 'Viewer';

  const [dragOverColumn, setDragOverColumn] = useState<ContentStatus | null>(null);

  const handleDragOver = (e: React.DragEvent, colStatus: ContentStatus) => {
    e.preventDefault();
    if (colStatus === 'Published') {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(colStatus);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ContentStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (targetStatus === 'Published') {
      showToast("Posts cannot be manually moved to Published. They publish automatically at their scheduled time or via 'Publish now'.");
      return;
    }

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data?.id) {
        if (targetStatus === 'Scheduled' && data.status === 'Draft') {
          // If draft moved to Scheduled without time, open drawer at schedule section
          const found = items.find(i => i.id === data.id);
          if (found) {
            onOpenDrawer(found, 'destinations');
            return;
          }
        }
        onMoveColumn(data.id, targetStatus);
      }
    } catch {}
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'Idea': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Needs approval': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Scheduled': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Published': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="flex-1 overflow-x-auto p-4 bg-gray-50/50">
      <div className="flex gap-4 min-w-[1000px] h-full items-start">
        {COLUMNS.map(col => {
          const colItems = items.filter(i => i.status === col.status);
          const isPublishedCol = col.status === 'Published';
          const isOver = dragOverColumn === col.status;

          return (
            <div
              key={col.status}
              onDragOver={e => handleDragOver(e, col.status)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, col.status)}
              className={`w-72 shrink-0 rounded-[6px] border flex flex-col max-h-full transition-all ${
                isOver && !isPublishedCol
                  ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-100'
                  : 'border-gray-200 bg-gray-100/60'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-gray-200 bg-white/70 rounded-t-[6px] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">
                      {col.label}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-semibold">
                      {colItems.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5" title={col.description}>
                    {col.description}
                  </p>
                </div>

                {isPublishedCol && (
                  <span 
                    title="Posts can only be published automatically when their scheduled time arrives or by clicking 'Publish now'"
                    className="text-gray-400 cursor-help"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Cards Container */}
              <div className="p-2 space-y-2 overflow-y-auto flex-1 min-h-[200px]">
                {colItems.map(item => {
                  const hasFailedDest = Object.values(item.destinationSchedules || {}).some(s => s.status === 'Failed');

                  return (
                    <div
                      key={item.id}
                      draggable={!isViewer && !isPublishedCol}
                      onDragStart={e => {
                        e.dataTransfer.setData('text/plain', JSON.stringify({ id: item.id, status: item.status }));
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onClick={() => onOpenDrawer(item)}
                      className="p-3 rounded-[5px] border border-gray-200 bg-white shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-tight">
                          {item.topic}
                        </h4>
                      </div>

                      {/* Metadata row */}
                      {col.status === 'Idea' && item.painAddressed && (
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight">
                          {item.painAddressed}
                        </p>
                      )}

                      {col.status === 'Published' && (
                        <div className="text-[11px] font-mono text-gray-600 bg-gray-50 p-1.5 rounded border border-gray-100 flex items-center justify-between">
                          <span>{(item.impressions || 4000).toLocaleString()} imps</span>
                          <span>{item.repliesOrDms || 8} replies</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px]">
                        <div className="flex items-center gap-1">
                          {item.selectedDestinations.slice(0, 3).map(d => (
                            <span key={d} title={d}>
                              {PLATFORM_ICONS[d.startsWith('linkedin') ? 'LinkedIn' : d === 'facebook_page' ? 'Facebook' : d === 'x_profile' ? 'X' : 'Website']}
                            </span>
                          ))}
                        </div>

                        {hasFailedDest ? (
                          <span className="font-mono text-red-600 font-bold">
                            Failed on X
                          </span>
                        ) : item.scheduledDate || item.publishedDate ? (
                          <span className="font-mono text-gray-400">
                            {item.scheduledDate || item.publishedDate}
                          </span>
                        ) : (
                          <span className="font-mono text-gray-400">
                            {item.pattern || 'Idea'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colItems.length === 0 && (
                  <div className="py-8 text-center text-xs text-gray-400">
                    No items in {col.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
