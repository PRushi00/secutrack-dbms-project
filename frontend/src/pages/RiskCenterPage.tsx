import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/client';
import { Risk, Severity } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { RiskExplanationModal } from '../components/RiskExplanationModal';
import {
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
} from 'lucide-react';

export const RiskCenterPage: React.FC = () => {
  const context = useOutletContext<{ searchQuery?: string }>();
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'ale' | 'title'>('score');
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  const loadRisks = async () => {
    try {
      const data = await api.getRisks();
      setRisks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisks();
  }, []);

  const handleStatusChange = async (riskId: number, newStatus: Risk['status']) => {
    await api.updateRiskStatus(riskId, newStatus);
    await loadRisks();
  };

  const query = (search || context?.searchQuery || '').toLowerCase();

  const filtered = risks.filter(r => {
    const matchesQuery =
      r.title.toLowerCase().includes(query) ||
      r.risk_code.toLowerCase().includes(query) ||
      (r.asset_name && r.asset_name.toLowerCase().includes(query)) ||
      r.threat_description.toLowerCase().includes(query);

    const matchesSeverity =
      severityFilter === 'ALL' || r.risk_level.toUpperCase() === severityFilter.toUpperCase();

    const matchesStatus =
      statusFilter === 'ALL' || r.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesSeverity && matchesStatus;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'score') return b.risk_score - a.risk_score;
    if (sortBy === 'ale') return (b.annual_loss_expectancy || 0) - (a.annual_loss_expectancy || 0);
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
              Risk Center & Causal Intelligence
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-elevated text-accent-primary border border-border-default">
              {filtered.length} Recorded Risks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Prioritize exposures using quantitative SLE/ALE formulas alongside explainable root-cause telemetry.
          </p>
        </div>

        <button
          onClick={loadRisks}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary rounded-lg border border-border-default hover:bg-bg-elevated transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Register</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="cyber-card p-4 border-border-default space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Local Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Filter by risk code, title, or asset..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input w-full pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Severity Filter */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0">Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="cyber-input w-full px-2.5 py-1.5 text-xs text-text-primary"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="cyber-input w-full px-2.5 py-1.5 text-xs text-text-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="open">Open</option>
              <option value="under investigation">Under Investigation</option>
              <option value="mitigating">Mitigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="cyber-input w-full px-2.5 py-1.5 text-xs text-text-primary"
            >
              <option value="score">Risk Score (High-Low)</option>
              <option value="ale">Annual Loss (ALE)</option>
              <option value="title">Risk Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk List / Cards */}
      {loading ? (
        <div className="p-12 text-center text-text-muted">Loading risk register...</div>
      ) : filtered.length === 0 ? (
        <div className="cyber-card p-12 text-center">
          <ShieldAlert className="w-10 h-10 mx-auto text-text-muted mb-3" />
          <h3 className="text-base font-semibold text-text-primary">No matching risks found</h3>
          <p className="text-xs text-text-secondary mt-1">
            Try adjusting your search criteria or reset filters to display all recorded exposures.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(risk => (
            <div
              key={risk.id}
              className="cyber-card p-4 sm:p-5 border-border-default hover:border-accent-primary/40 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Code, Title, Asset, Threat */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-bg-main text-accent-primary border border-border-default">
                      {risk.risk_code}
                    </span>
                    <SeverityBadge severity={risk.risk_level} size="sm" />
                    <span className="text-xs text-text-muted font-mono">
                      Asset: <strong className="text-text-primary">{risk.asset_name || 'Core System'}</strong>
                    </span>
                    <span className="text-xs text-text-muted">• Owner: {risk.assigned_owner}</span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary">
                    {risk.title}
                  </h3>

                  <p className="text-xs text-text-secondary line-clamp-2 max-w-3xl leading-relaxed">
                    {risk.threat_description}
                  </p>
                </div>

                {/* Right: Quantitative Stats & Action */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-border-subtle shrink-0">
                  {/* Qualitative calculation */}
                  <div className="text-center sm:text-right">
                    <div className="text-[10px] text-text-muted font-mono uppercase">Score</div>
                    <div className="font-mono text-sm font-bold text-text-primary">
                      {risk.likelihood} × {risk.impact} = <span className="text-status-critical">{risk.risk_score}</span>
                    </div>
                  </div>

                  {/* Quantitative ALE */}
                  <div className="text-center sm:text-right">
                    <div className="text-[10px] text-text-muted font-mono uppercase">Annual Loss (ALE)</div>
                    <div className="font-mono text-sm font-bold text-status-critical">
                      ₹{risk.annual_loss_expectancy?.toLocaleString('en-IN') || '1,50,000'}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <select
                      value={risk.status}
                      onChange={e => handleStatusChange(risk.id, e.target.value as any)}
                      className="cyber-input text-xs px-2 py-1.5 font-medium"
                    >
                      <option value="Open">Open</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Mitigating">Mitigating</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Accepted">Accepted</option>
                    </select>
                  </div>

                  {/* Explain Button */}
                  <button
                    onClick={() => setSelectedRisk(risk)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary text-bg-main hover:bg-accent-primary/90 font-semibold text-xs shadow-cyber transition-all cursor-pointer"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Explain Risk</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deep Explainable Risk Inspector Modal */}
      <RiskExplanationModal
        risk={selectedRisk}
        onClose={() => setSelectedRisk(null)}
      />
    </div>
  );
};

