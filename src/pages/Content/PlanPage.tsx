import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Edit2, PenTool, CheckCircle2 } from 'lucide-react';

export const PlanPage: React.FC = () => {
  const { content, generateNextWeekContent, isGeneratingContent, offers, icps } = useStore();
  const navigate = useNavigate();

  // If Brain has no data, show plain empty state
  if (offers.length === 0 || icps.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center space-y-3 font-sans">
        <h3 className="text-sm font-semibold text-gray-900">
          Brain knowledge base empty
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Finish your ICPs to start finding leads and planning editorial posts.
        </p>
        <button
          onClick={() => navigate('/brain/icps')}
          className="text-xs font-medium py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors"
        >
          Finish your ICPs to start finding leads
        </button>
      </div>
    );
  }

  // Group items by day
  const plannedItems = content.filter(c => c.status === 'Idea' || c.status === 'Draft');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Weekly Editorial Plan</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Planned topics, target pains, and formats generated to address buyer objections.
          </p>
        </div>

        <button
          onClick={generateNextWeekContent}
          disabled={isGeneratingContent}
          className="text-xs font-medium px-3.5 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors disabled:bg-blue-400"
        >
          {isGeneratingContent ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span>Generating Next Week (Task #T-142)...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Next Week</span>
            </>
          )}
        </button>
      </div>

      {/* Weekly Plan List Grouped by Day */}
      <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
              <th className="py-2.5 px-4 font-normal">Scheduled Day</th>
              <th className="py-2.5 px-4 font-normal">Topic & Angle</th>
              <th className="py-2.5 px-4 font-normal">Format</th>
              <th className="py-2.5 px-4 font-normal">Pain Addressed</th>
              <th className="py-2.5 px-4 font-normal">Target Keyword</th>
              <th className="py-2.5 px-4 font-normal text-center">Status</th>
              <th className="py-2.5 px-4 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plannedItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors h-14">
                <td className="py-2 px-4 font-mono text-gray-900 text-xs whitespace-nowrap font-medium">
                  {item.scheduledDay || 'TBD'}
                </td>
                <td className="py-2 px-4 font-semibold text-gray-900 max-w-xs truncate" title={item.topic}>
                  {item.topic}
                </td>
                <td className="py-2 px-4 text-gray-600 whitespace-nowrap">
                  <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                    {item.format}
                  </span>
                </td>
                <td className="py-2 px-4 text-gray-700 max-w-xs truncate" title={item.painAddressed}>
                  {item.painAddressed}
                </td>
                <td className="py-2 px-4 text-gray-600 font-mono text-[11px] whitespace-nowrap">
                  {item.targetKeyword}
                </td>
                <td className="py-2 px-4 text-center whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
                    item.status === 'Idea' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/content/compose?id=${item.id}`)}
                      className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded flex items-center gap-1"
                    >
                      <PenTool className="w-3 h-3" />
                      <span>Draft</span>
                    </button>
                    <button
                      onClick={() => navigate(`/content/compose?id=${item.id}`)}
                      className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
