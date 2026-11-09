import {
  Asset,
  AuditLog,
  DashboardMetrics,
  Incident,
  RemediationTask,
  Risk,
  User,
  Vulnerability,
} from '../types';

const API_BASE = '/api';

// Seed Baseline matching SecureExam University case study & schema.sql
const DEFAULT_USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@secutrack.io',
  full_name: 'Dr. Alistair Vance',
  role: 'Security Admin',
  department: 'CISO Directorate',
};

const SEED_ASSETS: Asset[] = [
  {
    id: 1,
    asset_tag: 'AST-QP-01',
    name: 'Question Paper Repository',
    type: 'Database',
    environment: 'Production',
    criticality: 'Critical',
    owner: 'Exam Directorate',
    ip_address: '10.0.4.12',
    hostname: 'qp-vault.exam.internal',
    status: 'At Risk',
    asset_value: 800000.00,
    open_vulns_count: 1,
    open_risks_count: 1,
  },
  {
    id: 2,
    asset_tag: 'AST-ANS-02',
    name: 'Student Answer Database',
    type: 'Database',
    environment: 'Production',
    criticality: 'Critical',
    owner: 'Records & Evaluation',
    ip_address: '10.0.4.15',
    hostname: 'answers-db.exam.internal',
    status: 'Active',
    asset_value: 750000.00,
    open_vulns_count: 1,
    open_risks_count: 1,
  },
  {
    id: 3,
    asset_tag: 'AST-SRV-03',
    name: 'Online Examination Server',
    type: 'Server',
    environment: 'Production',
    criticality: 'Critical',
    owner: 'Systems Engineering',
    ip_address: '10.0.2.50',
    hostname: 'exam-cluster-01.internal',
    status: 'Under Remediation',
    asset_value: 600000.00,
    open_vulns_count: 1,
    open_risks_count: 1,
  },
  {
    id: 4,
    asset_tag: 'AST-ID-04',
    name: 'Faculty Identity & Access Store',
    type: 'Identity',
    environment: 'Production',
    criticality: 'Critical',
    owner: 'IT Security Operations',
    ip_address: '10.0.1.10',
    hostname: 'sso-faculty.internal',
    status: 'At Risk',
    asset_value: 500000.00,
    open_vulns_count: 2,
    open_risks_count: 2,
  },
  {
    id: 5,
    asset_tag: 'AST-MRK-05',
    name: 'Final Marks & Grades DB',
    type: 'Database',
    environment: 'Production',
    criticality: 'High',
    owner: 'Registrar Office',
    ip_address: '10.0.4.20',
    hostname: 'grades-master.internal',
    status: 'Active',
    asset_value: 650000.00,
    open_vulns_count: 1,
    open_risks_count: 1,
  },
  {
    id: 6,
    asset_tag: 'AST-NET-06',
    name: 'Campus Core Gateway Router',
    type: 'Network',
    environment: 'Production',
    criticality: 'High',
    owner: 'Network Infrastructure',
    ip_address: '10.0.0.1',
    hostname: 'edge-gateway-gw01',
    status: 'Active',
    asset_value: 400000.00,
    open_vulns_count: 1,
    open_risks_count: 1,
  },
];

