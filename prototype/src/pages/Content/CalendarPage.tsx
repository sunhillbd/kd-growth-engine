import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ContentItem, DestinationId } from '../../types';
import { DESTINATIONS } from '../../mock/destinations';
import { PostDetailDrawer } from '../../components/content/PostDetailDrawer';
import { Modal } from '../../components/common/Modal';

export const CalendarPage: React.FC = () => {
  const { content, movePostDate } = useStore();
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [filterDestination, setFilterDestination] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<ContentItem | null>(null);

  // Drag and drop state
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [pendingMoveTarget, setPendingMoveTarget] = useState<{ postId: string; targetDay: number } | null>(null);
  const [movePromptModalOpen, setMovePromptModalOpen] = useState(false);

  // November 2026 calendar days (1 to 30)
  const daysInMonth = Array.from({ length: 30 }).map((_, i) => i + 1);

  const filteredContent = content.filter(item => {
    if (filterDestination !== 'all') {
      if (!item.selectedDestinations || !item.selectedDestinations.includes(filterDestination as DestinationId)) {
        return false;
      }
    }
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const getPostsForDay = (dayNum: number) => {
    return filteredContent.filter(item => {
      // Check any destination schedule on this day
      if (item.destinationSchedules) {
        const hasMatch = Object.values(item.destinationSchedules).some(sched => {
          return sched.scheduledDate?.endsWith(`-${dayNum.toString().padStart(2, '0')}`) ||
                 sched.scheduledDate?.includes(`Nov ${dayNum}`);
        });
        if (hasMatch) return true;
      }
      if (item.scheduledDay?.includes(`Nov ${dayNum}`)) return true;
      if (item.publishedDate?.endsWith(`-${dayNum.toString().padStart(2, '0')}`)) return true;
      const hash = Math.abs(item.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
      return (hash % 28) + 1 === dayNum;
    });
  };

  const getStatusDotColor = (status?: string) => {
    switch (status) {
      case 'Published': return 'bg-emerald-500';
      case 'Scheduled': return 'bg-blue-600';
      case 'Pending approval': return 'bg-amber-500';
      case 'Failed': return 'bg-rose-500';
      case 'Publishing': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getDestinationBadge = (destId: DestinationId) => {
    switch (destId) {
      case 'linkedin_personal': return 'LI';
      case 'linkedin_company': return 'LIC';
      case 'facebook_page': return 'FB';
      case 'x_profile': return 'X';
      case 'website_blog': return 'WEB';
      default: return '';
    }
  };

  // Drag handlers
  const handleDragStart = (postId: string) => {
    setDraggedPostId(postId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDay = (dayNum: number) => {
    if (!draggedPostId) return;

    const post = content.find(p => p.id === draggedPostId);
    if (!post) return;

    if (post.selectedDestinations && post.selectedDestinations.length > 1) {
      // Prompt user whether to move all or single destination
      setPendingMoveTarget({ postId: post.id, targetDay: dayNum });
      setMovePromptModalOpen(true);
    } else {
      const newDateStr = `2026-11-${dayNum.toString().padStart(2, '0')}`;
      movePostDate(post.id, newDateStr);
    }
    setDraggedPostId(null);
  };

  const handleConfirmMoveChoice = (moveAll: boolean) => {
    if (!pendingMoveTarget) return;
    const newDateStr = `2026-11-${pendingMoveTarget.targetDay.toString().padStart(2, '0')}`;
    const post = content.find(p => p.id === pendingMoveTarget.postId);

    if (moveAll) {
      movePostDate(pendingMoveTarget.postId, newDateStr);
    } else if (post && post.selectedDestinations) {
      movePostDate(pendingMoveTarget.postId, newDateStr, post.selectedDestinations[0]);
    }

    setMovePromptModalOpen(false);
    setPendingMoveTarget(null);
  };

  const pendingPostToMove = pendingMoveTarget ? content.find(p => p.id === pendingMoveTarget.postId) : null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Calendar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Multi-Destination Content Calendar</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Times in Asia/Dhaka. Each chip displays destination badges. Drag chips to reschedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Destination filter */}
          <select
            value={filterDestination}
            onChange={e => setFilterDestination(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-[6px] outline-none text-gray-700"
          >
            <option value="all">All Destinations</option>
            {DESTINATIONS.map(d => (
              <option key={d.id} value={d.id}>{d.subName}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-[6px] outline-none text-gray-700"
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Published">Published</option>
            <option value="Pending approval">Pending Approval</option>
            <option value="Failed">Failed</option>
            <option value="Draft">Draft</option>
          </select>

          {/* View Mode Toggle */}
          <div className="border border-gray-200 bg-white rounded-[6px] p-0.5 flex text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-[4px] font-medium transition-colors ${
                viewMode === 'month' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-[4px] font-medium transition-colors ${
                viewMode === 'week' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Month View Grid */}
      <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center text-xs font-mono font-medium text-gray-500 py-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
          {daysInMonth.map(day => {
            const dayPosts = getPostsForDay(day);

            return (
              <div
                key={day}
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnDay(day)}
                className={`min-h-[110px] p-2 transition-colors flex flex-col justify-between ${
                  draggedPostId ? 'hover:bg-blue-50/40' : 'hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-gray-700">
                    {day}
                  </span>
                  {dayPosts.length > 0 && (
                    <span className="text-[10px] font-mono text-gray-400">
                      {dayPosts.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 mt-1 overflow-y-auto max-h-24">
                  {dayPosts.map(post => {
                    const dests = post.selectedDestinations || ['linkedin_personal'];

                    return (
                      <div
                        key={post.id}
                        draggable
                        onDragStart={() => handleDragStart(post.id)}
                        onClick={() => setSelectedPost(post)}
                        className="w-full text-left p-1.5 rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[11px] cursor-pointer transition-colors space-y-1 group"
                        title={`${post.topic} (${dests.join(', ')})`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate text-gray-900 font-medium group-hover:text-blue-600 leading-tight">
                            {post.topic}
                          </span>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDotColor(post.status)}`}></span>
                        </div>

                        {/* Covered Destination Badges */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {dests.map(d => (
                            <span
                              key={d}
                              className="font-mono text-[9px] font-bold px-1 py-0.2 bg-white text-gray-600 border border-gray-200 rounded"
                            >
                              {getDestinationBadge(d)}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-500 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Published</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Pending Approval</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Failed Delivery</span>
        </div>
      </div>

      {/* Drag Move Prompt Modal */}
      <Modal
        isOpen={movePromptModalOpen}
        onClose={() => setMovePromptModalOpen(false)}
        title="Reschedule Multi-Destination Post"
        description="This post is scheduled across multiple destinations."
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-700 leading-relaxed">
            Move all {pendingPostToMove?.selectedDestinations?.length || 0} destinations to Nov {pendingMoveTarget?.targetDay}, or only reschedule {DESTINATIONS.find(d => d.id === pendingPostToMove?.selectedDestinations?.[0])?.subName}?
          </p>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleConfirmMoveChoice(true)}
              className="w-full py-2 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors"
            >
              Move all destinations
            </button>
            <button
              onClick={() => handleConfirmMoveChoice(false)}
              className="w-full py-2 px-3 text-xs font-medium border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-[6px] transition-colors"
            >
              Only {DESTINATIONS.find(d => d.id === pendingPostToMove?.selectedDestinations?.[0])?.subName}
            </button>
          </div>
        </div>
      </Modal>

      {/* Post Detail Drawer */}
      <PostDetailDrawer
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};
