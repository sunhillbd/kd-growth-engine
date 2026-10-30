import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';
import { ProofItem } from '../../types';
import { Plus, ArrowRight, Check, X } from 'lucide-react';

export const ProofPage: React.FC = () => {
  const { proof, addProof, offers } = useStore();
  const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New proof form state
  const [title, setTitle] = useState('');
  const [clientType, setClientType] = useState('');
  const [offerId, setOfferId] = useState<ProofItem['offerId']>('ai-sprint');
  const [industry, setIndustry] = useState('');
  const [result, setResult] = useState('');
  const [canNameClient, setCanNameClient] = useState(false);
  const [clientName, setClientName] = useState('');
  const [writeUp, setWriteUp] = useState('');

  const getOfferName = (id: string) => {
    return offers.find(o => o.id === id)?.name || id;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !result) return;

    const newItem: ProofItem = {
      id: `proof-${Date.now()}`,
      title,
      clientType,
      offerId,
      industry,
      result,
      canNameClient,
      clientName: canNameClient ? clientName : undefined,
      timesUsed: 0,
      writeUp,
      usedIn: []
    };

    addProof(newItem);
    setAddModalOpen(false);
    // Reset
    setTitle('');
    setClientType('');
    setIndustry('');
    setResult('');
    setClientName('');
    setWriteUp('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Proof Library & Case Studies</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified client outcomes, quantitative metrics, and citation references used by the agent in outreach emails.
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="text-xs font-medium px-3.5 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>Add Case Study</span>
        </button>
      </div>

      {/* Proof Table */}
      <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
              <th className="py-2.5 px-4 font-normal">Case Study Title</th>
              <th className="py-2.5 px-4 font-normal">Client Profile</th>
              <th className="py-2.5 px-4 font-normal">Offer</th>
              <th className="py-2.5 px-4 font-normal">Industry</th>
              <th className="py-2.5 px-4 font-normal">Key Result</th>
              <th className="py-2.5 px-4 font-normal text-center">Can Name Client</th>
              <th className="py-2.5 px-4 font-normal text-right">Times Used</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {proof.map(item => (
              <tr
                key={item.id}
                onClick={() => setSelectedProof(item)}
                className="hover:bg-gray-50 transition-colors cursor-pointer h-12"
              >
                <td className="py-2 px-4 font-semibold text-gray-900 max-w-xs truncate">
                  {item.title}
                </td>
                <td className="py-2 px-4 text-gray-600">
                  {item.clientType}
                </td>
                <td className="py-2 px-4 text-gray-600 font-mono text-xs">
                  {getOfferName(item.offerId)}
                </td>
                <td className="py-2 px-4 text-gray-600">
                  {item.industry}
                </td>
                <td className="py-2 px-4 text-gray-800 font-medium max-w-xs truncate">
                  {item.result}
                </td>
                <td className="py-2 px-4 text-center">
                  {item.canNameClient ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check className="w-3 h-3" /> Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                      <X className="w-3 h-3" /> Anonymous
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-900 font-semibold">
                  {item.timesUsed}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Case Study Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedProof)}
        onClose={() => setSelectedProof(null)}
        title={selectedProof?.title || ''}
        subtitle={`${selectedProof?.clientType} · ${getOfferName(selectedProof?.offerId || '')}`}
        width="xl"
      >
        {selectedProof && (
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Key outcome */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-[6px]">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-blue-700 block mb-1">
                Verified Outcome
              </span>
              <p className="text-blue-950 font-medium leading-relaxed">
                {selectedProof.result}
              </p>
            </div>

            {/* Client naming status */}
            <div className="border border-gray-200 rounded-[6px] p-4 bg-gray-50 flex items-center justify-between">
              <div>
                <span className="text-gray-500 block text-xs">Client Disclosure</span>
                <span className="font-semibold text-gray-900">
                  {selectedProof.canNameClient 
                    ? `Public: ${selectedProof.clientName || selectedProof.clientType}` 
                    : 'Confidential / Under NDA (Do not name in public campaigns)'}
                </span>
              </div>
              <span className="font-mono text-gray-500 text-xs">
                Industry: {selectedProof.industry}
              </span>
            </div>

            {/* Full Write-up */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 font-mono text-xs uppercase tracking-wider">
                Full Technical Write-up
              </h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-[6px] border border-gray-200">
                {selectedProof.writeUp}
              </p>
            </div>

            {/* Citation History */}
            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-gray-900 font-mono text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Where This Proof Was Used ({selectedProof.usedIn.length})</span>
                <span className="text-gray-400 font-normal font-sans text-xs">Total citations: {selectedProof.timesUsed}</span>
              </h4>

              {selectedProof.usedIn.length === 0 ? (
                <p className="text-gray-500 italic text-xs">No active campaign citations logged yet.</p>
              ) : (
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-[6px] overflow-hidden">
                  {selectedProof.usedIn.map((usage, idx) => (
                    <div key={idx} className="p-3 bg-white hover:bg-gray-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded uppercase font-mono text-[10px] ${
                          usage.type === 'lead' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {usage.type}
                        </span>
                        <span className="font-medium text-gray-800">{usage.title}</span>
                      </div>
                      <span className="font-mono text-gray-400 text-[11px]">{usage.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Case Study Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Case Study to Brain"
        description="Add a verified client project outcome to reference in agent-drafted messages."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Automated Customs Document Parsing"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Aligned Offer</label>
              <select
                value={offerId}
                onChange={e => setOfferId(e.target.value as ProofItem['offerId'])}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none bg-white"
              >
                {offers.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                required
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="e.g. Logistics & Supply Chain"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Client Profile</label>
            <input
              type="text"
              required
              value={clientType}
              onChange={e => setClientType(e.target.value)}
              placeholder="e.g. SMB Freight Forwarder (80 staff)"
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Key Quantitative Result</label>
            <input
              type="text"
              required
              value={result}
              onChange={e => setResult(e.target.value)}
              placeholder="e.g. Cut document turnaround from 36 hours to 4 minutes; 99.2% accuracy."
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="canNameCheck"
              checked={canNameClient}
              onChange={e => setCanNameClient(e.target.checked)}
              className="rounded text-blue-600"
            />
            <label htmlFor="canNameCheck" className="text-xs text-gray-700 cursor-pointer">
              Client explicitly permitted naming their company in cold outreach
            </label>
          </div>

          {canNameClient && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Client Legal / Trading Name</label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="e.g. Portline Global Freight Ltd"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Technical Write-up</label>
            <textarea
              rows={3}
              value={writeUp}
              onChange={e => setWriteUp(e.target.value)}
              placeholder="Describe technical implementation, tech stack, and workflow details..."
              className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-[6px] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-[6px] hover:bg-blue-700"
            >
              Save Case Study
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
