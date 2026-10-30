import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
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
            Reset your password
          </h1>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Enter your work email address and we'll send a password recovery link.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-6 shadow-xs">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@kinetikdynamics.com"
                    className="w-full text-xs pl-8 pr-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  />
                </div>
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
                    <span>Send reset link</span>
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
                  If an account exists for this email, a reset link is on its way.
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Check your inbox and spam folder. The link will expire in 60 minutes.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/reset-password"
                  className="inline-block text-xs font-medium py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[6px] transition-colors"
                >
                  Simulate clicking email reset link &rarr;
                </Link>
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Link to="/login" className="text-xs text-gray-500 hover:text-gray-700">
              &larr; Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
