# SecuTrack — AI-Powered Cybersecurity Risk Detection, Explanation & Management System

> **A Production-Grade, Full-Stack Cybersecurity Risk Intelligence Platform with Immersive 3D Visuals, Explainable AI Causality, Quantitative Loss Estimation (ALE/SLE), and Complete Relational Integrity.**

LIVE WEBSITE: [Open SecuTrack](https://prushi00.github.io/secutrack-dbms-project/)  
GITHUB REPOSITORY: [View Source Code](https://github.com/PRushi00/secutrack-dbms-project)

---

## 🛡️ 1. Executive Summary & Overview

**SecuTrack** is an enterprise cybersecurity risk management platform engineered to solve the operational gap between raw scanner alerts and decisive mitigation. Built for CISOs, SOC analysts, and remediation teams, it unifies asset inventory, vulnerability telemetry, dual qualitative/quantitative risk modeling, incident response, explainable AI root-cause reasoning, and audit logging into a single cohesive system.

### Grounded Academic Domain
SecuTrack is modeled on the **SecureExam University Online Examination Platform** cybersecurity case study (12,000 students, 650 faculty, online examination infrastructure). The system tracks critical production assets (Question Paper Repository, Student Answer Database, Online Exam Server Cluster, Faculty Identity & SSO Store, Final Marks Ledger, Campus Core Gateway), detects known vulnerabilities (e.g. CVE-2024-21887, CVE-2024-38077), and optimizes the allocation of a strict **₹6,00,000 cybersecurity improvement budget**.

---

## ⚡ 2. The Three Connected Experiences

### 1. Cinematic Public Landing Page
- **Visual Impact**: Immersive deep-space palette (`#09111F`, `#101B2D`), subtle radial cyan glows, and refined editorial typography.
- **Interactive 3D Centerpiece**: Built with **Three.js**, rendering a geometric security core surrounded by interconnected asset nodes, orbital lattice cage, responsive pointer parallax, and smooth rotation with automatic WebGL fallback and `prefers-reduced-motion` compliance.
- **Scroll-Driven Storytelling**:
  - **Section A (The Problem)**: The pain points of fragmented asset silos, black-box severity scores, and qualitative guesswork.
  - **Section B (The SecuTrack Approach)**: The 5-stage closed loop: *Identify → Explain → Prioritize → Remediate → Review*.
  - **Section C (Core Capabilities)**: Modular grid highlighting Asset Inventory, Vulnerability Management, Risk Prioritization, Explainable Risk Analysis, Incident Response, and Audit History.
  - **Section D (How Risk Explanation Works)**: Interactive live inspector comparing Case R1 (Question Paper Archive MFA deficit) and Case R3 (Exam Server single-point-of-failure).
  - **Section E (Security Workflow)**: Traceable 4-phase progression from telemetry ingestion to cryptographic patch closure.
  - **Section F (Final CTA)**: Clear entry point leading to the operational dashboard.

### 2. Polished Authentication Portal
- **2-Column Responsive Layout**: Sleek brand-storytelling side panel on desktop paired with a focused sign-in form.
- **Security Features**: Email/username input matching backend contract, password visibility toggle, session persistence option, and inline validation.
- **One-Click Faculty Demo Identities** (Password: `SecuTrack2026!`):
  - **Security Admin** (`admin`): Dr. Alistair Vance (CISO Directorate)
  - **SOC Analyst** (`analyst`): Devin Vance (Threat Operations)
  - **Remediation Lead** (`lead`): Elena Rostova (Infrastructure Security)
  - **Compliance Auditor** (`auditor`): Marcus Sterling (GRC & Audit)

### 3. Professional Cybersecurity Operations Suite
- **Operational Shell**: Collapsible sidebar with active route indicator, tooltips, responsive mobile drawer, top breadcrumbs bar, global telemetry search, and live posture indicator.
- **Overview Dashboard**: High-density metric cards (Total Assets, Open Risks, Critical/High Risks, Open Vulnerabilities, Active Incidents, Remediation Completion %, Total ALE), severity tier distribution bars, cybersecurity budget utilization vs. exposure, priority risk table, asset health overview, and real audit activity feed.
- **Risk Center & Explainable AI**: Searchable risk register with severity/status filters and sorting. Clicking any risk opens the deep **Explainable Risk Panel** answering:
  1. *What was identified?*
  2. *Why does it matter?*
  3. *What evidence supports this assessment?*
  4. *Why this priority? (Likelihood × Impact matrix, Single Loss Expectancy ₹, Annualized Loss Expectancy ₹)*
  5. *What should happen next? (Actionable remediation guidance)*
- **Asset Inventory**: Enterprise registry of Databases, Servers, Network appliances, and Identity stores with IP addressing, environment tags, owner, asset value, and status.
- **Vulnerability Management**: Direct tracking of CVE findings (e.g. CVE-2024-21887), CVSS scores (up to 9.8 Critical), affected systems, detection telemetry sources, and technical details.
- **Incident Response**: SOC incident tracking (spear-phishing campaigns, network saturation, data integrity) with containment steps and status transitions (Open → Investigating → Contained → Resolved).
- **Remediation Management**: Actionable engineering tasks with cost estimations (tracking against the ₹6,00,000 university budget ceiling), target deadlines, verification evidence notes, and status updates.
- **Reports & Audit Trail**: Cryptographically attributable operational audit log, CSV export, and print-ready Executive Governance summary.
- **Identity & Preferences**: Multi-tier RBAC directory, telemetry polling interval settings, and currency display preferences.

---

## 🛠️ 3. Technical Architecture & Tech Stack

```
SecuTrack/
├── .github/workflows/deploy.yml  # Automated GitHub Actions CI/CD to GitHub Pages
├── frontend/                     # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/client.ts         # Unified API Client with Flask sync & local fallback
│   │   ├── components/           # Hero3D (Three.js), Navbar, Layout, SeverityBadge, Modal
│   │   ├── pages/                # Landing, Login, Dashboard, Risks, Assets, Vulns, etc.
│   │   └── types/                # Strict TypeScript data models
│   ├── vite.config.ts            # Relative base path for GitHub Pages & manual chunking
│   └── package.json              # Dependencies: three, lucide-react, react-router-dom
├── backend/                      # Python Flask REST API
│   ├── app.py                    # REST API endpoints, CORS, database queries, structured logging
│   ├── inspect_db.py             # Read-only terminal database table inspector
│   ├── secutrack.db              # Relational SQLite database (excluded from Git)
│   └── requirements.txt          # Flask, flask-cors, python-dotenv
├── database/
│   └── schema.sql                # Complete relational schema (MySQL 8.0 & SQLite compatible)
├── start_secutrack.bat           # 1-Click Launch (Backend :5000 + Frontend :5173 + Browser)
├── stop_secutrack.bat            # Safe process termination script
└── view_database_tables.bat      # 1-Click Interactive Database Inspector
```

---

## 🌐 4. Live Deployment vs. Local Execution

| Capability | Live GitHub Pages (`Web`) | Local Full-Stack (`Desktop`) |
| :--- | :--- | :--- |
| **Interactive 3D Centerpiece** | Full Three.js WebGL rendering | Full Three.js WebGL rendering |
| **Public Landing Page** | Fully accessible on any browser | Localhost port 5173 |
| **Demo Authentication** | 4 demo roles (`admin`, `analyst`, etc.) | 4 demo roles verified via Flask |
| **Operations Suite** | Full interactive suite via client storage | Full interactive suite via Flask API |
| **Database Engine** | Bundled relational baseline dataset | Live SQLite / MySQL via [`backend/app.py`](file:///c:/Users/nanda/OneDrive/Desktop/Projects/Subjects/DBMS/backend/app.py) |
| **Table Inspection Utility** | N/A (Static hosting) | [`view_database_tables.bat`](file:///c:/Users/nanda/OneDrive/Desktop/Projects/Subjects/DBMS/view_database_tables.bat) |

---

## 🚀 5. Local Setup & Execution

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Quick Start (Windows)
Double-click `start_secutrack.bat` in the project root:
```bat
start_secutrack.bat
```
This automatically initializes Python virtualenv and node_modules (if missing), launches the Flask API on `http://127.0.0.1:5000`, launches the Vite frontend on `http://localhost:5173`, and opens the landing page in your browser.

### Inspecting Database Tables
Double-click `view_database_tables.bat`:
```bat
view_database_tables.bat
```
Safely inspect all 8 tables, schemas, and records in read-only mode from your terminal.

### Stopping the Application
Double-click `stop_secutrack.bat`:
```bat
stop_secutrack.bat
```

---

## 📊 6. Quantitative Risk Formulas

SecuTrack calculates risk using international cybersecurity risk management standards (NIST SP 800-30 / ISO 27005):

$$\text{Single Loss Expectancy (SLE)} = \text{Asset Value (AV)} \times \text{Exposure Factor (EF)}$$

$$\text{Annualized Loss Expectancy (ALE)} = \text{SLE} \times \text{Annual Rate of Occurrence (ARO)}$$

$$\text{Qualitative Risk Score} = \text{Likelihood (1–5)} \times \text{Impact (1–5)} \in [1, 25]$$
