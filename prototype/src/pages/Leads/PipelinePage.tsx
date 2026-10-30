import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lead, PipelineStage } from '../../types';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';
import { Clock, DollarSign, MoveRight, ChevronRight, Save } from 'lucide-react';

const STAGES: PipelineStage[] = [
  'Qualified',
  'Approved',
  'Contacted',
  'Replied',
  'Call booked',
  'Proposal',
  'Won',
  'Lost'
];

export const PipelinePage: React.FC = () => {
  const { leads, movePipelineStage, updateLeadNotes, offers } = useStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState('');
  
  // Drag and drop / Move state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [pendingLostLeadId, setPendingLostLeadId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState('Went with competitor');

  const getOfferName = (offerId: string) => {
    return offers.find(o => o.id === offerId)?.name || offerId;
  };

  const handleCardClick = (lead: Lead) => {
    setSelectedLead(lead);
    setLeadNotes(lead.notes || '');
  };

  const handleSaveNotes = () => {
    if (!selectedLead) return;
    updateLeadNotes(selectedLead.id, leadNotes);
  };

  // Drag handlers
  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStage: PipelineStage) => {
    if (!draggedLeadId) return;

    if (targetStage === 'Lost') {
      setPendingLostLeadId(draggedLeadId);
      setLostModalOpen(true);
      setDraggedLeadId(null);
      return;
    }

    movePipelineStage(draggedLeadId, targetStage);
    setDraggedLeadId(null);
  };

  const handleConfirmLost = () => {
    if (!pendingLostLeadId) return;
    movePipelineStage(pendingLostLeadId, 'Lost', lostReason);
    setLostModalOpen(false);
    setPendingLostLeadId(null);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col p-6 space-y-4">
      {/* Top summary header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Lead Pipeline Board</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Columns up to Replied synchronize with Outreach app webhooks. Drag cards to update later deal stages.
          </p>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          Total Deals in Pipeline: <span className="font-semibold text-gray-900 font-mono">{leads.length}</span>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage);
            const totalStageValue = stageLeads.reduce((acc, curr) => acc + (curr.valueEst || 0), 0);
            const isAutoSynced = ['Qualified', 'Approved', 'Contacted', 'Replied'].includes(stage);

            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage)}
                className={`w-72 bg-gray-100/70 border border-gray-200 rounded-[6px] flex flex-col h-full overflow-hidden ${
                  draggedLeadId ? 'hover:border-blue-500 transition-colors' : ''
                }`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-gray-200 bg-white/80 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-gray-900 font-mono uppercase tracking-wide">
                      {stage}
                    </span>
                    <span className="font-mono text-xs text-gray-500 tabular-nums">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono mt-1">
                    <span>${totalStageValue.toLocaleString()}</span>
                    {isAutoSynced ? (
                      <span className="text-[10px] text-gray-400 italic">
                        Auto-synced
                      </span>
                    ) : (
                      <span className="text-[10px] text-blue-600 font-medium">
                        Manual drag
                      </span>
                    )}
                  </div>
                </div>

                {/* Cards List */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                  {stageLeads.length === 0 ? (
                    <div className="h-24 border border-dashed border-gray-300 rounded-[6px] flex items-center justify-center text-[11px] text-gray-400 font-mono">
                      Empty stage
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead.id)}
                        onClick={() => handleCardClick(lead)}
                        className="p-3 bg-white border border-gray-200 rounded-[6px] hover:border-gray-300 shadow-none cursor-pointer transition-all space-y-2 text-xs select-none active:opacity-60"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-gray-900 leading-tight">
                            {lead.company}
                          </span>
                          <span className="font-mono tabular-nums text-gray-700 font-medium text-[11px]">
                            ${(lead.valueEst || 0).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-gray-600 text-[11px]">
                          {lead.personName} · <span className="text-gray-400">{lead.country}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] font-mono text-gray-400">
                          <span className="truncate max-w-[150px]">
                            {getOfferName(lead.offerId)}
                          </span>
                          <span>Score: {lead.score}</span>
                        </div>

                        {lead.lostReason && (
                          <div className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            Reason: {lead.lostReason}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.company || ''}
        subtitle={`${selectedLead?.personName} (${selectedLead?.personRole}) · ${selectedLead?.country}`}
        width="lg"
      >
        {selectedLead && (
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Stage mover bar */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-[6px] space-y-2">
              <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold block">
                Current Pipeline Stage
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedLead.stage}
                  onChange={e => {
                    const newStage = e.target.value as PipelineStage;
                    if (newStage === 'Lost') {
                      setPendingLostLeadId(selectedLead.id);
                      setLostModalOpen(true);
                    } else {
                      movePipelineStage(selectedLead.id, newStage);
                      setSelectedLead({ ...selectedLead, stage: newStage });
                    }
                  }}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-[6px] text-xs font-medium text-gray-800 outline-none"
                >
                  {STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="font-mono text-gray-500 text-xs">
                  Value: ${selectedLead.valueEst.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                Pipeline Event Timeline
              </h4>

              <div className="border border-gray-200 rounded-[6px] divide-y divide-gray-100 bg-white">
                {selectedLead.timeline.map((evt, idx) => (
                  <div key={idx} className="p-3 text-xs flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-gray-900 block leading-snug">
                        {evt.event}
                      </span>
                      <span className="text-[11px] text-gray-500 mt-0.5 block font-mono">
                        Actor: {evt.actor}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 shrink-0">
                      {evt.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
                  Deal Notes & Meeting Minutes
                </h4>
                <button
                  onClick={handleSaveNotes}
                  className="text-xs font-medium px-2.5 py-1 rounded-[4px] bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
                >
                  <Save className="w-3 h-3" /> Save Note
                </button>
              </div>

              <textarea
                rows={5}
                value={leadNotes}
                onChange={e => setLeadNotes(e.target.value)}
                placeholder="Log internal notes from calls, technical requirements, or budget discussions..."
                className="w-full text-xs p-3 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
              />
            </div>
          </div>
        )}
      </Drawer>

      {/* Lost Reason Modal */}
      <Modal
        isOpen={lostModalOpen}
        onClose={() => setLostModalOpen(false)}
        title="Mark Lead as Lost"
        description="Provide a reason to track loss drivers across quarterly reports."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Primary Reason
            </label>
            <select
              value={lostReason}
              onChange={e => setLostReason(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none bg-white"
            >
              <option value="Budget cut / funding delayed">Budget cut / funding delayed</option>
              <option value="Went with competitor">Went with competitor</option>
              <option value="Decided on internal hire">Decided on internal hire</option>
              <option value="Ghosted after proposal">Ghosted after proposal</option>
              <option value="Project cancelled">Project cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setLostModalOpen(false)}
              className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-[6px] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmLost}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 rounded-[6px] hover:bg-rose-700"
            >
              Confirm Lost
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
