import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { 
  Search, LayoutDashboard, Brain, Users, FileText, 
  Settings, CheckSquare, Sparkles, RefreshCw, X, Calendar, Send, Lightbulb, Plus 
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { leads, approveLead, resetDemoData, generateNextWeekContent } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Can be toggled externally or through props
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { title: 'Overview', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/overview') },
    { title: 'Brain → Offers', category: 'Navigation', icon: Brain, action: () => navigate('/brain/offers') },
    { title: 'Brain → ICPs', category: 'Navigation', icon: Brain, action: () => navigate('/brain/icps') },
    { title: 'Brain → Proof', category: 'Navigation', icon: Brain, action: () => navigate('/brain/proof') },
    { title: 'Leads → Queue', category: 'Navigation', icon: Users, action: () => navigate('/leads/queue') },
    { title: 'Leads → Pipeline', category: 'Navigation', icon: Users, action: () => navigate('/leads/pipeline') },
    { title: 'Leads → Signals', category: 'Navigation', icon: Users, action: () => navigate('/leads/signals') },
    { title: 'Leads → Sources', category: 'Navigation', icon: Users, action: () => navigate('/leads/sources') },
    { title: 'Publish → Queue', category: 'Navigation', icon: Calendar, action: () => navigate('/publish?tab=queue') },
    { title: 'Publish → Calendar', category: 'Navigation', icon: Calendar, action: () => navigate('/publish?tab=calendar') },
    { title: 'Publish → Approvals', category: 'Navigation', icon: CheckSquare, action: () => navigate('/publish?tab=approvals') },
    { title: 'Publish → Sent', category: 'Navigation', icon: Send, action: () => navigate('/publish?tab=sent') },
    { title: 'Publish → New post', category: 'Action', icon: Plus, action: () => navigate('/publish?action=new') },
    { title: 'Publish → Plan next week', category: 'Action', icon: Calendar, action: () => navigate('/publish?action=plan') },
    { title: 'Ideas', category: 'Navigation', icon: Lightbulb, action: () => navigate('/ideas') },
    { title: 'Insights & Proposals', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/insights') },
    { title: 'Settings & Connections', category: 'Navigation', icon: Settings, action: () => navigate('/settings') },
    {
      title: 'Approve First Waiting Lead',
      category: 'Action',
      icon: CheckSquare,
      action: () => {
        const waiting = leads.find(l => l.stage === 'Qualified' && l.checks.every(c => c.passed));
        if (waiting) {
          approveLead(waiting.id);
        }
      }
    },
    {
      title: 'Generate Next Week Content Plan',
      category: 'Action',
      icon: Sparkles,
      action: () => {
        navigate('/publish?action=plan');
      }
    },
    {
      title: 'Reset All Demo Data',
      category: 'System',
      icon: RefreshCw,
      action: () => resetDemoData()
    }
  ];

  const filtered = commands.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) || 
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-gray-900/40">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div 
        className="relative w-full max-w-lg bg-white rounded-[6px] border border-gray-200 overflow-hidden z-10 flex flex-col max-h-[480px]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" strokeWidth={1.5} />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search screens..."
            className="w-full text-xs sm:text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
          />
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] hover:bg-gray-100 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" strokeWidth={1.5} />
                    <span className="text-xs sm:text-sm text-gray-800 group-hover:text-gray-900 font-medium">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>Navigate with mouse or click command</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
