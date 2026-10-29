import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoginLocked, failedLoginAttempts, onboardingCompleted, userRole } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex@kinetikdynamics.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Authentication failed');
        return;
      }

      if (res.requires2fa) {
        navigate('/two-factor');
      } else if (!onboardingCompleted && userRole === 'Owner') {
        navigate('/onboarding');
      } else {
        navigate('/overview');
      }
    }, 400);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = login('alex@kinetikdynamics.com');
      if (res.requires2fa) {
        navigate('/two-factor');
      } else if (!onboardingCompleted && userRole === 'Owner') {
        navigate('/onboarding');
      } else {
        navigate('/overview');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-9 h-9 rounded-[6px] bg-gray-900 text-white font-semibold text-sm flex items-center justify-center tracking-tight mb-3 shadow-xs">
            KD
          </div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            Kinetik Growth Engine
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Internal outreach and content planning studio
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-6 shadow-xs">
          {/* Locked Alert if failed attempts >= 5 */}
          {isLoginLocked || failedLoginAttempts >= 5 ? (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-[6px] flex items-start gap-2.5 text-xs text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="font-medium text-rose-900">Account locked</p>
                <p className="mt-0.5 text-rose-700">Too many attempts. Try again in 10 minutes.</p>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                required
                disabled={isLoginLocked || failedLoginAttempts >= 5 || loading}
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="name@kinetikdynamics.com"
                className={`w-full text-xs px-3 py-2 border rounded-[6px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                  error ? 'border-rose-300 focus:border-rose-500' : 'border-gray-200 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLoginLocked || failedLoginAttempts >= 5 || loading}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
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

              {/* Inline Error */}
              {error && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoginLocked || failedLoginAttempts >= 5 || loading}
              className="w-full text-xs font-medium py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-[6px] transition-colors flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-gray-400">
              <span className="bg-white px-2">or</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoginLocked || failedLoginAttempts >= 5 || loading}
            className="w-full text-xs font-medium py-2 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-[6px] text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Demo Helper Pill */}
        <div className="mt-4 p-2.5 bg-gray-100 border border-gray-200 rounded-[6px] text-[11px] text-gray-500">
          <p className="font-medium text-gray-700">Prototype Test Accounts:</p>
          <p className="mt-0.5">Any email & password works. Test error with <code className="text-gray-800 font-mono bg-white px-1 py-0.5 rounded border border-gray-200">wrong@example.com</code>.</p>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-[11px] text-gray-400 flex items-center justify-center gap-3">
          <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
          <span>·</span>
          <Link to="/accept-invite" className="hover:text-gray-600 transition-colors">Accept Invite Demo</Link>
        </div>
      </div>
    </div>
  );
};
