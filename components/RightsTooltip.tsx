'use client';

import { Info } from 'lucide-react';
import { RIGHTS_INFO } from '@/lib/constants';

export function RightsTooltip() {
  return (
    <div className="group relative inline-block">
      <button className="p-1.5 rounded-full bg-dark-card border border-dark-border hover:border-gold transition-colors">
        <Info size={16} className="text-dark-muted group-hover:text-gold" />
      </button>
      
      <div className="tooltip w-80 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        <h4 className="font-semibold text-gold mb-2 text-sm">Rights Summary</h4>
        <div className="space-y-2 text-xs">
          <div>
            <span className="font-medium text-ethos-exemplary">Lender:</span>
            <p className="text-dark-muted mt-0.5">{RIGHTS_INFO.lender}</p>
          </div>
          <div>
            <span className="font-medium text-ethos-reputable">Borrower:</span>
            <p className="text-dark-muted mt-0.5">{RIGHTS_INFO.borrower}</p>
          </div>
          <div>
            <span className="font-medium text-gold">Escrow:</span>
            <p className="text-dark-muted mt-0.5">{RIGHTS_INFO.escrow}</p>
          </div>
          <div className="pt-2 border-t border-dark-border">
            <span className="font-medium text-ethos-untrusted">Anti-Theft:</span>
            <p className="text-dark-muted mt-0.5">{RIGHTS_INFO.antiTheft}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
