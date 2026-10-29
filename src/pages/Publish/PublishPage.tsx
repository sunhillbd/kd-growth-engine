import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Channel, Post, ChannelId } from '../../types';
import { ChannelPanel } from '../../components/publish/ChannelPanel';
import { QueueTab } from '../../components/publish/QueueTab';
import { CalendarTab } from '../../components/publish/CalendarTab';
import { DraftsTab } from '../../components/publish/DraftsTab';
import { ApprovalsTab } from '../../components/publish/ApprovalsTab';
import { SentTab } from '../../components/publish/SentTab';
import { PostComposerModal } from '../../components/publish/PostComposerModal';
import { PostingScheduleModal } from '../../components/publish/PostingScheduleModal';
import { ConnectChannelModal } from '../../components/publish/ConnectChannelModal';
import { DisconnectChannelModal } from '../../components/publish/DisconnectChannelModal';
import { PostDetailDrawer } from '../../components/publish/PostDetailDrawer';
import { PlanWeeklyPostsModal } from '../../components/publish/PlanWeeklyPostsModal';
import { Plus } from 'lucide-react';

export const PublishPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    channels,
    posts,
    offers,
    approvalMode,
    addPostsBuffer,
    updatePostItem,
    deletePostItem,
    approvePostItem,
    approveMultiplePostsItem,
    rejectPostItem,
    shareNowPostItem,
    shareNextPostItem,
    reschedulePostItem,
    retryPostItem,
    fillQueueWithDrafts,
    updateChannelSchedule,
    togglePauseChannel,
    connectChannel,
    disconnectChannel,
    planWeeklyPosts
  } = useStore();

  // Tab state: Queue | Calendar | Drafts | Approvals (count) | Sent
  type TabType = 'queue' | 'calendar' | 'drafts' | 'approvals' | 'sent';
  const tabParam = searchParams.get('tab') as TabType;
  const currentTab: TabType = (tabParam && ['queue', 'calendar', 'drafts', 'approvals', 'sent'].includes(tabParam)) 
    ? tabParam 
    : 'queue';

  const handleTabChange = (tab: TabType) => {
    setSearchParams(prev => {
      prev.set('tab', tab);
      return prev;
    });
  };

  // Selected Channel state
  const channelParam = searchParams.get('channel') as ChannelId | 'all';
  const selectedChannelId: ChannelId | 'all' = channelParam || 'all';

  const handleSelectChannel = (id: ChannelId | 'all') => {
    setSearchParams(prev => {
      if (id === 'all') {
        prev.delete('channel');
      } else {
        prev.set('channel', id);
      }
      return prev;
    });
  };

  // Modals state
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerEditingPost, setComposerEditingPost] = useState<Post | null>(null);
  const [composerInitialSlot, setComposerInitialSlot] = useState<{ date: string; time: string; slotId: string; channelId?: ChannelId } | undefined>();
  const [composerInitialDraft, setComposerInitialDraft] = useState<string | undefined>();

  const [scheduleModalChannel, setScheduleModalChannel] = useState<Channel | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [disconnectModalChannel, setDisconnectModalChannel] = useState<Channel | null>(null);
  const [drawerPost, setDrawerPost] = useState<Post | null>(null);
  const [planWeeklyModalOpen, setPlanWeeklyModalOpen] = useState(false);

  // Check if ?action=new or ?action=plan in URL
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setComposerOpen(true);
      setSearchParams(prev => {
        prev.delete('action');
        return prev;
      });
    } else if (searchParams.get('action') === 'plan') {
      setPlanWeeklyModalOpen(true);
      setSearchParams(prev => {
        prev.delete('action');
        return prev;
      });
    }
  }, [searchParams, setSearchParams]);

  // Compute queued count per channel
  const queuedCountByChannel: Record<string, number> = {};
  channels.forEach(c => {
    queuedCountByChannel[c.id] = posts.filter(p => p.channelId === c.id && p.status === 'Scheduled').length;
  });

  const waitingApprovalsCount = posts.filter(p => p.status === 'Needs approval').length;

  const handleOpenComposerForSlot = (date: string, time: string, slotId: string, channelId: ChannelId) => {
    setComposerEditingPost(null);
    setComposerInitialSlot({ date, time, slotId, channelId });
    setComposerInitialDraft(undefined);
    setComposerOpen(true);
  };

  const handleOpenComposerForDay = (date: string, channelId?: ChannelId) => {
    setComposerEditingPost(null);
    setComposerInitialSlot({ date, time: '18:30', slotId: 'custom', channelId });
    setComposerInitialDraft(undefined);
    setComposerOpen(true);
  };

  const handleEditPost = (post: Post) => {
    setComposerEditingPost(post);
    setComposerInitialSlot(undefined);
    setComposerInitialDraft(undefined);
    setComposerOpen(true);
  };

  const handleComposerSubmit = (newPosts: Post[]) => {
    if (composerEditingPost) {
      if (newPosts.length === 1) {
        updatePostItem(newPosts[0]);
      } else {
        deletePostItem(composerEditingPost.id);
        addPostsBuffer(newPosts);
      }
    } else {
      addPostsBuffer(newPosts);
    }
  };

  const handleAddToQueueFromDraft = (draft: Post) => {
    const ch = channels.find(c => c.id === draft.channelId);
    if (!ch) return;
    approvePostItem(draft.id); // Assigns next open slot and schedules
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Top Page Sub-Header */}
      <div className="h-14 border-b border-gray-200 px-6 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-6">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">
            Publish
          </h1>

          {/* 5 Tabs: Queue | Calendar | Drafts | Approvals (count) | Sent */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handleTabChange('queue')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'queue'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Queue
            </button>

            <button
              onClick={() => handleTabChange('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'calendar'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>

            <button
              onClick={() => handleTabChange('drafts')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'drafts'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Drafts
            </button>

            <button
              onClick={() => handleTabChange('approvals')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentTab === 'approvals'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>Approvals</span>
              {waitingApprovalsCount > 0 && (
                <span className="font-mono text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded border border-amber-200">
                  {waitingApprovalsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabChange('sent')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                currentTab === 'sent'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Sent
            </button>
          </nav>
        </div>

        {/* Header Actions: Plan next week + New post (no icons on either) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlanWeeklyModalOpen(true)}
            className="text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-[6px] border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 transition-colors shadow-2xs"
          >
            Plan next week
          </button>

          <button
            type="button"
            onClick={() => {
              setComposerEditingPost(null);
              setComposerInitialSlot(undefined);
              setComposerInitialDraft(undefined);
              setComposerOpen(true);
            }}
            className="text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors shadow-2xs"
          >
            New post
          </button>
        </div>
      </div>

      {/* Main Page Layout: Channel Panel (240px) + Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* 240px Inside Channel Panel */}
        <ChannelPanel
          channels={channels}
          selectedChannelId={selectedChannelId}
          onSelectChannel={handleSelectChannel}
          onOpenConnectModal={() => setConnectModalOpen(true)}
          onOpenScheduleModal={(ch) => setScheduleModalChannel(ch)}
          onTogglePauseChannel={(cid) => togglePauseChannel(cid)}
          onOpenDisconnectModal={(ch) => setDisconnectModalChannel(ch)}
          queuedCountByChannel={queuedCountByChannel}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {currentTab === 'queue' && (
            <QueueTab
              channels={channels}
              posts={posts}
              selectedChannelId={selectedChannelId}
              onOpenDrawer={(p) => setDrawerPost(p)}
              onEditPost={handleEditPost}
              onShareNow={shareNowPostItem}
              onMoveToTop={shareNextPostItem}
              onDeletePost={deletePostItem}
              onOpenComposerForSlot={handleOpenComposerForSlot}
              onFillWithDrafts={fillQueueWithDrafts}
              onOpenScheduleModal={(ch) => setScheduleModalChannel(ch)}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarTab
              channels={channels}
              posts={posts}
              selectedChannelId={selectedChannelId}
              onOpenDrawer={(p) => setDrawerPost(p)}
              onOpenComposerForSlot={handleOpenComposerForSlot}
              onOpenComposerForDay={handleOpenComposerForDay}
              onReschedulePost={reschedulePostItem}
            />
          )}

          {currentTab === 'drafts' && (
            <DraftsTab
              channels={channels}
              posts={posts}
              selectedChannelId={selectedChannelId}
              onOpenDrawer={(p) => setDrawerPost(p)}
              onEditPost={handleEditPost}
              onDeletePost={deletePostItem}
              onAddToQueue={handleAddToQueueFromDraft}
              onOpenComposer={() => {
                setComposerEditingPost(null);
                setComposerInitialSlot(undefined);
                setComposerOpen(true);
              }}
            />
          )}

          {currentTab === 'approvals' && (
            <ApprovalsTab
              channels={channels}
              posts={posts}
              selectedChannelId={selectedChannelId}
              onOpenDrawer={(p) => setDrawerPost(p)}
              onEditPost={handleEditPost}
              onDeletePost={deletePostItem}
              onApprove={approvePostItem}
              onRequestChanges={rejectPostItem}
              onApproveSelected={approveMultiplePostsItem}
              onApproveSiblings={approveMultiplePostsItem}
            />
          )}

          {currentTab === 'sent' && (
            <SentTab
              channels={channels}
              posts={posts}
              selectedChannelId={selectedChannelId}
              onOpenDrawer={(p) => setDrawerPost(p)}
              onEditPost={handleEditPost}
              onDeletePost={deletePostItem}
              onRetry={retryPostItem}
            />
          )}
        </main>
      </div>

      {/* Post Composer Modal */}
      <PostComposerModal
        isOpen={composerOpen}
        onClose={() => {
          setComposerOpen(false);
          setComposerEditingPost(null);
          setComposerInitialSlot(undefined);
        }}
        channels={channels}
        allPosts={posts}
        approvalMode={approvalMode}
        initialPost={composerEditingPost}
        initialTargetChannelId={selectedChannelId}
        initialSlotTarget={composerInitialSlot}
        initialDraftText={composerInitialDraft}
        onSubmit={handleComposerSubmit}
        onOpenScheduleModal={(ch) => {
          setComposerOpen(false);
          setScheduleModalChannel(ch);
        }}
      />

      {/* Posting Schedule Modal */}
      <PostingScheduleModal
        channel={scheduleModalChannel}
        channels={channels}
        isOpen={Boolean(scheduleModalChannel)}
        onClose={() => setScheduleModalChannel(null)}
        onSaveSchedule={updateChannelSchedule}
        onTogglePauseQueue={togglePauseChannel}
      />

      {/* Connect Channel Modal */}
      <ConnectChannelModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        onConnectSuccess={connectChannel}
        existingChannels={channels}
      />

      {/* Disconnect Confirmation Modal */}
      <DisconnectChannelModal
        channel={disconnectModalChannel}
        isOpen={Boolean(disconnectModalChannel)}
        onClose={() => setDisconnectModalChannel(null)}
        onConfirmDisconnect={disconnectChannel}
        scheduledPosts={posts}
      />

      {/* Post Detail Drawer */}
      <PostDetailDrawer
        post={drawerPost}
        channels={channels}
        allPosts={posts}
        isOpen={Boolean(drawerPost)}
        onClose={() => setDrawerPost(null)}
        onEdit={handleEditPost}
        onShareNow={shareNowPostItem}
        onApprove={approvePostItem}
        onRequestChanges={(id) => rejectPostItem(id, 'Refine wording')}
        onDelete={deletePostItem}
        onRetry={retryPostItem}
        onSelectSibling={(sib) => setDrawerPost(sib)}
      />

      {/* Plan Next Week's Editorial Posts Modal */}
      <PlanWeeklyPostsModal
        isOpen={planWeeklyModalOpen}
        onClose={() => setPlanWeeklyModalOpen(false)}
        channels={channels}
        offers={offers}
        onGeneratePlan={planWeeklyPosts}
        onNavigateToTab={(tab) => {
          handleTabChange(tab);
          setPlanWeeklyModalOpen(false);
        }}
        onOpenComposerForPost={(post) => {
          setPlanWeeklyModalOpen(false);
          handleEditPost(post);
        }}
      />
    </div>
  );
};
