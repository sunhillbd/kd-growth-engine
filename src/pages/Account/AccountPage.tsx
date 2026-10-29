import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  User, Mail, Lock, ShieldCheck, KeyRound, Copy, Check, 
  Globe, Bell, Laptop, Smartphone, Trash2, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { 
    currentUser, updateUserProfile, twoFactorEnabled, setTwoFactorEnabled,
    sessions, signOutSession, signOutAllOtherSessions, showToast 
  } = useStore();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');
  const [showEmailPasswordModal, setShowEmailPasswordModal] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Timezone
  const [timezone, setTimezone] = useState(currentUser.timezone || 'Asia/Dhaka');

  // 2FA Setup
  const [twoFaModalOpen, setTwoFaModalOpen] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const backupCodes = [
    'A7B2-C9D1', 'K4M8-P2Q6', '3T9X-W1Y5', 'H8J2-L4N6',
    'R5V7-Z9B1', 'C3D5-F7G9', 'M1P3-Q5S7', 'U9W2-X4Z6'
  ];

  // Notification prefs
  const [emailDigest, setEmailDigest] = useState<'daily' | 'weekly' | 'none'>('daily');
  const [collectorAlerts, setCollectorAlerts] = useState(true);
  const [duplicateAlerts, setDuplicateAlerts] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (email !== currentUser.email && !emailCurrentPassword) {
      setShowEmailPasswordModal(true);
      return;
    }
    updateUserProfile({ name, email, timezone });
    setEmailCurrentPassword('');
    setShowEmailPasswordModal(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 12) {
      showToast('New password must be at least 12 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    setPasswordChanged(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Account password changed successfully');
    setTimeout(() => setPasswordChanged(false), 3000);
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setCopiedCodes(true);
    showToast('Copied 8 backup codes to clipboard');
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 font-sans">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Personal Account & Security</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your login credentials, two-step verification, active login sessions, and timezone.
        </p>
      </div>

      {/* Profile & Email */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-6 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
          Profile Details
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address <span className="text-[11px] text-gray-400 font-normal">(Changing email requires entering current password)</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Studio Role</label>
            <div className="flex items-center gap-2">
              <span className="inline-block text-[11px] font-mono px-2 py-0.5 bg-gray-100 text-gray-800 rounded border border-gray-200 font-semibold">
                {currentUser.role}
              </span>
              <span className="text-[11px] text-gray-400">
                Managed in Settings &rarr; Team
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="text-xs font-medium py-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors"
            >
              Save profile changes
            </button>
          </div>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-6 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
          Change Password
        </h3>

        {passwordChanged && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
            <span>Password updated successfully.</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">New Password (12+ characters)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="text-xs font-medium py-1.5 px-3.5 bg-gray-900 hover:bg-black text-white rounded-[6px] transition-colors"
            >
              Update password
            </button>
          </div>
        </form>
      </div>

      {/* Two-Step Verification */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
              Two-Step Verification (2FA)
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Secure your account using an authenticator app (Google Authenticator, 1Password, Authy).
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (twoFactorEnabled) {
                setTwoFactorEnabled(false);
              } else {
                setTwoFaModalOpen(true);
              }
            }}
            className={`text-xs font-medium py-1.5 px-3 rounded-[6px] transition-colors border ${
              twoFactorEnabled
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-[6px] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 ${twoFactorEnabled ? 'text-emerald-600' : 'text-gray-400'}`} strokeWidth={1.5} />
            <span className="text-gray-800 font-medium">
              Status: {twoFactorEnabled ? 'Enabled & Active' : 'Not configured'}
            </span>
          </div>

          {twoFactorEnabled && (
            <button
              type="button"
              onClick={() => setTwoFaModalOpen(true)}
              className="text-[11px] text-blue-600 hover:underline"
            >
              View backup codes
            </button>
          )}
        </div>
      </div>

      {/* Timezone Preference */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-6 space-y-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
            Timezone Preference
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Used to render scheduled times across Content Compose, Calendar, and Activity feeds.
          </p>
        </div>

        <div className="max-w-xs text-xs space-y-2">
          <select
            value={timezone}
            onChange={e => {
              setTimezone(e.target.value);
              updateUserProfile({ timezone: e.target.value });
            }}
            className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
          >
            <option value="Asia/Dhaka">Asia/Dhaka (UTC+06:00)</option>
            <option value="America/New_York">America/New_York (UTC-05:00)</option>
            <option value="Europe/London">Europe/London (UTC+00:00)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (UTC-08:00)</option>
          </select>
          <span className="text-[11px] text-gray-400 block">
            Default: Asia/Dhaka. Audience times in New York will be calculated alongside.
          </span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-6 space-y-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
            Personal Notifications
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Select what transactional updates are dispatched to your work email.
          </p>
        </div>

        <div className="space-y-3 text-xs max-w-lg">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Digest Frequency</label>
            <select
              value={emailDigest}
              onChange={e => {
                setEmailDigest(e.target.value as any);
                showToast(`Digest frequency updated to ${e.target.value}`);
              }}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-[6px] bg-white text-gray-900"
            >
              <option value="daily">Daily morning summary (8:00 AM)</option>
              <option value="weekly">Weekly editorial summary (Monday)</option>
              <option value="none">No digest emails</option>
            </select>
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={collectorAlerts}
                onChange={e => {
                  setCollectorAlerts(e.target.checked);
                  showToast('Collector alert preferences saved');
                }}
                className="rounded text-blue-600"
              />
              <span className="text-gray-800">Alert on collector rate limits or failure events</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={duplicateAlerts}
                onChange={e => {
                  setDuplicateAlerts(e.target.checked);
                  showToast('Duplicate alert preferences saved');
                }}
                className="rounded text-blue-600"
              />
              <span className="text-gray-800">Alert if high-scoring lead has duplicate outreach history</span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Login Sessions */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-gray-800">
              Active Sessions
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Devices and locations currently authenticated into this account.
            </p>
          </div>

          {sessions.length > 1 && (
            <button
              type="button"
              onClick={signOutAllOtherSessions}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium"
            >
              Sign out all other sessions
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-100 border border-gray-200 rounded-[6px] overflow-hidden text-xs">
          {sessions.map(sess => (
            <div key={sess.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                  {sess.device.includes('iPhone') ? (
                    <Smartphone className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Laptop className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{sess.device}</span>
                    <span className="text-gray-500">· {sess.browser}</span>
                    {sess.isCurrent && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                    {sess.ip} · {sess.location} · {sess.lastActive}
                  </p>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  type="button"
                  onClick={() => signOutSession(sess.id)}
                  className="text-xs text-gray-400 hover:text-rose-600 px-2 py-1"
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2FA Enable Modal */}
      {twoFaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-[6px] shadow-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-tight">
                  Two-step verification setup
                </h3>
                <p className="text-xs text-gray-500">
                  Scan the QR code with your authenticator app and save your backup codes.
                </p>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-[6px]">
              <div className="w-32 h-32 bg-white border border-gray-300 rounded-[4px] p-2 flex flex-col items-center justify-center">
                {/* SVG QR Code Pattern Mock */}
                <svg className="w-28 h-28 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm9-2h7v7h-7V2zm2 2v3h3V4h-3zM2 13h7v7H2v-7zm2 2v3h3v-3H4zm13-2h3v3h-3v-3zm0 4h3v3h-3v-3zm-4-4h3v3h-3v-3zm0 4h3v3h-3v-3z" />
                </svg>
              </div>
              <p className="text-[11px] font-mono text-gray-600 mt-2">
                Secret: <span className="font-semibold text-gray-900">JBSWY3DPEHPK3PXP</span>
              </p>
            </div>

            {/* 8 Backup Codes Shown Once */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  8 Single-Use Backup Codes
                </span>
                <button
                  type="button"
                  onClick={copyBackupCodes}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                  {copiedCodes ? <Check className="w-3 h-3 stroke-[2.5]" /> : <Copy className="w-3 h-3 strokeWidth={1.5}" />}
                  <span>{copiedCodes ? 'Copied' : 'Copy all'}</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-3 bg-gray-50 border border-gray-200 rounded-[6px] font-mono text-xs text-gray-800 text-center">
                {backupCodes.map((code, idx) => (
                  <div key={idx} className="p-1 bg-white border border-gray-100 rounded">
                    {code}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                Store these codes securely. Each code can be used once if you lose access to your authenticator.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setTwoFaModalOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-[6px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setTwoFactorEnabled(true);
                  setTwoFaModalOpen(false);
                }}
                className="px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-[6px]"
              >
                Done & Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Password Confirmation Modal */}
      {showEmailPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-[6px] shadow-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Confirm email change
            </h3>
            <p className="text-xs text-gray-600">
              Enter your current account password to change your primary work email address.
            </p>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={emailCurrentPassword}
                onChange={e => setEmailCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEmailPasswordModal(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-[6px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (emailCurrentPassword.length > 0) {
                    updateUserProfile({ name, email, timezone });
                    setShowEmailPasswordModal(false);
                    setEmailCurrentPassword('');
                  }
                }}
                className="px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-[6px]"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
