import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { samplePreviewSignals } from '../../mock/icps';
import { ArrowLeft, Save, Sparkles, X, Plus, Trash2 } from 'lucide-react';

export const IcpDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { icps, updateIcp, offers } = useStore();

  const icp = icps.find(i => i.id === id);

  const [activeTab, setActiveTab] = useState<'definition' | 'performance' | 'history'>('definition');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form states
  const [name, setName] = useState(icp?.name || '');
  const [companyType, setCompanyType] = useState(icp?.companyType || '');
  const [companySize, setCompanySize] = useState(icp?.companySize || '');
  const [countries, setCountries] = useState<string[]>(icp?.countries || []);
  const [industries, setIndustries] = useState<string[]>(icp?.industries || []);
  const [roles, setRoles] = useState<string[]>(icp?.roles || []);
  const [buyingTriggers, setBuyingTriggers] = useState<string[]>(icp?.buyingTriggers || []);
  const [pains, setPains] = useState<string[]>(icp?.pains || []);
  const [disqualifiers, setDisqualifiers] = useState<string[]>(icp?.disqualifiers || []);
  const [objections, setObjections] = useState(icp?.objections || []);

  const [newTrigger, setNewTrigger] = useState('');
  const [newPain, setNewPain] = useState('');
  const [newDisqualifier, setNewDisqualifier] = useState('');

  if (!icp) {
    return (
      <div className="p-8 text-center text-xs text-gray-500">
        ICP not found. <button onClick={() => navigate('/brain/icps')} className="text-blue-600 underline">Back to ICPs</button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...icp,
      name,
      companyType,
      companySize,
      countries,
      industries,
      roles,
      buyingTriggers,
      pains,
      disqualifiers,
      objections,
      history: [
        { date: new Date().toISOString().split('T')[0], who: 'Alex Mercer', what: 'Updated ICP triggers and disqualifiers' },
        ...icp.history
      ]
    };
    updateIcp(updated);
  };

  const handlePreviewMatches = () => {
    setIsPreviewLoading(true);
    setTimeout(() => {
      setIsPreviewLoading(false);
      setShowPreviewModal(true);
    }, 2200);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/brain/icps')}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-[4px] hover:bg-gray-100"
            title="Back to ICPs"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <div>
            <h2 className="text-base font-semibold text-gray-900">{icp.name}</h2>
            <p className="text-xs text-gray-500">Target Ideal Client Profile</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviewMatches}
            disabled={isPreviewLoading}
            className="text-xs font-medium px-3 py-1.5 rounded-[6px] border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 transition-colors"
          >
            {isPreviewLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin"></span>
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-blue-600" strokeWidth={1.5} />
            )}
            <span>Preview Matches</span>
          </button>

          {activeTab === 'definition' && (
            <button
              onClick={handleSave}
              className="text-xs font-medium px-3.5 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Save ICP</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button
          onClick={() => setActiveTab('definition')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'definition'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Definition & Triggers
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'performance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Monthly Performance
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          History ({icp.history.length})
        </button>
      </div>

      {/* Tab 1: Definition */}
      {activeTab === 'definition' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Firmographics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company Type</label>
                <input
                  type="text"
                  value={companyType}
                  onChange={e => setCompanyType(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company Size</label>
                <input
                  type="text"
                  value={companySize}
                  onChange={e => setCompanySize(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Target Countries (comma separated)</label>
                <input
                  type="text"
                  value={countries.join(', ')}
                  onChange={e => setCountries(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Target Roles (comma separated)</label>
                <input
                  type="text"
                  value={roles.join(', ')}
                  onChange={e => setRoles(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Buying Triggers */}
          <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Buying Triggers (+ Intent Signals)
            </h3>
            <p className="text-[11px] text-gray-500">
              When an agent identifies these patterns online, signal score increases (+20 to +35 pts).
            </p>
            <div className="space-y-2">
              {buyingTriggers.map((trig, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-[6px] text-xs">
                  <span className="text-gray-800">{trig}</span>
                  <button
                    type="button"
                    onClick={() => setBuyingTriggers(buyingTriggers.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTrigger}
                onChange={e => setNewTrigger(e.target.value)}
                placeholder="Add another buying trigger..."
                className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTrigger.trim()) {
                    setBuyingTriggers([...buyingTriggers, newTrigger.trim()]);
                    setNewTrigger('');
                  }
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-[6px] hover:bg-gray-50 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Disqualifiers */}
          <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-rose-700">
              Disqualifiers (Auto-Drop Signals)
            </h3>
            <p className="text-[11px] text-gray-500">
              Any signal containing these signals drops automatically to noise.
            </p>
            <div className="space-y-2">
              {disqualifiers.map((dis, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-rose-50/50 border border-rose-200 rounded-[6px] text-xs">
                  <span className="text-rose-900">{dis}</span>
                  <button
                    type="button"
                    onClick={() => setDisqualifiers(disqualifiers.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDisqualifier}
                onChange={e => setNewDisqualifier(e.target.value)}
                placeholder="Add disqualifier rule..."
                className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={() => {
                  if (newDisqualifier.trim()) {
                    setDisqualifiers([...disqualifiers, newDisqualifier.trim()]);
                    setNewDisqualifier('');
                  }
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-[6px] hover:bg-gray-50 flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Objections & Answers */}
          <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-700">
              Anticipated Objections & Studio Answers
            </h3>
            <div className="space-y-3">
              {objections.map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-[6px] space-y-2 text-xs">
                  <div className="font-semibold text-gray-900">
                    Q: {item.objection}
                  </div>
                  <div className="text-gray-700">
                    A: {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Monthly Performance */}
      {activeTab === 'performance' && (
        <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                <th className="py-2.5 px-4 font-normal">Month</th>
                <th className="py-2.5 px-4 font-normal text-right">Leads Qualified</th>
                <th className="py-2.5 px-4 font-normal text-right">Replies</th>
                <th className="py-2.5 px-4 font-normal text-right">Calls Booked</th>
                <th className="py-2.5 px-4 font-normal text-right">Wins</th>
                <th className="py-2.5 px-4 font-normal text-right">Reply Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {icp.monthlyPerformance.map((row, idx) => (
                <tr key={idx} className="h-10 hover:bg-gray-50">
                  <td className="py-2 px-4 font-mono font-medium text-gray-900">
                    {row.month}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                    {row.leads}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                    {row.replies}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                    {row.calls}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">
                    {row.wins}
                  </td>
                  <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-600">
                    {row.leads > 0 ? `${((row.replies / row.leads) * 100).toFixed(1)}%` : '0.0%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
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
              {icp.history.map((hist, idx) => (
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

      {/* Preview Matches Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
          <div className="relative w-full max-w-xl bg-white rounded-[6px] border border-gray-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
                  Matched Live Signals (~120 in the last 30 days)
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Showing 5 sample signals matching "{icp.name}" rules
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              {samplePreviewSignals.map(sig => (
                <div key={sig.id} className="p-3 border border-gray-200 rounded-[6px] hover:bg-gray-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{sig.company}</span>
                    <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold text-[11px]">
                      Score: {sig.score}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-snug">
                    "{sig.snippet}"
                  </p>
                  <div className="text-[11px] text-gray-400 font-mono">
                    Source: {sig.source}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-[6px] hover:bg-gray-100"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
