import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, ArrowRight, RotateCw, KeyRound } from 'lucide-react';

export const TwoFactorPage: React.FC = () => {
  const { completeTwoFactor, onboardingCompleted, userRole } = useStore();
  const navigate = useNavigate();

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 30s countdown for Resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Handle digit change & auto advance
  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const codeToVerify = useBackupCode ? backupCode.trim() : digits.join('');

    setTimeout(() => {
      setLoading(false);
      if (!useBackupCode && codeToVerify.length < 6) {
        setError('Please enter all 6 digits.');
        return;
      }

      const success = completeTwoFactor(codeToVerify);
      if (!success) {
        setError('Invalid verification code. Try again.');
        return;
      }

      if (!onboardingCompleted && userRole === 'Owner') {
        navigate('/onboarding');
      } else {
        navigate('/overview');
      }
    }, 400);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(30);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-9 h-9 rounded-[6px] bg-blue-50 border border-blue-200 text-blue-600 font-semibold text-sm flex items-center justify-center tracking-tight mb-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            Two-step verification
          </h1>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {useBackupCode
              ? 'Enter an 8-character backup code generated from your account.'
              : 'Enter the 6-digit authentication code from your authenticator app.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!useBackupCode ? (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2 text-center">
                  Authentication Code
                </label>
                <div className="flex justify-between gap-2">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleDigitChange(idx, e.target.value)}
                      onKeyDown={e => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className={`w-11 h-12 text-center font-mono text-base font-semibold border rounded-[6px] bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                        error ? 'border-rose-300 focus:border-rose-500' : 'border-gray-200 focus:border-blue-600'
                      }`}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Backup code
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                  <input
                    type="text"
                    required
                    value={backupCode}
                    onChange={e => {
                      setBackupCode(e.target.value.toUpperCase());
                      setError(null);
                    }}
                    placeholder="e.g. A7B2-C9D1"
                    className={`w-full text-xs pl-8 pr-3 py-2 font-mono uppercase border rounded-[6px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                      error ? 'border-rose-300 focus:border-rose-500' : 'border-gray-200 focus:border-blue-600'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <p className="text-xs text-rose-600 font-medium text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-xs font-medium py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-[6px] transition-colors flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Verify & continue</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Backup Code and Resend */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setError(null);
              }}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {useBackupCode ? 'Use authenticator code instead' : 'Use a backup code'}
            </button>

            {!useBackupCode && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-gray-500 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 text-[11px]"
              >
                <RotateCw className="w-3 h-3" strokeWidth={1.5} />
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
              </button>
            )}
          </div>
        </div>

        {/* Demo Note */}
        <div className="mt-4 p-2.5 bg-gray-100 border border-gray-200 rounded-[6px] text-[11px] text-gray-500">
          <p className="font-medium text-gray-700">Prototype Demo Check:</p>
          <p className="mt-0.5">Any 6 digits pass (or any backup code). Entering <code className="text-gray-800 font-mono bg-white px-1 py-0.5 rounded border border-gray-200">000000</code> tests the invalid code error.</p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-xs text-gray-500 hover:text-gray-700">
            &larr; Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
