import React, { useEffect } from 'react';
import { Risk } from '../types';
import { SeverityBadge } from './SeverityBadge';
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  FileSearch,
  Server,
  ShieldAlert,
  X,
} from 'lucide-react';

interface RiskExplanationModalProps {
  risk: Risk | null;
  onClose: () => void;
  onNavigateToRemediation?: (riskId: number) => void;
}

export const RiskExplanationModal: React.FC<RiskExplanationModalProps> = ({
  risk,
  onClose,
  onNavigateToRemediation,
}) => {
  useEffect(() => {
    if (!risk) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [risk, onClose]);

  if (!risk) return null;

  const expl = risk.explanation || {
    what_identified: risk.threat_description,
    why_it_matters: `Potential single loss exposure of ₹${risk.single_loss_expectancy?.toLocaleString('en-IN') || '3,00,000'} impacting ${risk.asset_name || 'core assets'}.`,
    evidence_telemetry: `Calculated from asset record ${risk.affected_asset_id} with Likelihood ${risk.likelihood}/5 and Impact ${risk.impact}/5.`,
    why_priority: `Assigned ${risk.risk_level} based on Qualitative Matrix (Score: ${risk.risk_score}/25) and Annualized Loss Expectancy of ₹${risk.annual_loss_expectancy?.toLocaleString('en-IN') || '1,50,000'}.`,
    actionable_remediation: `1. Enforce compensating access controls.\n2. Execute verification tests.\n3. Re-evaluate exposure factor during next audit cycle.`,
    confidence_score: 0.94,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-risk-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto cyber-card bg-[#0F1B2D] border border-border-default shadow-cyber-lg p-6 md:p-8 rounded-xl">
        {/* Header Bar */}
        <div className="flex items-start justify-between pb-5 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-bg-main text-accent-primary border border-border-default">
                {risk.risk_code}
              </span>
              <SeverityBadge severity={risk.risk_level} size="sm" />
              <span className="text-xs text-text-secondary flex items-center gap-1 ml-2">
                <BrainCircuit className="w-3.5 h-3.5 text-accent-primary" />
                Explainable Risk Engine (Score: {Math.round((expl.confidence_score || 0.95) * 100)}% Confidence)
              </span>
            </div>
            <h2 id="modal-risk-title" className="text-xl md:text-2xl font-bold text-text-primary">
              {risk.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quantitative Assessment Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 p-3.5 rounded-lg bg-bg-main/70 border border-border-subtle text-xs">
          <div>
            <div className="text-text-muted">Asset Value (AV)</div>
            <div className="font-mono font-semibold text-text-primary text-sm mt-0.5">
              ₹{risk.asset_value?.toLocaleString('en-IN') || '5,00,000'}
            </div>
          </div>
          <div>
            <div className="text-text-muted">Exposure Factor (EF)</div>
            <div className="font-mono font-semibold text-text-primary text-sm mt-0.5">
              {Math.round((risk.exposure_factor || 0.6) * 100)}%
            </div>
          </div>
          <div>
            <div className="text-text-muted">Single Loss (SLE)</div>
            <div className="font-mono font-semibold text-status-warning text-sm mt-0.5">
              ₹{risk.single_loss_expectancy?.toLocaleString('en-IN') || '3,00,000'}
            </div>
          </div>
          <div>
            <div className="text-text-muted">Annual Loss (ALE)</div>
            <div className="font-mono font-semibold text-status-critical text-sm mt-0.5">
              ₹{risk.annual_loss_expectancy?.toLocaleString('en-IN') || '1,50,000'}
            </div>
          </div>
        </div>

        {/* Structured 5-Pillar Explanation Body */}
        <div className="space-y-5 text-sm">
          {/* 1. What was identified? */}
          <div className="p-4 rounded-lg bg-bg-elevated/50 border border-border-subtle">
            <h3 className="flex items-center gap-2 font-semibold text-accent-primary text-sm mb-2">
              <ShieldAlert className="w-4 h-4 text-accent-primary" />
              1. What was identified?
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {expl.what_identified}
            </p>
          </div>

          {/* 2. Why does it matter? */}
          <div className="p-4 rounded-lg bg-bg-elevated/50 border border-border-subtle">
            <h3 className="flex items-center gap-2 font-semibold text-accent-secondary text-sm mb-2">
              <AlertTriangle className="w-4 h-4 text-accent-secondary" />
              2. Why does it matter?
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {expl.why_it_matters}
            </p>
          </div>

          {/* 3. Evidence & telemetry */}
          <div className="p-4 rounded-lg bg-bg-elevated/50 border border-border-subtle">
            <h3 className="flex items-center gap-2 font-semibold text-text-primary text-sm mb-2">
              <FileSearch className="w-4 h-4 text-accent-primary" />
              3. What evidence supports this assessment?
            </h3>
            <div className="font-mono text-xs p-3 rounded bg-bg-main border border-border-default text-accent-primary/90 leading-relaxed whitespace-pre-wrap">
              {expl.evidence_telemetry}
            </div>
          </div>

          {/* 4. Why this priority? */}
          <div className="p-4 rounded-lg bg-bg-elevated/50 border border-border-subtle">
            <h3 className="flex items-center gap-2 font-semibold text-[#F5B942] text-sm mb-2">
              <Calculator className="w-4 h-4 text-[#F5B942]" />
              4. Why this priority? (Quantitative & Qualitative Matrix)
            </h3>
            <p className="text-text-secondary leading-relaxed mb-3">
              {expl.why_priority}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded bg-bg-main border border-border-default text-text-secondary">
                Likelihood: <strong className="text-text-primary">{risk.likelihood}/5</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-bg-main border border-border-default text-text-secondary">
                Impact: <strong className="text-text-primary">{risk.impact}/5</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-bg-main border border-border-default text-text-secondary">
                Combined Score: <strong className="text-status-critical">{risk.risk_score}/25</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-bg-main border border-border-default text-text-secondary flex items-center gap-1">
                <Server className="w-3.5 h-3.5" />
                Affected Asset: <strong className="text-text-primary">{risk.asset_name || 'Core System'}</strong>
              </span>
            </div>
          </div>

          {/* 5. What should happen next? */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h3 className="flex items-center gap-2 font-semibold text-[#45C99A] text-sm mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#45C99A]" />
              5. What should happen next? (Recommended Remediation)
            </h3>
            <div className="text-text-secondary leading-relaxed whitespace-pre-wrap text-sm">
              {expl.actionable_remediation}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-border-subtle">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg border border-border-default hover:bg-bg-elevated transition-colors"
          >
            Close Inspector
          </button>
          {onNavigateToRemediation && (
            <button
              onClick={() => {
                onClose();
                onNavigateToRemediation(risk.id);
              }}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-bg-main bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-cyber transition-all"
            >
              Open Remediation Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

