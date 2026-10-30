import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SourceCollector } from '../../types';
import { Drawer } from '../../components/common/Drawer';
import { Modal } from '../../components/common/Modal';
import { suggestedKeywordsFromClearSearch } from '../../mock/sources';
import { AlertTriangle, CheckCircle2, Plus, Edit2, Check } from 'lucide-react';

export const SourcesPage: React.FC = () => {
  const { sources, toggleSource, searchPlans, updateSearchPlan, addKeywordsToSearchPlans, icps } = useStore();

  const [activeTab, setActiveTab] = useState<'sources' | 'plans'>('sources');
  const [selectedFailingSource, setSelectedFailingSource] = useState<SourceCollector | null>(null);

  // ClearSearch Keywords Modal
  const [keywordModalOpen, setKeywordModalOpen] = useState(false);
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<string[]>(['k1', 'k3']);

  // Edit query inline state
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editQueryText, setEditQueryText] = useState('');

  const handleStartEditPlan = (id: string, currentQuery: string) => {
    setEditingPlanId(id);
    setEditQueryText(currentQuery);
  };

  const handleSavePlanQuery = (id: string) => {
    updateSearchPlan(id, editQueryText);
    setEditingPlanId(null);
  };

  const handleToggleKeyword = (id: string) => {
    if (selectedKeywordIds.includes(id)) {
      setSelectedKeywordIds(selectedKeywordIds.filter(k => k !== id));
    } else {
      setSelectedKeywordIds([...selectedKeywordIds, id]);
    }
  };

  const handleImportKeywords = () => {
    const kws = suggestedKeywordsFromClearSearch
      .filter(k => selectedKeywordIds.includes(k.id))
      .map(k => `"${k.keyword}"`);
    addKeywordsToSearchPlans(kws);
    setKeywordModalOpen(false);
  };

  const getIcpName = (icpId: string) => {
    return icps.find(i => i.id === icpId)?.name || icpId;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Sources & Search Plans</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage active scraping collectors, background schedule intervals, and ICP keyword queries.
          </p>
        </div>

        {activeTab === 'plans' && (
          <button
            onClick={() => setKeywordModalOpen(true)}
            className="text-xs font-medium px-3.5 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Keywords from ClearSearch</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6">
        <button
          onClick={() => setActiveTab('sources')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'sources'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Collectors & Kill Switches ({sources.length})
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'plans'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Active Search Plans ({searchPlans.length})
        </button>
      </div>

      {activeTab === 'sources' ? (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  <th className="py-2.5 px-4 font-normal">Active Kill Switch</th>
                  <th className="py-2.5 px-4 font-normal">Collector Name</th>
                  <th className="py-2.5 px-4 font-normal">Type & Schedule</th>
                  <th className="py-2.5 px-4 font-normal">Last Executed</th>
                  <th className="py-2.5 px-4 font-normal text-right">Items (7d)</th>
                  <th className="py-2.5 px-4 font-normal text-right">Leads (7d)</th>
                  <th className="py-2.5 px-4 font-normal text-center">Collector Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sources.map(src => (
                  <tr key={src.id} className="hover:bg-gray-50 transition-colors h-12">
                    <td className="py-2 px-4">
                      {/* Simple Accessible On/Off Switch */}
                      <button
                        onClick={() => toggleSource(src.id)}
                        className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
                          src.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                        role="switch"
                        aria-checked={src.enabled}
                        title={src.enabled ? 'Click to pause collector' : 'Click to resume collector'}
                      >
                        <span
                          className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform transform mt-0.5 ml-0.5 ${
                            src.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-2 px-4 font-semibold text-gray-900">
                      {src.name}
                    </td>
                    <td className="py-2 px-4 text-gray-600 text-xs font-mono">
                      {src.type} · {src.schedule}
                    </td>
                    <td className="py-2 px-4 text-gray-500 font-mono text-[11px]">
                      {src.lastRun}
                    </td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                      {src.items7d}
                    </td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums font-semibold text-gray-900">
                      {src.leads7d}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {src.health === 'Healthy' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Healthy
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedFailingSource(src)}
                          className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Failing (View Error)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Explicit Note as required */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-xs text-gray-500 font-mono">
            Note: Not collected: LinkedIn lead data, X search.
          </div>
        </div>
      ) : (
        /* Tab 2: Search Plans */
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  <th className="py-2.5 px-4 font-normal">ICP</th>
                  <th className="py-2.5 px-4 font-normal">Source</th>
                  <th className="py-2.5 px-4 font-normal">Query Filter</th>
                  <th className="py-2.5 px-4 font-normal text-right">Signals Found</th>
                  <th className="py-2.5 px-4 font-normal text-right">Leads</th>
                  <th className="py-2.5 px-4 font-normal text-right">Reply Rate</th>
                  <th className="py-2.5 px-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {searchPlans.map(plan => (
                  <tr key={plan.id} className="hover:bg-gray-50 transition-colors h-12">
                    <td className="py-2 px-4 font-semibold text-gray-900">
                      {getIcpName(plan.icpId)}
                    </td>
                    <td className="py-2 px-4 text-gray-600 font-mono text-[11px]">
                      {plan.sourceName}
                    </td>
                    <td className="py-2 px-4 text-gray-800 font-mono text-xs max-w-xs truncate">
                      {editingPlanId === plan.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editQueryText}
                            onChange={e => setEditQueryText(e.target.value)}
                            className="px-2 py-1 text-xs border border-blue-600 rounded bg-white w-full font-mono outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePlanQuery(plan.id)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span>{plan.query}</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                      {plan.signalsFound}
                    </td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums font-semibold text-gray-900">
                      {plan.leadsProduced}
                    </td>
                    <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-gray-900">
                      {plan.replyRate}%
                    </td>
                    <td className="py-2 px-4 text-right">
                      {editingPlanId !== plan.id && (
                        <button
                          onClick={() => handleStartEditPlan(plan.id, plan.query)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Failing Source Error Drawer */}
      <Drawer
        isOpen={Boolean(selectedFailingSource)}
        onClose={() => setSelectedFailingSource(null)}
        title={selectedFailingSource?.name || ''}
        subtitle="Collector Error Diagnostics"
        width="md"
      >
        {selectedFailingSource && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-[6px] text-rose-950 space-y-2">
              <span className="font-semibold font-mono text-xs uppercase tracking-wider text-rose-800 block">
                Execution Failure Log
              </span>
              <p className="font-mono text-xs leading-relaxed bg-white/70 p-3 rounded border border-rose-200">
                {selectedFailingSource.errorMessage}
              </p>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <h4 className="font-semibold text-gray-900">Recovery Steps:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Automated exponential backoff is actively waiting for rate limit window reset.</li>
                <li>You can toggle the Kill Switch off to immediately suppress retry attempts.</li>
                <li>API token and proxy pool can be rotated in Settings → Connections.</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  toggleSource(selectedFailingSource.id);
                  setSelectedFailingSource(null);
                }}
                className="px-3 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-[6px] hover:bg-gray-50"
              >
                Toggle Kill Switch Off
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Suggested Keywords Modal */}
      <Modal
        isOpen={keywordModalOpen}
        onClose={() => setKeywordModalOpen(false)}
        title="Import Keywords from ClearSearch"
        description="Select high-commercial intent keywords discovered from search volume analytics."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  <th className="py-2 px-3 text-center w-10">Select</th>
                  <th className="py-2 px-3 font-normal">Search Query</th>
                  <th className="py-2 px-3 font-normal">Monthly Volume</th>
                  <th className="py-2 px-3 font-normal">Competition</th>
                  <th className="py-2 px-3 font-normal">Intent Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {suggestedKeywordsFromClearSearch.map(kw => {
                  const isChecked = selectedKeywordIds.includes(kw.id);
                  return (
                    <tr
                      key={kw.id}
                      onClick={() => handleToggleKeyword(kw.id)}
                      className="hover:bg-gray-50 cursor-pointer h-10"
                    >
                      <td className="py-1 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by row click
                          className="rounded text-blue-600"
                        />
                      </td>
                      <td className="py-1 px-3 font-semibold text-gray-900 font-mono">
                        {kw.keyword}
                      </td>
                      <td className="py-1 px-3 text-gray-600 font-mono tabular-nums">
                        {kw.monthlyVolume}
                      </td>
                      <td className="py-1 px-3 text-gray-600">
                        {kw.competition}
                      </td>
                      <td className="py-1 px-3">
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-medium">
                          {kw.intent}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setKeywordModalOpen(false)}
              className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-[6px] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImportKeywords}
              disabled={selectedKeywordIds.length === 0}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-[6px] hover:bg-blue-700 disabled:bg-gray-300"
            >
              Import {selectedKeywordIds.length} Selected Keywords
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
