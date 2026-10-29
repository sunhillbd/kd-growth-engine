import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Eye, EyeOff, AlertTriangle, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

export const AcceptInvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { login, switchUserRole, showToast } = useStore();
  const navigate = useNavigate();

  const initialRole = (searchParams.get('role') as UserRole) || 'Editor';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isExpired, setIsExpired] = useState(searchParams.get('expired') === 'true');

  const [name, setName] = useState('Marcus Vance');
  const [email] = useState('marcus@kinetikdynamics.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email, password);
      switchUserRole(role);
      showToast(`Welcome to Kinetik Dynamics as ${role}`);
      navigate('/overview');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-9 h-9 rounded-[6px] bg-blue-50 border border-blue-200 text-blue-600 font-semibold text-sm flex items-center justify-center tracking-tight mb-3">
            <UserPlus className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight text-center">
            You've been invited to Kinetik Dynamics as {role}
          </h1>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Set up your credentials to join the workspace.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-6 shadow-xs">
          {!isExpired ? (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Invited Email
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-[6px] bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Set your account password"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full text-xs font-medium py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-[6px] transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Join Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-gray-800 font-medium">
                  This invite has expired.
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Ask the owner to send a new one.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-block text-xs font-medium py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-[6px] transition-colors"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          )}

          {/* Prototype Toggle Expired Link State */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Demo state:</span>
            <button
              type="button"
              onClick={() => setIsExpired(!isExpired)}
              className="text-blue-600 hover:underline font-mono"
            >
              {isExpired ? 'Switch to Valid Invite' : 'Switch to Expired Invite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
