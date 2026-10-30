import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ContentItem, ContentStatus } from '../../types';
import { PLATFORM_ICONS } from '../../mock/destinations';

interface ContentListViewProps {
  items: ContentItem[];
  onOpenDrawer: (item: ContentItem) => void;
}

type SortField = 'when' | 'status';
type SortOrder = 'asc' | 'desc';

const STATUS_ORDER: Record<ContentStatus, number> = {
  'Idea': 1,
  'Draft': 2,
  'Needs approval': 3,
  'Scheduled': 4,
  'Published': 5
};

export const ContentListView: React.FC<ContentListViewProps> = ({
  items,
  onOpenDrawer
}) => {
  const [sortField, setSortField] = useState<SortField>('when');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortField === 'status') {
      const diff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      return sortOrder === 'asc' ? diff : -diff;
    }

    if (sortField === 'when') {
      const dateA = a.scheduledDate || a.publishedDate || a.scheduledDay || '1970-01-01';
      const dateB = b.scheduledDate || b.publishedDate || b.scheduledDay || '1970-01-01';
      const cmp = dateA.localeCompare(dateB);
      return sortOrder === 'asc' ? cmp : -cmp;
    }

    return 0;
  });

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
    <div className="flex-1 overflow-y-auto bg-white">
      <table className="w-full text-left text-xs table-fixed">
        <thead className="bg-gray-50 border-b border-gray-200 font-mono uppercase text-[10px] text-gray-500 sticky top-0 z-10">
          <tr>
            <th className="py-2.5 px-4 w-[40%]">
              Title
            </th>
            <th className="py-2.5 px-3 w-[15%]">
              Destinations
            </th>
            <th 
              onClick={() => handleSort('status')}
              className="py-2.5 px-3 w-[15%] cursor-pointer hover:text-gray-900 select-none"
            >
              <div className="flex items-center gap-1">
                <span>Status</span>
                {sortField === 'status' ? (
                  sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-600" /> : <ArrowDown className="w-3 h-3 text-blue-600" />
                ) : (
                  <ArrowUpDown className="w-3 h-3 opacity-40" />
                )}
              </div>
            </th>
            <th 
              onClick={() => handleSort('when')}
              className="py-2.5 px-3 w-[15%] cursor-pointer hover:text-gray-900 select-none"
            >
              <div className="flex items-center gap-1">
                <span>When</span>
                {sortField === 'when' ? (
                  sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-600" /> : <ArrowDown className="w-3 h-3 text-blue-600" />
                ) : (
                  <ArrowUpDown className="w-3 h-3 opacity-40" />
                )}
              </div>
            </th>
            <th className="py-2.5 px-4 w-[15%]">
              Results
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedItems.map(item => {
            const hasFailedDest = Object.values(item.destinationSchedules || {}).some(s => s.status === 'Failed');
            const whenText = item.scheduledDate || item.publishedDate || item.scheduledDay || '—';

            return (
              <tr
                key={item.id}
                onClick={() => onOpenDrawer(item)}
                className="hover:bg-gray-50/80 cursor-pointer transition-colors group"
              >
                {/* Title (wraps to 2 lines, never ellipsis truncated) */}
                <td className="py-3 px-4">
                  <div className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-relaxed break-words">
                    {item.topic}
                  </div>
                  {item.pattern && (
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                      {item.pattern}
                    </span>
                  )}
                </td>

                {/* Destinations */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.selectedDestinations.map(d => (
                      <span key={d} title={d} className="text-xs">
                        {PLATFORM_ICONS[d.startsWith('linkedin') ? 'LinkedIn' : d === 'facebook_page' ? 'Facebook' : d === 'x_profile' ? 'X' : 'Website']}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getStatusBadge(item.status)} font-medium`}>
                      {item.status}
                    </span>
                    {hasFailedDest && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-red-50 text-red-700 border border-red-200 font-bold">
                        Failed on X
                      </span>
                    )}
                  </div>
                </td>

                {/* When */}
                <td className="py-3 px-3 font-mono text-gray-600 text-xs">
                  <div>{whenText}</div>
                  {item.scheduledTime && (
                    <span className="text-[10px] text-gray-400 block font-mono">
                      {item.scheduledTime}
                    </span>
                  )}
                </td>

                {/* Results (compact cell for published items) */}
                <td className="py-3 px-4 font-mono text-xs">
                  {item.status === 'Published' ? (
                    <div className="text-gray-800 leading-tight">
                      <span className="font-semibold tabular-nums">
                        {(item.impressions || 4000).toLocaleString()}
                      </span> imps ·{' '}
                      <span className="font-semibold tabular-nums">
                        {item.repliesOrDms || 8}
                      </span> replies
                    </div>
                  ) : (
                    <span className="text-gray-300 font-mono">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
