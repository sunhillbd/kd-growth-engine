import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { 
  Check, ArrowRight, ArrowLeft, Globe, CheckCircle2, 
  Trash2, Plus, Edit2, ShieldAlert, Sparkles, AlertTriangle, Key, ExternalLink
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const OnboardingPage: React.FC = () => {
  const { 
    onboardingStep, setOnboardingStep, 
    onboardingData, updateOnboardingData, 
    finishOnboarding, currentUser 
  } = useStore();
  const navigate = useNavigate();

  // Local form mirrors
  const [formData, setFormData] = useState(onboardingData);
  const currentStep = onboardingStep;

  // Step 1: Scanning website simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0 to 4
  const scanStages = [
    'Fetching pages from sitemap and root...',
    'Finding core services and packages...',
    'Extracting quantitative case studies...',
    'Drafting studio profile, offers, and ICPs...'
  ];

  // Modals for editing/adding in Step 2 & 3
  const [editOfferIndex, setEditOfferIndex] = useState<number | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({ name: '', promise: '', priceRange: '' });

  const [editIcpIndex, setEditIcpIndex] = useState<number | null>(null);
  const [icpModalOpen, setIcpModalOpen] = useState(false);
  const [icpForm, setIcpForm] = useState({ name: '', whoTheyAre: '', rolesToContact: '', buyingTriggers: '' });

  const [caseStudyModalOpen, setCaseStudyModalOpen] = useState(false);
  const [caseStudyForm, setCaseStudyForm] = useState({ title: '', clientType: '', result: '', canNameClient: true });

  // OAuth connect modal
  const [connectingTool, setConnectingTool] = useState<string | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');

  // AI Test key state
  const [testingAiKey, setTestingAiKey] = useState(false);
  const [aiKeyStatus, setAiKeyStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // Sync formData back to store when state changes
  const saveCurrentData = (updated: typeof formData) => {
    setFormData(updated);
    updateOnboardingData(updated);
  };

  // Step 1: Website Scanner Simulation (4 seconds)
  useEffect(() => {
    let timer: any;
    if (isScanning && scanStep < 4) {
      timer = setTimeout(() => {
        setScanStep(prev => prev + 1);
      }, 1000);
    } else if (isScanning && scanStep >= 4) {
      setIsScanning(false);
      setScanStep(0);
      setOnboardingStep(2);
    }
    return () => clearTimeout(timer);
  }, [isScanning, scanStep]);

  const handleStartScan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanStep(0);
  };

  const handleCancelScan = () => {
    setIsScanning(false);
    setScanStep(0);
  };

  // Navigation handlers
  const handleNextStep = () => {
    const next = Math.min(currentStep + 1, 5);
    setOnboardingStep(next);
  };

  const handlePrevStep = () => {
    const prev = Math.max(currentStep - 1, 1);
    setOnboardingStep(prev);
  };

  const handleFinish = () => {
    finishOnboarding(formData);
    navigate('/overview');
  };

  // Check connection requirement for step 4
  const hasOutreachOrDestination = 
    formData.connectedTools.outreach || 
    formData.connectedTools.linkedin_personal || 
    formData.connectedTools.facebook || 
    formData.connectedTools.x || 
    formData.connectedTools.website;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-gray-900 text-white font-semibold text-xs flex items-center justify-center">
            KD
          </div>
          <span className="text-xs font-semibold text-gray-900">
            Kinetik Growth Engine Setup
          </span>
        </div>

        {/* Stepper Progress */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700">
            Step {currentStep} of 5
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            {[1, 2, 3, 4, 5].map(step => (
              <div
                key={step}
                className={`w-5 h-1.5 rounded-full transition-colors ${
                  step === currentStep
                    ? 'bg-blue-600'
                    : step < currentStep
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 py-8">
        {/* STEP 1: YOUR BUSINESS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Your business</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Tell us about your studio so the research agent can locate buying intent signals and match your services.
              </p>
            </div>

            {!isScanning ? (
              <form onSubmit={handleStartScan} className="bg-white border border-gray-200 rounded-[6px] p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.business.companyName}
                    onChange={e => {
                      const updated = {
                        ...formData,
                        business: { ...formData.business, companyName: e.target.value }
                      };
                      saveCurrentData(updated);
                    }}
                    placeholder="Kinetik Dynamics"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                    <input
                      type="url"
                      required
                      value={formData.business.websiteUrl}
                      onChange={e => {
                        const updated = {
                          ...formData,
                          business: { ...formData.business, websiteUrl: e.target.value }
                        };
                        saveCurrentData(updated);
                      }}
                      placeholder="https://kinetikdynamics.com"
                      className="w-full text-xs pl-8 pr-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    The agent will scan public pages to draft your packages, deliverables, and case studies automatically.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Short Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.business.description}
                    onChange={e => {
                      const updated = {
                        ...formData,
                        business: { ...formData.business, description: e.target.value }
                      };
                      saveCurrentData(updated);
                    }}
                    placeholder="Boutique software engineering studio building web/app MVPs and AI automation sprints."
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Primary Target Markets (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['US', 'UK', 'EU', 'Other'].map(market => {
                      const selected = formData.business.primaryMarkets.includes(market);
                      return (
                        <button
                          key={market}
                          type="button"
                          onClick={() => {
                            const current = formData.business.primaryMarkets;
                            const next = selected 
                              ? current.filter(m => m !== market)
                              : [...current, market];
                            const updated = {
                              ...formData,
                              business: { ...formData.business, primaryMarkets: next }
                            };
                            saveCurrentData(updated);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-[6px] border transition-colors flex items-center gap-1.5 ${
                            selected
                              ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 stroke-[2.5]" />}
                          <span>{market}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="text-xs font-medium py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors flex items-center gap-1.5"
                  >
                    <span>Scan website & continue</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            ) : (
              /* Reading website progress list (4s) */
              <div className="bg-white border border-gray-200 rounded-[6px] p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Reading your website ({formData.business.websiteUrl})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Please wait while our crawler analyzes your services, case studies, and positioning.
                  </p>
                </div>

                <div className="space-y-3">
                  {scanStages.map((stage, idx) => {
                    const isDone = scanStep > idx;
                    const isCurrent = scanStep === idx;

                    return (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        {isDone ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300 shrink-0" />
                        )}
                        <span className={isDone ? 'text-gray-800 font-medium' : isCurrent ? 'text-blue-700 font-medium' : 'text-gray-400'}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleCancelScan}
                    className="text-xs text-rose-600 hover:text-rose-800"
                  >
                    Cancel
                  </button>
                  <span className="text-[11px] font-mono text-gray-400">
                    Step {Math.min(scanStep + 1, 4)} / 4
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: OFFERS AND IDEAL CLIENTS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Offers and ideal clients</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review the packages and ICPs drafted by the research agent from your website.
                </p>
              </div>
              <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                Drafted by agent
              </span>
            </div>

            {/* Offers Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Core Offers ({formData.offers.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setOfferForm({ name: '', promise: '', priceRange: '' });
                    setEditOfferIndex(null);
                    setOfferModalOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Add another offer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {formData.offers.map((offer, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-[6px] p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900">{offer.name}</span>
                        <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {offer.priceRange}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{offer.promise}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setOfferForm(offer);
                          setEditOfferIndex(idx);
                          setOfferModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded"
                        title="Edit offer"
                      >
                        <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...formData,
                            offers: formData.offers.filter((_, i) => i !== idx)
                          };
                          saveCurrentData(updated);
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded"
                        title="Remove offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ICPs Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Ideal Client Profiles ({formData.icps.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIcpForm({ name: '', whoTheyAre: '', rolesToContact: '', buyingTriggers: '' });
                    setEditIcpIndex(null);
                    setIcpModalOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Add another ICP</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {formData.icps.map((icp, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-[6px] p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{icp.name}</span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          Target: {icp.rolesToContact}
                        </span>
                      </div>
                      <p className="text-gray-600">{icp.whoTheyAre}</p>
                      <div className="text-[11px] text-gray-500">
                        <span className="font-medium text-gray-700">Triggers: </span>
                        {icp.buyingTriggers}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIcpForm(icp);
                          setEditIcpIndex(idx);
                          setIcpModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded"
                        title="Edit ICP"
                      >
                        <Edit2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...formData,
                            icps: formData.icps.filter((_, i) => i !== idx)
                          };
                          saveCurrentData(updated);
                        }}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded"
                        title="Remove ICP"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation notice */}
            {(formData.offers.length === 0 || formData.icps.length === 0) && (
              <p className="text-xs text-rose-600">
                At least 1 offer and 1 ICP are required to continue.
              </p>
            )}
          </div>
        )}

        {/* STEP 3: PROOF AND VOICE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Proof and voice</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Add case studies for outreach claims and configure tone guidelines for drafts.
              </p>
            </div>

            {/* Case Studies */}
            <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Case Studies ({formData.caseStudies.length})
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Paste past project wins so messages cite verifiable results.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCaseStudyForm({ title: '', clientType: '', result: '', canNameClient: true });
                    setCaseStudyModalOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Add case study</span>
                </button>
              </div>

              {formData.caseStudies.length === 0 ? (
                <div className="p-6 border border-dashed border-gray-200 rounded-[6px] text-center text-xs text-gray-500">
                  <p>No case studies added yet.</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    You can add them now or skip and populate from the Brain later.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.caseStudies.map((cs, idx) => (
                    <div key={idx} className="p-3 border border-gray-100 rounded-[6px] bg-gray-50 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{cs.title}</span>
                          <span className="text-[11px] text-gray-500 font-mono">({cs.clientType})</span>
                          <span className={`text-[10px] px-1 py-0.2 rounded ${cs.canNameClient ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                            {cs.canNameClient ? 'Named' : 'Anonymous'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px]">{cs.result}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...formData,
                            caseStudies: formData.caseStudies.filter((_, i) => i !== idx)
                          };
                          saveCurrentData(updated);
                        }}
                        className="text-gray-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Voice & Tone */}
            <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Tone & Voice Rules
                </h3>
                <p className="text-[11px] text-gray-500">
                  Sample copy and rules the drafting agent must respect across LinkedIn, X, and cold emails.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Sample Post or Email Excerpt
                </label>
                <textarea
                  rows={3}
                  value={formData.voice.sampleText}
                  onChange={e => {
                    const updated = {
                      ...formData,
                      voice: { ...formData.voice, sampleText: e.target.value }
                    };
                    saveCurrentData(updated);
                  }}
                  placeholder="Paste 2 to 3 sample posts or emails that represent your desired voice..."
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tone Principles (Check all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'direct', label: 'Direct & Pragmatic' },
                    { key: 'friendly', label: 'Friendly & Approachable' },
                    { key: 'technical', label: 'Technical & Engineering' },
                    { key: 'concise', label: 'Concise (No fluff)' }
                  ].map(rule => {
                    const checked = formData.voice.toneRules.includes(rule.key);
                    return (
                      <label
                        key={rule.key}
                        className={`text-xs p-2.5 rounded-[6px] border cursor-pointer flex items-center gap-2 select-none ${
                          checked
                            ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const current = formData.voice.toneRules;
                            const next = checked
                              ? current.filter(k => k !== rule.key)
                              : [...current, rule.key];
                            const updated = {
                              ...formData,
                              voice: { ...formData.voice, toneRules: next }
                            };
                            saveCurrentData(updated);
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 border-gray-300"
                        />
                        <span>{rule.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CONNECT YOUR TOOLS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Connect your tools</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Connect your outreach sender or at least one publishing destination to enable dispatching.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-[6px] divide-y divide-gray-100 overflow-hidden">
              {[
                { key: 'outreach', name: 'Outreach App (Instantly / Smartlead)', note: 'Required to dispatch approved leads' },
                { key: 'clearsearch', name: 'ClearSearch Intent Scraper', note: 'Monitors hiring and tech stack signals' },
                { key: 'linkedin_personal', name: 'LinkedIn (Personal profile)', note: 'Publishing destination (Alex Mercer)' },
                { key: 'linkedin_company', name: 'LinkedIn (Company page)', note: 'Needs LinkedIn review', disabled: true },
                { key: 'facebook', name: 'Facebook Page (Kinetik Dynamics)', note: 'Publishing destination' },
                { key: 'x', name: 'X (@kinetikdynamics)', note: 'Publishing destination' },
                { key: 'website', name: 'Website Publishing (CMS Webhook)', note: 'Publishes articles and live case studies' },
                { key: 'contact_data', name: 'Contact Data Provider (Hunter / Apollo)', note: 'Enriches lead work emails' },
                { 
                  key: 'apify', 
                  name: 'Apify Web Scrapers', 
                  note: 'Third-party scrapers may breach terms of service or trigger IP bans',
                  riskWarning: true 
                }
              ].map(tool => {
                const isConnected = !!formData.connectedTools[tool.key];

                return (
                  <div key={tool.key} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{tool.name}</span>
                        {tool.riskWarning && (
                          <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                            Risk note
                          </span>
                        )}
                        {tool.disabled && (
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded">
                            Pending review
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] ${tool.riskWarning ? 'text-amber-700' : 'text-gray-500'}`}>
                        {tool.note}
                      </p>
                    </div>

                    <div>
                      {tool.disabled ? (
                        <span className="text-[11px] text-gray-400 font-mono">Disabled</span>
                      ) : isConnected ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-[4px] border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Connected
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = {
                                ...formData,
                                connectedTools: { ...formData.connectedTools, [tool.key]: false }
                              };
                              saveCurrentData(updated);
                            }}
                            className="text-gray-400 hover:text-rose-600 text-[11px]"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setConnectingTool(tool.key);
                            setApiKeyInput('');
                          }}
                          className="text-xs font-medium py-1 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-[6px] transition-colors"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!hasOutreachOrDestination && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-[6px] text-xs text-amber-800">
                <p className="font-medium">Note on tool dependencies:</p>
                <p className="mt-0.5 text-amber-700">
                  Without an outreach app or at least one publishing destination connected, newly approved leads and content cannot be dispatched automatically.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: RULES AND LIMITS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Rules and limits</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Set human approval boundaries, daily throughput safety caps, and optional AI model credentials.
              </p>
            </div>

            {/* Approval Mode */}
            <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Approval Mode
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  className={`p-3 border rounded-[6px] cursor-pointer flex flex-col justify-between ${
                    formData.rules.approvalMode === 'manual'
                      ? 'border-blue-600 bg-blue-50/40 text-gray-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="approvalMode"
                      checked={formData.rules.approvalMode === 'manual'}
                      onChange={() => {
                        const updated = {
                          ...formData,
                          rules: { ...formData.rules, approvalMode: 'manual' as const }
                        };
                        saveCurrentData(updated);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold">Manual (Recommended)</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 pl-5">
                    A human must review and click Approve on every drafted lead and scheduled post.
                  </p>
                </label>

                <label
                  className={`p-3 border rounded-[6px] cursor-pointer flex flex-col justify-between ${
                    formData.rules.approvalMode === 'auto'
                      ? 'border-blue-600 bg-blue-50/40 text-gray-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="approvalMode"
                      checked={formData.rules.approvalMode === 'auto'}
                      onChange={() => {
                        const updated = {
                          ...formData,
                          rules: { ...formData.rules, approvalMode: 'auto' as const }
                        };
                        saveCurrentData(updated);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold">Auto with Daily Cap</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 pl-5">
                    High-scoring leads (85+) and scheduled posts publish automatically up to daily cap.
                  </p>
                </label>
              </div>
            </div>

            {/* Daily Safety Limits */}
            <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Daily Throughput Caps
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Daily Leads Drafted
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={formData.rules.dailyLeadLimit}
                    onChange={e => {
                      const updated = {
                        ...formData,
                        rules: { ...formData.rules, dailyLeadLimit: parseInt(e.target.value, 10) || 25 }
                      };
                      saveCurrentData(updated);
                    }}
                    className="w-full font-mono text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Max leads agent queues/day</span>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Daily Posts Scheduled
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={formData.rules.dailyPostLimit}
                    onChange={e => {
                      const updated = {
                        ...formData,
                        rules: { ...formData.rules, dailyPostLimit: parseInt(e.target.value, 10) || 3 }
                      };
                      saveCurrentData(updated);
                    }}
                    className="w-full font-mono text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Across all social destinations</span>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Monthly Spend Cap ($)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={2000}
                    value={formData.rules.monthlySpendCap}
                    onChange={e => {
                      const updated = {
                        ...formData,
                        rules: { ...formData.rules, monthlySpendCap: parseInt(e.target.value, 10) || 300 }
                      };
                      saveCurrentData(updated);
                    }}
                    className="w-full font-mono text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Hard limit for paid APIs</span>
                </div>
              </div>
            </div>

            {/* AI Provider Setup */}
            <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    AI Provider Setup
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    No key means AI features are off. You can skip and provide later in Settings.
                  </p>
                </div>
                {aiKeyStatus === 'valid' && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    Key verified
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Text Provider
                  </label>
                  <select
                    value={formData.rules.aiProvider}
                    onChange={e => {
                      const updated = {
                        ...formData,
                        rules: { ...formData.rules, aiProvider: e.target.value }
                      };
                      saveCurrentData(updated);
                    }}
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Anthropic (Claude 3.5 Sonnet)">Anthropic (Claude 3.5 Sonnet)</option>
                    <option value="OpenAI (GPT-4o)">OpenAI (GPT-4o)</option>
                    <option value="Google (Gemini 1.5 Pro)">Google (Gemini 1.5 Pro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">
                    Model Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.rules.aiModel}
                    onChange={e => {
                      const updated = {
                        ...formData,
                        rules: { ...formData.rules, aiModel: e.target.value }
                      };
                      saveCurrentData(updated);
                    }}
                    className="w-full font-mono text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={formData.rules.aiApiKey}
                    onChange={e => {
                      const updated = {
                        ...formData,
                        rules: { ...formData.rules, aiApiKey: e.target.value }
                      };
                      saveCurrentData(updated);
                      setAiKeyStatus('idle');
                    }}
                    placeholder="sk-ant-..."
                    className="flex-1 font-mono text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setTestingAiKey(true);
                      setTimeout(() => {
                        setTestingAiKey(false);
                        setAiKeyStatus(formData.rules.aiApiKey.length > 5 ? 'valid' : 'invalid');
                      }, 700);
                    }}
                    disabled={testingAiKey || !formData.rules.aiApiKey}
                    className="text-xs font-medium px-3 py-2 border border-gray-200 rounded-[6px] bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50"
                  >
                    {testingAiKey ? 'Testing...' : 'Test key'}
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Summary */}
            <div className="p-4 bg-gray-100 border border-gray-200 rounded-[6px] text-xs text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">What happens next:</p>
              <p>
                Your studio profile will be initialized with {formData.offers.length} offers and {formData.icps.length} ICPs. 
                Collectors will begin scanning intent signals based on your keywords. All outbound drafts will require your manual approval.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation Bar */}
      <footer className="h-16 border-t border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="text-xs font-medium py-2 px-3.5 border border-gray-200 rounded-[6px] bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Back</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Skip for now link on optional steps 3 & 4 */}
          {(currentStep === 3 || (currentStep === 4 && !hasOutreachOrDestination)) && (
            <button
              type="button"
              onClick={handleNextStep}
              className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              Skip for now
            </button>
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={
                (currentStep === 2 && (formData.offers.length === 0 || formData.icps.length === 0)) ||
                isScanning
              }
              className="text-xs font-medium py-2 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-[6px] transition-colors flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs font-semibold py-2 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-[6px] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Finish setup</span>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </footer>

      {/* Offer Modal */}
      <Modal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title={editOfferIndex !== null ? 'Edit Offer' : 'Add Offer'}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Package Name</label>
            <input
              type="text"
              value={offerForm.name}
              onChange={e => setOfferForm({ ...offerForm, name: e.target.value })}
              placeholder="e.g. AI Automation Sprint"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">One-line Promise</label>
            <input
              type="text"
              value={offerForm.promise}
              onChange={e => setOfferForm({ ...offerForm, promise: e.target.value })}
              placeholder="Automate high-friction back-office operations in 2 weeks..."
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Price Range</label>
            <input
              type="text"
              value={offerForm.priceRange}
              onChange={e => setOfferForm({ ...offerForm, priceRange: e.target.value })}
              placeholder="$12,000 - $18,000"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOfferModalOpen(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-[6px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!offerForm.name) return;
                const nextOffers = [...formData.offers];
                if (editOfferIndex !== null) {
                  nextOffers[editOfferIndex] = offerForm;
                } else {
                  nextOffers.push(offerForm);
                }
                const updated = { ...formData, offers: nextOffers };
                saveCurrentData(updated);
                setOfferModalOpen(false);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-[6px] font-medium"
            >
              Save offer
            </button>
          </div>
        </div>
      </Modal>

      {/* ICP Modal */}
      <Modal
        isOpen={icpModalOpen}
        onClose={() => setIcpModalOpen(false)}
        title={editIcpIndex !== null ? 'Edit ICP' : 'Add Ideal Client Profile'}
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Profile Name</label>
            <input
              type="text"
              value={icpForm.name}
              onChange={e => setIcpForm({ ...icpForm, name: e.target.value })}
              placeholder="e.g. Seed-Stage B2B SaaS Founders"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Who they are</label>
            <textarea
              rows={2}
              value={icpForm.whoTheyAre}
              onChange={e => setIcpForm({ ...icpForm, whoTheyAre: e.target.value })}
              placeholder="Funded SaaS startups ($500k-$2M seed) without in-house CTO..."
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Roles to contact</label>
            <input
              type="text"
              value={icpForm.rolesToContact}
              onChange={e => setIcpForm({ ...icpForm, rolesToContact: e.target.value })}
              placeholder="Founder, Co-Founder, CEO, Head of Product"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Buying triggers</label>
            <input
              type="text"
              value={icpForm.buyingTriggers}
              onChange={e => setIcpForm({ ...icpForm, buyingTriggers: e.target.value })}
              placeholder="Announced funding, hiring first engineer on LinkedIn..."
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIcpModalOpen(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-[6px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!icpForm.name) return;
                const nextIcps = [...formData.icps];
                if (editIcpIndex !== null) {
                  nextIcps[editIcpIndex] = icpForm;
                } else {
                  nextIcps.push(icpForm);
                }
                const updated = { ...formData, icps: nextIcps };
                saveCurrentData(updated);
                setIcpModalOpen(false);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-[6px] font-medium"
            >
              Save ICP
            </button>
          </div>
        </div>
      </Modal>

      {/* Case Study Modal */}
      <Modal
        isOpen={caseStudyModalOpen}
        onClose={() => setCaseStudyModalOpen(false)}
        title="Add Case Study"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Case Study Title</label>
            <input
              type="text"
              value={caseStudyForm.title}
              onChange={e => setCaseStudyForm({ ...caseStudyForm, title: e.target.value })}
              placeholder="e.g. PayLedger Multi-Tenant Billing Portal"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Client Type / Stage</label>
            <input
              type="text"
              value={caseStudyForm.clientType}
              onChange={e => setCaseStudyForm({ ...caseStudyForm, clientType: e.target.value })}
              placeholder="e.g. Seed Fintech ($1.2M seed)"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Quantitative Result</label>
            <input
              type="text"
              value={caseStudyForm.result}
              onChange={e => setCaseStudyForm({ ...caseStudyForm, result: e.target.value })}
              placeholder="e.g. Shipped billing portal in 5 weeks; onboarded first 40 paying tenants"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseStudyForm.canNameClient}
                onChange={e => setCaseStudyForm({ ...caseStudyForm, canNameClient: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span className="text-gray-700 font-medium">Can name client publicly in outreach and posts</span>
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCaseStudyModalOpen(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-[6px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (!caseStudyForm.title) return;
                const updated = {
                  ...formData,
                  caseStudies: [...formData.caseStudies, caseStudyForm]
                };
                saveCurrentData(updated);
                setCaseStudyModalOpen(false);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-[6px] font-medium"
            >
              Add Case Study
            </button>
          </div>
        </div>
      </Modal>

      {/* OAuth Mock Connect Modal */}
      <Modal
        isOpen={!!connectingTool}
        onClose={() => setConnectingTool(null)}
        title={`Connect ${connectingTool?.replace('_', ' ').toUpperCase()}`}
      >
        <div className="space-y-4 text-xs">
          <p className="text-gray-600">
            Authorizing access for Kinetik Growth Engine. Enter an API key or authenticate via OAuth.
          </p>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              API Token or Webhook URL
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="live_key_..."
              className="w-full font-mono text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setConnectingTool(null)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-[6px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (connectingTool) {
                  const updated = {
                    ...formData,
                    connectedTools: { ...formData.connectedTools, [connectingTool]: true }
                  };
                  saveCurrentData(updated);
                }
                setConnectingTool(null);
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] font-medium"
            >
              Authorize & Connect
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
