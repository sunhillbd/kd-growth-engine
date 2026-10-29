import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Check, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

export const SetupChecklist: React.FC = () => {
  const { 
    setupChecklistDismissed, dismissSetupChecklist, 
    offers, icps, proof, onboardingData 
  } = useStore();

  if (setupChecklistDismissed) return null;

  // Compute status for each step
  const steps = [
    {
      id: 'business',
      label: 'Business profile',
      done: true,
      link: '/settings'
    },
    {
      id: 'offers_icps',
      label: 'Offers and ICPs',
      done: offers.length > 0 && icps.length > 0,
      link: '/brain/offers'
    },
    {
      id: 'proof',
      label: 'Proof & case studies',
      done: proof.length > 0,
      link: '/brain/proof'
    },
    {
      id: 'connections',
      label: 'Publishing connections',
      done: !!(onboardingData.connectedTools?.outreach || onboardingData.connectedTools?.linkedin_personal),
      link: '/settings'
    },
    {
      id: 'limits',
      label: 'Safety limits and approval rules',
      done: true,
      link: '/settings'
    }
  ];

  const allDone = steps.every(s => s.done);

  return (
    <div className="bg-white border border-gray-200 rounded-[6px] p-4 relative shadow-xs font-sans">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              Setup Checklist
            </h3>
            {allDone && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-medium">
                Complete
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Initialize your studio knowledge base and integrations to automate intent discovery.
          </p>
        </div>

        <button
          type="button"
          onClick={dismissSetupChecklist}
          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
          title="Dismiss setup checklist"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2 border-t border-gray-100 text-xs">
        {steps.map(step => (
          <div key={step.id} className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-400'
              }`}>
                {step.done ? <Check className="w-2.5 h-2.5 stroke-[2.5]" /> : <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>}
              </div>
              <span className={`text-[11px] font-medium truncate ${step.done ? 'text-gray-800' : 'text-gray-600'}`}>
                {step.label}
              </span>
            </div>

            {!step.done ? (
              <Link to={step.link} className="text-[11px] text-blue-600 hover:text-blue-800 font-medium shrink-0 ml-1">
                Finish
              </Link>
            ) : (
              <span className="text-[10px] text-emerald-600 font-mono shrink-0 ml-1">Done</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
