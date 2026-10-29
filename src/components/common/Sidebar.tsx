import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { 
  LayoutDashboard, Brain, Target, Award, Users, 
  Kanban, Radio, Globe, Calendar, CheckSquare, 
  Send, BarChart2, Settings, Compass, Layers, FileText, Bookmark, Lightbulb
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { leads, posts } = useStore();

  // Waiting leads in queue are stage === 'Qualified'
  const waitingLeadsCount = leads.filter(l => l.stage === 'Qualified').length;
  // Waiting posts in approvals are status === 'Needs approval'
  const waitingApprovalsCount = posts.filter(p => p.status === 'Needs approval').length;

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-between px-3 py-1.5 rounded-[6px] text-xs sm:text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-100 text-gray-900 font-semibold'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-60 border-r border-gray-200 bg-white flex flex-col shrink-0 h-screen select-none">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-5 border-b border-gray-200 gap-2.5">
        <div className="w-5 h-5 rounded-[4px] bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold tracking-tight">
          K
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-900 tracking-tight leading-none">
            Kinetik Dynamics
          </span>
          <span className="text-[10px] text-gray-500 font-mono mt-0.5 leading-none">
            Growth Engine
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Top level item */}
        <div>
          <NavLink to="/overview" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Overview</span>
            </div>
          </NavLink>
        </div>

        {/* Section: Brain */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Brain
          </div>
          <NavLink to="/brain/offers" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Offers</span>
            </div>
          </NavLink>
          <NavLink to="/brain/icps" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Target className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>ICPs</span>
            </div>
          </NavLink>
          <NavLink to="/brain/proof" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Proof</span>
            </div>
          </NavLink>
        </div>

        {/* Section: Leads */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Leads
          </div>
          <NavLink to="/leads/queue" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Queue</span>
            </div>
            {waitingLeadsCount > 0 && (
              <span className="font-mono tabular-nums text-[11px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                {waitingLeadsCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/leads/pipeline" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Kanban className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Pipeline</span>
            </div>
          </NavLink>
          <NavLink to="/leads/signals" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Signals</span>
            </div>
          </NavLink>
          <NavLink to="/leads/sources" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Sources</span>
            </div>
          </NavLink>
        </div>

        {/* Section: Content */}
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1">
            Content
          </div>
          <NavLink to="/publish" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Publish</span>
            </div>
            {waitingApprovalsCount > 0 && (
              <span className="font-mono tabular-nums text-[11px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                {waitingApprovalsCount}
              </span>
            )}
          </NavLink>
          <NavLink to="/ideas" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Ideas</span>
            </div>
          </NavLink>
        </div>

        {/* Bottom items */}
        <div className="space-y-1 pt-2 border-t border-gray-100">
          <NavLink to="/insights" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <BarChart2 className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Insights</span>
            </div>
          </NavLink>
          <NavLink to="/settings" className={navItemClass}>
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
              <span>Settings</span>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Studio footer status */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Agent active</span>
          </div>
          <span className="font-mono text-[10px]">Asia/Dhaka</span>
        </div>
      </div>
    </aside>
  );
};
