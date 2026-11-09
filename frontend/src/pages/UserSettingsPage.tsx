import React, { useState } from 'react';
import { api } from '../api/client';
import { User, UserRole } from '../types';
import {
  Bell,
  CheckCircle2,
  Lock,
  Moon,
  RefreshCw,
  Search,
  Shield,
  Sliders,
  UserCheck,
  Users,
} from 'lucide-react';

export const UserSettingsPage: React.FC = () => {
  const currentUser = api.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Settings State
  const [telemetryInterval, setTelemetryInterval] = useState('30');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [aleDisplayMode, setAleDisplayMode] = useState<'INR' | 'USD'>('INR');

  const users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@secutrack.io',
      full_name: 'Dr. Alistair Vance',
      role: 'Security Admin',
      department: 'CISO Directorate',
    },
    {
      id: 2,
      username: 'analyst',
      email: 'analyst@secutrack.io',
      full_name: 'Devin Vance',
      role: 'SOC Analyst',
      department: 'Threat Operations',
    },
    {
      id: 3,
      username: 'lead',
      email: 'remediation@secutrack.io',
      full_name: 'Elena Rostova',
      role: 'Remediation Lead',
      department: 'Infrastructure Security',
    },
    {
      id: 4,
      username: 'auditor',
      email: 'auditor@secutrack.io',
      full_name: 'Marcus Sterling',
      role: 'Auditor',
      department: 'Compliance & GRC',
    },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice('Security operations preferences saved successfully.');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
              Identity Management & Operator Preferences
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-elevated text-accent-primary border border-border-default">
              RBAC ACTIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage multi-tier role assignments and configure local telemetry polling parameters.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-lg bg-bg-secondary border border-border-default self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-accent-primary text-bg-main shadow-cyber'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Authorized Operators
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-accent-primary text-bg-main shadow-cyber'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            System Settings
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-[#45C99A] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedNotice}</span>
        </div>
      )}

      {activeTab === 'users' ? (
        <div className="space-y-6">
          <div className="cyber-card p-5 border-border-default">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Operator Role Directory
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Institutional accounts authorized for SecureExam risk telemetry.
                </p>
              </div>
              <span className="text-xs text-text-muted font-mono">
                Active Session: <strong className="text-accent-primary">{currentUser?.username}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Operators Table">
                <thead>
                  <tr className="border-b border-border-subtle text-text-muted uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3">Operator Name</th>
                    <th className="py-2.5 px-3">Username</th>
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Assigned Role</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/60">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-bg-elevated/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-text-primary whitespace-nowrap">
                        {u.full_name}
                      </td>
                      <td className="py-3 px-3 font-mono text-accent-primary whitespace-nowrap">
                        {u.username}
                      </td>
                      <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                        {u.email}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-bg-main border border-border-default font-medium text-text-primary">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-text-muted whitespace-nowrap">
                        {u.department}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-success/15 text-status-success border border-status-success/30">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Permissions Notice */}
          <div className="p-4 rounded-lg bg-bg-secondary border border-border-subtle text-xs text-text-muted flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent-primary" />
              <span>
                Backend authentication authority is strictly enforced at the API layer. Frontend role switches are subject to JWT token verification.
              </span>
            </div>
            <span className="font-mono text-[10px]">RBAC Level 3</span>
          </div>
        </div>
      ) : (
        /* Settings Form */
        <div className="cyber-card p-6 border-border-default max-w-2xl bg-[#0C1628]">
          <h3 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-border-subtle">
            Operational Telemetry Configuration
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            <div>
              <label className="block text-text-secondary font-medium mb-1">
                Continuous Telemetry Polling Interval (seconds)
              </label>
              <select
                value={telemetryInterval}
                onChange={e => setTelemetryInterval(e.target.value)}
                className="cyber-input w-full px-3 py-2 text-xs"
              >
                <option value="15">15 seconds (High Frequency)</option>
                <option value="30">30 seconds (Standard Operations)</option>
                <option value="60">60 seconds (Conserve Resources)</option>
              </select>
            </div>

            <div>
              <label className="block text-text-secondary font-medium mb-1">
                Quantitative Exposure Currency Notation
              </label>
              <select
                value={aleDisplayMode}
                onChange={e => setAleDisplayMode(e.target.value as any)}
                className="cyber-input w-full px-3 py-2 text-xs"
              >
                <option value="INR">Indian Rupee (₹ - Standard for Academic Case Study)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="rounded border-border-default bg-bg-main text-accent-primary focus:ring-accent-primary"
                />
                <span>Dispatch urgent alerts to SOC Analyst when Critical Risk ALE exceeds ₹2,00,000</span>
              </label>
            </div>

            <div className="pt-4 border-t border-border-subtle flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-bg-main font-semibold text-xs shadow-cyber"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

