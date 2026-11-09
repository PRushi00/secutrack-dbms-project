import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Shield,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('SecuTrack2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please provide a valid username or email.');
      return;
    }
    if (!password) {
      setError('Please provide your password.');
      return;
    }

    setLoading(true);
    try {
      await api.login(username, password);
      navigate('/app');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials or unauthorized login attempt.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoUser = (user: string, pw: string) => {
    setUsername(user);
    setPassword(pw);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-border-default bg-bg-secondary overflow-hidden shadow-cyber-lg">
        {/* Left Column: Visual Brand Storytelling */}
        <div className="lg:col-span-5 p-8 lg:p-10 bg-gradient-to-br from-[#0F1B2D] to-[#09111F] border-b lg:border-b-0 lg:border-r border-border-subtle flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Landing</span>
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/40 flex items-center justify-center shadow-cyber-sm">
                <Shield className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <span className="font-display font-bold text-xl text-text-primary">
                  Secu<span className="text-accent-primary">Track</span>
                </span>
                <span className="block text-[10px] text-text-muted font-mono tracking-wider">
                  ENTERPRISE OPERATIONS
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary mb-3">
              Protected Access Portal
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
              Sign in with institutional credentials to access continuous telemetry, quantitative ALE registers, and explainable risk intelligence.
            </p>

            <div className="space-y-3 pt-2 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-primary shrink-0" />
                <span>Zero Trust Multi-Role Authorization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-secondary shrink-0" />
                <span>Immutable Telemetry & Audit Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#45C99A] shrink-0" />
                <span>Grounded Single Loss (SLE) Calculations</span>
              </div>
            </div>
          </div>

          {/* Academic Attribution Badge */}
          <div className="mt-8 pt-6 border-t border-border-subtle/80 relative z-10 text-[11px] text-text-muted font-mono">
            <span>SecureExam University Defense Architecture</span>
          </div>

          {/* Decorative Glow */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-accent-primary/10 rounded-full blur-[70px] pointer-events-none" />
        </div>

        {/* Right Column: Sign In Form */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-text-primary tracking-tight">
                Authentication
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Enter your security operator credentials to initiate your session.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                className="mb-5 p-3 rounded-lg bg-status-critical/15 border border-status-critical/30 flex items-center gap-2.5 text-xs text-status-critical"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="username">
                  Operator Username / Email
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. admin or analyst@secutrack.io"
                    className="cyber-input w-full px-3.5 py-2.5 text-sm"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-text-secondary" htmlFor="password">
                    Password
                  </label>
                  <span className="text-[11px] text-text-muted">Case-sensitive</span>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter operator password"
                    className="cyber-input w-full px-3.5 py-2.5 text-sm pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-text-secondary cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-border-default bg-bg-main text-accent-primary focus:ring-accent-primary"
                  />
                  <span>Persist secure session token</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-bg-main font-semibold text-sm shadow-cyber transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-bg-main border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to SecuTrack</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Identities (Faculty Viva Shortcut) */}
            <div className="mt-8 pt-5 border-t border-border-subtle">
              <div className="text-[11px] uppercase font-mono text-text-muted mb-2.5">
                Quick Demo Identities (Faculty Evaluation):
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('admin', 'SecuTrack2026!')}
                  className="p-2 rounded bg-bg-main hover:bg-bg-elevated border border-border-subtle text-left transition-colors"
                >
                  <div className="font-semibold text-accent-primary">Security Admin</div>
                  <div className="text-[10px] text-text-muted">Dr. Alistair Vance</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('analyst', 'SecuTrack2026!')}
                  className="p-2 rounded bg-bg-main hover:bg-bg-elevated border border-border-subtle text-left transition-colors"
                >
                  <div className="font-semibold text-accent-secondary">SOC Analyst</div>
                  <div className="text-[10px] text-text-muted">Devin Vance</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('lead', 'SecuTrack2026!')}
                  className="p-2 rounded bg-bg-main hover:bg-bg-elevated border border-border-subtle text-left transition-colors"
                >
                  <div className="font-semibold text-[#45C99A]">Remediation Lead</div>
                  <div className="text-[10px] text-text-muted">Elena Rostova</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser('auditor', 'SecuTrack2026!')}
                  className="p-2 rounded bg-bg-main hover:bg-bg-elevated border border-border-subtle text-left transition-colors"
                >
                  <div className="font-semibold text-status-warning">Compliance Auditor</div>
                  <div className="text-[10px] text-text-muted">Marcus Sterling</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

