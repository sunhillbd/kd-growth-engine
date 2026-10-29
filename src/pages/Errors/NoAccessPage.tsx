import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowRight } from 'lucide-react';

export const NoAccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-[420px] text-center">
        <div className="w-10 h-10 rounded-[6px] bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <h1 className="text-base font-semibold text-gray-900 tracking-tight">
          No access
        </h1>
        <p className="text-xs text-gray-600 mt-1 mb-6">
          You don't have permission to view this. Ask an owner for access.
        </p>

        <Link
          to="/overview"
          className="inline-flex items-center gap-1.5 text-xs font-medium py-2 px-4 bg-gray-900 hover:bg-black text-white rounded-[6px] transition-colors"
        >
          <span>Return to Overview</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
};
