import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from './ToastContainer';
import { CommandPalette } from './CommandPalette';
import { SessionExpiredModal } from './SessionExpiredModal';

export const Layout: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const getPageTitle = (pathname: string): string => {
    if (pathname === '/' || pathname === '/overview') return 'Overview';
    if (pathname === '/brain/offers') return 'Offers';
    if (pathname.startsWith('/brain/offers/')) return 'Offer Detail';
    if (pathname === '/brain/icps') return 'Ideal Client Profiles (ICPs)';
    if (pathname.startsWith('/brain/icps/')) return 'ICP Detail';
    if (pathname === '/brain/proof') return 'Proof & Case Studies';
    if (pathname === '/leads/queue') return 'Lead Approval Queue';
    if (pathname === '/leads/pipeline') return 'Lead Pipeline';
    if (pathname === '/leads/signals') return 'Signals Feed';
    if (pathname === '/leads/sources') return 'Sources & Search Plans';
    if (pathname === '/content/plan') return 'Content Plan';
    if (pathname === '/content/calendar') return 'Content Calendar';
    if (pathname === '/content/compose') return 'Compose Post';
    if (pathname === '/content/approvals') return 'Content Approvals';
    if (pathname === '/content/posts') return 'Post Performance';
    if (pathname === '/insights') return 'Insights & Performance';
    if (pathname === '/settings') return 'Settings & Connections';
    if (pathname === '/account') return 'Personal Account & Security';
    return 'Growth Engine';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title={getPageTitle(location.pathname)} 
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />
      <SessionExpiredModal />
    </div>
  );
};