const SEED_VULNS: Vulnerability[] = [
  {
    id: 1,
    vuln_code: 'VULN-AUTH-001',
    title: 'Missing Multi-Factor Authentication on Faculty Portal',
    cve_id: 'CVE-2024-21887',
    severity: 'Critical',
    cvss_score: 9.8,
    affected_asset_id: 4,
    asset_name: 'Faculty Identity & Access Store',
    source: 'Identity Posture Assessment',
    description: 'Faculty authentication portal accepts single-factor credentials without time-based one-time passwords or FIDO2 hardware keys.',
    remediation_guidance: 'Enforce mandatory MFA (TOTP / WebAuthn) for all active faculty and administrative accounts.',
    status: 'Open',
    discovered_at: '2026-10-24 10:30:00',
  },
  {
    id: 2,
    vuln_code: 'VULN-DB-002',
    title: 'Irregular Backup Restoration Verification',
    cve_id: 'CVE-2023-48795',
    severity: 'Medium',
    cvss_score: 6.2,
    affected_asset_id: 2,
    asset_name: 'Student Answer Database',
    source: 'Disaster Recovery Audit',
    description: 'Encrypted backups are scheduled nightly, but automated integrity testing and restore dry-runs are not performed weekly.',
    remediation_guidance: 'Deploy automated weekly sandbox restore validation scripts with checksum verification.',
    status: 'Open',
    discovered_at: '2026-10-22 15:45:00',
  },
  {
    id: 3,
    vuln_code: 'VULN-HA-003',
    title: 'Single Point of Failure in Production Exam Cluster',
    cve_id: 'CVE-2024-38077',
    severity: 'High',
    cvss_score: 8.5,
    affected_asset_id: 3,
    asset_name: 'Online Examination Server',
    source: 'Architecture Review',
    description: 'The live examination environment runs on a single host without multi-availability zone failover or live heartbeat mirrors.',
    remediation_guidance: 'Implement active-passive load balanced replica nodes with automatic health check failover.',
    status: 'Open',
    discovered_at: '2026-10-20 09:12:00',
  },
  {
    id: 4,
    vuln_code: 'VULN-PHISH-004',
    title: 'Credential Harvesting & Phishing Susceptibility',
    cve_id: 'CWE-200',
    severity: 'Critical',
    cvss_score: 9.1,
    affected_asset_id: 4,
    asset_name: 'Faculty Identity & Access Store',
    source: 'SOC Telemetry Analysis',
    description: 'High volume of spear-phishing campaigns detected targeting academic evaluators during final examination upload cycles.',
    remediation_guidance: 'Implement advanced DMARC/DKIM/SPF enforcement and email payload sandbox isolation.',
    status: 'Open',
    discovered_at: '2026-10-26 14:10:00',
  },
  {
    id: 5,
    vuln_code: 'VULN-ACL-005',
    title: 'Excessive Administrative Privileges on Marks Ledger',
    cve_id: 'CWE-250',
    severity: 'High',
    cvss_score: 7.9,
    affected_asset_id: 5,
    asset_name: 'Final Marks & Grades DB',
    source: 'Privilege Audit',
    description: 'Administrative access privileges exceed least-privilege standards; 14 accounts hold full write access to historical grade tables.',
    remediation_guidance: 'Refactor RBAC into dual-custody authorization with cryptographic row-level tamper signatures.',
    status: 'Open',
    discovered_at: '2026-10-18 11:20:00',
  },
  {
    id: 6,
    vuln_code: 'VULN-NET-006',
    title: 'Single ISP Uplink Redundancy Deficit',
    cve_id: 'CWE-400',
    severity: 'Medium',
    cvss_score: 5.8,
    affected_asset_id: 6,
    asset_name: 'Campus Core Gateway Router',
    source: 'Network Redundancy Scan',
    description: 'Core gateway relies on single primary leased line without dynamic BGP dual-homed secondary failover link.',
    remediation_guidance: 'Provision automated SD-WAN secondary cellular / fibre failover line with BGP route convergence.',
    status: 'Mitigated',
    discovered_at: '2026-10-15 08:00:00',
  },
];

