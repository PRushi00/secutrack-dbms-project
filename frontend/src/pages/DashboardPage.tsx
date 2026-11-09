import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  Asset,
  AuditLog,
  DashboardMetrics,
  Risk,
} from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { RiskExplanationModal } from '../components/RiskExplanationModal';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  Clock,
  ExternalLink,
  HardDrive,
  RefreshCw,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [m, r, a, l] = await Promise.all([
        api.getMetrics(),
        api.getRisks(),
        api.getAssets(),
        api.getAuditLogs(),
      ]);
      setMetrics(m);
      setRisks(r);
      setAssets(a);
      setLogs(l);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerScan = async () => {
    setScanning(true);
    setScanMessage(null);
    try {
      const res = await api.triggerScan();
      setScanMessage(res.message);
      await loadData();
      setTimeout(() => setScanMessage(null), 4000);
    } finally {
      setScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <RefreshCw className="w-5 h-5 animate-spin text-accent-primary" />
          <span>Synchronizing security operations telemetry...</span>
        </div>
      </div>
    );
  }

  const priorityRisks = risks
    .filter(r => r.status !== 'Resolved')
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  const atRiskAssets = assets.filter(a => a.status === 'At Risk' || a.status === 'Under Remediation');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 8.1 Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
              Security Posture Overview
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-bg-elevated text-accent-primary border border-border-default">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Continuous risk quantification, causal explanation, and remediation tracking across SecureExam University.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTriggerScan}
            disabled={scanning}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-bg-main bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-cyber disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Auditing Telemetry...' : 'Trigger Asset Scan'}</span>
          </button>
          <button
            onClick={() => navigate('/app/risks')}
            className="px-3.5 py-2 text-xs font-medium text-text-secondary hover:text-text-primary rounded-lg border border-border-default hover:bg-bg-elevated transition-colors"
          >
            View Critical Risks ({metrics?.critical_high_risks || 0})
          </button>
        </div>
      </div>

      {/* Alert Banner upon scan */}
      {scanMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-[#45C99A] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{scanMessage}</span>
          </div>
          <span className="font-mono text-[10px] text-text-muted">Logged to Audit Trail</span>
        </div>
      )}

      {/* 8.2 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Assets */}
        <div
          onClick={() => navigate('/app/assets')}
          className="cyber-card p-4 cursor-pointer hover:border-accent-primary/40 group"
        >
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs">Monitored Assets</span>
            <HardDrive className="w-4 h-4 group-hover:text-accent-primary transition-colors" />
          </div>
          <div className="font-mono text-2xl font-bold text-text-primary">
            {metrics?.total_assets || 0}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            {atRiskAssets.length} asset(s) under review
          </div>
        </div>

        {/* Open Risks */}
        <div
          onClick={() => navigate('/app/risks')}
          className="cyber-card p-4 cursor-pointer hover:border-status-critical/40 group"
        >
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs">Open Risks</span>
            <ShieldAlert className="w-4 h-4 text-status-critical" />
          </div>
          <div className="font-mono text-2xl font-bold text-text-primary">
            {metrics?.open_risks || 0}
          </div>
          <div className="text-[11px] text-status-critical mt-1 font-medium">
            {metrics?.critical_high_risks || 0} Critical / High
          </div>
        </div>

        {/* Open Vulnerabilities */}
        <div
          onClick={() => navigate('/app/vulnerabilities')}
          className="cyber-card p-4 cursor-pointer hover:border-status-warning/40 group"
        >
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs">Vulnerabilities</span>
            <AlertOctagon className="w-4 h-4 text-status-warning" />
          </div>
          <div className="font-mono text-2xl font-bold text-text-primary">
            {metrics?.open_vulnerabilities || 0}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            Active CVE findings
          </div>
        </div>

        {/* Active Incidents */}
        <div
          onClick={() => navigate('/app/incidents')}
          className="cyber-card p-4 cursor-pointer hover:border-accent-secondary/40 group"
        >
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs">Active Incidents</span>
            <Activity className="w-4 h-4 text-accent-secondary" />
          </div>
          <div className="font-mono text-2xl font-bold text-text-primary">
            {metrics?.active_incidents || 0}
          </div>
          <div className="text-[11px] text-text-muted mt-1">
            SOC investigations
          </div>
        </div>

        {/* Remediation Completion */}
        <div
          onClick={() => navigate('/app/remediation')}
          className="cyber-card p-4 cursor-pointer hover:border-[#45C99A]/40 group"
        >
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs">Remediation Done</span>
            <CheckCircle2 className="w-4 h-4 text-[#45C99A]" />
          </div>
          <div className="font-mono text-2xl font-bold text-[#45C99A]">
            {metrics?.remediation_completion_pct || 0}%
          </div>
          <div className="w-full bg-bg-main h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#45C99A] h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics?.remediation_completion_pct || 0}%` }}
            />
          </div>
        </div>

        {/* Annual Loss Expectancy */}
        <div
          onClick={() => navigate('/app/reports')}
          className="cyber-card p-4 cursor-pointer hover:border-accent-primary/40 group"
        >
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs">Total ALE</span>
            <Calculator className="w-4 h-4 group-hover:text-accent-primary transition-colors" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-text-primary">
            ₹{((metrics?.total_annual_loss_expectancy || 0) / 100000).toFixed(1)}L
          </div>
          <div className="text-[11px] text-text-muted mt-1 truncate">
            ₹{(metrics?.total_annual_loss_expectancy || 0).toLocaleString('en-IN')}/yr
          </div>
        </div>
      </div>

      {/* Middle Row: Severity Chart & Budget Allocation Posture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 8.3 Risk Severity Visualization */}
        <div className="lg:col-span-6 cyber-card p-5 sm:p-6 border-border-default">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Risk Distribution by Severity Tier
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Current breakdown across recorded university risks
              </p>
            </div>
            <button
              onClick={() => navigate('/app/risks')}
              className="text-xs text-accent-primary hover:underline flex items-center gap-1"
            >
              <span>Explore Register</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {/* Critical */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <span className="w-2.5 h-2.5 rounded-sm bg-status-critical" />
                  Critical Severity (Score 17 - 25)
                </span>
                <span className="font-mono font-semibold text-status-critical">
                  {metrics?.severity_distribution.critical || 0} risks
                </span>
              </div>
              <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden">
                <div
                  className="bg-status-critical h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((metrics?.severity_distribution.critical || 0) / (risks.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FF884D]" />
                  High Severity (Score 10 - 16)
                </span>
                <span className="font-mono font-semibold text-[#FF884D]">
                  {metrics?.severity_distribution.high || 0} risks
                </span>
              </div>
              <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF884D] h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((metrics?.severity_distribution.high || 0) / (risks.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <span className="w-2.5 h-2.5 rounded-sm bg-status-warning" />
                  Medium Severity (Score 5 - 9)
                </span>
                <span className="font-mono font-semibold text-status-warning">
                  {metrics?.severity_distribution.medium || 0} risks
                </span>
              </div>
              <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden">
                <div
                  className="bg-status-warning h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((metrics?.severity_distribution.medium || 0) / (risks.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 font-medium text-text-primary">
                  <span className="w-2.5 h-2.5 rounded-sm bg-status-success" />
                  Low Severity (Score 1 - 4)
                </span>
                <span className="font-mono font-semibold text-status-success">
                  {metrics?.severity_distribution.low || 0} risks
                </span>
              </div>
              <div className="w-full bg-bg-main h-2 rounded-full overflow-hidden">
                <div
                  className="bg-status-success h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((metrics?.severity_distribution.low || 0) / (risks.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted font-mono">
            <span>Formula: Qualitative Score = Likelihood × Impact (1-25)</span>
            <span className="text-accent-primary">Calculated Deterministically</span>
          </div>
        </div>

        {/* 8.4 Cybersecurity Budget & Posture */}
        <div className="lg:col-span-6 cyber-card p-5 sm:p-6 border-border-default flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Cybersecurity Improvement Budget vs Exposure
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  SecureExam University annual allocation: ₹6,00,000 ceiling
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-bg-main text-accent-secondary border border-border-default">
                BUDGET OPTIMIZATION
              </span>
            </div>

            <div className="p-4 rounded-lg bg-bg-main/60 border border-border-subtle space-y-3 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">Approved Remediation Budget:</span>
                <span className="font-mono font-bold text-text-primary">₹6,00,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Committed Task Allocation:</span>
                <span className="font-mono font-bold text-accent-primary">₹5,10,000 (85%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Unallocated Contingency Reserve:</span>
                <span className="font-mono font-bold text-[#45C99A]">₹90,000 (15%)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border-subtle">
                <span className="text-text-secondary">Projected Annual Loss Reduction:</span>
                <span className="font-mono font-bold text-status-critical">₹6,87,500</span>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Allocating ₹1,50,000 to FIDO2 MFA (REM-01) and ₹1,80,000 to Exam Cluster Clustering (REM-03) neutralizes 68% of total university exposure while maintaining ₹90,000 in contingency reserves.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
            <button
              onClick={() => navigate('/app/remediation')}
              className="text-xs font-semibold text-accent-primary hover:text-accent-primary/80 flex items-center gap-1.5"
            >
              <span>Inspect Remediation Budget Workflows</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8.5 Priority Risk Table */}
      <div className="cyber-card p-5 sm:p-6 border-border-default">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Priority Risk Register (Actionable Focus)
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Click any risk row to open the Explainable AI Reasoning Inspector
            </p>
          </div>
          <button
            onClick={() => navigate('/app/risks')}
            className="text-xs text-accent-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All ({risks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Priority Risks Table">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Risk ID</th>
                <th className="py-2.5 px-3">Title & Finding</th>
                <th className="py-2.5 px-3">Target Asset</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Qualitative</th>
                <th className="py-2.5 px-3">Annual Loss (ALE)</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {priorityRisks.map(risk => (
                <tr
                  key={risk.id}
                  onClick={() => setSelectedRisk(risk)}
                  className="hover:bg-bg-elevated/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-mono text-accent-primary font-semibold whitespace-nowrap">
                    {risk.risk_code}
                  </td>
                  <td className="py-3 px-3 font-medium text-text-primary max-w-xs truncate">
                    {risk.title}
                  </td>
                  <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                    {risk.asset_name || 'Core Asset'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <SeverityBadge severity={risk.risk_level} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-text-muted whitespace-nowrap">
                    {risk.likelihood} × {risk.impact} = <span className="text-text-primary font-bold">{risk.risk_score}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-status-critical whitespace-nowrap">
                    ₹{risk.annual_loss_expectancy?.toLocaleString('en-IN') || '1,50,000'}
                  </td>
                  <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                    {risk.assigned_owner}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedRisk(risk);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-bg-main hover:bg-accent-primary hover:text-bg-main border border-border-default text-text-secondary transition-all font-medium"
                    >
                      <BrainCircuit className="w-3 h-3 text-accent-primary group-hover:text-bg-main" />
                      <span>Explain</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Asset Health & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 8.6 Asset Health */}
        <div className="lg:col-span-5 cyber-card p-5 border-border-default">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-bold text-text-primary">
              Asset Security Health
            </h3>
            <button
              onClick={() => navigate('/app/assets')}
              className="text-xs text-accent-primary hover:underline"
            >
              All Assets ({assets.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {assets.slice(0, 4).map(asset => {
              const isAtRisk = asset.status === 'At Risk';
              return (
                <div
                  key={asset.id}
                  onClick={() => navigate('/app/assets')}
                  className="p-3 rounded-lg bg-bg-main/70 border border-border-subtle flex items-center justify-between hover:border-accent-primary/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isAtRisk ? 'bg-status-critical animate-pulse' : 'bg-status-success'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-text-primary">{asset.name}</div>
                      <div className="text-[10px] text-text-muted font-mono">
                        {asset.asset_tag} • {asset.type} • {asset.ip_address}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                      isAtRisk
                        ? 'bg-status-critical/10 text-status-critical border-status-critical/30'
                        : 'bg-status-success/10 text-status-success border-status-success/30'
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8.7 Recent Activity & 8.8 Recommended Next Actions */}
        <div className="lg:col-span-7 cyber-card p-5 border-border-default flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-primary" />
                <span>Recent System & Audit Activity</span>
              </h3>
              <button
                onClick={() => navigate('/app/reports')}
                className="text-xs text-accent-primary hover:underline"
              >
                Audit Log Trail
              </button>
            </div>

            <div className="space-y-2.5">
              {logs.slice(0, 3).map(log => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-bg-main/50 border border-border-subtle text-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-text-muted mb-1">
                    <span className="text-accent-secondary font-semibold">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-text-primary text-xs font-medium">{log.details}</p>
                  <div className="text-[10px] text-text-muted mt-1 flex items-center gap-2">
                    <span>Actor: {log.actor_name} ({log.actor_role})</span>
                    <span>•</span>
                    <span>IP: {log.ip_address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8.8 Contextual Shortcuts */}
          <div className="mt-4 pt-3 border-t border-border-subtle">
            <div className="text-[11px] font-mono uppercase text-text-muted mb-2">
              Recommended Next Actions:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => navigate('/app/risks')}
                className="px-2.5 py-1.5 rounded bg-bg-main hover:bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-status-critical" />
                <span>Review Critical Findings</span>
              </button>
              <button
                onClick={() => navigate('/app/remediation')}
                className="px-2.5 py-1.5 rounded bg-bg-main hover:bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#45C99A]" />
                <span>Continue Remediation Tasks</span>
              </button>
              <button
                onClick={() => navigate('/app/incidents')}
                className="px-2.5 py-1.5 rounded bg-bg-main hover:bg-bg-elevated border border-border-subtle text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 text-accent-secondary" />
                <span>Review Phishing Incidents</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Explainable Risk Inspection Modal */}
      <RiskExplanationModal
        risk={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        onNavigateToRemediation={riskId => {
          setSelectedRisk(null);
          navigate('/app/remediation');
        }}
      />
    </div>
  );
};

