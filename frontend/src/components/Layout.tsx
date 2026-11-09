import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  Activity,
  AlertOctagon,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  HardDrive,
  LayoutDashboard,
  LogOut,
  Menu,
  Radar,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';

export const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = api.getCurrentUser();

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/app', icon: LayoutDashboard },
    { name: 'Risk Center', path: '/app/risks', icon: ShieldAlert },
    { name: 'Assets', path: '/app/assets', icon: HardDrive },
    { name: 'Vulnerabilities', path: '/app/vulnerabilities', icon: AlertOctagon },
    { name: 'Incidents', path: '/app/incidents', icon: Activity },
    { name: 'Remediation', path: '/app/remediation', icon: CheckSquare },
    { name: 'Reports & Audit', path: '/app/reports', icon: FileText },
    { name: 'User Management', path: '/app/users', icon: Users },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  // Derive current title
  const currentNav = navItems.find(item => item.path === location.pathname) || { name: 'Security Operations' };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-main text-text-primary">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-border-subtle bg-bg-secondary transition-all duration-300 z-30 select-none ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle">
          <Link to="/app" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center shrink-0 shadow-cyber-sm">
              <Shield className="w-5 h-5 text-accent-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-display font-bold text-base tracking-tight text-text-primary">
                  Secu<span className="text-accent-primary">Track</span>
                </span>
                <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
                  Cyber Operations
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5" aria-label="Operational Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-accent-primary/15 text-accent-primary border border-accent-primary/30 shadow-cyber-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/70'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-primary'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Sign Out */}
        <div className="p-3 border-t border-border-subtle bg-bg-main/40">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-accent-secondary/20 border border-accent-secondary/40 text-accent-secondary flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-text-primary truncate">
                    {currentUser?.full_name || 'Security Analyst'}
                  </div>
                  <div className="text-[10px] text-text-muted truncate">
                    {currentUser?.role || 'SOC Lead'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-text-muted hover:text-status-critical hover:bg-bg-elevated rounded-lg transition-colors"
                title="Sign Out"
                aria-label="Sign out of SecuTrack"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 text-text-muted hover:text-status-critical hover:bg-bg-elevated rounded-lg transition-colors"
              title="Sign Out"
              aria-label="Sign out of SecuTrack"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-full bg-bg-secondary border-r border-border-default flex flex-col h-full z-10 shadow-cyber-lg">
            <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-accent-primary" />
                <span className="font-display font-bold text-lg text-text-primary">
                  Secu<span className="text-accent-primary">Track</span>
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/app'}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-accent-primary/15 text-accent-primary border border-accent-primary/30 font-semibold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border-subtle flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-text-primary">{currentUser?.full_name}</div>
                <div className="text-[10px] text-text-muted">{currentUser?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-text-muted hover:text-status-critical"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Operational Top Bar */}
        <header className="h-16 shrink-0 border-b border-border-subtle bg-bg-secondary/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated md:hidden"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>SecuTrack</span>
                <span>/</span>
                <span className="text-text-secondary font-medium">{currentNav.name}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-text-primary leading-tight">
                {currentNav.name}
              </h1>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block w-48 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Global telemetry search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-bg-main border border-border-subtle rounded-lg pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
              />
            </div>

            {/* Telemetry Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-bg-main border border-border-subtle text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
              <span className="text-text-muted text-[11px]">POSTURE: NORMAL</span>
            </div>

            <Link
              to="/"
              className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary rounded-lg border border-border-subtle hover:bg-bg-elevated transition-colors hidden sm:block"
            >
              Landing Page
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-bg-main">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

