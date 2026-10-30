import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px] text-center">
        <div className="w-10 h-10 rounded-[6px] bg-gray-100 border border-gray-200 text-gray-500 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <h1 className="text-base font-semibold text-gray-900 tracking-tight">
          This page doesn't exist
        </h1>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          The link you followed may be broken or the page may have been removed.
        </p>

        <Link
          to="/overview"
          className="inline-flex items-center gap-1.5 text-xs font-medium py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[6px] transition-colors"
        >
          <span>Return to Overview</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
};
