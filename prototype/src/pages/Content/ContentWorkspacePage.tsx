import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Kanban, List as ListIcon, 
  Search, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { ContentItem, ContentStatus, DestinationId } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ContentCalendarView } from '../../components/content/ContentCalendarView';
import { ContentBoardView } from '../../components/content/ContentBoardView';
import { ContentListView } from '../../components/content/ContentListView';
import { ContentQueuePanel } from '../../components/content/ContentQueuePanel';
import { ContentDrawer } from '../../components/content/ContentDrawer';
import { PlanNextWeekModal } from '../../components/content/PlanNextWeekModal';
import { WeeklyQuestionsModal } from '../../components/content/WeeklyQuestionsModal';
import { MoveDestinationModal } from '../../components/content/MoveDestinationModal';
import { DESTINATIONS } from '../../mock/destinations';

type ViewMode = 'calendar' | 'board' | 'list';

export const ContentWorkspacePage: React.FC = () => {
  const { content, changePostStatus, movePostDate, reschedulePostDestination, addPost, showToast, userRole } = useStore();
  const isViewer = userRole === 'Viewer';

  const [searchParams, setSearchParams] = useSearchParams();

  // View mode (remembers choice)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Default to 'list' on small screens (e.g. mobile 390px)
    if (typeof window !== 'undefined' && window.innerWidth <= 640) {
      return 'list';
    }
    const saved = localStorage.getItem('kge_content_view_mode');
    return (saved as ViewMode) || 'calendar';
  });

  useEffect(() => {
    localStorage.setItem('kge_content_view_mode', viewMode);
  }, [viewMode]);

  // Calendar specific state
  const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('week');
  const [currentDateOffset, setCurrentDateOffset] = useState(0);

  // Filters (remembers choice)
  const [destinationFilter, setDestinationFilter] = useState<string>(() => {
    return localStorage.getItem('kge_content_filter_dest') || 'all';
  });
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    return localStorage.getItem('kge_content_filter_status') || 'all';
  });
  const [authorFilter, setAuthorFilter] = useState<string>(() => {
    return localStorage.getItem('kge_content_filter_author') || 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('kge_content_filter_dest', destinationFilter);
  }, [destinationFilter]);

  useEffect(() => {
    localStorage.setItem('kge_content_filter_status', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem('kge_content_filter_author', authorFilter);
  }, [authorFilter]);

  // Queue Modal state (sliding modal)
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('kge_queue_open');
    return saved === 'true';
  });

  const [activeQueueTab, setActiveQueueTab] = useState<'approval' | 'ideas' | 'drafts'>('approval');

  useEffect(() => {
    localStorage.setItem('kge_queue_open', String(isQueueOpen));
  }, [isQueueOpen]);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawerItem, setActiveDrawerItem] = useState<ContentItem | null>(null);
  const [drawerSection, setDrawerSection] = useState<'content' | 'destinations' | 'results' | 'activity'>('content');
  const [focusEditorOnOpen, setFocusEditorOnOpen] = useState(false);

  // Modals state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [weeklyQuestionsOpen, setWeeklyQuestionsOpen] = useState(false);
  const [movePromptOpen, setMovePromptOpen] = useState(false);
  const [movePromptItem, setMovePromptItem] = useState<ContentItem | null>(null);
  const [movePromptTargetDate, setMovePromptTargetDate] = useState('');

  // Newly generated ideas highlight
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  // Deep-link check from URL params
  useEffect(() => {
    const queueParam = searchParams.get('queue');
    if (queueParam === 'approval') {
      setIsQueueOpen(true);
      setActiveQueueTab('approval');
    } else if (queueParam === 'ideas') {
      setIsQueueOpen(true);
      setActiveQueueTab('ideas');
    } else if (queueParam === 'drafts') {
      setIsQueueOpen(true);
      setActiveQueueTab('drafts');
    }

    const actionParam = searchParams.get('action');
    if (actionParam === 'new') {
      handleOpenNewPost();
    }

    const itemParam = searchParams.get('item');
    if (itemParam) {
      const found = content.find(c => c.id === itemParam);
      if (found) {
        setActiveDrawerItem(found);
        setDrawerOpen(true);
      }
    }
  }, [searchParams, content]);

  // Handle "New post" action
  const handleOpenNewPost = () => {
    const newItem: ContentItem = {
      id: `post-${Date.now()}`,
      topic: '',
      format: 'LinkedIn post',
      painAddressed: '',
      targetKeyword: '',
      baseText: '',
      selectedDestinations: ['linkedin_personal'],
      destinationSchedules: {
        linkedin_personal: {
          destinationId: 'linkedin_personal',
          status: 'Draft',
          scheduledDate: '2026-11-04',
          scheduledTime: '18:30',
          audienceTimeInfo: '= 8:30 AM Wed in New York'
        }
      },
      status: 'Draft',
      author: 'Alex Mercer',
      draftedByAgent: false,
      auditTrail: [
        { date: 'Today (just now)', action: 'Created new draft post', actor: 'human' }
      ]
    };

    addPost(newItem);
    setActiveDrawerItem(newItem);
    setDrawerSection('content');
    setFocusEditorOnOpen(true);
    setDrawerOpen(true);
  };

  const handleOpenDrawerForItem = (
    item: ContentItem, 
    section: 'content' | 'destinations' | 'results' | 'activity' = 'content'
  ) => {
    setActiveDrawerItem(item);
    setDrawerSection(section);
    setFocusEditorOnOpen(false);
    setDrawerOpen(true);
  };

  // Drag and drop onto calendar day
  const handleDropOnCalendarDay = (itemId: string, dateStr: string) => {
    const item = content.find(i => i.id === itemId);
    if (!item) return;

    // If item was a Draft, dropping it schedules it at suggested time (18:30 Dhaka)
    if (item.status === 'Draft') {
      const updatedSchedules = { ...item.destinationSchedules };
      item.selectedDestinations.forEach(destId => {
        updatedSchedules[destId] = {
          destinationId: destId,
          status: 'Scheduled',
          scheduledDate: dateStr,
          scheduledTime: '18:30',
          audienceTimeInfo: '= 8:30 AM NY'
        };
      });
      changePostStatus(item.id, 'Scheduled');
      movePostDate(item.id, dateStr);
      showToast(`Scheduled "${item.topic.substring(0, 28)}..." for ${dateStr}`);
      return;
    }

    // If item has several destinations, ask move prompt
    if (item.selectedDestinations.length > 1) {
      setMovePromptItem(item);
      setMovePromptTargetDate(dateStr);
      setMovePromptOpen(true);
    } else {
      movePostDate(item.id, dateStr);
      showToast(`Rescheduled to ${dateStr}`);
    }
  };

  // Filter content
  const filteredContent = content.filter(item => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = item.topic.toLowerCase().includes(q);
      const matchPain = item.painAddressed.toLowerCase().includes(q);
      const matchKeyword = item.targetKeyword.toLowerCase().includes(q);
      const matchBase = item.baseText.toLowerCase().includes(q);
      if (!matchTopic && !matchPain && !matchKeyword && !matchBase) return false;
    }

    // Destination filter
    if (destinationFilter !== 'all') {
      if (!item.selectedDestinations.includes(destinationFilter as DestinationId)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (item.status !== statusFilter) return false;
    }

    // Author filter
    if (authorFilter !== 'all') {
      if (authorFilter === 'Agent' && !item.draftedByAgent) return false;
      if (authorFilter === 'Alex Mercer' && item.author !== 'Alex Mercer') return false;
      if (authorFilter === 'Sarah Connor' && item.author !== 'Sarah Connor') return false;
    }

    return true;
  });

  const needsApprovalCount = content.filter(c => c.status === 'Needs approval').length;
  const ideaCount = content.filter(c => c.status === 'Idea').length;
  const draftCount = content.filter(c => c.status === 'Draft').length;
  const totalQueueCount = needsApprovalCount + ideaCount + draftCount;

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* 1. HEADER (No icons on New post, Plan next week, or Queue) */}
      <div className="px-6 py-3.5 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-bold text-gray-900 tracking-tight">
            Content
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Single workspace for pipeline ideation, multi-channel drafting, approval, and publishing.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPlanModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Plan next week
          </button>
          <button
            type="button"
            onClick={() => setIsQueueOpen(prev => !prev)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded border transition-colors shadow-2xs flex items-center gap-1.5 ${
              isQueueOpen
                ? 'bg-gray-100 text-gray-900 border-gray-400 font-bold'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            title={isQueueOpen ? "Close Queue modal" : "Open Queue modal"}
          >
            <span>Queue</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono leading-none ${
              needsApprovalCount > 0
                ? 'bg-amber-100 text-amber-800 font-bold'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {totalQueueCount}
            </span>
          </button>
          <button
            type="button"
            onClick={handleOpenNewPost}
            disabled={isViewer}
            title={isViewer ? "Viewers can't do this" : "Create new post"}
            className={`px-3.5 py-1.5 text-xs font-semibold text-white rounded transition-colors shadow-xs ${
              isViewer ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            New post
          </button>
        </div>
      </div>

      {/* 2. TOOLBAR */}
      <div className="px-6 py-2.5 border-b border-gray-200 bg-gray-50/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: View Mode Segmented Control */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-300 rounded-[5px] p-0.5 shadow-2xs text-xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-gray-100 text-gray-900 font-bold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'board'
                  ? 'bg-gray-100 text-gray-900 font-bold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900 font-bold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* Calendar specific date navigation */}
          {viewMode === 'calendar' && (
            <div className="flex items-center gap-1 text-xs font-mono">
              <button
                onClick={() => setCurrentDateOffset(prev => prev - 1)}
                className="p-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                title="Previous"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentDateOffset(0)}
                className="px-2 py-0.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDateOffset(prev => prev + 1)}
                className="p-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                title="Next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="ml-2 flex items-center bg-white border border-gray-300 rounded p-0.5 text-[11px]">
                <button
                  onClick={() => setCalendarMode('week')}
                  className={`px-2 py-0.5 rounded ${calendarMode === 'week' ? 'bg-gray-100 font-bold text-gray-900' : 'text-gray-500'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setCalendarMode('month')}
                  className={`px-2 py-0.5 rounded ${calendarMode === 'month' ? 'bg-gray-100 font-bold text-gray-900' : 'text-gray-500'}`}
                >
                  Month
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Filters & Search */}
        <div className="flex items-center gap-2 text-xs">
          {/* Destination Filter */}
          <select
            value={destinationFilter}
            onChange={e => setDestinationFilter(e.target.value)}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 focus:outline-none"
          >
            <option value="all">All destinations</option>
            {DESTINATIONS.filter(d => !d.disabled).map(d => (
              <option key={d.id} value={d.id}>
                {d.accountName}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="Idea">Idea</option>
            <option value="Draft">Draft</option>
            <option value="Needs approval">Needs approval</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Published">Published</option>
          </select>

          {/* Author Filter */}
          <select
            value={authorFilter}
            onChange={e => setAuthorFilter(e.target.value)}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-gray-700 focus:outline-none"
          >
            <option value="all">All authors</option>
            <option value="Agent">Agent drafted</option>
            <option value="Alex Mercer">Alex Mercer</option>
            <option value="Sarah Connor">Sarah Connor</option>
          </select>

          {/* Search Input */}
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="w-full rounded border border-gray-300 bg-white pl-7 pr-2 py-1 text-xs focus:outline-none focus:border-blue-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-1.5 top-1.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE AREA + QUEUE PANEL */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main View Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {viewMode === 'calendar' && (
            <ContentCalendarView
              items={filteredContent}
              onOpenDrawer={handleOpenDrawerForItem}
              onDropItemOnDay={handleDropOnCalendarDay}
              onInitiateChipDrag={(item, targetDate) => {
                setMovePromptItem(item);
                setMovePromptTargetDate(targetDate);
                setMovePromptOpen(true);
              }}
              calendarMode={calendarMode}
              onCalendarModeChange={setCalendarMode}
              currentDateOffset={currentDateOffset}
              onPrevDate={() => setCurrentDateOffset(prev => prev - 1)}
              onNextDate={() => setCurrentDateOffset(prev => prev + 1)}
              onToday={() => setCurrentDateOffset(0)}
            />
          )}

          {viewMode === 'board' && (
            <ContentBoardView
              items={filteredContent}
              onOpenDrawer={handleOpenDrawerForItem}
              onMoveColumn={(itemId, newStatus) => {
                changePostStatus(itemId, newStatus);
              }}
            />
          )}

          {viewMode === 'list' && (
            <ContentListView
              items={filteredContent}
              onOpenDrawer={handleOpenDrawerForItem}
            />
          )}
        </div>
      </div>

      {/* 4. QUEUE SLIDING MODAL */}
      <ContentQueuePanel
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        activeTab={activeQueueTab}
        onTabChange={setActiveQueueTab}
        onOpenDrawer={(item, section) => {
          setIsQueueOpen(false);
          handleOpenDrawerForItem(item, section);
        }}
        onOpenWeeklyQuestions={() => setWeeklyQuestionsOpen(true)}
        highlightedIds={highlightedIds}
      />

      {/* 5. UNIFIED DRAWER */}
      <ContentDrawer
        isOpen={drawerOpen}
        item={activeDrawerItem}
        onClose={() => {
          setDrawerOpen(false);
          setActiveDrawerItem(null);
        }}
        initialSection={drawerSection}
        focusEditorOnOpen={focusEditorOnOpen}
      />

      {/* 6. PLAN NEXT WEEK MODAL */}
      <PlanNextWeekModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        onPlanGenerated={() => {
          setIsQueueOpen(true);
          setActiveQueueTab('ideas');
          // Highlight top generated items
          const topIds = content.slice(0, 7).map(c => c.id);
          setHighlightedIds(topIds);
          setTimeout(() => setHighlightedIds([]), 4000);
        }}
      />

      {/* 6. WEEKLY QUESTIONS MODAL */}
      <WeeklyQuestionsModal
        isOpen={weeklyQuestionsOpen}
        onClose={() => setWeeklyQuestionsOpen(false)}
        onSubmitted={() => {
          setIsQueueOpen(true);
          setActiveQueueTab('ideas');
        }}
      />

      {/* 7. MOVE DESTINATION PROMPT MODAL */}
      <MoveDestinationModal
        isOpen={movePromptOpen}
        item={movePromptItem}
        targetDate={movePromptTargetDate}
        onClose={() => {
          setMovePromptOpen(false);
          setMovePromptItem(null);
        }}
        onConfirmMoveAll={() => {
          if (movePromptItem) {
            movePostDate(movePromptItem.id, movePromptTargetDate);
            showToast(`Moved all destinations to ${movePromptTargetDate}`);
          }
          setMovePromptOpen(false);
          setMovePromptItem(null);
        }}
        onConfirmMoveSingle={() => {
          if (movePromptItem) {
            reschedulePostDestination(movePromptItem.id, 'linkedin_personal', movePromptTargetDate, '18:30');
            showToast(`Moved LinkedIn · Personal to ${movePromptTargetDate}`);
          }
          setMovePromptOpen(false);
          setMovePromptItem(null);
        }}
      />
    </div>
  );
};
