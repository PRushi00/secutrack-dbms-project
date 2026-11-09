import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/client';
import { Asset, AssetCriticality, AssetStatus } from '../types';
import {
  CheckCircle2,
  Database,
  Globe,
  HardDrive,
  Network,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  X,
} from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const context = useOutletContext<{ searchQuery?: string }>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [critFilter, setCritFilter] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Asset Form State
  const [newTag, setNewTag] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Database');
  const [newEnv, setNewEnv] = useState<'Production' | 'Staging' | 'Development'>('Production');
  const [newCrit, setNewCrit] = useState<AssetCriticality>('High');
  const [newOwner, setNewOwner] = useState('');
  const [newIp, setNewIp] = useState('');
  const [newVal, setNewVal] = useState('500000');

  const loadAssets = async () => {
    try {
      const data = await api.getAssets();
      setAssets(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddOpen) {
        setIsAddOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddOpen]);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag || !newName || !newOwner) return;

    await api.addAsset({
      asset_tag: newTag,
      name: newName,
      type: newType,
      environment: newEnv,
      criticality: newCrit,
      owner: newOwner,
      ip_address: newIp || '10.0.4.50',
      hostname: `${newTag.toLowerCase()}.internal`,
      status: 'Active',
      asset_value: parseFloat(newVal) || 500000,
    });

    setIsAddOpen(false);
    // Reset Form
    setNewTag('');
    setNewName('');
    setNewOwner('');
    setNewIp('');
    await loadAssets();
  };

  const query = (search || context?.searchQuery || '').toLowerCase();

  const filtered = assets.filter(a => {
    const matchesQuery =
      a.name.toLowerCase().includes(query) ||
      a.asset_tag.toLowerCase().includes(query) ||
      a.owner.toLowerCase().includes(query) ||
      a.ip_address.includes(query);

    const matchesType = typeFilter === 'ALL' || a.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesCrit = critFilter === 'ALL' || a.criticality.toUpperCase() === critFilter.toUpperCase();

    return matchesQuery && matchesType && matchesCrit;
  });

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'database':
        return <Database className="w-4 h-4 text-accent-primary" />;
      case 'server':
        return <Server className="w-4 h-4 text-accent-secondary" />;
      case 'network':
        return <Network className="w-4 h-4 text-[#F5B942]" />;
      default:
        return <HardDrive className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary">
              Asset Inventory & Infrastructure Registry
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-elevated text-accent-primary border border-border-default">
              {filtered.length} Assets
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Track servers, databases, and network topologies mapped to security exposures and valuations.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-bg-main bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-cyber transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Asset</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="cyber-card p-4 border-border-default">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by tag, name, owner, or IP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="cyber-input w-full pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted"
            />
          </div>

          <div className="lg:col-span-3 flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0">Type:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="cyber-input w-full px-2.5 py-1.5 text-xs text-text-primary"
            >
              <option value="ALL">All Types</option>
              <option value="Database">Database</option>
              <option value="Server">Server</option>
              <option value="Network">Network</option>
              <option value="Identity">Identity</option>
            </select>
          </div>

          <div className="lg:col-span-3 flex items-center gap-2">
            <span className="text-xs text-text-muted shrink-0">Tier:</span>
            <select
              value={critFilter}
              onChange={e => setCritFilter(e.target.value)}
              className="cyber-input w-full px-2.5 py-1.5 text-xs text-text-primary"
            >
              <option value="ALL">All Criticalities</option>
              <option value="CRITICAL">Critical Tier</option>
              <option value="HIGH">High Tier</option>
              <option value="MEDIUM">Medium Tier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="cyber-card p-4 sm:p-5 border-border-default">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs" aria-label="Asset inventory list">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Tag</th>
                <th className="py-2.5 px-3">Asset Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Environment</th>
                <th className="py-2.5 px-3">Criticality</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">Asset Value (AV)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/60">
              {filtered.map(asset => {
                const isAtRisk = asset.status === 'At Risk' || asset.status === 'Under Remediation';
                return (
                  <tr key={asset.id} className="hover:bg-bg-elevated/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-accent-primary whitespace-nowrap">
                      {asset.asset_tag}
                    </td>
                    <td className="py-3 px-3 font-medium text-text-primary whitespace-nowrap">
                      {asset.name}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        {getTypeIcon(asset.type)}
                        <span>{asset.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-bg-main border border-border-subtle text-text-secondary">
                        {asset.environment}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          asset.criticality === 'Critical'
                            ? 'bg-status-critical/15 text-status-critical border border-status-critical/30'
                            : asset.criticality === 'High'
                            ? 'bg-[#FF884D]/15 text-[#FF884D] border border-[#FF884D]/30'
                            : 'bg-status-warning/15 text-status-warning border border-status-warning/30'
                        }`}
                      >
                        {asset.criticality.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-text-muted whitespace-nowrap">
                      {asset.ip_address}
                    </td>
                    <td className="py-3 px-3 text-text-secondary whitespace-nowrap">
                      {asset.owner}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-text-primary whitespace-nowrap">
                      ₹{asset.asset_value?.toLocaleString('en-IN') || '5,00,000'}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span
                        className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                          isAtRisk
                            ? 'bg-status-critical/10 text-status-critical border-status-critical/30'
                            : 'bg-status-success/10 text-status-success border-status-success/30'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="cyber-card w-full max-w-lg p-6 bg-[#0E1A2C] border border-border-default shadow-cyber-lg">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-accent-primary" />
                <span>Register New Asset</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary mb-1">Asset Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AST-AUTH-07"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    className="cyber-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Asset Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="cyber-input w-full px-3 py-2 text-xs"
                  >
                    <option value="Database">Database</option>
                    <option value="Server">Server</option>
                    <option value="Network">Network</option>
                    <option value="Identity">Identity</option>
                    <option value="Application">Application</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evaluation Mirror Database"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="cyber-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary mb-1">Criticality Tier</label>
                  <select
                    value={newCrit}
                    onChange={e => setNewCrit(e.target.value as any)}
                    className="cyber-input w-full px-3 py-2 text-xs"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">Environment</label>
                  <select
                    value={newEnv}
                    onChange={e => setNewEnv(e.target.value as any)}
                    className="cyber-input w-full px-3 py-2 text-xs"
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary mb-1">Owner / Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT Operations"
                    value={newOwner}
                    onChange={e => setNewOwner(e.target.value)}
                    className="cyber-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-text-secondary mb-1">IP Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 10.0.4.55"
                    value={newIp}
                    onChange={e => setNewIp(e.target.value)}
                    className="cyber-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary mb-1">Asset Valuation (₹)</label>
                <input
                  type="number"
                  value={newVal}
                  onChange={e => setNewVal(e.target.value)}
                  className="cyber-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-2 rounded text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-primary text-bg-main font-semibold rounded shadow-cyber"
                >
                  Save Asset Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

