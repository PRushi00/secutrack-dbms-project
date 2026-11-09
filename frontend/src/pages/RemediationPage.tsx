import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/client';
import { RemediationStatus, RemediationTask, Severity } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  RefreshCw,
  Search,
  User,
  Wrench,
  X,
} from 'lucide-react';

export const RemediationPage: React.FC = () => {
  const context = useOutletContext<{ searchQuery?: string }>();
  const [tasks, setTasks] = useState<RemediationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [activeTask, setActiveTask] = useState<RemediationTask | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [newStatus, setNewStatus] = useState<RemediationStatus>('Completed');

  const loadTasks = async () => {
    try {
      const data = await api.getRemediationTasks();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTask) {
        setActiveTask(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTask]);

  const handleOpenUpdate = (task: RemediationTask) => {
    setActiveTask(task);
    setNewStatus(task.status);
    setVerifyNotes(task.verification_notes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    await api.updateRemediationStatus(activeTask.id, newStatus, verifyNotes);
    setActiveTask(null);
    await loadTasks();
  };

  const query = (search || context?.searchQuery || '').toLowerCase();

  const filtered = tasks.filter(t => {
    const matchesQuery =
      t.title.toLowerCase().includes(query) ||
      t.task_code.toLowerCase().includes(query) ||
      t.assigned_owner.toLowerCase().includes(query) ||
      (t.asset_name && t.asset_name.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === 'ALL' || t.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === 'ALL' || t.priority.toUpperCase() === priorityFilter.toUpperCase();

    return matchesQuery && matchesStatus && matchesPriority;
  });

  const totalCost = tasks.reduce((sum, t) => sum + (t.estimated_cost || 0), 0);
  const completedCost = tasks
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + (t.estimated_cost || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
              Remediation Engineering & Budget Allocation
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-elevated text-accent-primary border border-border-default">
              {filtered.length} Tasks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Execute targeted corrective controls within the approved ₹6,00,000 university cybersecurity budget.
          </p>
        </div>

        <button
          onClick={loadTasks}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary rounded-lg border border-border-default hover:bg-bg-elevated transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Tasks</span>
        </button>
      </div>

      {/* Budget Progress Bar Card */}
      <div className="cyber-card p-5 border-border-default">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-text-primary">Cybersecurity Budget Utilization</span>
            <span className="text-xs text-text-muted ml-2 font-mono">
              Committed: ₹{totalCost.toLocaleString('en-IN')} / Ceiling: ₹6,00,000
            </span>
          </div>
          <div className="font-mono text-xs text-accent-primary font-semibold">
            {Math.round((totalCost / 600000) * 100)}% Budget Committed • ₹{(600000 - totalCost).toLocaleString('en-IN')} Reserve
          </div>
        </div>

        <div className="w-full bg-bg-main h-2.5 rounded-full overflow-hidden flex">
          <div
            className="bg-[#45C99A] h-full transition-all duration-500"
            style={{ width: `${(completedCost / 600000) * 100}%` }}
            title="Completed Tasks Spend"
          />
          <div
            className="bg-accent-primary h-full transition-all duration-500"
            style={{ width: `${((totalCost - completedCost) / 600000) * 100}%` }}
            title="In-Progress / Pending Spend"
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-text-muted mt-2 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#45C99A]" />
            Completed Controls (₹{completedCost.toLocaleString('en-IN')})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-primary" />
            Active Commitments (₹{(totalCost - completedCost).toLocaleString('en-IN')})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-border-default" />
            Contingency Fund (₹{(600000 - totalCost).toLocaleString('en-IN')})
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="cyber-card p-4 border-border-default">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by code, title, owner, or asset..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input w-full pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div className="lg:col-span-3 flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0">Priority:</span>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="cyber-input w-full px-2.5 py-1.5 text-xs text-text-primary"
            >
              <option value="ALL">All Priorities</option>
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
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="cyber-card p-4 sm:p-5 border-border-default">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Remediation Tasks Table">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Task Code</th>
                <th className="py-2.5 px-3">Remediation Action</th>
                <th className="py-2.5 px-3">Target Asset</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">Allocated Cost</th>
                <th className="py-2.5 px-3">Target Due</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {filtered.map(task => {
                const isComplete = task.status === 'Completed';
                return (
                  <tr key={task.id} className="hover:bg-bg-elevated/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-accent-primary whitespace-nowrap">
                      {task.task_code}
                    </td>
                    <td className="py-3 px-3 font-medium text-text-primary max-w-xs">
                      <div>{task.title}</div>
                      {task.verification_notes && (
                        <div className="text-[10px] text-[#45C99A] font-mono mt-0.5">
                          ✓ {task.verification_notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                      {task.asset_name || 'Core System'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <SeverityBadge severity={task.priority} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                      {task.assigned_owner}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-text-primary whitespace-nowrap">
                      ₹{task.estimated_cost?.toLocaleString('en-IN') || '25,000'}
                    </td>
                    <td className="py-3 px-3 font-mono text-text-muted whitespace-nowrap">
                      {task.due_date}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isComplete
                            ? 'bg-[#45C99A]/15 text-[#45C99A] border-[#45C99A]/30'
                            : task.status === 'In Progress'
                            ? 'bg-accent-primary/15 text-accent-primary border-accent-primary/30'
                            : 'bg-status-warning/15 text-status-warning border-status-warning/30'
                        }`}
                      >
                        {task.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenUpdate(task)}
                        className="px-2.5 py-1 rounded bg-bg-main hover:bg-bg-elevated border border-border-default text-text-secondary text-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Update Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-md p-6 bg-[#0E1A2C] border border-border-default shadow-cyber-lg">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Wrench className="w-4 h-4 text-accent-primary" />
                <span>Update Remediation Milestone</span>
              </h3>
              <button
                onClick={() => setActiveTask(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <span className="text-text-muted font-mono">{activeTask.task_code}</span>
                <div className="font-semibold text-text-primary text-sm mt-0.5">
                  {activeTask.title}
                </div>
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Status Milestone</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as any)}
                  className="cyber-input w-full px-3 py-2 text-xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Completed">Completed (Verified)</option>
                </select>
              </div>

              <div>
                <label className="block text-text-secondary mb-1">
                  Verification & Closure Evidence Notes
                </label>
                <textarea
                  rows={3}
                  value={verifyNotes}
                  onChange={e => setVerifyNotes(e.target.value)}
                  placeholder="Record patch release version, testing checksum, or operational outcome..."
                  className="cyber-input w-full p-2.5 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="px-3.5 py-1.5 rounded text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-accent-primary text-bg-main font-semibold rounded shadow-cyber"
                >
                  Commit Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