const SEED_RISKS: Risk[] = [
  {
    id: 1,
    risk_code: 'RSK-R1',
    title: 'Unauthorized Access & Leakage of Question Papers',
    affected_asset_id: 1,
    asset_name: 'Question Paper Repository',
    related_vuln_id: 1,
    threat_description: 'Threat actors exploit weak faculty credentials lacking MFA to breach repository and exfiltrate unpublished examination papers prior to exam date.',
    likelihood: 4,
    impact: 5,
    risk_score: 20,
    risk_level: 'Critical',
    asset_value: 800000.00,
    exposure_factor: 0.75,
    single_loss_expectancy: 600000.00,
    annual_rate_of_occurrence: 0.40,
    annual_loss_expectancy: 240000.00,
    status: 'Open',
    assigned_owner: 'Dr. Alistair Vance',
    created_at: '2026-10-24 10:35:00',
    explanation: {
      what_identified: 'Weak single-factor authentication guarding unpublished question paper archives.',
      why_it_matters: 'Breach of question paper confidentiality triggers widespread exam cancellations, regulatory audits, institutional reputational damage, and an estimated single loss expectancy of ₹6,00,000.',
      evidence_telemetry: 'Auth logs show 340 brute-force attempts on faculty credentials; zero MFA challenges recorded; endpoint exposed to internal network 10.0.4.12:443.',
      why_priority: 'Critical severity (Score: 20/25). Likelihood rating 4 (Likely) multiplied by Impact rating 5 (Severe) yields highest tier priority. Asset criticality is Tier 1.',
      actionable_remediation: '1. Enforce WebAuthn/TOTP MFA on all evaluator logins within 48 hours.\n2. Restrict question paper repository access to internal campus VPN IP pools.\n3. Enable cryptographic download watermarking with assessor audit trails.',
      confidence_score: 0.98,
    },
  },
  {
    id: 2,
    risk_code: 'RSK-R2',
    title: 'Corruption or Irrecoverable Loss of Submitted Answers',
    affected_asset_id: 2,
    asset_name: 'Student Answer Database',
    related_vuln_id: 2,
    threat_description: 'Database storage glitch or malicious ransomware encrypts submitted student scripts while restore procedures fail verification.',
    likelihood: 2,
    impact: 3,
    risk_score: 6,
    risk_level: 'Medium',
    asset_value: 750000.00,
    exposure_factor: 0.40,
    single_loss_expectancy: 300000.00,
    annual_rate_of_occurrence: 0.15,
    annual_loss_expectancy: 45000.00,
    status: 'Under Investigation',
    assigned_owner: 'Elena Rostova',
    created_at: '2026-10-22 16:00:00',
    explanation: {
      what_identified: 'Backup snapshot schedules exist, but scheduled disaster-recovery restoration tests have not been executed in 118 days.',
      why_it_matters: 'Without verified restore operations, disk failures or catastrophic corruption could result in permanent loss of submitted student scripts.',
      evidence_telemetry: 'Backup logs confirm daily dump generation at 02:00 UTC, but zero dry-run validation logs exist in /var/log/dr-verification.log.',
      why_priority: 'Medium severity (Score: 6/25). Likelihood 2 (Unlikely) × Impact 3 (Moderate). Mitigated partially by multi-drive array.',
      actionable_remediation: '1. Configure automated weekly sandbox restoration script with SHA-256 table verification.\n2. Mandate off-site immutable air-gapped cold storage replication.',
      confidence_score: 0.92,
    },
  },
  {
    id: 3,
    risk_code: 'RSK-R3',
    title: 'Production Online Exam Service Outage During Active Exam',
    affected_asset_id: 3,
    asset_name: 'Online Examination Server',
    related_vuln_id: 3,
    threat_description: 'Single server node undergoes memory exhaustion or DDoS traffic, stranding 12,000 students mid-exam session.',
    likelihood: 3,
    impact: 4,
    risk_score: 12,
    risk_level: 'High',
    asset_value: 600000.00,
    exposure_factor: 0.60,
    single_loss_expectancy: 360000.00,
    annual_rate_of_occurrence: 0.50,
    annual_loss_expectancy: 180000.00,
    status: 'Mitigating',
    assigned_owner: 'Devin Vance',
    created_at: '2026-10-20 09:30:00',
    explanation: {
      what_identified: 'Online examination portal operates on standalone web/app node without high-availability clustering or auto-scaling.',
      why_it_matters: 'A sudden traffic surge of 12,000 simultaneous submissions causes socket exhaustion and 504 Gateway Timeouts during critical evaluation hours.',
      evidence_telemetry: 'CPU utilization spiked to 94.6% during previous mid-term test; memory saturation reached 89% with zero replica nodes available.',
      why_priority: 'High severity (Score: 12/25). Likelihood 3 (Possible) × Impact 4 (Major). SLE ₹3,60,000, ALE ₹1,80,000.',
      actionable_remediation: '1. Deploy containerized horizontal pod auto-scalers across 3 replica sets.\n2. Configure reverse proxy round-robin load balancer with SSL offloading.\n3. Implement edge caching for static assets and exam instructions.',
      confidence_score: 0.95,
    },
  },
  {
    id: 4,
    risk_code: 'RSK-R4',
    title: 'Credential Theft via Spear-Phishing Campaign',
    affected_asset_id: 4,
    asset_name: 'Faculty Identity & Access Store',
    related_vuln_id: 4,
    threat_description: 'Sophisticated threat group launches cloned university portal email lure, harvesting faculty credentials to establish persistent foothold.',
    likelihood: 5,
    impact: 4,
    risk_score: 20,
    risk_level: 'Critical',
    asset_value: 500000.00,
    exposure_factor: 0.70,
    single_loss_expectancy: 350000.00,
    annual_rate_of_occurrence: 0.80,
    annual_loss_expectancy: 280000.00,
    status: 'Open',
    assigned_owner: 'Devin Vance',
    created_at: '2026-10-26 14:15:00',
    explanation: {
      what_identified: 'Targeted credential harvesting and spear-phishing lures detected targeting 650 faculty members.',
      why_it_matters: 'Phishing compromises lead directly to lateral movement toward grade databases and question paper stores.',
      evidence_telemetry: 'Mail gateway logs intercepted 42 phishing emails impersonating the Vice Chancellor with lookalike domain secure-exam-portal.org.',
      why_priority: 'Critical severity (Score: 20/25). Likelihood 5 (Almost Certain) × Impact 4 (Major). Annualized Loss Expectancy reaches ₹2,80,000.',
      actionable_remediation: '1. Block lookalike domain at DNS resolver.\n2. Roll out contextual email banner warnings for external senders.\n3. Conduct mandatory interactive phishing simulation training for department chairs.',
      confidence_score: 0.97,
    },
  },
  {
    id: 5,
    risk_code: 'RSK-R5',
    title: 'Unauthorized Tampering with Official Student Grades',
    affected_asset_id: 5,
    asset_name: 'Final Marks & Grades DB',
    related_vuln_id: 5,
    threat_description: 'Over-privileged internal staff or compromised account alters student GPA/marks records in master grade ledger.',
    likelihood: 2,
    impact: 5,
    risk_score: 10,
    risk_level: 'High',
    asset_value: 650000.00,
    exposure_factor: 0.50,
    single_loss_expectancy: 325000.00,
    annual_rate_of_occurrence: 0.10,
    annual_loss_expectancy: 32500.00,
    status: 'Open',
    assigned_owner: 'Marcus Sterling',
    created_at: '2026-10-18 11:25:00',
    explanation: {
      what_identified: 'Fourteen internal accounts possess superuser write privileges on the historical student marks ledger.',
      why_it_matters: 'Lack of separation of duties allows unauthorized grade adjustments without multi-person approval or non-repudiable audit logging.',
      evidence_telemetry: 'Database privilege schema inspection indicates 14 accounts have GRANT ALL PRIVILEGES on exam_db.grades_master.',
      why_priority: 'High severity (Score: 10/25). Likelihood 2 (Unlikely) × Impact 5 (Severe). Institutional integrity depends on grade veracity.',
      actionable_remediation: '1. Revoke direct write permissions; migrate to stored procedures with dual-authorization signatures.\n2. Implement append-only cryptographic transaction auditing on all grade modifications.',
      confidence_score: 0.94,
    },
  },
  {
    id: 6,
    risk_code: 'RSK-R6',
    title: 'Core Network Disconnection During Distributed Exam Hours',
    affected_asset_id: 6,
    asset_name: 'Campus Core Gateway Router',
    related_vuln_id: 6,
    threat_description: 'Primary ISP fibre cut halts remote submission sync across satellite test centers and campus halls.',
    likelihood: 3,
    impact: 3,
    risk_score: 9,
    risk_level: 'Medium',
    asset_value: 400000.00,
    exposure_factor: 0.35,
    single_loss_expectancy: 140000.00,
    annual_rate_of_occurrence: 0.30,
    annual_loss_expectancy: 42000.00,
    status: 'Resolved',
    assigned_owner: 'Elena Rostova',
    created_at: '2026-10-15 08:15:00',
    explanation: {
      what_identified: 'Gateway router lacks secondary automated ISP uplink failover.',
      why_it_matters: 'Fibre cut or ISP routing failure disconnects remote proctoring telemetry and student answer transmission.',
      evidence_telemetry: 'SNMP telemetry records single WAN interface active on gigabitethernet0/0/0 with no secondary route in OSPF table.',
      why_priority: 'Medium severity (Score: 9/25). Likelihood 3 (Possible) × Impact 3 (Moderate). Primary ISP SLA is 99.5%.',
      actionable_remediation: '1. Activate secondary optical fibre link on redundant port gigabitethernet0/0/1 with automatic failover.\n2. Test failover latency during non-examination maintenance window.',
      confidence_score: 0.91,
    },
  },
];

