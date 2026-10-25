import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { ServerRiskItem } from '../../types/event';

interface RiskPanelProps {
  risks: ServerRiskItem[];
}

export const RiskPanel: React.FC<RiskPanelProps> = ({ risks }) => {
  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return <Badge variant="rose" size="sm">High Severity</Badge>;
      case 'medium':
        return <Badge variant="amber" size="sm">Medium Severity</Badge>;
      case 'low':
      default:
        return <Badge variant="slate" size="sm">Low Risk</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              What am I forgetting?
              <span className="text-xs bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded-full border border-rose-500/30">
                Pre-Flight Audit
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Veyra scanned your event constraints against common failure points to prevent costly surprises.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-rose-400">
          {risks.length} Risk Factors Identified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((risk, idx) => (
          <Card
            key={idx}
            variant="glass"
            padding="md"
            className="border-rose-500/25 bg-gradient-to-br from-rose-950/20 via-slate-900/60 to-slate-900/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-rose-400 font-bold">
                  0{idx + 1} // RISK FACTOR
                </span>
                {getSeverityBadge(risk.severity)}
              </div>

              <h5 className="text-base font-bold text-white mb-2">
                {risk.title}
              </h5>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 mt-3">
                <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Recommended Preventative Solution:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {risk.solution}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
