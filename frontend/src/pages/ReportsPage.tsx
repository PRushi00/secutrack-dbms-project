import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { AuditLog, DashboardMetrics } from '../types';
import {
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Printer,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [l, m] = await Promise.all([api.getAuditLogs(), api.getMetrics()]);
      setLogs(l);
      setMetrics(m);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Timestamp,Actor,Role,Action,Target,Details,IP\n' +
      logs
        .map(
          l =>
            `"${l.id}","${l.timestamp}","${l.actor_name}","${l.actor_role}","${l.action}","${l.target_entity}","${l.details}","${l.ip_address}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SecuTrack_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Audit trail exported successfully as CSV.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const filteredLogs = logs.filter(
    l =>
      l.actor_name.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target_entity.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
              Executive Reports & Operational Audit Log
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-elevated text-accent-primary border border-border-default">
              ISO/IEC 27005 COMPLIANT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Produce compliance audit dossiers and inspect append-only operator activity records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary rounded-lg border border-border-default hover:bg-bg-elevated transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-bg-main bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-cyber transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Export Notice Banner */}
      {exportNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-[#45C99A] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Executive Summary Card (Visible in UI and Print) */}
      <div className="cyber-card p-6 border-border-default bg-[#0C1628]">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Executive Cybersecurity Risk & Governance Summary
              </h3>
              <p className="text-xs text-text-muted font-mono">
                Institution: SecureExam University • Evaluation Cycle: Academic Semester Final
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-text-muted hidden sm:inline-block">
            Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-xs">
          <div className="p-3.5 rounded bg-bg-main border border-border-subtle">
            <div className="text-text-muted">Monitored Assets</div>
            <div className="font-mono text-xl font-bold text-text-primary mt-1">
              {metrics?.total_assets || 6} Systems
            </div>
          </div>
          <div className="p-3.5 rounded bg-bg-main border border-border-subtle">
            <div className="text-text-muted">Active Risk Findings</div>
            <div className="font-mono text-xl font-bold text-status-critical mt-1">
              {metrics?.open_risks || 5} Identified
            </div>
          </div>
          <div className="p-3.5 rounded bg-bg-main border border-border-subtle">
            <div className="text-text-muted">Total Annual Exposure (ALE)</div>
            <div className="font-mono text-xl font-bold text-text-primary mt-1">
              ₹{(metrics?.total_annual_loss_expectancy || 734500).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="p-3.5 rounded bg-bg-main border border-border-subtle">
            <div className="text-text-muted">Remediation Progress</div>
            <div className="font-mono text-xl font-bold text-[#45C99A] mt-1">
              {metrics?.remediation_completion_pct || 17}% Completed
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded bg-bg-main/60 border border-border-subtle text-xs text-text-secondary leading-relaxed">
          <strong className="text-text-primary block mb-1">Key Operational Audit Finding:</strong>
          Implementation of mandatory WebAuthn MFA on faculty credentials and secondary clustered failover nodes accounts for ₹4,20,000 in risk mitigation under the approved ₹6,00,000 cybersecurity improvement ceiling.
        </div>
      </div>

      {/* Immutable Audit Log Trail */}
      <div className="cyber-card p-5 border-border-default print:border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Immutable Operator Audit Log Trail
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Append-only security log recording administrative changes, authentication events, and scan triggers.
            </p>
          </div>

          <div className="relative w-full sm:w-64 print:hidden">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Filter audit events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input w-full pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Audit Log Table">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Operational Details</th>
                <th className="py-2.5 px-3 text-right">Origin IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-bg-elevated/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-text-muted whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-semibold text-text-primary">{log.actor_name}</div>
                    <div className="text-[10px] text-text-muted">{log.actor_role}</div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-bg-main border border-border-default text-accent-secondary">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-text-primary whitespace-nowrap">
                    {log.target_entity}
                  </td>
                  <td className="py-3 px-3 text-text-secondary max-w-md">
                    {log.details}
                  </td>
                  <td className="py-3 px-3 font-mono text-text-muted text-right whitespace-nowrap">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

