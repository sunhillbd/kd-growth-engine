import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const IcpsPage: React.FC = () => {
  const { icps, offers } = useStore();
  const navigate = useNavigate();

  const getOfferName = (offerId: string) => {
    return offers.find(o => o.id === offerId)?.name || offerId;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Ideal Client Profiles (ICPs)</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Profiles configured to scan for buying triggers, pains, and objections in online feeds.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
              <th className="py-2.5 px-4 font-normal">ICP Name</th>
              <th className="py-2.5 px-4 font-normal">Aligned Offer</th>
              <th className="py-2.5 px-4 font-normal">Target Countries</th>
              <th className="py-2.5 px-4 font-normal">Target Roles</th>
              <th className="py-2.5 px-4 font-normal text-right">Leads</th>
              <th className="py-2.5 px-4 font-normal text-right">Reply Rate</th>
              <th className="py-2.5 px-4 font-normal text-right">Calls</th>
              <th className="py-2.5 px-4 font-normal text-right">Wins</th>
              <th className="py-2.5 px-4 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {icps.map(icp => (
              <tr
                key={icp.id}
                onClick={() => navigate(`/brain/icps/${icp.id}`)}
                className="hover:bg-gray-50 transition-colors cursor-pointer h-12"
              >
                <td className="py-2 px-4 font-semibold text-gray-900">
                  {icp.name}
                </td>
                <td className="py-2 px-4 text-gray-600">
                  <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-100">
                    {getOfferName(icp.offerId)}
                  </span>
                </td>
                <td className="py-2 px-4 text-gray-600 font-mono text-[11px]">
                  {icp.countries.slice(0, 2).join(', ')}{icp.countries.length > 2 ? ` +${icp.countries.length - 2}` : ''}
                </td>
                <td className="py-2 px-4 text-gray-600 text-xs">
                  {icp.roles.slice(0, 2).join(', ')}
                </td>
                <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                  {icp.leadsCount}
                </td>
                <td className="py-2 px-4 text-right font-mono tabular-nums font-semibold text-gray-900">
                  {icp.replyRate}%
                </td>
                <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                  {icp.callsCount}
                </td>
                <td className="py-2 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">
                  {icp.winsCount}
                </td>
                <td className="py-2 px-4 text-right">
                  <span className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-medium">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
