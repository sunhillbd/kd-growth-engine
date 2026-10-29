import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export const OfferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { offers, updateOffer, proof } = useStore();

  const offer = offers.find(o => o.id === id);

  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [name, setName] = useState(offer?.name || '');
  const [priceRange, setPriceRange] = useState(offer?.priceRange || '');
  const [timeline, setTimeline] = useState(offer?.timeline || '');
  const [promise, setPromise] = useState(offer?.promise || '');
  const [deliverables, setDeliverables] = useState<string[]>(offer?.deliverables || []);
  const [newDeliverable, setNewDeliverable] = useState('');

  if (!offer) {
    return (
      <div className="p-8 text-center text-xs text-gray-500">
        Offer not found. <button onClick={() => navigate('/brain/offers')} className="text-blue-600 underline">Back to Offers</button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...offer,
      name,
      priceRange,
      timeline,
      promise,
      deliverables,
      history: [
        { date: new Date().toISOString().split('T')[0], who: 'Alex Mercer', what: 'Updated deliverables and promise' },
        ...offer.history
      ]
    };
    updateOffer(updated);
  };

  const addDeliverableItem = () => {
    if (!newDeliverable.trim()) return;
    setDeliverables([...deliverables, newDeliverable.trim()]);
    setNewDeliverable('');
  };

  const removeDeliverableItem = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const linkedProofs = proof.filter(p => p.offerId === offer.id);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/brain/offers')}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-[4px] hover:bg-gray-100"
            title="Back to Offers"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{offer.name}</h2>
            <p className="text-xs text-gray-500">Service Offer Specification</p>
          </div>
        </div>

        {activeTab === 'details' && (
          <button
            onClick={handleSave}
            className="text-xs font-medium px-3.5 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'details'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Offer Details & Deliverables
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Version History ({offer.history.length})
        </button>
      </div>

      {activeTab === 'details' ? (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Offer Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <input
                  type="text"
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Delivery Timeline
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={e => setTimeline(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Core Value Promise
              </label>
              <textarea
                rows={3}
                value={promise}
                onChange={e => setPromise(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Referenced verbatim by the agent when drafting cold pitch opening value propositions.
              </p>
            </div>
          </div>

          {/* Deliverables List */}
          <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Contracted Deliverables ({deliverables.length})
            </h3>
            
            <div className="space-y-2">
              {deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-[6px] text-xs">
                  <span className="text-gray-800">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeDeliverableItem(idx)}
                    className="text-gray-400 hover:text-rose-600 p-1"
                    title="Remove deliverable"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDeliverable}
                onChange={e => setNewDeliverable(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDeliverableItem(); } }}
                placeholder="Add another deliverable specification..."
                className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={addDeliverableItem}
                className="px-3 py-2 text-xs border border-gray-300 rounded-[6px] hover:bg-gray-50 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Linked Proof */}
          <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Linked Case Studies in Brain ({linkedProofs.length})
            </h3>
            <div className="divide-y divide-gray-100 text-xs">
              {linkedProofs.map(p => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{p.title}</span>
                    <span className="text-gray-500 block text-[11px] mt-0.5">{p.clientType} · {p.result}</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Used {p.timesUsed}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </form>
      ) : (
        /* History Tab */
        <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                <th className="py-2.5 px-4 font-normal">Date</th>
                <th className="py-2.5 px-4 font-normal">Changed By</th>
                <th className="py-2.5 px-4 font-normal">Description of Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {offer.history.map((hist, idx) => (
                <tr key={idx} className="h-10 hover:bg-gray-50">
                  <td className="py-2 px-4 font-mono text-gray-500 text-xs">
                    {hist.date}
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-900">
                    {hist.who}
                  </td>
                  <td className="py-2 px-4 text-gray-700">
                    {hist.what}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
