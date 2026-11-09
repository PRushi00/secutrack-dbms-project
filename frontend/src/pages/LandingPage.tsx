import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero3D } from '../components/Hero3D';
import { SeverityBadge } from '../components/SeverityBadge';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  HardDrive,
  Lock,
  Radar,
  Server,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDemoTab, setActiveDemoTab] = useState<'r1' | 'r3'>('r1');

  return (
    <div className="min-h-screen bg-bg-main text-text-primary selection:bg-accent-primary/25">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-border-subtle/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-20">
              {/* Product Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/30 text-xs font-mono text-accent-primary">
                <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                <span>CYBERSECURITY RISK ARCHITECTURE & DEFENSE</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-text-primary leading-[1.1]">
                See the Risk. <br className="hidden sm:inline" />
                Understand the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">Why.</span> <br />
                Act with Confidence.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                SecuTrack brings assets, vulnerabilities, explainable risk models, incident response, and verifiable remediation into one coherent, actionable cybersecurity workflow.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/app')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-bg-main bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-cyber hover:shadow-[0_0_25px_rgba(56,214,197,0.4)] transition-all cursor-pointer"
                >
                  <span>Explore SecuTrack Operations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#overview"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-text-secondary hover:text-text-primary bg-bg-secondary hover:bg-bg-elevated border border-border-default rounded-lg transition-colors cursor-pointer"
                >
                  <span>Understand the Platform</span>
                </a>
              </div>

              {/* Trust & Academic Signature */}
              <div className="pt-6 border-t border-border-subtle/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-text-muted font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  <span>Dual Qualitative & Quantitative ALE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-secondary" />
                  <span>Explainable Causality Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#45C99A]" />
                  <span>Enterprise Relational Integrity</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: 3D Centerpiece */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <Hero3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION A — THE PROBLEM */}
      <section id="overview" className="py-20 bg-bg-secondary/40 border-b border-border-subtle/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-status-critical tracking-widest">
              The Security Operations Dilemma
            </span>
            <h2 className="text-3xl font-bold font-display text-text-primary mt-2">
              Why Security Teams Struggle with Prioritization
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mt-3">
              Modern enterprises run dozens of scanners generating thousands of alerts. Without asset context and explainable causality, analysts drown in noisy reports while critical exposures remain unaddressed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cyber-card p-6 border-border-subtle hover:border-status-critical/40">
              <div className="w-10 h-10 rounded-lg bg-status-critical/10 text-status-critical flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Scattered Asset Silos
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Database servers, cloud instances, and network gateways are tracked in disconnected spreadsheets, obscuring which assets carry critical business value.
              </p>
            </div>

            <div className="cyber-card p-6 border-border-subtle hover:border-status-warning/40">
              <div className="w-10 h-10 rounded-lg bg-status-warning/10 text-status-warning flex items-center justify-center mb-4">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Qualitative Guesswork
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Risk severity is often assigned subjectively without mathematical Exposure Factor (EF) calculations or Single and Annualized Loss Expectancy (SLE/ALE) grounding.
              </p>
            </div>

            <div className="cyber-card p-6 border-border-subtle hover:border-accent-primary/40">
              <div className="w-10 h-10 rounded-lg bg-accent-primary/10 text-accent-primary flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Black-Box Vulnerability Scoring
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Generic CVSS scores fail to explain why a vulnerability matters on a specific production server or what exact steps the engineering team must take next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION B — THE SECUTRACK APPROACH */}
      <section className="py-20 border-b border-border-subtle/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-accent-primary tracking-widest">
              Methodology
            </span>
            <h2 className="text-3xl font-bold font-display text-text-primary mt-2">
              The 5-Stage Closed-Loop Security Cycle
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mt-3">
              SecuTrack transforms isolated vulnerability findings into verified business outcomes through a disciplined, auditable pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Identify',
                desc: 'Map digital assets, services, and recorded CVE findings across enterprise networks.',
              },
              {
                step: '02',
                title: 'Explain',
                desc: 'Derive causal telemetry evidence and threat mechanisms via explainable logic.',
              },
              {
                step: '03',
                title: 'Prioritize',
                desc: 'Calculate financial exposure (ALE = SLE × ARO) and qualitative severity matrices.',
              },
              {
                step: '04',
                title: 'Remediate',
                desc: 'Assign actionable containment tasks with target deadlines and estimated costs.',
              },
              {
                step: '05',
                title: 'Review',
                desc: 'Verify patch efficacy, record immutable audit logs, and produce executive reports.',
              },
            ].map(item => (
              <div key={item.step} className="p-5 rounded-lg bg-bg-secondary border border-border-subtle relative group hover:border-accent-primary/50 transition-colors">
                <div className="font-mono text-2xl font-bold text-accent-primary/40 group-hover:text-accent-primary transition-colors">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-text-primary mt-2 mb-1.5">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECTION C — CORE CAPABILITIES */}
      <section id="capabilities" className="py-20 bg-bg-secondary/30 border-b border-border-subtle/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-accent-secondary tracking-widest">
              Operational Modules
            </span>
            <h2 className="text-3xl font-bold font-display text-text-primary mt-2">
              Complete Cybersecurity Command Suite
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mt-3">
              Designed for CISOs, SOC analysts, and remediation engineers needing real-time clarity and relational depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="cyber-card p-6 border-border-subtle">
              <HardDrive className="w-7 h-7 text-accent-primary mb-3.5" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Asset Inventory</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Centralized registry of databases, application servers, and network infrastructure tagged by environment, criticality tier, and ownership.
              </p>
            </div>

            <div className="cyber-card p-6 border-border-subtle">
              <ShieldAlert className="w-7 h-7 text-status-critical mb-3.5" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Vulnerability Management</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Track CVE identifiers, CVSS metrics, detection sources, and status transitions across all monitored production hosts.
              </p>
            </div>

            <div className="cyber-card p-6 border-border-subtle">
              <Calculator className="w-7 h-7 text-status-warning mb-3.5" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Risk Prioritization</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Rigorous quantitative Single Loss Expectancy (SLE) and Annualized Loss Expectancy (ALE) models combined with 5×5 qualitative matrices.
              </p>
            </div>

            <div className="cyber-card p-6 border-border-subtle">
              <BrainCircuit className="w-7 h-7 text-accent-primary mb-3.5" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Explainable Risk Analysis</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Deterministic causal explanations answering what was identified, why it matters, what evidence supports it, and what to do next.
              </p>
            </div>

            <div className="cyber-card p-6 border-border-subtle">
              <Activity className="w-7 h-7 text-accent-secondary mb-3.5" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Incident Management</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Track critical security breaches, spear-phishing campaigns, containment measures, and forensic milestones from triage to resolution.
              </p>
            </div>

            <div className="cyber-card p-6 border-border-subtle">
              <FileCheck2 className="w-7 h-7 text-[#45C99A] mb-3.5" />
              <h3 className="text-lg font-bold text-text-primary mb-2">Reports & Audit History</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Cryptographically attributable operational audit logs, role-based activity trails, and compliance-ready executive documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION D — HOW RISK EXPLANATION WORKS (INTERACTIVE DEMO) */}
      <section id="risk-intelligence" className="py-20 border-b border-border-subtle/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase text-accent-primary tracking-widest">
              Live Reasoning Demonstration
            </span>
            <h2 className="text-3xl font-bold font-display text-text-primary mt-2">
              Explainable Risk in Action
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Select a scenario from the SecureExam University case study to inspect how SecuTrack explains findings transparently:
            </p>

            {/* Scenario Selector Tabs */}
            <div className="inline-flex p-1 rounded-lg bg-bg-secondary border border-border-default mt-6">
              <button
                onClick={() => setActiveDemoTab('r1')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeDemoTab === 'r1'
                    ? 'bg-accent-primary text-bg-main shadow-cyber'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Case R1: Question Paper Archive (MFA Deficit)
              </button>
              <button
                onClick={() => setActiveDemoTab('r3')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeDemoTab === 'r3'
                    ? 'bg-accent-primary text-bg-main shadow-cyber'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Case R3: Online Exam Cluster (High Availability)
              </button>
            </div>
          </div>

          {/* Interactive Inspection Card */}
          <div className="cyber-card p-6 sm:p-8 max-w-4xl mx-auto border-border-default shadow-cyber-lg">
            {activeDemoTab === 'r1' ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-bg-main text-accent-primary border border-border-default">
                        RSK-R1
                      </span>
                      <SeverityBadge severity="Critical" size="sm" />
                      <span className="text-xs text-text-muted">Target: Question Paper Repository (AST-QP-01)</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">
                      Unauthorized Access & Pre-Examination Leakage
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text-muted">Annual Loss Expectancy</div>
                    <div className="font-mono text-xl font-bold text-status-critical">₹2,40,000 / yr</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle">
                    <div className="font-semibold text-accent-primary mb-1">1. What was identified?</div>
                    <p className="text-text-secondary">
                      Faculty authentication portal accepts single-factor passwords without mandatory TOTP or hardware MFA challenges.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle">
                    <div className="font-semibold text-accent-secondary mb-1">2. Why does it matter?</div>
                    <p className="text-text-secondary">
                      Leakage of confidential exam papers before test date forces university-wide cancellations, costing an estimated ₹6,00,000 in single loss expectancy.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle">
                    <div className="font-semibold text-text-primary mb-1">3. Telemetry Evidence</div>
                    <p className="font-mono text-accent-primary/90">
                      340 brute-force attempts on faculty portal; 0 MFA challenges registered; internal IP 10.0.4.12:443 accessible.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle">
                    <div className="font-semibold text-status-warning mb-1">4. Quantitative Priority</div>
                    <p className="text-text-secondary">
                      Likelihood 4/5 × Impact 5/5 = Score 20/25 (Critical). Exposure factor is 75% of total asset valuation.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="font-semibold text-[#45C99A] mb-1">5. Actionable Next Step:</div>
                  <p className="text-text-secondary">
                    Roll out mandatory WebAuthn / TOTP two-factor authentication on all faculty portal endpoints within 48 hours. Estimated remediation cost: ₹1,50,000.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-bg-main text-accent-primary border border-border-default">
                        RSK-R3
                      </span>
                      <SeverityBadge severity="High" size="sm" />
                      <span className="text-xs text-text-muted">Target: Online Examination Server (AST-SRV-03)</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">
                      Production Exam Outage During Live Examination
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text-muted">Annual Loss Expectancy</div>
                    <div className="font-mono text-xl font-bold text-status-warning">₹1,80,000 / yr</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle">
                    <div className="font-semibold text-accent-primary mb-1">1. What was identified?</div>
                    <p className="text-text-secondary">
                      The core examination cluster runs on a single production host without hot-standby replicas or automatic load balancing.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle">
                    <div className="font-semibold text-accent-secondary mb-1">2. Why does it matter?</div>
                    <p className="text-text-secondary">
                      Traffic spikes during submission hour cause socket exhaustion, stranding 12,000 students mid-exam session.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle">
                    <div className="font-semibold text-text-primary mb-1">3. Telemetry Evidence</div>
                    <p className="font-mono text-accent-primary/90">
                      CPU utilization peaked at 94.6% in previous midterm; 2 short outages logged; 0 secondary heartbeat listeners found.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-bg-elevated/70 border border-border-subtle">
                    <div className="font-semibold text-status-warning mb-1">4. Quantitative Priority</div>
                    <p className="text-text-secondary">
                      Likelihood 3/5 × Impact 4/5 = Score 12/25 (High). Annual Rate of Occurrence (ARO) is 0.50 outages/yr.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="font-semibold text-[#45C99A] mb-1">5. Actionable Next Step:</div>
                  <p className="text-text-secondary">
                    Deploy an active-passive load balanced replica node with automatic health-check failover. Estimated remediation cost: ₹1,80,000.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. SECTION E — THE WORKFLOW */}
      <section id="workflow" className="py-20 bg-bg-secondary/40 border-b border-border-subtle/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase text-accent-secondary tracking-widest">
              Traceable Remediation
            </span>
            <h2 className="text-3xl font-bold font-display text-text-primary mt-2">
              From Detection to Verified Containment
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mt-3">
              See how a critical vulnerability moves seamlessly through the SecuTrack operations pipeline.
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: '1. Ingestion & Finding',
                  badge: 'CVE-2024-21887',
                  body: 'Automated telemetry logs identify single-factor exposure on faculty authentication gateway.',
                },
                {
                  title: '2. Causal AI Analysis',
                  badge: 'Risk Score: 20/25',
                  body: 'SecuTrack computes ALE of ₹2,40,000 and drafts plain-English reasoning for the CISO.',
                },
                {
                  title: '3. Task Assignment',
                  badge: 'REM-01 Pending',
                  body: 'Task is assigned to Dr. Vance with a ₹1,50,000 allocated budget and November 15 deadline.',
                },
                {
                  title: '4. Verified Closure',
                  badge: 'Audit Confirmed',
                  body: 'Patch verification confirms FIDO2 enforcement. Audit trail logs cryptographic closure.',
                },
              ].map((step, idx) => (
                <div key={idx} className="cyber-card p-6 border-border-subtle relative flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-bg-main text-accent-primary border border-border-default">
                      {step.badge}
                    </span>
                    <h3 className="text-base font-bold text-text-primary mt-3 mb-2">{step.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{step.body}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border-subtle/60 flex items-center text-xs text-text-muted">
                    <span>Phase 0{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION F — FINAL CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/10 border border-accent-primary/30 text-xs font-mono text-accent-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>READY FOR FACULTY DEFENSE & DEMONSTRATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Step Inside SecuTrack Operations
          </h2>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Experience the complete cybersecurity risk management dashboard with live asset tracking, quantitative loss calculations, and explainable intelligence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/app')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-semibold text-bg-main bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-cyber hover:shadow-[0_0_30px_rgba(56,214,197,0.45)] transition-all cursor-pointer"
            >
              <span>Enter Operational Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-medium text-text-secondary hover:text-text-primary bg-bg-secondary hover:bg-bg-elevated border border-border-default rounded-lg transition-colors cursor-pointer"
            >
              <span>Sign In with Demo Credentials</span>
            </Link>
          </div>
        </div>

        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent-primary/10 blur-[130px] pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border-subtle bg-bg-secondary text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent-primary" />
            <span className="font-semibold text-text-secondary">SecuTrack</span>
            <span>— AI-powered Cybersecurity Risk Detection, Explanation & Management System</span>
          </div>
          <div className="font-mono text-text-muted">
            Academic Final Project • SecureExam Case Study
          </div>
        </div>
      </footer>
    </div>
  );
};

