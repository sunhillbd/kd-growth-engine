import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PlanNextWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: () => void;
}

export const PlanNextWeekModal: React.FC<PlanNextWeekModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated
}) => {
  const { planNextWeekContent, offers, showToast, writeAllDraftsFromIdeas } = useStore();

  const [linkedinCount, setLinkedinCount] = useState(3);
  const [websiteCount, setWebsiteCount] = useState(1);
  const [facebookCount, setFacebookCount] = useState(2);
  const [xCount, setXCount] = useState(3);
  const [focusOffer, setFocusOffer] = useState('mvp-6-weeks');
  const [useClearSearch, setUseClearSearch] = useState(true);

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSynthesizing(true);
    setProgressStep(1);

    const timer1 = setTimeout(() => setProgressStep(2), 1000);
    const timer2 = setTimeout(() => setProgressStep(3), 2000);

    try {
      await planNextWeekContent({
        linkedinCount,
        websiteCount,
        facebookCount,
        xCount,
        focusOffer,
        useClearSearch
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsSynthesizing(false);
      onClose();
      onPlanGenerated();

      showToast('7 ideas added', () => {
        writeAllDraftsFromIdeas();
      }, 7000);
    } catch {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-[6px] border border-gray-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Plan Next Week
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure posting targets and studio focus to generate content ideas.
            </p>
          </div>
          {!isSynthesizing && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {isSynthesizing ? (
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  progressStep > 1 ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-blue-600 text-white animate-pulse'
                }`}>
                  {progressStep > 1 ? <Check className="w-3 h-3" /> : '1'}
                </div>
                <span className={`text-xs ${progressStep >= 1 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  Analyzing recent conversion data and audience engagement...
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  progressStep > 2 ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : progressStep === 2 ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-100 text-gray-400'
                }`}>
                  {progressStep > 2 ? <Check className="w-3 h-3" /> : '2'}
                </div>
                <span className={`text-xs ${progressStep >= 2 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  Harvesting search intent keywords from ClearSearch...
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  progressStep === 3 ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-100 text-gray-400'
                }`}>
                  3
                </div>
                <span className={`text-xs ${progressStep === 3 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  Synthesizing 7 high-intent topic ideas and hook patterns...
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-4">
              <div
                className="bg-blue-600 h-full transition-all duration-700 ease-out"
                style={{ width: `${(progressStep / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="p-5 space-y-4">
            {/* Posts per destination */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Posts per destination (target for next week)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded border border-gray-200 bg-gray-50">
                  <span className="font-medium text-gray-800">LinkedIn · Personal</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLinkedinCount(Math.max(0, linkedinCount - 1))}
                      className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="font-mono tabular-nums font-semibold w-4 text-center">
                      {linkedinCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLinkedinCount(linkedinCount + 1)}
                      className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded border border-gray-200 bg-gray-50">
                  <span className="font-medium text-gray-800">Website article</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setWebsiteCount(Math.max(0, websiteCount - 1))}
                      className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="font-mono tabular-nums font-semibold w-4 text-center">
                      {websiteCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWebsiteCount(websiteCount + 1)}
                      className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded border border-gray-200 bg-gray-50">
                  <span className="font-medium text-gray-800">Facebook Page</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFacebookCount(Math.max(0, facebookCount - 1))}
                      className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="font-mono tabular-nums font-semibold w-4 text-center">
                      {facebookCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFacebookCount(facebookCount + 1)}
                      className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded border border-gray-200 bg-gray-50">
                  <span className="font-medium text-gray-800">X (Twitter)</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setXCount(Math.max(0, xCount - 1))}
                      className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="font-mono tabular-nums font-semibold w-4 text-center">
                      {xCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setXCount(xCount + 1)}
                      className="w-5 h-5 rounded border border-gray-300 bg-white text-gray-600 flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus offer */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Focus offer
              </label>
              <select
                value={focusOffer}
                onChange={e => setFocusOffer(e.target.value)}
                className="w-full text-xs rounded border border-gray-300 p-2 bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.priceRange})
                  </option>
                ))}
              </select>
            </div>

            {/* ClearSearch checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useClearSearch}
                  onChange={e => setUseClearSearch(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 font-medium">
                  Use latest keywords from ClearSearch
                </span>
              </label>
              <p className="text-[11px] text-gray-500 ml-5 mt-0.5">
                Pulls real-time search queries and intent clusters into topic hooks.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors shadow-xs"
              >
                Generate plan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
