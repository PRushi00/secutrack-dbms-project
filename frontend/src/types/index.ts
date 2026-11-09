export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AssetCriticality = 'Critical' | 'High' | 'Medium' | 'Low';
export type AssetStatus = 'Active' | 'At Risk' | 'Under Remediation' | 'Offline';
export type RiskStatus = 'Open' | 'Under Investigation' | 'Mitigating' | 'Resolved' | 'Accepted';
export type VulnStatus = 'Open' | 'Confirmed' | 'Mitigated' | 'False Positive';
export type IncidentStatus = 'Open' | 'Investigating' | 'Contained' | 'Resolved';
export type RemediationStatus = 'Pending' | 'In Progress' | 'Under Review' | 'Completed';
export type UserRole = 'Security Admin' | 'SOC Analyst' | 'Remediation Lead' | 'Auditor';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: string;
}

export interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  type: 'Database' | 'Server' | 'Application' | 'Network' | 'Identity' | string;
  environment: 'Production' | 'Staging' | 'Development';
  criticality: AssetCriticality;
  owner: string;
  ip_address: string;
  hostname: string;
  status: AssetStatus;
  asset_value: number;
  open_vulns_count?: number;
  open_risks_count?: number;
}

export interface Vulnerability {
  id: number;
  vuln_code: string;
  title: string;
  cve_id: string;
  severity: Severity;
  cvss_score: number;
  affected_asset_id: number;
  asset_name?: string;
  source: string;
  description: string;
  remediation_guidance: string;
  status: VulnStatus;
  discovered_at: string;
}

export interface RiskExplanation {
  what_identified: string;
  why_it_matters: string;
  evidence_telemetry: string;
  why_priority: string;
  actionable_remediation: string;
  confidence_score: number;
}

export interface Risk {
  id: number;
  risk_code: string;
  title: string;
  affected_asset_id: number;
  asset_name?: string;
  related_vuln_id?: number;
  threat_description: string;
  likelihood: number; // 1 - 5
  impact: number;     // 1 - 5
  risk_score: number; // 1 - 25
  risk_level: Severity;
  asset_value: number;
  exposure_factor: number;
  single_loss_expectancy: number; // SLE = AV * EF
  annual_rate_of_occurrence: number; // ARO
  annual_loss_expectancy: number; // ALE = SLE * ARO
  status: RiskStatus;
  assigned_owner: string;
  created_at: string;
  updated_at?: string;
  explanation?: RiskExplanation;
}

export interface Incident {
  id: number;
  incident_code: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  affected_asset_id: number;
  asset_name?: string;
  assigned_analyst: string;
  summary: string;
  containment_steps: string;
  reported_at: string;
  resolved_at?: string;
}

export interface RemediationTask {
  id: number;
  task_code: string;
  risk_id: number;
  risk_title?: string;
  affected_asset_id: number;
  asset_name?: string;
  title: string;
  description: string;
  assigned_owner: string;
  priority: Severity;
  status: RemediationStatus;
  estimated_cost: number;
  due_date: string;
  completed_at?: string;
  verification_notes?: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  action: string;
  target_entity: string;
  details: string;
  ip_address: string;
}

export interface DashboardMetrics {
  total_assets: number;
  open_risks: number;
  critical_high_risks: number;
  open_vulnerabilities: number;
  active_incidents: number;
  remediation_completion_pct: number;
  total_annual_loss_expectancy: number;
  severity_distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