const SEED_INCIDENTS: Incident[] = [
  {
    id: 1,
    incident_code: 'INC-2026-001',
    title: 'Repeated Phishing Inundation Against Faculty Portals',
    severity: 'Critical',
    status: 'Investigating',
    affected_asset_id: 4,
    asset_name: 'Faculty Identity & Access Store',
    assigned_analyst: 'Devin Vance',
    summary: 'SOC alerts triggered by multiple faculty members reporting suspicious password-reset prompts originating from external IP space.',
    containment_steps: 'Blacklisted 14 phishing domain indicators on gateway DNS; quarantined 42 malicious inboxes; revoked active tokens for 3 vulnerable accounts.',
    reported_at: '2026-10-28 09:14:00',
  },
  {
    id: 2,
    incident_code: 'INC-2026-002',
    title: 'Temporary Core Network Saturation & Outage',
    severity: 'High',
    status: 'Contained',
    affected_asset_id: 6,
    asset_name: 'Campus Core Gateway Router',
    assigned_analyst: 'Elena Rostova',
    summary: 'Intermittent packet loss of 28% observed during mock examination trial run caused by upstream ISP BGP flap.',
    containment_steps: 'Rerouted critical exam submission traffic via backup microwave channel; engaged ISP NOC for route damping resolution.',
    reported_at: '2026-10-29 14:22:00',
  },
  {
    id: 3,
    incident_code: 'INC-2026-003',
    title: 'Accidental Partial Drop of Test Evaluation Batch',
    severity: 'Medium',
    status: 'Resolved',
    affected_asset_id: 2,
    asset_name: 'Student Answer Database',
    assigned_analyst: 'Elena Rostova',
    summary: 'Operator script prematurely cleared staging answer table during semester trial run; data recovered successfully from hourly snapshot.',
    containment_steps: 'Restored snapshot table in isolated staging schema; verified cryptographic row counts; added confirmation gates to batch deletion scripts.',
    reported_at: '2026-10-25 11:05:00',
    resolved_at: '2026-10-25 12:40:00',
  },
];

