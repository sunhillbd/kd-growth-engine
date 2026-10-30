import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Signal, SignalType } from '../../types';
import { Search, ExternalLink, Plus, Ban, CheckCircle2 } from 'lucide-react';

export const SignalsPage: React.FC = () => {
  const { signals, makeLeadFromSignal, markSignalAsNoise } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSignals = signals.filter(sig => {
    if (filterSource !== 'all' && !sig.source.toLowerCase().includes(filterSource.toLowerCase())) return false;
    if (filterType !== 'all' && sig.signalType !== filterType) return false;
    if (filterStatus !== 'all' && sig.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sig.companyName.toLowerCase().includes(q) ||
        sig.textSnippet.toLowerCase().includes(q) ||
        sig.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Signals Collector Feed</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Raw posts, job requisitions, and funding alerts monitored by background collectors.
          </p>
        </div>
        <div className="text-xs font-mono text-gray-500">
          Total Captured: <span className="font-semibold text-gray-900 font-mono">{signals.length} signals</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search company, keywords or snippet text..."
            className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterSource}
            onChange={e => setFilterSource(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 outline-none"
          >
            <option value="all">All Sources</option>
            <option value="Hacker News">Hacker News</option>
            <option value="Reddit">Reddit</option>
            <option value="Indeed">Indeed</option>
            <option value="TechCrunch">TechCrunch</option>
            <option value="Product Hunt">Product Hunt</option>
            <option value="Agency">Agency RFP</option>
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 outline-none"
          >
            <option value="all">All Signal Types</option>
            <option value="Hiring Post">Hiring Post</option>
            <option value="Funding News">Funding News</option>
            <option value="Reddit Problem">Reddit Problem</option>
            <option value="Product Hunt Launch">Product Hunt Launch</option>
            <option value="Agency Referral">Agency Referral</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="lead">Became Lead</option>
            <option value="unprocessed">Unprocessed</option>
            <option value="dropped">Marked Noise</option>
          </select>
        </div>
      </div>

      {/* Signals Table */}
      <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
              <th className="py-2.5 px-4 font-normal">Source</th>
              <th className="py-2.5 px-4 font-normal">Company / Entity</th>
              <th className="py-2.5 px-4 font-normal">Signal Snippet</th>
              <th className="py-2.5 px-4 font-normal">Type</th>
              <th className="py-2.5 px-4 font-normal text-right">Relevance</th>
              <th className="py-2.5 px-4 font-normal text-center">Status</th>
              <th className="py-2.5 px-4 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSignals.slice(0, 50).map(sig => (
              <tr key={sig.id} className="hover:bg-gray-50 transition-colors h-12">
                <td className="py-2 px-4 text-gray-600 font-mono text-[11px] whitespace-nowrap">
                  {sig.source}
                </td>
                <td className="py-2 px-4 font-semibold text-gray-900 whitespace-nowrap">
                  {sig.companyName}
                </td>
                <td className="py-2 px-4 text-gray-700 max-w-md truncate" title={sig.textSnippet}>
                  {sig.textSnippet}
                </td>
                <td className="py-2 px-4 text-gray-600 whitespace-nowrap">
                  <span className="text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                    {sig.signalType}
                  </span>
                </td>
                <td className="py-2 px-4 text-right font-mono tabular-nums font-semibold text-gray-800">
                  {sig.relevanceScore}
                </td>
                <td className="py-2 px-4 text-center whitespace-nowrap">
                  {sig.status === 'lead' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Lead
                    </span>
                  ) : sig.status === 'dropped' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">
                      Noise
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium border border-blue-200">
                      Unprocessed
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 text-right whitespace-nowrap">
                  {sig.status !== 'lead' ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => makeLeadFromSignal(sig.id)}
                        className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Promote to Lead Queue"
                      >
                        Make lead
                      </button>
                      {sig.status !== 'dropped' && (
                        <button
                          onClick={() => markSignalAsNoise(sig.id)}
                          className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                          title="Mark as noise"
                        >
                          Noise
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-mono">In Queue / Pipeline</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
