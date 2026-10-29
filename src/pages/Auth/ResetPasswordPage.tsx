import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Check, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validation rules
  const commonPasswords = ['password123', 'admin1234567', '123456789012', 'qwerty123456', 'kinetik123456'];
  const hasMinLength = newPassword.length >= 12;
  const isNotCommon = newPassword.length > 0 && !commonPasswords.includes(newPassword.toLowerCase());
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const canSubmit = hasMinLength && isNotCommon && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-9 h-9 rounded-[6px] bg-gray-900 text-white font-semibold text-sm flex items-center justify-center tracking-tight mb-3">
            KD
          </div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            Create new password
          </h1>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Set a secure password for your Kinetik Growth Engine account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-6 shadow-xs">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter at least 12 characters"
                    className="w-full text-xs px-3 py-2 pr-9 border border-gray-200 rounded-[6px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
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
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className={`w-full text-xs px-3 py-2 border rounded-[6px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    confirmPassword && !passwordsMatch ? 'border-rose-300' : 'border-gray-200 focus:border-blue-600'
                  }`}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-[11px] text-rose-600">Passwords do not match.</p>
                )}
              </div>

              {/* Password Rule Checklist */}
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-[6px] space-y-2 text-xs">
                <p className="font-medium text-gray-700 text-[11px] uppercase tracking-wider">
                  Password Requirements
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    hasMinLength ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {hasMinLength ? <Check className="w-2.5 h-2.5 stroke-[2.5]" /> : <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>}
                  </div>
                  <span className={hasMinLength ? 'text-gray-800 font-medium' : 'text-gray-500'}>
                    12+ characters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    isNotCommon ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isNotCommon ? <Check className="w-2.5 h-2.5 stroke-[2.5]" /> : <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>}
                  </div>
                  <span className={isNotCommon ? 'text-gray-800 font-medium' : 'text-gray-500'}>
                    Not a common password
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-medium text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full text-xs font-medium py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-[6px] transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Reset password</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-gray-800 font-medium">
                  Your password has been reset.
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  You can now sign in with your new credentials.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center text-xs font-medium py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}

          {!success && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <Link to="/login" className="text-xs text-gray-500 hover:text-gray-700">
                &larr; Back to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