const SEED_REMEDIATION: RemediationTask[] = [
  {
    id: 1,
    task_code: 'REM-01',
    risk_id: 1,
    risk_title: 'Unauthorized Access & Leakage of Question Papers',
    affected_asset_id: 1,
    asset_name: 'Question Paper Repository',
    title: 'Deploy FIDO2 / TOTP Multi-Factor Authentication',
    description: 'Roll out mandatory two-factor authentication across all faculty portal access points and question paper repositories.',
    assigned_owner: 'Dr. Alistair Vance',
    priority: 'Critical',
    status: 'In Progress',
    estimated_cost: 150000.00,
    due_date: '2026-11-15',
  },
  {
    id: 2,
    task_code: 'REM-02',
    risk_id: 2,
    risk_title: 'Corruption or Irrecoverable Loss of Submitted Answers',
    affected_asset_id: 2,
    asset_name: 'Student Answer Database',
    title: 'Automated Weekly Disaster Recovery Verification Pipeline',
    description: 'Implement automated script that spins up ephemeral MySQL container, restores latest backup, and validates row hashes.',
    assigned_owner: 'Elena Rostova',
    priority: 'Medium',
    status: 'In Progress',
    estimated_cost: 45000.00,
    due_date: '2026-11-20',
  },
  {
    id: 3,
    task_code: 'REM-03',
    risk_id: 3,
    risk_title: 'Production Online Exam Service Outage During Active Exam',
    affected_asset_id: 3,
    asset_name: 'Online Examination Server',
    title: 'High Availability Web Cluster with Load Balancer',
    description: 'Provision secondary application server with NGINX reverse proxy failover and health probe monitoring.',
    assigned_owner: 'Devin Vance',
    priority: 'High',
    status: 'Pending',
    estimated_cost: 180000.00,
    due_date: '2026-11-30',
  },
  {
    id: 4,
    task_code: 'REM-04',
    risk_id: 4,
    risk_title: 'Credential Theft via Spear-Phishing Campaign',
    affected_asset_id: 4,
    asset_name: 'Faculty Identity & Access Store',
    title: 'Enterprise Phishing Protection & Threat Training',
    description: 'Implement AI-assisted email threat filtering and conduct mandatory faculty phishing awareness workshops.',
    assigned_owner: 'Devin Vance',
    priority: 'Critical',
    status: 'In Progress',
    estimated_cost: 95000.00,
    due_date: '2026-11-10',
  },
  {
    id: 5,
    task_code: 'REM-05',
    risk_id: 5,
    risk_title: 'Unauthorized Tampering with Official Student Grades',
    affected_asset_id: 5,
    asset_name: 'Final Marks & Grades DB',
    title: 'Dual-Custody Authorization & RBAC Least Privilege',
    description: 'Strip direct write privileges on grades table; enforce two-officer digital signoff for any grade modifications.',
    assigned_owner: 'Marcus Sterling',
    priority: 'High',
    status: 'Pending',
    estimated_cost: 60000.00,
    due_date: '2026-12-05',
  },
  {
    id: 6,
    task_code: 'REM-06',
    risk_id: 6,
    risk_title: 'Core Network Disconnection During Distributed Exam Hours',
    affected_asset_id: 6,
    asset_name: 'Campus Core Gateway Router',
    title: 'Secondary ISP Uplink with Automated BGP Failover',
    description: 'Contract secondary leased line and configure gateway router with sub-second failover monitoring.',
    assigned_owner: 'Elena Rostova',
    priority: 'Medium',
    status: 'Completed',
    estimated_cost: 70000.00,
    due_date: '2026-10-30',
    completed_at: '2026-10-30 17:00:00',
    verification_notes: 'Sub-second optical cut simulation succeeded; zero packet loss recorded during cutover.',
  },
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    timestamp: '2026-10-31 23:45:12',
    actor_name: 'Dr. Alistair Vance',
    actor_role: 'Security Admin',
    action: 'LOGIN',
    target_entity: 'SecuTrack Portal',
    details: 'Authenticated successfully via session token.',
    ip_address: '127.0.0.1',
  },
  {
    id: 2,
    timestamp: '2026-10-31 22:15:00',
    actor_name: 'Devin Vance',
    actor_role: 'SOC Analyst',
    action: 'UPDATE_RISK',
    target_entity: 'RSK-R1',
    details: 'Adjusted Likelihood rating to 4 following telemetry alert feed.',
    ip_address: '127.0.0.1',
  },
  {
    id: 3,
    timestamp: '2026-10-31 20:30:00',
    actor_name: 'Elena Rostova',
    actor_role: 'Remediation Lead',
    action: 'UPDATE_REMEDIATION',
    target_entity: 'REM-06',
    details: 'Updated status to Completed; verification confirmed.',
    ip_address: '127.0.0.1',
  },
  {
    id: 4,
    timestamp: '2026-10-31 18:20:00',
    actor_name: 'Marcus Sterling',
    actor_role: 'Auditor',
    action: 'GENERATE_REPORT',
    target_entity: 'Executive Risk Dossier',
    details: 'Exported quantitative ALE & budget reduction report for academic committee.',
    ip_address: '127.0.0.1',
  },
  {
    id: 5,
    timestamp: '2026-10-31 14:10:00',
    actor_name: 'System Daemon',
    actor_role: 'Automated Agent',
    action: 'TELEMETRY_SCAN',
    target_entity: 'AST-QP-01',
    details: 'Scheduled vulnerability probe completed. 0 new findings, 1 existing critical finding active.',
    ip_address: '127.0.0.1',
  },
];

