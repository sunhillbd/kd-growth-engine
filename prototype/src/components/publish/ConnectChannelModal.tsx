import React, { useState } from 'react';
import { Channel, ChannelId, WeeklySlot } from '../../types';
import { X, Check, ArrowRight, ArrowLeft, AlertCircle, ExternalLink, Globe, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ConnectChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: (channel: Channel) => void;
  existingChannels: Channel[];
}

export const ConnectChannelModal: React.FC<ConnectChannelModalProps> = ({
  isOpen,
  onClose,
  onConnectSuccess,
  existingChannels
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlatform, setSelectedPlatform] = useState<'LinkedIn' | 'Facebook' | 'X' | 'Website' | null>(null);

  // Platform-specific inputs
  const [linkedinType, setLinkedinType] = useState<'personal' | 'company'>('personal');
  const [facebookPageSelected, setFacebookPageSelected] = useState<string>('Kinetik Dynamics Studio');
  const [xSpendCap, setXSpendCap] = useState<number>(150);
  const [websiteMethod, setWebsiteMethod] = useState<'WordPress' | 'Laravel route' | 'Webhook' | 'Other'>('Laravel route');
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://kinetikdynamics.com');
  const [websiteApiKey, setWebsiteApiKey] = useState<string>('kd_live_sec_993848201');
  const [websiteTestState, setWebsiteTestState] = useState<'idle' | 'testing' | 'success'>('idle');

  // Schedule setup step
  const [scheduleTimezone, setScheduleTimezone] = useState<string>('Asia/Dhaka');
  const [scheduleGoal, setScheduleGoal] = useState<'1x' | '3x' | '5x'>('3x');
  const [skipSchedule, setSkipSchedule] = useState<boolean>(false);

  const handleTestWebsiteConnection = () => {
    setWebsiteTestState('testing');
    setTimeout(() => {
      setWebsiteTestState('success');
    }, 1200);
  };

  const handleCompleteConnection = () => {
    let id: ChannelId = 'linkedin_personal';
    let name = 'LinkedIn · Personal profile';
    let handleOrSub = 'Alex Mercer';

    if (selectedPlatform === 'LinkedIn') {
      id = linkedinType === 'personal' ? 'linkedin_personal' : 'linkedin_company';
      name = linkedinType === 'personal' ? 'LinkedIn · Personal profile' : 'LinkedIn · Company page';
      handleOrSub = linkedinType === 'personal' ? 'Alex Mercer' : 'Kinetik Dynamics';
    } else if (selectedPlatform === 'Facebook') {
      id = 'facebook_page';
      name = 'Facebook · Page';
      handleOrSub = facebookPageSelected;
    } else if (selectedPlatform === 'X') {
      id = 'x_profile';
      name = 'X · account';
      handleOrSub = '@kinetikdynamics';
    } else if (selectedPlatform === 'Website') {
      id = 'website_blog';
      name = 'Website · kinetikdynamics.com';
      handleOrSub = 'kinetikdynamics.com/blog';
    }

    const defaultSlots: WeeklySlot[] = skipSchedule ? [] : [
      { id: `slot-${Date.now()}-1`, dayOfWeek: 'Tue', time: '18:30', audienceTime: '8:30 AM NY' },
      { id: `slot-${Date.now()}-2`, dayOfWeek: 'Thu', time: '18:30', audienceTime: '8:30 AM NY' }
    ];

    const newChannel: Channel = {
      id,
      platform: selectedPlatform!,
      name,
      handleOrSub,
      status: 'connected',
      isPaused: false,
      timezone: scheduleTimezone,
      postingGoal: scheduleGoal,
      slots: defaultSlots,
      connectionType: selectedPlatform === 'Website' ? websiteMethod : undefined,
      spendCapMonthly: selectedPlatform === 'X' ? xSpendCap : undefined
    };

    onConnectSuccess(newChannel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header & Stepper */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-semibold">
              Step {step} of 4 · Channel Connection
            </span>
            <h2 className="text-sm font-semibold text-gray-900 mt-0.5">
              {step === 1 && 'Choose a Platform'}
              {step === 2 && `Configure ${selectedPlatform} Connection`}
              {step === 3 && 'Confirm Connection'}
              {step === 4 && 'Set Up Posting Schedule'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="h-1 bg-gray-100 flex">
          <div className={`h-full bg-blue-600 transition-all ${
            step === 1 ? 'w-1/4' : step === 2 ? 'w-2/4' : step === 3 ? 'w-3/4' : 'w-full'
          }`} />
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-gray-700">
          {/* STEP 1: CHOOSE PLATFORM */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-500">
                Connect your business profiles to enable scheduled publishing directly into their queues.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* LinkedIn */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('LinkedIn');
                    setStep(2);
                  }}
                  className="p-4 border rounded-lg text-left hover:border-blue-500 hover:shadow-xs transition-all flex items-start gap-3 border-gray-200 bg-white"
                >
                  <div className="w-8 h-8 rounded bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    in
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xs">LinkedIn</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Profile or Company page</p>
                  </div>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('Facebook');
                    setStep(2);
                  }}
                  className="p-4 border rounded-lg text-left hover:border-blue-500 hover:shadow-xs transition-all flex items-start gap-3 border-gray-200 bg-white"
                >
                  <div className="w-8 h-8 rounded bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    f
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xs">Facebook</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Business Page</p>
                  </div>
                </button>

                {/* X */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('X');
                    setStep(2);
                  }}
                  className="p-4 border rounded-lg text-left hover:border-blue-500 hover:shadow-xs transition-all flex items-start gap-3 border-gray-200 bg-white"
                >
                  <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                    𝕏
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xs">X (Twitter)</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Account & thread queues</p>
                  </div>
                </button>

                {/* Website */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('Website');
                    setStep(2);
                  }}
                  className="p-4 border rounded-lg text-left hover:border-blue-500 hover:shadow-xs transition-all flex items-start gap-3 border-gray-200 bg-white"
                >
                  <div className="w-8 h-8 rounded bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    KD
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xs">Website</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">CMS webhook or API route</p>
                  </div>
                </button>

                {/* Instagram (Later - disabled) */}
                <div className="p-4 border border-dashed rounded-lg text-left border-gray-200 bg-gray-50/50 opacity-60 flex items-start gap-3 cursor-not-allowed">
                  <div className="w-8 h-8 rounded bg-gray-400 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    IG
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-gray-700 text-xs">Instagram</h3>
                      <span className="text-[10px] bg-gray-200 text-gray-600 px-1 rounded font-mono">Later</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Coming in Q1 2027</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PLATFORM CONFIGURATION */}
          {step === 2 && (
            <div className="space-y-4">
              {/* LinkedIn Step */}
              {selectedPlatform === 'LinkedIn' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">
                    Choose which LinkedIn destination you want to connect to Kinetik Growth Engine:
                  </p>

                  <div className="space-y-2">
                    <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      linkedinType === 'personal' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="li_type"
                        checked={linkedinType === 'personal'}
                        onChange={() => setLinkedinType('personal')}
                        className="mt-0.5 text-blue-600"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 text-xs">Personal profile</div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Post as Alex Mercer (Founder). Full support for text, carousels, and open queue slots.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3 border rounded-lg border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed">
                      <input
                        type="radio"
                        name="li_type"
                        disabled
                        checked={false}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-700 text-xs">Company page (Kinetik Dynamics)</span>
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-medium">Pending Review</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Needs LinkedIn review. You can connect once approved by LinkedIn Developer portal.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Facebook Step */}
              {selectedPlatform === 'Facebook' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-950">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Authenticated via Facebook OAuth (Alex Mercer)</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Active</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-2">
                      Select Facebook Pages to connect:
                    </label>
                    <div className="space-y-2">
                      {['Kinetik Dynamics Studio', 'Kinetik Labs'].map(page => (
                        <label key={page} className="flex items-center gap-2.5 p-2.5 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="fb_page"
                            checked={facebookPageSelected === page}
                            onChange={() => setFacebookPageSelected(page)}
                            className="text-blue-600"
                          />
                          <span className="text-xs font-medium text-gray-900">{page}</span>
                          <span className="text-[11px] text-gray-400 ml-auto font-mono">1.2k followers</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* X Step */}
              {selectedPlatform === 'X' && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-xs text-gray-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Signed in as @kinetikdynamics</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">API v2 Verified</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                    <span className="font-semibold block mb-0.5">X API usage pricing:</span>
                    X charges per post; links cost more against monthly quota allowances. Set a spend cap to avoid surprise billing.
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                      Monthly Spend Cap (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        value={xSpendCap}
                        onChange={e => setXSpendCap(Number(e.target.value))}
                        className="w-full text-xs border border-gray-300 rounded pl-7 pr-3 py-1.5 font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">Default cap: $150/mo. Posts pause automatically if exceeded.</span>
                  </div>
                </div>
              )}

              {/* Website Step */}
              {selectedPlatform === 'Website' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-900 mb-1">Publishing Method</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['WordPress', 'Laravel route', 'Webhook', 'Other'] as const).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setWebsiteMethod(m)}
                          className={`py-1.5 px-2 rounded border text-xs font-medium text-center ${
                            websiteMethod === m ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-900 mb-1">Site URL</label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-900 mb-1">Secret Key / API Token</label>
                    <input
                      type="password"
                      value={websiteApiKey}
                      onChange={e => setWebsiteApiKey(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-3 py-1.5 font-mono"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleTestWebsiteConnection}
                      disabled={websiteTestState === 'testing'}
                      className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded text-xs font-medium flex items-center gap-1.5"
                    >
                      {websiteTestState === 'testing' && <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />}
                      <span>Test connection</span>
                    </button>

                    {websiteTestState === 'success' && (
                      <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Published a test draft successfully to {websiteUrl}/api/v1/posts</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === 3 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Ready to link {selectedPlatform}?
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Clicking confirm will register this channel inside Kinetik Growth Engine and initialize queue slots.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left max-w-sm mx-auto text-xs space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Platform:</span> <span className="font-semibold text-gray-900">{selectedPlatform}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Destination:</span> <span className="font-medium text-gray-900">{selectedPlatform === 'LinkedIn' ? linkedinType : selectedPlatform === 'Facebook' ? facebookPageSelected : selectedPlatform === 'X' ? '@kinetikdynamics' : websiteUrl}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status:</span> <span className="text-emerald-600 font-semibold">Verified</span></div>
              </div>
            </div>
          )}

          {/* STEP 4: SET UP POSTING SCHEDULE */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600">
                Configure default repeating weekly slots for this channel's queue:
              </p>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">Schedule Timezone</label>
                <select
                  value={scheduleTimezone}
                  onChange={e => setScheduleTimezone(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-900"
                >
                  <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-900 mb-1">Posting Goal</label>
                <div className="flex gap-2">
                  {(['1x', '3x', '5x'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setScheduleGoal(g)}
                      className={`flex-1 py-1.5 rounded border text-xs font-medium ${
                        scheduleGoal === g ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white'
                      }`}
                    >
                      {g} / week
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                <span className="font-semibold text-gray-800 block">Suggested default weekly slots:</span>
                <span className="text-gray-600 block">· Tuesdays at 18:30 (8:30 AM NY)</span>
                <span className="text-gray-600 block">· Thursdays at 18:30 (8:30 AM NY)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step === 4 && (
              <button
                type="button"
                onClick={() => {
                  setSkipSchedule(true);
                  handleCompleteConnection();
                }}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Skip for now
              </button>
            )}

            {step < 3 && (
              <button
                type="button"
                disabled={!selectedPlatform}
                onClick={() => setStep((step + 1) as any)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
              >
                Add to Kinetik Growth Engine
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleCompleteConnection}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
