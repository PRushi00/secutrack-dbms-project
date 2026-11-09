-- SecuTrack: AI-powered Cybersecurity Risk Detection, Explanation & Management System
-- Database Schema for MySQL 8.0 & SQLite Compatibility
-- Academic Case Study: SecureExam University Enterprise Cybersecurity Risk Architecture

-- ----------------------------------------------------------------------------
-- 1. USERS & IDENTITY MANAGEMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'SOC Analyst',
    department VARCHAR(80) DEFAULT 'Cybersecurity Operations',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. ASSET INVENTORY
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_tag VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(50) NOT NULL,
    environment VARCHAR(30) NOT NULL DEFAULT 'Production',
    criticality VARCHAR(20) NOT NULL DEFAULT 'High',
    owner VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50) DEFAULT '10.0.4.15',
    hostname VARCHAR(120) DEFAULT 'core-srv.secutrack.internal',
    status VARCHAR(30) NOT NULL DEFAULT 'Active',
    asset_value DECIMAL(12, 2) DEFAULT 500000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. VULNERABILITIES & FINDINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vulnerabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vuln_code VARCHAR(40) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    cve_id VARCHAR(50) DEFAULT 'N/A',
    severity VARCHAR(20) NOT NULL,
    cvss_score DECIMAL(3, 1) DEFAULT 7.5,
    affected_asset_id INT NOT NULL,
    source VARCHAR(60) NOT NULL DEFAULT 'Automated Telemetry Scanner',
    description TEXT NOT NULL,
    remediation_guidance TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Open',
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (affected_asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 4. RISK REGISTER & QUANTITATIVE/QUALITATIVE ASSESSMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS risks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    risk_code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    affected_asset_id INT NOT NULL,
    related_vuln_id INT,
    threat_description TEXT NOT NULL,
    likelihood INT NOT NULL DEFAULT 3,
    impact INT NOT NULL DEFAULT 3,
    risk_score INT NOT NULL DEFAULT 9,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'Medium',
    
    asset_value DECIMAL(12, 2) DEFAULT 500000.00,
    exposure_factor DECIMAL(4, 2) DEFAULT 0.60,
    single_loss_expectancy DECIMAL(12, 2) DEFAULT 300000.00,
    annual_rate_of_occurrence DECIMAL(5, 2) DEFAULT 0.50,
    annual_loss_expectancy DECIMAL(12, 2) DEFAULT 150000.00,
    
    status VARCHAR(30) NOT NULL DEFAULT 'Open',
    assigned_owner VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (affected_asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (related_vuln_id) REFERENCES vulnerabilities(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 5. EXPLAINABLE RISK REASONING & CAUSAL EVIDENCE (EXPLAINABLE AI ENGINE)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS risk_explanations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    risk_id INT NOT NULL UNIQUE,
    what_identified TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    evidence_telemetry TEXT NOT NULL,
    why_priority TEXT NOT NULL,
    actionable_remediation TEXT NOT NULL,
    confidence_score DECIMAL(4, 2) DEFAULT 0.94,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 6. INCIDENT MANAGEMENT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Open',
    affected_asset_id INT NOT NULL,
    assigned_analyst VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    containment_steps TEXT,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (affected_asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 7. REMEDIATION WORKFLOW & TASKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS remediation_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_code VARCHAR(30) NOT NULL UNIQUE,
    risk_id INT NOT NULL,
    affected_asset_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    assigned_owner VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'High',
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    estimated_cost DECIMAL(10, 2) DEFAULT 25000.00,
    due_date DATE,
    completed_at TIMESTAMP NULL,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE,
    FOREIGN KEY (affected_asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 8. AUDIT LOGS & REPORTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(60) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1'
);

-- ----------------------------------------------------------------------------
-- SEED DATA: SecureExam University Case Study & Grounded Cybersecurity Baseline
-- ----------------------------------------------------------------------------

-- Users (Demo accounts for viva evaluation)
INSERT INTO users (username, email, password_hash, full_name, role, department) VALUES
('admin', 'admin@secutrack.io', '$2b$12$K8yQd1vXF9sLp1k6A/P7q.m8k6Z2W8Y6C1B4N7M9k0L2Q3W4E5R6T', 'Dr. Alistair Vance', 'Security Admin', 'CISO Directorate'),
('analyst', 'analyst@secutrack.io', '$2b$12$K8yQd1vXF9sLp1k6A/P7q.m8k6Z2W8Y6C1B4N7M9k0L2Q3W4E5R6T', 'Devin Vance', 'SOC Analyst', 'Threat Operations'),
('lead', 'remediation@secutrack.io', '$2b$12$K8yQd1vXF9sLp1k6A/P7q.m8k6Z2W8Y6C1B4N7M9k0L2Q3W4E5R6T', 'Elena Rostova', 'Remediation Lead', 'Infrastructure Security'),
('auditor', 'auditor@secutrack.io', '$2b$12$K8yQd1vXF9sLp1k6A/P7q.m8k6Z2W8Y6C1B4N7M9k0L2Q3W4E5R6T', 'Marcus Sterling', 'Auditor', 'Compliance & GRC');

-- Assets
INSERT INTO assets (asset_tag, name, type, environment, criticality, owner, ip_address, hostname, status, asset_value) VALUES
('AST-QP-01', 'Question Paper Repository', 'Database', 'Production', 'Critical', 'Exam Directorate', '10.0.4.12', 'qp-vault.exam.internal', 'At Risk', 800000.00),
('AST-ANS-02', 'Student Answer Database', 'Database', 'Production', 'Critical', 'Records & Evaluation', '10.0.4.15', 'answers-db.exam.internal', 'Active', 750000.00),
('AST-SRV-03', 'Online Examination Server', 'Server', 'Production', 'Critical', 'Systems Engineering', '10.0.2.50', 'exam-cluster-01.internal', 'Under Remediation', 600000.00),
('AST-ID-04', 'Faculty Identity & Access Store', 'Identity', 'Production', 'Critical', 'IT Security Operations', '10.0.1.10', 'sso-faculty.internal', 'At Risk', 500000.00),
('AST-MRK-05', 'Final Marks & Grades DB', 'Database', 'Production', 'High', 'Registrar Office', '10.0.4.20', 'grades-master.internal', 'Active', 650000.00),
('AST-NET-06', 'Campus Core Gateway Router', 'Network', 'Production', 'High', 'Network Infrastructure', '10.0.0.1', 'edge-gateway-gw01', 'Active', 400000.00);

-- Vulnerabilities
INSERT INTO vulnerabilities (vuln_code, title, cve_id, severity, cvss_score, affected_asset_id, source, description, remediation_guidance, status) VALUES
('VULN-AUTH-001', 'Missing Multi-Factor Authentication on Faculty Portal', 'CVE-2024-21887', 'Critical', 9.8, 4, 'Identity Posture Assessment', 'Faculty authentication portal accepts single-factor credentials without time-based one-time passwords or FIDO2 hardware keys.', 'Enforce mandatory MFA (TOTP / WebAuthn) for all active faculty and administrative accounts.', 'Open'),
('VULN-DB-002', 'Irregular Backup Restoration Verification', 'CVE-2023-48795', 'Medium', 6.2, 2, 'Disaster Recovery Audit', 'Encrypted backups are scheduled nightly, but automated integrity testing and restore dry-runs are not performed weekly.', 'Deploy automated weekly sandbox restore validation scripts with checksum verification.', 'Open'),
('VULN-HA-003', 'Single Point of Failure in Production Exam Cluster', 'CVE-2024-38077', 'High', 8.5, 3, 'Architecture Review', 'The live examination environment runs on a single host without multi-availability zone failover or live heartbeat mirrors.', 'Implement active-passive load balanced replica nodes with automatic health check failover.', 'Open'),
('VULN-PHISH-004', 'Credential Harvesting & Phishing Susceptibility', 'CWE-200', 'Critical', 9.1, 4, 'SOC Telemetry Analysis', 'High volume of spear-phishing campaigns detected targeting academic evaluators during final examination upload cycles.', 'Implement advanced DMARC/DKIM/SPF enforcement and email payload sandbox isolation.', 'Open'),
('VULN-ACL-005', 'Excessive Administrative Privileges on Marks Ledger', 'CWE-250', 'High', 7.9, 5, 'Privilege Audit', 'Administrative access privileges exceed least-privilege standards: 14 accounts hold full write access to historical grade tables.', 'Refactor RBAC into dual-custody authorization with cryptographic row-level tamper signatures.', 'Open'),
('VULN-NET-006', 'Single ISP Uplink Redundancy Deficit', 'CWE-400', 'Medium', 5.8, 6, 'Network Redundancy Scan', 'Core gateway relies on single primary leased line without dynamic BGP dual-homed secondary failover link.', 'Provision automated SD-WAN secondary cellular / fibre failover line with BGP route convergence.', 'Open');

-- Risks
INSERT INTO risks (risk_code, title, affected_asset_id, related_vuln_id, threat_description, likelihood, impact, risk_score, risk_level, asset_value, exposure_factor, single_loss_expectancy, annual_rate_of_occurrence, annual_loss_expectancy, status, assigned_owner) VALUES
('RSK-R1', 'Unauthorized Access & Leakage of Question Papers', 1, 1, 'Threat actors exploit weak faculty credentials lacking MFA to breach repository and exfiltrate unpublished examination papers prior to exam date.', 4, 5, 20, 'Critical', 800000.00, 0.75, 600000.00, 0.40, 240000.00, 'Open', 'Dr. Alistair Vance'),
('RSK-R2', 'Corruption or Irrecoverable Loss of Submitted Answers', 2, 2, 'Database storage glitch or malicious ransomware encrypts submitted student scripts while restore procedures fail verification.', 2, 3, 6, 'Medium', 750000.00, 0.40, 300000.00, 0.15, 45000.00, 'Under Investigation', 'Elena Rostova'),
('RSK-R3', 'Production Online Exam Service Outage During Active Exam', 3, 3, 'Single server node undergoes memory exhaustion or DDoS traffic, stranding 12,000 students mid-exam session.', 3, 4, 12, 'High', 600000.00, 0.60, 360000.00, 0.50, 180000.00, 'Mitigating', 'Devin Vance'),
('RSK-R4', 'Credential Theft via Spear-Phishing Campaign', 4, 4, 'Sophisticated threat group launches cloned university portal email lure, harvesting faculty credentials to establish persistent foothold.', 5, 4, 20, 'Critical', 500000.00, 0.70, 350000.00, 0.80, 280000.00, 'Open', 'Devin Vance'),
('RSK-R5', 'Unauthorized Tampering with Official Student Grades', 5, 5, 'Over-privileged internal staff or compromised account alters student GPA/marks records in master grade ledger.', 2, 5, 10, 'High', 650000.00, 0.50, 325000.00, 0.10, 32500.00, 'Open', 'Marcus Sterling'),
('RSK-R6', 'Core Network Disconnection During Distributed Exam Hours', 6, 6, 'Primary ISP fibre cut halts remote submission sync across satellite test centers and campus halls.', 3, 3, 9, 'Medium', 400000.00, 0.35, 140000.00, 0.30, 42000.00, 'Resolved', 'Elena Rostova');

-- Explainable Risk Details
INSERT INTO risk_explanations (risk_id, what_identified, why_it_matters, evidence_telemetry, why_priority, actionable_remediation, confidence_score) VALUES
(1, 'Weak single-factor authentication guarding unpublished question paper archives.', 'Breach of question paper confidentiality triggers widespread exam cancellations, regulatory audits, institutional reputational damage, and an estimated single loss expectancy of ₹6,00,000.', 'Auth logs show 340 brute-force attempts on faculty credentials - zero MFA challenges recorded - endpoint exposed to public IP range 10.0.4.12:443.', 'Critical severity (Score: 20/25). Likelihood rating 4 (Likely) multiplied by Impact rating 5 (Severe) yields highest tier priority. Asset criticality is Tier 1.', '1. Enforce WebAuthn/TOTP MFA on all evaluator logins within 48 hours.\n2. Restrict question paper repository access to internal campus VPN IP pools.\n3. Enable cryptographic download watermarking with assessor audit trails.', 0.98),
(2, 'Backup snapshot schedules exist, but scheduled disaster-recovery restoration tests have not been executed in 118 days.', 'Without verified restore operations, disk failures or catastrophic corruption could result in permanent loss of submitted student scripts.', 'Backup logs confirm daily dump generation at 02:00 UTC, but zero dry-run validation logs exist in /var/log/dr-verification.log.', 'Medium severity (Score: 6/25). Likelihood 2 (Unlikely) × Impact 3 (Moderate). Mitigated partially by multi-drive array.', '1. Configure automated weekly sandbox restoration script with SHA-256 table verification.\n2. Mandate off-site immutable air-gapped cold storage replication.', 0.92),
(3, 'Online examination portal operates on standalone web/app node without high-availability clustering or auto-scaling.', 'A sudden traffic surge of 12,000 simultaneous submissions causes socket exhaustion and 504 Gateway Timeouts during critical evaluation hours.', 'CPU utilization spiked to 94.6% during previous mid-term test - memory saturation reached 89% with zero replica nodes available.', 'High severity (Score: 12/25). Likelihood 3 (Possible) × Impact 4 (Major). SLE ₹3,60,000, ALE ₹1,80,000.', '1. Deploy containerized horizontal pod auto-scalers across 3 replica sets.\n2. Configure reverse proxy round-robin load balancer with SSL offloading.\n3. Implement edge caching for static assets and exam instructions.', 0.95),
(4, 'Targeted credential harvesting and spear-phishing lures detected targeting 650 faculty members.', 'Phishing compromises lead directly to lateral movement toward grade databases and question paper stores.', 'Mail gateway logs intercepted 42 phishing emails impersonating the Vice Chancellor with lookalike domain secure-exam-portal.org.', 'Critical severity (Score: 20/25). Likelihood 5 (Almost Certain) × Impact 4 (Major). Annualized Loss Expectancy reaches ₹2,80,000.', '1. Block lookalike domain at DNS resolver.\n2. Roll out contextual email banner warnings for external senders.\n3. Conduct mandatory interactive phishing simulation training for department chairs.', 0.97),
(5, 'Fourteen internal accounts possess superuser write privileges on the historical student marks ledger.', 'Lack of separation of duties allows unauthorized grade adjustments without multi-person approval or non-repudiable audit logging.', 'Database privilege schema inspection indicates 14 accounts have GRANT ALL PRIVILEGES on exam_db.grades_master.', 'High severity (Score: 10/25). Likelihood 2 (Unlikely) × Impact 5 (Severe). Institutional integrity depends on grade veracity.', '1. Revoke direct write permissions - migrate to stored procedures with dual-authorization signatures.\n2. Implement append-only cryptographic transaction auditing on all grade modifications.', 0.94),
(6, 'Gateway router lacks secondary automated ISP uplink failover.', 'Fibre cut or ISP routing failure disconnects remote proctoring telemetry and student answer transmission.', 'SNMP telemetry records single WAN interface active on gigabitethernet0/0/0 with no secondary route in OSPF table.', 'Medium severity (Score: 9/25). Likelihood 3 (Possible) × Impact 3 (Moderate). Primary ISP SLA is 99.5%.', '1. Activate secondary optical fibre link on redundant port gigabitethernet0/0/1 with automatic failover.\n2. Test failover latency during non-examination maintenance window.', 0.91);

-- Incidents
INSERT INTO incidents (incident_code, title, severity, status, affected_asset_id, assigned_analyst, summary, containment_steps, reported_at) VALUES
('INC-2026-001', 'Repeated Phishing Inundation Against Faculty Portals', 'Critical', 'Investigating', 4, 'Devin Vance', 'SOC alerts triggered by multiple faculty members reporting suspicious password-reset prompts originating from external IP space.', 'Blacklisted 14 phishing domain indicators on gateway DNS: quarantined 42 malicious inboxes: revoked active tokens for 3 vulnerable accounts.', '2026-10-28 09:14:00'),
('INC-2026-002', 'Temporary Core Network Saturation & Outage', 'High', 'Contained', 6, 'Elena Rostova', 'Intermittent packet loss of 28% observed during mock examination trial run caused by upstream ISP BGP flap.', 'Rerouted critical exam submission traffic via backup microwave channel: engaged ISP NOC for route damping resolution.', '2026-10-29 14:22:00'),
('INC-2026-003', 'Accidental Partial Drop of Test Evaluation Batch', 'Medium', 'Resolved', 2, 'Elena Rostova', 'Operator script prematurely cleared staging answer table during semester trial run: data recovered successfully from hourly snapshot.', 'Restored snapshot table in isolated staging schema: verified cryptographic row counts: added confirmation gates to batch deletion scripts.', '2026-10-25 11:05:00');

-- Remediation Tasks
INSERT INTO remediation_tasks (task_code, risk_id, affected_asset_id, title, description, assigned_owner, priority, status, estimated_cost, due_date) VALUES
('REM-01', 1, 1, 'Deploy FIDO2 / TOTP Multi-Factor Authentication', 'Roll out mandatory two-factor authentication across all faculty portal access points and question paper repositories.', 'Dr. Alistair Vance', 'Critical', 'In Progress', 150000.00, '2026-11-15'),
('REM-02', 2, 2, 'Automated Weekly Disaster Recovery Verification Pipeline', 'Implement automated script that spins up ephemeral MySQL container, restores latest backup, and validates row hashes.', 'Elena Rostova', 'Medium', 'In Progress', 45000.00, '2026-11-20'),
('REM-03', 3, 3, 'High Availability Web Cluster with Load Balancer', 'Provision secondary application server with NGINX reverse proxy failover and health probe monitoring.', 'Devin Vance', 'High', 'Pending', 180000.00, '2026-11-30'),
('REM-04', 4, 4, 'Enterprise Phishing Protection & Threat Training', 'Implement AI-assisted email threat filtering and conduct mandatory faculty phishing awareness workshops.', 'Devin Vance', 'Critical', 'In Progress', 95000.00, '2026-11-10'),
('REM-05', 5, 5, 'Dual-Custody Authorization & RBAC Least Privilege', 'Strip direct write privileges on grades table: enforce two-officer digital signoff for any grade modifications.', 'Marcus Sterling', 'High', 'Pending', 60000.00, '2026-12-05'),
('REM-06', 6, 6, 'Secondary ISP Uplink with Automated BGP Failover', 'Contract secondary leased line and configure gateway router with sub-second failover monitoring.', 'Elena Rostova', 'Medium', 'Completed', 70000.00, '2026-10-30');

-- Audit Logs
INSERT INTO audit_logs (actor_name, actor_role, action, target_entity, details, ip_address) VALUES
('Dr. Alistair Vance', 'Security Admin', 'LOGIN', 'SecuTrack Portal', 'Authentication successful via SSO credentials.', '127.0.0.1'),
('Devin Vance', 'SOC Analyst', 'UPDATE_RISK', 'RSK-R1', 'Updated likelihood assessment from 3 to 4 based on threat intelligence findings.', '127.0.0.1'),
('Elena Rostova', 'Remediation Lead', 'UPDATE_REMEDIATION', 'REM-06', 'Marked task REM-06 as Completed following successful ISP failover test.', '127.0.0.1'),
('Marcus Sterling', 'Auditor', 'GENERATE_REPORT', 'Quarterly Risk Audit', 'Generated executive PDF compliance report for SecureExam University Board.', '127.0.0.1'),
('System Telemetry', 'Automated Daemon', 'TRIGGER_SCAN', 'AST-QP-01', 'Scheduled CVE vulnerability scan completed: 1 critical finding updated.', '127.0.0.1');