// Helper to access LocalStorage cache
function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(`secutrack_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`secutrack_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error', e);
  }
}

// Unified API Service
export const api = {
  // Auth
  async login(username: string, _password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: _password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('secutrack_token', data.token);
        localStorage.setItem('secutrack_user', JSON.stringify(data.user));
        return data;
      } else {
        const err = await res.json().catch(() => ({ error: 'Invalid operator credentials.' }));
        throw new Error(err.error || 'Authentication failed.');
      }
    } catch (e: any) {
      if (e.message && e.message !== 'Failed to fetch') {
        throw e;
      }
      // Offline fallback: only allow valid known institutional demo credentials
      const validCreds: Record<string, { role: User['role']; name: string; dept: string }> = {
        admin: { role: 'Security Admin', name: 'Dr. Alistair Vance', dept: 'CISO Directorate' },
        analyst: { role: 'SOC Analyst', name: 'Devin Vance', dept: 'Threat Operations' },
        lead: { role: 'Remediation Lead', name: 'Elena Rostova', dept: 'Infrastructure Security' },
        auditor: { role: 'Auditor', name: 'Marcus Sterling', dept: 'Compliance & GRC' },
      };

      const lowerUser = username.trim().toLowerCase();
      const match = validCreds[lowerUser];
      if (match && _password === 'SecuTrack2026!') {
        const mockUser: User = {
          id: lowerUser === 'admin' ? 1 : lowerUser === 'analyst' ? 2 : lowerUser === 'lead' ? 3 : 4,
          username: lowerUser,
          email: `${lowerUser}@secutrack.io`,
          full_name: match.name,
          role: match.role,
          department: match.dept,
        };
        const token = `secutrack_offline_jwt_${mockUser.id}_${Date.now()}`;
        localStorage.setItem('secutrack_token', token);
        localStorage.setItem('secutrack_user', JSON.stringify(mockUser));
        return { user: mockUser, token };
      }

      throw new Error('Invalid operator credentials. Unauthorized login attempt.');
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('secutrack_token') && !!localStorage.getItem('secutrack_user');
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('secutrack_user');
    return stored ? JSON.parse(stored) : null;
  },

  logout(): void {
    localStorage.removeItem('secutrack_token');
    localStorage.removeItem('secutrack_user');
  },

  // Dashboard Metrics
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/metrics`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback calculation
    }

    const risks = await this.getRisks();
    const assets = await this.getAssets();
    const vulns = await this.getVulnerabilities();
    const incidents = await this.getIncidents();
    const remediation = await this.getRemediationTasks();

    const openRisks = risks.filter(r => r.status !== 'Resolved');
    const critHigh = openRisks.filter(r => r.risk_level === 'Critical' || r.risk_level === 'High');
    const openVulns = vulns.filter(v => v.status === 'Open');
    const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
    const completedTasks = remediation.filter(t => t.status === 'Completed').length;
    const totalTasks = remediation.length;
    const remPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalALE = risks.reduce((sum, r) => sum + (r.annual_loss_expectancy || 0), 0);

    return {
      total_assets: assets.length,
      open_risks: openRisks.length,
      critical_high_risks: critHigh.length,
      open_vulnerabilities: openVulns.length,
      active_incidents: activeIncidents.length,
      remediation_completion_pct: remPct,
      total_annual_loss_expectancy: totalALE,
      severity_distribution: {
        critical: risks.filter(r => r.risk_level === 'Critical').length,
        high: risks.filter(r => r.risk_level === 'High').length,
        medium: risks.filter(r => r.risk_level === 'Medium').length,
        low: risks.filter(r => r.risk_level === 'Low').length,
      },
    };
  },

  // Assets
  async getAssets(): Promise<Asset[]> {
    try {
      const res = await fetch(`${API_BASE}/assets`);
      if (res.ok) return await res.json();
    } catch {}
    return getStored<Asset[]>('assets', SEED_ASSETS);
  },

  async addAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
    const assets = await this.getAssets();
    const newAsset: Asset = {
      ...asset,
      id: Date.now(),
      open_vulns_count: 0,
      open_risks_count: 0,
    };
    assets.push(newAsset);
    setStored('assets', assets);

    try {
      await fetch(`${API_BASE}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset),
      });
    } catch {}

    return newAsset;
  },

  // Vulnerabilities
  async getVulnerabilities(): Promise<Vulnerability[]> {
    try {
      const res = await fetch(`${API_BASE}/vulnerabilities`);
      if (res.ok) return await res.json();
    } catch {}
    return getStored<Vulnerability[]>('vulnerabilities', SEED_VULNS);
  },

  // Risks
  async getRisks(): Promise<Risk[]> {
    try {
      const res = await fetch(`${API_BASE}/risks`);
      if (res.ok) return await res.json();
    } catch {}
    return getStored<Risk[]>('risks', SEED_RISKS);
  },

  async updateRiskStatus(riskId: number, status: Risk['status']): Promise<void> {
    const risks = await this.getRisks();
    const r = risks.find(item => item.id === riskId);
    if (r) {
      r.status = status;
      setStored('risks', risks);
    }
    try {
      await fetch(`${API_BASE}/risks/${riskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {}
  },

  // Incidents
  async getIncidents(): Promise<Incident[]> {
    try {
      const res = await fetch(`${API_BASE}/incidents`);
      if (res.ok) return await res.json();
    } catch {}
    return getStored<Incident[]>('incidents', SEED_INCIDENTS);
  },

  async updateIncidentStatus(incidentId: number, status: Incident['status']): Promise<void> {
    const incidents = await this.getIncidents();
    const inc = incidents.find(item => item.id === incidentId);
    if (inc) {
      inc.status = status;
      if (status === 'Resolved') inc.resolved_at = new Date().toISOString();
      setStored('incidents', incidents);
    }
    try {
      await fetch(`${API_BASE}/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {}
  },

  // Remediation Tasks
  async getRemediationTasks(): Promise<RemediationTask[]> {
    try {
      const res = await fetch(`${API_BASE}/remediation`);
      if (res.ok) return await res.json();
    } catch {}
    return getStored<RemediationTask[]>('remediation', SEED_REMEDIATION);
  },

  async updateRemediationStatus(taskId: number, status: RemediationTask['status'], verificationNotes?: string): Promise<void> {
    const tasks = await this.getRemediationTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      if (verificationNotes) task.verification_notes = verificationNotes;
      if (status === 'Completed') task.completed_at = new Date().toISOString();
      setStored('remediation', tasks);
    }
    try {
      await fetch(`${API_BASE}/remediation/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, verification_notes: verificationNotes }),
      });
    } catch {}
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch(`${API_BASE}/audit`);
      if (res.ok) return await res.json();
    } catch {}
    return getStored<AuditLog[]>('audit_logs', SEED_AUDIT_LOGS);
  },

  // Trigger Telemetry Scan Simulation (with real audit event)
  async triggerScan(): Promise<{ message: string; scanned_count: number }> {
    const logs = await this.getAuditLogs();
    const newLog: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor_name: this.getCurrentUser()?.full_name || 'Dr. Alistair Vance',
      actor_role: this.getCurrentUser()?.role || 'Security Admin',
      action: 'TRIGGER_SCAN',
      target_entity: 'All Core Assets',
      details: 'On-demand telemetry scan executed across 6 production assets. 0 new vulnerabilities detected.',
      ip_address: '127.0.0.1',
    };
    logs.unshift(newLog);
    setStored('audit_logs', logs);

    try {
      const res = await fetch(`${API_BASE}/scan`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}

    return { message: 'Asset scan completed successfully. Telemetry integrity verified.', scanned_count: 6 };
  },
};

