import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/client';
import { Incident } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  User,
  X,
} from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const context = useOutletContext<{ searchQuery?: string }>();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInc, setSelectedInc] = useState<Incident | null>(null);

  const loadIncidents = async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedInc) {
        setSelectedInc(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInc]);

  const handleUpdateStatus = async (id: number, newStatus: Incident['status']) => {
    await api.updateIncidentStatus(id, newStatus);
    await loadIncidents();
    if (selectedInc && selectedInc.id === id) {
      setSelectedInc({ ...selectedInc, status: newStatus });
    }
  };

  const query = (search || context?.searchQuery || '').toLowerCase();

  const filtered = incidents.filter(i => {
    const matchesQuery =
      i.title.toLowerCase().includes(query) ||
      i.incident_code.toLowerCase().includes(query) ||
      i.assigned_analyst.toLowerCase().includes(query) ||
      i.summary.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'ALL' || i.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
              SOC Incident Response & Containment
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-elevated text-accent-primary border border-border-default">
              {filtered.length} Active Incidents
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track active security investigations, forensic timelines, containment milestones, and analyst assignments.
          </p>
        </div>

        <button
          onClick={loadIncidents}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary rounded-lg border border-border-default hover:bg-bg-elevated transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Incidents</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="cyber-card p-4 border-border-default">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Filter by code, analyst, title, or summary..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input w-full pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div className="lg:col-span-4 flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="cyber-input w-full px-2.5 py-1.5 text-xs text-text-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="contained">Contained</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="space-y-3">
        {filtered.map(inc => (
          <div
            key={inc.id}
            onClick={() => setSelectedInc(inc)}
            className="cyber-card p-5 border-border-default hover:border-accent-secondary/50 transition-all cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-bg-main text-accent-secondary border border-border-default">
                    {inc.incident_code}
                  </span>
                  <SeverityBadge severity={inc.severity} size="sm" />
                  <span className="text-xs text-text-muted">Target: {inc.asset_name || 'Campus Core'}</span>
                  <span className="text-xs text-text-muted">• Reported: {inc.reported_at}</span>
                </div>

                <h3 className="text-base font-bold text-text-primary">{inc.title}</h3>

                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 max-w-3xl">
                  {inc.summary}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border-subtle">
                <div className="text-left sm:text-right text-xs">
                  <div className="text-[10px] text-text-muted">Assigned Analyst</div>
                  <div className="font-medium text-text-primary flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-accent-primary" />
                    <span>{inc.assigned_analyst}</span>
                  </div>
                </div>

                <div>
                  <select
                    value={inc.status}
                    onClick={e => e.stopPropagation()}
                    onChange={e => handleUpdateStatus(inc.id, e.target.value as any)}
                    className="cyber-input text-xs px-2.5 py-1.5 font-medium"
                  >
                    <option value="Open">Open</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Contained">Contained</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedInc(inc);
                  }}
                  className="px-3 py-1.5 bg-bg-main hover:bg-bg-elevated border border-border-default rounded text-xs text-text-secondary"
                >
                  Timeline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Incident Detail Modal */}
      {selectedInc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-2xl p-6 bg-[#0E1A2C] border border-border-default shadow-cyber-lg">
            <div className="flex items-start justify-between pb-3 border-b border-border-subtle mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-bg-main text-accent-secondary border border-border-default">
                    {selectedInc.incident_code}
                  </span>
                  <SeverityBadge severity={selectedInc.severity} size="sm" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">{selectedInc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedInc(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded bg-bg-main border border-border-subtle space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Assigned Investigator:</span>
                  <span className="font-semibold text-text-primary">{selectedInc.assigned_analyst}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Target Asset:</span>
                  <span className="font-semibold text-accent-primary">{selectedInc.asset_name || 'Core Network'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Reported Timestamp:</span>
                  <span className="font-mono text-text-secondary">{selectedInc.reported_at}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-text-primary block mb-1">Incident Summary & Scope:</span>
                <p className="text-text-secondary leading-relaxed bg-bg-main p-3 rounded border border-border-subtle">
                  {selectedInc.summary}
                </p>
              </div>

              <div>
                <span className="font-semibold text-status-warning block mb-1">Containment & Forensic Actions:</span>
                <p className="text-text-secondary leading-relaxed bg-bg-main p-3 rounded border border-border-subtle">
                  {selectedInc.containment_steps}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded bg-bg-elevated/40 border border-border-subtle">
                <span className="text-text-secondary">Incident Status:</span>
                <div className="flex gap-2">
                  {(['Open', 'Investigating', 'Contained', 'Resolved'] as Incident['status'][]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedInc.id, st)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        selectedInc.status === st
                          ? 'bg-accent-primary text-bg-main font-bold shadow-cyber'
                          : 'bg-bg-main text-text-muted hover:text-text-primary border border-border-default'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-border-subtle flex justify-end">
              <button
                onClick={() => setSelectedInc(null)}
                className="px-4 py-2 bg-bg-main hover:bg-bg-elevated border border-border-default rounded text-xs text-text-secondary"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

