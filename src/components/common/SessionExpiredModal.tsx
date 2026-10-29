import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';

export const SessionExpiredModal: React.FC = () => {
  const { sessionExpiredModalOpen, restoreSession, currentUser } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!sessionExpiredModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const ok = restoreSession(password);
      if (!ok) {
        setError('Incorrect password.');
      } else {
        setPassword('');
        setError(null);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans animate-fade-in">
      <div 
        className="w-full max-w-[380px] bg-white border border-gray-200 rounded-[6px] shadow-lg p-6 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-[6px] bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div>
            <h2 id="session-expired-title" className="text-sm font-semibold text-gray-900 tracking-tight">
              Session expired
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              You've been signed out. Sign in again to continue.
            </p>
          </div>
        </div>

        <div className="mb-4 p-2.5 bg-gray-50 border border-gray-200 rounded-[6px] text-xs">
          <p className="text-[11px] text-gray-500">Signing in as:</p>
          <p className="font-semibold text-gray-900 mt-0.5">{currentUser.name}</p>
          <p className="text-gray-500 text-[11px] font-mono">{currentUser.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter password to resume"
                className={`w-full text-xs px-3 py-2 pr-9 border rounded-[6px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                  error ? 'border-rose-300 focus:border-rose-500' : 'border-gray-200 focus:border-blue-600'
                }`}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                )}
              </button>
            </div>
            {error && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-xs font-medium py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-[6px] transition-colors flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Sign in and resume</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>

        <p className="mt-3 text-[11px] text-gray-400 text-center">
          Your current form data and state will be preserved.
        </p>
      </div>
    </div>
  );
};
