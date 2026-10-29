import React, { useState } from 'react';
import { initialConnections, complianceRulesByRegion } from '../../mock/connections';
import { POSTING_WINDOWS } from '../../mock/destinations';
import { useStore } from '../../context/StoreContext';
import { Modal } from '../../components/common/Modal';
import { TeamTab } from './TeamTab';
import { 
  CheckCircle2, AlertTriangle, Clock, RefreshCw, 
  Key, Shield, Sliders, Bell, Plus, Trash2, Copy, Check, RotateCw, ExternalLink, ShieldAlert 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast, approvalMode, setApprovalMode, userRole } = useStore();
  const [activeTab, setActiveTab] = useState<'connections' | 'ai' | 'limits' | 'compliance' | 'tokens' | 'team' | 'notifications'>('connections');

  // Connections testing state
  const [testingId, setTestingId] = useState<string | null>(null);

  // Destination accounts config
  const [destinationConnections, setDestinationConnections] = useState([
    {
      id: 'dest-conn-1',
      name: 'LinkedIn · Personal profile',
      account: 'Alex Mercer (Founder Profile)',
      status: 'Connected',
      lastSync: '12 mins ago',
      note: 'Personal profile uses member OAuth 2.0 token with w_member_social scope.'
    },
    {
      id: 'dest-conn-2',
      name: 'LinkedIn · Company page (Kinetik Dynamics)',
      account: 'Kinetik Dynamics (urn:li:organization:981290)',
      status: 'Pending review',
      lastSync: 'Pending approval',
      note: 'Personal profile uses member OAuth token. Company page requires LinkedIn Marketing Developer Platform v2 review, currently under review by LinkedIn Developer Relations.'
    },
    {
      id: 'dest-conn-3',
      name: 'Facebook · Page (Kinetik Dynamics)',
      account: 'Kinetik Dynamics Page (ID: 1048192849)',
      status: 'Connected',
      lastSync: '25 mins ago',
      note: 'Connected via Meta Graph API v20.0 with pages_manage_posts scope.'
    },
    {
      id: 'dest-conn-4',
      name: 'X · @kinetikdynamics',
      account: '@kinetikdynamics (ID: 16829401928)',
      status: 'Connected',
      lastSync: '8 mins ago',
      note: 'Connected via Twitter API v2 OAuth 2.0 User Context with tweet.write scope.'
    },
    {
      id: 'dest-conn-5',
      name: 'Website · kinetikdynamics.com',
      account: 'kinetikdynamics.com (Next.js CMS API)',
      status: 'Connected',
      lastSync: 'Just now',
      note: 'Connected via secure webhook endpoint to push drafts and live published case study pages.'
    }
  ]);

  // AI Providers state
  const [textModel, setTextModel] = useState('claude-3-5-sonnet');
  const [textKey, setTextKey] = useState('sk-ant-api03-••••••••••••••••••••••••9F2a');
  const [imageModel, setImageModel] = useState('dall-e-3');
  const [imageKey, setImageKey] = useState('');
  const [videoModel, setVideoModel] = useState('none');
  const [videoKey, setVideoKey] = useState('');

  // Access Tokens state
  const [tokens, setTokens] = useState([
    { id: 'tok-1', name: 'Zapier Ingestion Webhook', abilities: 'signals:write, leads:read', lastUsed: '12 mins ago', created: '2026-09-10' },
    { id: 'tok-2', name: 'CI/CD Production Deployment', abilities: 'brain:read, system:status', lastUsed: '3 days ago', created: '2026-08-01' }
  ]);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Notifications Checkbox Grid
  const [notifs, setNotifs] = useState({
    'lead_high': { email: true, slack: true, webhook: false },
    'lead_reply': { email: true, slack: true, webhook: true },
    'source_error': { email: true, slack: true, webhook: false },
    'weekly_summary': { email: true, slack: false, webhook: false }
  });

  const handleTestConnection = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      showToast(`Connection test passed for ${name}`);
    }, 1200);
  };

  const handleReconnect = (name: string) => {
    showToast(`OAuth reconnect refreshed for ${name}`);
  };

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName) return;

    const tok = `kge_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`;
    setGeneratedToken(tok);
    setTokens(prev => [
      { id: `tok-${Date.now()}`, name: newTokenName, abilities: 'leads:read, signals:write', lastUsed: 'Never', created: 'Today' },
      ...prev
    ]);
  };

  const handleCopyToken = () => {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleRevokeToken = (id: string) => {
    setTokens(prev => prev.filter(t => t.id !== id));
    showToast('Access token revoked');
  };

  const toggleNotif = (eventKey: keyof typeof notifs, channel: 'email' | 'slack' | 'webhook') => {
    setNotifs(prev => ({
      ...prev,
      [eventKey]: {
        ...prev[eventKey],
        [channel]: !prev[eventKey][channel]
      }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Workspace Settings & Configurations</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure integration connections, publishing destinations, posting windows, and regulatory compliance.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6 overflow-x-auto">
        {[
          { key: 'connections', label: 'Connections & Destinations' },
          { key: 'ai', label: 'AI Providers' },
          { key: 'limits', label: 'Approvals & Limits' },
          { key: 'compliance', label: 'Compliance' },
          { key: 'tokens', label: 'Access Tokens' },
          { key: 'team', label: 'Team Members' },
          { key: 'notifications', label: 'Notifications' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Connections & Destinations */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          {/* 5 Publishing Destinations Connections */}
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
                  Publishing Destinations Connections (5 Platforms)
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  OAuth tokens, account handles, and access tiers for multi-destination distribution.
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {destinationConnections.map(conn => (
                <div key={conn.id} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-gray-50">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{conn.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        conn.status === 'Connected' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {conn.status}
                      </span>
                    </div>

                    <p className="text-gray-700 font-mono text-xs">
                      Account: {conn.account} · Last sync: {conn.lastSync}
                    </p>

                    <p className="text-gray-500 text-[11px] leading-relaxed bg-gray-50/70 p-2 rounded border border-gray-100">
                      {conn.note}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <button
                      onClick={() => handleTestConnection(conn.id, conn.name)}
                      disabled={testingId === conn.id}
                      className="px-3 py-1.5 border border-gray-300 rounded-[6px] text-gray-700 hover:bg-white text-xs font-medium transition-colors"
                    >
                      {testingId === conn.id ? 'Pinging...' : 'Test'}
                    </button>
                    <button
                      onClick={() => handleReconnect(conn.name)}
                      className="px-3 py-1.5 bg-gray-900 text-white rounded-[6px] hover:bg-gray-800 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <RotateCw className="w-3 h-3" /> Reconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posting Windows Table per Destination */}
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
                  Posting Windows per Destination (Audience Timezone & Dhaka Equivalents)
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Used by the "Suggested Time" helper in Compose to optimize for audience engagement peaks.
                </p>
              </div>
            </div>

            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-500 font-medium">
                  <th className="py-2.5 px-4 font-normal">Destination</th>
                  <th className="py-2.5 px-4 font-normal">Audience Timezone</th>
                  <th className="py-2.5 px-4 font-normal">Recommended Days</th>
                  <th className="py-2.5 px-4 font-normal font-mono">Audience Peak Window</th>
                  <th className="py-2.5 px-4 font-normal font-mono">Dhaka Equivalent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {POSTING_WINDOWS.map(win => (
                  <tr key={win.destinationId} className="h-11 hover:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-900">
                      {win.destinationName}
                    </td>
                    <td className="py-2 px-4 text-gray-600">
                      {win.audienceTimezone}
                    </td>
                    <td className="py-2 px-4 text-gray-700 font-medium">
                      {win.recommendedDays}
                    </td>
                    <td className="py-2 px-4 font-mono text-gray-900 font-semibold text-xs">
                      {win.timeRange}
                    </td>
                    <td className="py-2 px-4 font-mono text-blue-700 text-xs">
                      {win.dhakaEquivalent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Connected Outreach & ClearSearch Services */}
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
                Outreach & Enrichment APIs
              </h3>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {initialConnections.filter(c => !c.name.includes('LinkedIn') && !c.name.includes('X')).map(conn => (
                <div key={conn.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{conn.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {conn.status}
                      </span>
                    </div>
                    <p className="text-gray-500 font-mono text-[11px]">
                      {conn.type} · Last sync: {conn.lastSync}
                    </p>
                    {conn.details && (
                      <p className="text-gray-600 text-[11px]">{conn.details}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleTestConnection(conn.id, conn.name)}
                    disabled={testingId === conn.id}
                    className="px-3 py-1.5 border border-gray-300 rounded-[6px] text-gray-700 hover:bg-white text-xs font-medium shrink-0 self-start sm:self-center transition-colors"
                  >
                    {testingId === conn.id ? 'Pinging...' : 'Test Connection'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Outreach Event Logs Table */}
          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
                Outreach Webhook Event Logs (Instantly / Smartlead)
              </h3>
              <span className="text-[11px] font-mono text-gray-500">Live webhook stream</span>
            </div>

            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-500 font-medium">
                  <th className="py-2 px-4 font-normal">Timestamp</th>
                  <th className="py-2 px-4 font-normal">Event</th>
                  <th className="py-2 px-4 font-normal">Recipient Email</th>
                  <th className="py-2 px-4 font-normal">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {initialConnections[0].eventLogs?.map((log, idx) => (
                  <tr key={idx} className="h-10 hover:bg-gray-50">
                    <td className="py-2 px-4 font-mono text-gray-500 text-xs whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 font-mono text-[11px] px-1.5 py-0.5 rounded font-semibold ${
                        log.event === 'Meeting Booked' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        log.event === 'Email Replied' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        log.event === 'Email Bounced' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {log.event}
                      </span>
                    </td>
                    <td className="py-2 px-4 font-mono text-gray-800 text-xs">
                      {log.recipient}
                    </td>
                    <td className="py-2 px-4 text-gray-600 text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: AI Providers */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-xs text-gray-600 font-mono">
            Note: No key means the feature is off. Keys are stored locally in your encrypted vault.
          </div>

          <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-6 text-xs sm:text-sm">
            {/* Text Provider */}
            <div className="space-y-3 pb-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Text & Reasoning Provider (Lead Briefs & Copy)</h4>
                  <p className="text-xs text-gray-500">Used for signal scoring, site audits, and drafting outreach messages.</p>
                </div>
                <button
                  onClick={() => showToast('Anthropic API key verified')}
                  className="px-2.5 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 font-medium"
                >
                  Test Key
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Model Selection</label>
                  <select
                    value={textModel}
                    onChange={e => setTextModel(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none bg-white font-mono"
                  >
                    <option value="claude-3-5-sonnet">Anthropic: Claude 3.5 Sonnet (Recommended)</option>
                    <option value="gpt-4o">OpenAI: GPT-4o</option>
                    <option value="gemini-1-5-pro">Google: Gemini 1.5 Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    value={textKey}
                    onChange={e => setTextKey(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Image Provider */}
            <div className="space-y-3 pb-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Image Generation Provider</h4>
                  <p className="text-xs text-gray-500">Used for generating social post diagrams and graphics.</p>
                </div>
                {imageKey && (
                  <button
                    onClick={() => showToast('Image API key verified')}
                    className="px-2.5 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 font-medium"
                  >
                    Test Key
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Model Selection</label>
                  <select
                    value={imageModel}
                    onChange={e => setImageModel(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none bg-white font-mono"
                  >
                    <option value="none">Disabled (No Image Generation)</option>
                    <option value="dall-e-3">OpenAI: DALL-E 3</option>
                    <option value="imagen-3">Google: Imagen 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    placeholder="Enter OpenAI or Google Key..."
                    value={imageKey}
                    onChange={e => setImageKey(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-[6px] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Video Provider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Video Generation Provider</h4>
                  <p className="text-xs text-gray-500">Video rendering currently off.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Model</label>
                  <select
                    value={videoModel}
                    disabled
                    className="w-full text-xs px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-[6px]"
                  >
                    <option value="none">Disabled (No API Key Configured)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    disabled
                    placeholder="Not configured"
                    className="w-full text-xs px-3 py-2 border border-gray-200 bg-gray-50 text-gray-400 rounded-[6px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Approvals & Limits */}
      {activeTab === 'limits' && (
        <div className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-6 text-xs sm:text-sm">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800 mb-3">
              Approval Modes by Area
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-[6px] bg-gray-50 space-y-2">
                <span className="font-semibold text-gray-900 block">Lead Approval Queue</span>
                <p className="text-xs text-gray-500">Mode for Lead Queue approvals</p>
                <select className="w-full text-xs px-3 py-2 border border-gray-300 rounded bg-white font-medium">
                  <option>Strict Manual (Human clicks approve for each)</option>
                  <option>Auto-Approve Score &gt; 90 (Daily Cap: 5)</option>
                </select>
              </div>

              <div className="p-4 border border-gray-200 rounded-[6px] bg-gray-50 space-y-2">
                <span className="font-semibold text-gray-900 block">Content & Social Posts (Compose Button Mode)</span>
                <p className="text-xs text-gray-500">
                  Current: {approvalMode === 'manual' ? 'Strict Manual (Sends to Approvals)' : 'Auto-Schedule (Schedules immediately)'}
                </p>
                <select
                  value={approvalMode}
                  onChange={e => {
                    setApprovalMode(e.target.value as 'manual' | 'auto');
                    showToast(`Updated Content Approval mode to ${e.target.value === 'manual' ? 'Manual Review' : 'Auto-Schedule'}`);
                  }}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded bg-white font-medium"
                >
                  <option value="manual">Strict Manual ("Send for approval")</option>
                  <option value="auto">Auto-Schedule ("Schedule N posts" / "Publish now")</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
              Safety Throttles & Daily Limits
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">Leads approved today</span>
                  <span className="font-mono tabular-nums text-gray-900 font-semibold">12 / 20 leads cap</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">Outreach emails dispatched today</span>
                  <span className="font-mono tabular-nums text-gray-900 font-semibold">48 / 50 emails cap</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-700">Monthly ClearSearch enrichment credits</span>
                  <span className="font-mono tabular-nums text-gray-900 font-semibold">1,840 / 5,000 credits</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '36.8%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Compliance */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[6px] text-xs text-amber-900 font-semibold">
            Important: Review with a lawyer before launching the first live cold outreach campaign.
          </div>

          <div className="space-y-4">
            {complianceRulesByRegion.map(reg => (
              <div key={reg.region} className="bg-white border border-gray-200 rounded-[6px] p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="font-bold text-gray-900 text-sm">{reg.region}</h3>
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Framework: {reg.framework}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-gray-700">
                  {reg.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Access Tokens */}
      {activeTab === 'tokens' && (
        userRole !== 'Owner' ? (
          <div className="bg-white border border-gray-200 rounded-[6px] p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Owner Permission Required</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Only workspace Owners can manage API access tokens and integration credentials.
            </p>
          </div>
        ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              API tokens for background collectors, webhook endpoints, and external CLI tools.
            </p>
            <button
              onClick={() => {
                setGeneratedToken(null);
                setNewTokenName('');
                setTokenModalOpen(true);
              }}
              className="text-xs font-medium px-3.5 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Token</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-medium">
                  <th className="py-2.5 px-4 font-normal">Token Name</th>
                  <th className="py-2.5 px-4 font-normal">Granted Abilities</th>
                  <th className="py-2.5 px-4 font-normal">Created</th>
                  <th className="py-2.5 px-4 font-normal">Last Used</th>
                  <th className="py-2.5 px-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tokens.map(t => (
                  <tr key={t.id} className="h-11 hover:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-900 font-mono">
                      {t.name}
                    </td>
                    <td className="py-2 px-4 text-gray-600 font-mono text-[11px]">
                      {t.abilities}
                    </td>
                    <td className="py-2 px-4 text-gray-500 font-mono text-[11px]">
                      {t.created}
                    </td>
                    <td className="py-2 px-4 text-gray-500 font-mono text-[11px]">
                      {t.lastUsed}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => handleRevokeToken(t.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Create Token Modal */}
          <Modal
            isOpen={tokenModalOpen}
            onClose={() => setTokenModalOpen(false)}
            title="Create Personal Access Token"
            description="Generated tokens are shown only once upon creation."
            maxWidth="md"
          >
            {generatedToken ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] text-emerald-900">
                  <span className="font-semibold block mb-1">Token Generated Successfully</span>
                  Make sure to copy your personal access token now. You won’t be able to see it again!
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-300 rounded font-mono text-xs">
                  <input
                    type="text"
                    readOnly
                    value={generatedToken}
                    className="flex-1 bg-transparent outline-none text-gray-900"
                  />
                  <button
                    onClick={handleCopyToken}
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                    title="Copy token"
                  >
                    {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setTokenModalOpen(false)}
                    className="px-3.5 py-1.5 bg-blue-600 text-white rounded text-xs font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateToken} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Token Description Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newTokenName}
                    onChange={e => setNewTokenName(e.target.value)}
                    placeholder="e.g. Scraper Webhook Integration"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setTokenModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded"
                  >
                    Generate Token
                  </button>
                </div>
              </form>
            )}
          </Modal>
        </div>
        )
      )}

      {/* Tab 6: Team Members */}
      {activeTab === 'team' && (
        <TeamTab />
      )}

      {/* Tab 7: Notifications Checkbox Grid */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
              Notification Routing (Event × Channel Grid)
            </h3>
          </div>

          <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 text-gray-500 font-medium">
                <th className="py-2.5 px-4 font-normal">Event Trigger</th>
                <th className="py-2.5 px-4 font-normal text-center w-32">Email</th>
                <th className="py-2.5 px-4 font-normal text-center w-32">Slack Webhook</th>
                <th className="py-2.5 px-4 font-normal text-center w-32">External Webhook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { key: 'lead_high', label: 'New high-score lead found (>85 pts)' },
                { key: 'lead_reply', label: 'Recipient replies to cold outreach' },
                { key: 'source_error', label: 'Collector source fails or rate-limits' },
                { key: 'weekly_summary', label: 'Weekly pipeline and content summary' }
              ].map(item => {
                const k = item.key as keyof typeof notifs;
                return (
                  <tr key={item.key} className="h-12 hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium text-gray-900">
                      {item.label}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={notifs[k].email}
                        onChange={() => toggleNotif(k, 'email')}
                        className="rounded text-blue-600"
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={notifs[k].slack}
                        onChange={() => toggleNotif(k, 'slack')}
                        className="rounded text-blue-600"
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={notifs[k].webhook}
                        onChange={() => toggleNotif(k, 'webhook')}
                        className="rounded text-blue-600"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
