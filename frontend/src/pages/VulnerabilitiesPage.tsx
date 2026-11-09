import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/client';
import { Severity, Vulnerability } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import {
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Filter,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';

export const VulnerabilitiesPage: React.FC = () => {
  const context = useOutletContext<{ searchQuery?: string }>();
  const [vulns, setVulns] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);

  const loadVulns = async () => {
    try {
      const data = await api.getVulnerabilities();
      setVulns(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVulns();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedVuln) {
        setSelectedVuln(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVuln]);

  const query = (search || context?.searchQuery || '').toLowerCase();

  const filtered = vulns.filter(v => {
    const matchesQuery =
      v.title.toLowerCase().includes(query) ||
      v.vuln_code.toLowerCase().includes(query) ||
      v.cve_id.toLowerCase().includes(query) ||
      (v.asset_name && v.asset_name.toLowerCase().includes(query)) ||
      v.description.toLowerCase().includes(query);

    const matchesSeverity =
      severityFilter === 'ALL' || v.severity.toUpperCase() === severityFilter.toUpperCase();

    const matchesStatus =
      statusFilter === 'ALL' || v.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
              Vulnerability Telemetry & CVE Findings
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-elevated text-accent-primary border border-border-default">
              {filtered.length} Findings
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track recorded CVEs, automated scanner observations, and verified security flaws across production components.
          </p>
        </div>

        <button
          onClick={loadVulns}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary rounded-lg border border-border-default hover:bg-bg-elevated transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Findings</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="cyber-card p-4 border-border-default">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by CVE, title, asset, or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input w-full pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted"
            />
          </div>

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
            </select>
          </div>

          <div className="lg:col-span-3 flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="cyber-input w-full px-2.5 py-1.5 text-xs text-text-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="open">Open</option>
              <option value="confirmed">Confirmed</option>
              <option value="mitigated">Mitigated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="cyber-card p-4 sm:p-5 border-border-default">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Vulnerabilities Table">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Finding Code</th>
                <th className="py-2.5 px-3">CVE ID</th>
                <th className="py-2.5 px-3">Finding Title</th>
                <th className="py-2.5 px-3">Affected Asset</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">CVSS</th>
                <th className="py-2.5 px-3">Detection Source</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {filtered.map(vuln => (
                <tr
                  key={vuln.id}
                  onClick={() => setSelectedVuln(vuln)}
                  className="hover:bg-bg-elevated/60 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-semibold text-accent-primary whitespace-nowrap">
                    {vuln.vuln_code}
                  </td>
                  <td className="py-3 px-3 font-mono text-text-muted whitespace-nowrap">
                    {vuln.cve_id}
                  </td>
                  <td className="py-3 px-3 font-medium text-text-primary max-w-xs truncate">
                    {vuln.title}
                  </td>
                  <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                    {vuln.asset_name || `Asset #${vuln.affected_asset_id}`}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <SeverityBadge severity={vuln.severity} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold whitespace-nowrap">
                    <span
                      className={
                        vuln.cvss_score >= 9.0
                          ? 'text-status-critical font-bold'
                          : vuln.cvss_score >= 7.0
                          ? 'text-[#FF884D]'
                          : 'text-status-warning'
                      }
                    >
                      {vuln.cvss_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-text-secondary text-[11px] whitespace-nowrap">
                    {vuln.source}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        vuln.status === 'Open'
                          ? 'bg-status-critical/10 text-status-critical border-status-critical/30'
                          : 'bg-status-success/10 text-status-success border-status-success/30'
                      }`}
                    >
                      {vuln.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedVuln(vuln);
                      }}
                      className="px-2.5 py-1 rounded bg-bg-main hover:bg-bg-elevated border border-border-default text-text-secondary text-xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedVuln && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-2xl p-6 bg-[#0E1A2C] border border-border-default shadow-cyber-lg">
            <div className="flex items-start justify-between pb-3 border-b border-border-subtle mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-bg-main text-accent-primary border border-border-default">
                    {selectedVuln.vuln_code}
                  </span>
                  <SeverityBadge severity={selectedVuln.severity} size="sm" />
                  <span className="font-mono text-xs text-text-muted">
                    CVSS: <strong>{selectedVuln.cvss_score}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text-primary">
                  {selectedVuln.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVuln(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded bg-bg-main border border-border-subtle">
                <div>
                  <span className="text-text-muted">Target Asset:</span>
                  <div className="font-semibold text-text-primary mt-0.5">
                    {selectedVuln.asset_name || `Asset #${selectedVuln.affected_asset_id}`}
                  </div>
                </div>
                <div>
                  <span className="text-text-muted">Detection Telemetry Source:</span>
                  <div className="font-semibold text-accent-secondary mt-0.5">
                    {selectedVuln.source}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-semibold text-accent-primary block mb-1">Technical Finding Description:</span>
                <p className="text-text-secondary leading-relaxed bg-bg-main p-3 rounded border border-border-subtle">
                  {selectedVuln.description}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#45C99A] block mb-1">Recommended Remediation Guidance:</span>
                <p className="text-text-secondary leading-relaxed bg-bg-main p-3 rounded border border-border-subtle">
                  {selectedVuln.remediation_guidance}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-border-subtle flex justify-end">
              <button
                onClick={() => setSelectedVuln(null)}
                className="px-4 py-2 bg-bg-main hover:bg-bg-elevated border border-border-default rounded text-xs text-text-secondary"
              >
                Close Finding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

