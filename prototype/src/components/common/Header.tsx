import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, ChevronDown, User, RefreshCw, ExternalLink, 
  LogOut, Shield, Sliders, AlertTriangle, Sparkles 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';

interface HeaderProps {
  title: string;
  onOpenCommandPalette: () => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenCommandPalette, primaryAction }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoControlsOpen, setDemoControlsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { 
    currentUser, userRole, switchUserRole, 
    logout, setSessionExpiredModalOpen, 
    resetOnboarding, resetDemoData 
  } = useStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
        setDemoControlsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleTriggerSessionExpired = () => {
    setUserMenuOpen(false);
    setSessionExpiredModalOpen(true);
  };

  const handleResetOnboarding = () => {
    setUserMenuOpen(false);
    resetOnboarding();
    navigate('/onboarding');
  };

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-20 font-sans">
      <div className="flex items-center gap-4">
        <h1 className="text-base font-semibold text-gray-900 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Primary Action Button if specified for screen */}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            className={`text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-[6px] transition-colors flex items-center gap-1.5 ${
              primaryAction.disabled 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800'
            }`}
          >
            {primaryAction.loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></span>
            )}
            {primaryAction.label}
          </button>
        )}

        {/* ⌘K Command Palette Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded-[6px] bg-gray-50 hover:bg-gray-100 transition-colors"
          title="Search commands (⌘K or Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline font-mono text-[10px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-[6px] hover:bg-gray-100 text-gray-700 transition-colors border border-transparent hover:border-gray-200"
            aria-expanded={userMenuOpen}
            aria-label="User profile menu"
          >
            <div className="w-6 h-6 rounded bg-gray-900 text-white font-medium text-[11px] flex items-center justify-center">
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col text-left hidden md:block">
              <span className="text-xs font-semibold text-gray-800 leading-none">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-gray-400 leading-tight mt-0.5 font-mono">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-[6px] shadow-lg py-1 z-30 text-xs animate-fade-in">
              {/* User Header */}
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{currentUser.name}</p>
                <p className="text-[11px] text-gray-500 font-mono truncate">{currentUser.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-block text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-700 rounded font-mono font-medium border border-gray-200">
                    Role: {currentUser.role}
                  </span>
                  {currentUser.twoFactorEnabled && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                      2FA on
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Items */}
              <div className="py-1">
                <Link
                  to="/account"
                  className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User className="w-3.5 h-3.5 mr-2 text-gray-400" strokeWidth={1.5} />
                  <span>Account & Security</span>
                </Link>

                <Link
                  to="/settings"
                  className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Sliders className="w-3.5 h-3.5 mr-2 text-gray-400" strokeWidth={1.5} />
                  <span>Workspace Settings</span>
                </Link>
              </div>

              {/* Demo Controls Section (Clearly labeled for prototype reviewer) */}
              <div className="border-t border-gray-100 py-1 bg-gray-50/50">
                <div className="px-3 py-1 flex items-center justify-between text-[11px] font-semibold text-gray-700 uppercase tracking-wider">
                  <span>Demo Controls</span>
                  <span className="text-[10px] text-blue-600 font-mono font-normal">Reviewer</span>
                </div>

                {/* Role Switcher */}
                <div className="px-3 py-1.5 space-y-1">
                  <span className="text-[11px] text-gray-500 block">Switch Active Role:</span>
                  <div className="grid grid-cols-2 gap-1">
                    {(['Owner', 'Editor', 'Approver', 'Viewer'] as UserRole[]).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => switchUserRole(r)}
                        className={`text-[11px] font-mono py-1 px-1.5 rounded text-center border transition-colors ${
                          userRole === r
                            ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleResetOnboarding}
                    className="w-full text-left px-3 py-1.5 text-[11px] text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>Launch First-run Onboarding</span>
                    <span className="text-[10px] font-mono text-gray-400">&rarr;</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleTriggerSessionExpired}
                    className="w-full text-left px-3 py-1.5 text-[11px] text-amber-700 hover:bg-amber-50 flex items-center justify-between"
                  >
                    <span>Trigger "Session expired" modal</span>
                    <span className="text-[10px] font-mono text-amber-600">Simulate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      resetDemoData();
                    }}
                    className="w-full text-left px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-100 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3 text-gray-400" strokeWidth={1.5} />
                    <span>Reset All Mock Data</span>
                  </button>
                </div>
              </div>

              {/* Sign out */}
              <div className="border-t border-gray-100 py-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2 text-rose-500" strokeWidth={1.5} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
