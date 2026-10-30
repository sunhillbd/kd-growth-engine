import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Plus, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const OffersPage: React.FC = () => {
  const { offers, addProof, showToast } = useStore();
  const navigate = useNavigate();
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [setupUrl, setSetupUrl] = useState('https://kinetikdynamics.com');
  const [setupVoice, setSetupVoice] = useState('Direct, pragmatic, engineering-led. No buzzwords, no hype.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartSetup = () => {
    setSetupStep(1);
    setSetupModalOpen(true);
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setSetupStep(2);
    }, 2000);
  };

  const handleFinishSetup = () => {
    setSetupModalOpen(false);
    showToast('Onboarding complete: Offer drafts synced to Brain');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Studio Offers</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Core service packages and positioning used by the agent to qualify leads and draft outreach.
          </p>
        </div>
        <button
          onClick={handleStartSetup}
          className="text-xs font-medium px-3 py-1.5 rounded-[6px] border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-gray-500" strokeWidth={1.5} />
          <span>First-Run Setup Flow</span>
        </button>
      </div>

      {/* Offers Table */}
      <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
              <th className="py-2.5 px-4 font-normal">Offer Name</th>
              <th className="py-2.5 px-4 font-normal">Target ICPs</th>
              <th className="py-2.5 px-4 font-normal">Price Range</th>
              <th className="py-2.5 px-4 font-normal">Delivery Timeline</th>
              <th className="py-2.5 px-4 font-normal text-right">Linked Proof</th>
              <th className="py-2.5 px-4 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {offers.map(offer => (
              <tr
                key={offer.id}
                onClick={() => navigate(`/brain/offers/${offer.id}`)}
                className="hover:bg-gray-50 transition-colors cursor-pointer h-12"
              >
                <td className="py-2 px-4 font-semibold text-gray-900">
                  {offer.name}
                </td>
                <td className="py-2 px-4 text-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {offer.targetIcps.map((icp, i) => (
                      <span key={i} className="text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                        {icp}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 font-mono tabular-nums text-gray-800">
                  {offer.priceRange}
                </td>
                <td className="py-2 px-4 text-gray-600 font-mono text-[12px]">
                  {offer.timeline}
                </td>
                <td className="py-2 px-4 text-right font-mono tabular-nums text-gray-800">
                  {offer.proofCount} case studies
                </td>
                <td className="py-2 px-4 text-right">
                  <span className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 font-medium">
                    Edit <ArrowRight className="w-3 h-3" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* First-Run Setup Flow Modal */}
      <Modal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        title="First-Run Setup Flow (3-Step Onboarding)"
        description="Extract studio positioning, service tiers, and tone of voice."
        maxWidth="lg"
      >
        <div className="space-y-5">
          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 font-mono">
              <span>Step {setupStep} of 3</span>
              <span>{setupStep === 1 ? 'Website & Sources' : setupStep === 2 ? 'Review Extracted Offers' : 'Voice & Guidelines'}</span>
            </div>
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-1 transition-all duration-300"
                style={{ width: `${(setupStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {setupStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Studio Website URL
                </label>
                <input
                  type="text"
                  value={setupUrl}
                  onChange={e => setSetupUrl(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
                  placeholder="https://yourstudio.com"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  The agent scans your public landing page, case studies, and services.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Target Geographies
                </label>
                <input
                  type="text"
                  disabled
                  defaultValue="United States, United Kingdom, European Union (B2B tech hubs)"
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-200 bg-gray-50 rounded-[6px] text-gray-600"
                />
              </div>

              {isAnalyzing ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-[6px] flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-700 font-mono">
                    Crawling site pages and extracting core value propositions...
                  </span>
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSetupModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-[6px] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRunAnalysis}
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-[6px] hover:bg-blue-700"
                  >
                    Analyze Website & Extract Offers
                  </button>
                </div>
              )}
            </div>
          )}

          {setupStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600">
                The agent identified 3 distinct studio offers. You can tweak names and pricing ranges here:
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                <div className="p-3 border border-gray-200 rounded-[6px] bg-gray-50 text-xs">
                  <div className="font-semibold text-gray-900">1. AI Automation Sprint</div>
                  <div className="text-gray-500 mt-0.5">$6,000 - $12,000 · 2 weeks delivery</div>
                  <div className="text-gray-600 mt-1">Deploy LLM pipelines into CRM/TMS with human-in-the-loop exception handling.</div>
                </div>

                <div className="p-3 border border-gray-200 rounded-[6px] bg-gray-50 text-xs">
                  <div className="font-semibold text-gray-900">2. MVP in 6 Weeks</div>
                  <div className="text-gray-500 mt-0.5">$18,000 - $35,000 · 6 weeks delivery</div>
                  <div className="text-gray-600 mt-1">Full-stack Next.js and Supabase apps with Stripe billing and audit logs.</div>
                </div>

                <div className="p-3 border border-gray-200 rounded-[6px] bg-gray-50 text-xs">
                  <div className="font-semibold text-gray-900">3. White-label Development</div>
                  <div className="text-gray-500 mt-0.5">$4,500 - $9,000 / month · Retainer</div>
                  <div className="text-gray-600 mt-1">Dedicated senior developer capacity embedded directly in design agencies.</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSetupStep(1)}
                  className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-[6px] hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setSetupStep(3)}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-[6px] hover:bg-blue-700"
                >
                  Confirm Offers & Set Tone
                </button>
              </div>
            </div>
          )}

          {setupStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Studio Voice & Tone Guidelines
                </label>
                <textarea
                  rows={3}
                  value={setupVoice}
                  onChange={e => setSetupVoice(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-[6px] outline-none focus:border-blue-600"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  The agent adheres to these voice rules across all drafted emails and social posts.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-[6px] text-xs text-blue-900">
                <span className="font-semibold">Ready to sync:</span> Confirmed offers and voice rules will populate the Brain and guide signal scoring.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSetupStep(2)}
                  className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-[6px] hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleFinishSetup}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-[6px] hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save to Brain</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
