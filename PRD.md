I'll create a comprehensive Product Requirements Document (PRD) for the Al Rayaan Admin Dashboard, consolidating all the information from the instructions, conversations, and design files into a professional, actionable document.

```markdown
# Product Requirements Document (PRD)
## Al Rayaan Admin Dashboard

**Version:** 2.0  
**Date:** April 2026  
**Status:** In Development  
**Author:** Product Team  

---

## 1. Executive Summary

### 1.1 Product Vision
The Al Rayaan Admin Dashboard is a centralized, role-based management interface designed to streamline HR, Operations, Finance, Compliance, and Client Relations for Al Rayaan Contracting & Construction. It replaces fragmented spreadsheets and legacy tools with a unified, real-time system that enforces compliance, improves workforce visibility, and accelerates decision-making.

### 1.2 Business Objectives
- **Reduce administrative overhead** by 40% through automation of payroll, invoicing, and visa renewals.
- **Ensure 100% compliance** with visa/ license expiry tracking and hard-block assignment rules.
- **Improve project profitability** with real-time workforce allocation and cost tracking.
- **Provide bilingual (EN/AR) accessibility** for a diverse workforce.
- **Enable data-driven decisions** via integrated reports and KPI dashboards.

### 1.3 Success Metrics
| Metric | Target |
|--------|--------|
| Time to generate monthly payroll | < 15 minutes |
| Visa expiry alerts acknowledged within 24h | 95% |
| Reduction in unassigned labor hours | 30% |
| User satisfaction (CSAT) | ≥ 4.5/5 |
| System uptime | 99.9% |

---

## 2. User Personas & Roles

| Role | Responsibilities | Access Level |
|------|------------------|--------------|
| **Admin** | Full system configuration, user management, audit log review | All modules, RLS bypass |
| **HR Manager** | Employee lifecycle, attendance, leave approvals, payroll initiation | HR, Visa, limited Financial |
| **Operations Manager** | Project creation, manpower requests, workforce assignment, asset tracking | Operations, Assets, Reports |
| **Finance Manager** | Invoicing, expense approval, chart of accounts, financial reports | Financial, Contracts, Reports |
| **Project Supervisor** | View assigned workforce, submit manpower requests, log site attendance | Operations (view-only), HR (attendance) |
| **Client Relations** | Manage client database, log interactions, track feedback | CRM, Documents |

---

## 3. Functional Requirements

### 3.1 Module Breakdown

#### 3.1.1 Dashboard (Overview)
- **KPI Cards:** Active employees, visas expiring ≤30 days, monthly payroll total, active projects, YTD revenue.
- **Visa Expiry Alerts:** List of employees with visas expiring within 30 days, color-coded by urgency.
- **Recent Activity Feed:** Latest service requests, invoice payments, and manpower requests.
- **Revenue vs. Expense Chart:** Monthly trend (line/bar chart) using Chart.js.

#### 3.1.2 HR Management
- **Employee Directory:** CRUD operations with fields: name, position, primary trade, secondary trades (multi-select), availability status, contact info.
- **Attendance Logging:** Daily check-in/out with GPS/manual verification badges.
- **Leave Management:** Request submission, approval/rejection workflow, balance tracking.
- **Payroll Processing:**
  - Generate payroll periods (monthly).
  - Auto-calculate gross/net pay via Edge Function (mock implementation).
  - Preview payslip and bulk mark as paid.

#### 3.1.3 Visa & Immigration
- **Visa Registry:** Table showing employee name, visa number, issue/expiry dates, status.
- **Renewal Workflow:** Three-step modal (Apply → Approve → Issued) with status tracking.
- **Expiry Monitoring:** Highlight rows with expiry ≤30 days (orange) and ≤60 days (yellow).
- **Document Verification:** Link to uploaded passport/visa copies in Documents module.

#### 3.1.4 Operations
- **Construction Projects:** CRUD for projects (name, client, value, start/end dates, status).
- **Manpower Request Queue:** List of pending requests from supervisors with required trades and quantities.
- **Workforce Allocation Tracker:**
  - Real-time view of which employee is assigned to which project/manpower request.
  - Tabs: All / Projects / Manpower.
  - Compliance hard-block: Prevent assignment if visa expires ≤30 days.
  - Attendance sync verification (GPS/Manual/Missing).
  - Utilization doughnut chart.
- **Assignment Modal:** Dropdowns for employee (filtered by trade) and project, with role field.

#### 3.1.5 Financial
- **Invoice Management:**
  - Create/Edit invoices with client, date, due date, line items.
  - Status workflow: Draft → Sent → Paid → Overdue.
  - PDF generation via Edge Function (mock).
- **Expense Tracking:** Log expenses with account, amount, date, receipt upload.
- **Chart of Accounts:** Hierarchical view (Assets, Liabilities, Equity, Revenue, Expenses).
- **Journal Entries:** Double-entry bookkeeping with debit/credit validation.
- **Financial Reports:** P&L, Balance Sheet, Cash Flow, Trial Balance (exportable to CSV/PDF).

#### 3.1.6 Contracts
- **Contract Registry:** List all contracts (employee, client, subcontractor) with type, parties, start/end dates.
- **Renewal Tracking:** Days-to-expiry badges, renewal initiation button.
- **Template Storage:** Link to standard contract templates.

#### 3.1.7 Documents
- **Central Library:** All employee and client documents with type, expiry date, and related entity.
- **Search/Filter:** By document type, status, expiry range.
- **Upload:** Drag-and-drop or browse, with automatic linking to employee/client.

#### 3.1.8 CRM
- **Client Database:** Company name, contact person, phone, email, address.
- **Interaction Logging:** Calls, emails, meetings with date and notes.
- **Follow-up Scheduler:** Set reminders and view timeline.
- **Feedback Collection:** 1–5 star ratings and comments.

#### 3.1.9 Assets
- **Inventory:** Equipment, vehicles, tools with serial numbers, purchase date, value, current status (active, in maintenance, retired).
- **Maintenance Scheduling:** Log maintenance events with date, cost, description.
- **Depreciation Notes:** Manual entry for depreciation value/history.

#### 3.1.10 Reports & Analytics
- **Report Generator:** Dropdown to select pre-built templates (Payroll Summary, Project P&L, Visa Expiry, Attendance, Revenue, Performance).
- **Filters:** Date range, employee, project, client.
- **Export:** CSV and PDF (chart-to-image export).

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load time < 2 seconds on 4G connection.
- Table rendering for up to 10,000 rows with virtual scrolling (future).
- Chart.js animations smooth at 60fps.

### 4.2 Security
- Authentication via iron-session HTTP-only cookies.
- Supabase Row Level Security (RLS) enforced on all tables.
- Role-based UI rendering (elements hidden if user lacks permission).
- All file uploads scanned for malware (future integration).
- Password policy: min 8 chars, 1 uppercase, 1 number, lockout after 5 failed attempts.

### 4.3 Usability
- Fully bilingual (English/Arabic) with RTL layout support.
- Responsive design (desktop-first, tablet-friendly).
- Toast notifications for success/error feedback.
- Confirmation dialogs for destructive actions.

### 4.4 Reliability
- 99.9% uptime SLA.
- Graceful degradation when Supabase is unreachable (mock/localStorage fallback for development).

### 4.5 Maintainability
- Code separated into HTML, CSS, and JS files.
- Plain CSS (no frameworks) with Tailwind utilities.
- Vanilla JavaScript (no React/Vue) for maximum compatibility.
- Mock API layer for offline development and testing.

---

## 5. Technical Architecture

### 5.1 Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | HTML5, Bootstrap 5 (components), Tailwind CSS (utilities), Vanilla JS |
| Charts | Chart.js |
| Icons | Bootstrap Icons, Material Symbols |
| Backend | Supabase (PostgreSQL) |
| Auth | iron-session (cookie) → JWT bridge |
| Schema | Custom `alrayan` schema |
| Hosting | Vercel / Netlify (static) + Supabase Cloud |

### 5.2 Database Schema (Key Tables)
```sql
-- alrayan schema
employees (id, name, position, primary_trade, secondary_trades[], availability_status)
employee_visas (id, employee_id, visa_number, issue_date, expiry_date, status)
visa_renewals (id, visa_id, requested_date, approved_date, status)
construction_projects (id, name, client, value_omr, start_date, end_date, status)
manpower_requests (id, project_id, trade_required, quantity, status)
assignments (id, employee_id, project_id, request_id, role, is_active)
invoices (id, number, client_id, issue_date, due_date, total_amount, status)
invoice_items (id, invoice_id, description, quantity, unit_price, amount)
expenses (id, account_id, amount, date, description, receipt_url)
chart_of_accounts (id, parent_id, name, type)
journal_entries (id, date, description)
journal_entry_lines (id, entry_id, account_id, debit, credit)
contracts (id, party_type, party_name, start_date, end_date, terms)
employee_documents (id, employee_id, document_type, file_url, expiry_date)
clients (id, name, contact_person, phone, email)
client_interactions (id, client_id, type, date, notes)
assets (id, name, type, serial_number, status, purchase_date, value)
asset_maintenance (id, asset_id, date, cost, description)
```

### 5.3 API Endpoints (Supabase REST)
All tables accessible via Supabase auto-generated REST API with RLS.
Example:
- `GET /rest/v1/employees?select=*`
- `POST /rest/v1/assignments`
- `PATCH /rest/v1/assignments?id=eq.{id}`

Edge Functions (to be implemented):
- `calculate-payroll` – computes net pay based on attendance and salary rules.
- `generate-invoice` – creates PDF invoice and emails to client.

---

## 6. User Interface Design Principles

*Refer to DESIGN.md for detailed visual specifications.*

**Core Principles:**
- **Architectural Monolith Aesthetic:** Structural integrity, authoritative weight, precise detailing.
- **Tonal Layering:** Boundaries defined by background color shifts, not 1px borders.
- **Gold Accents:** Used sparingly as "structural highlights" for critical data.
- **Bilingual Fluidity:** Seamless RTL switching with mirrored layouts where appropriate.

**Component Guidelines:**
- **Cards:** No borders, 4px top accent in gold/red/blue, subtle shadow tinted with primary navy.
- **Tables:** Alternating row colors, heavy header in tertiary navy, ghost borders only if necessary.
- **Tabs:** Underline indicator (2px gold) with smooth slide transition.
- **Buttons:** Gradient "lacquered" finish for primary actions, outlined secondary.

---

## 7. Development Phases & Milestones

| Phase | Deliverables | Estimated Effort |
|-------|--------------|------------------|
| **Phase 1: Core Foundation** | Auth bridge, sidebar navigation, dashboard KPI cards, mock API layer, basic CRUD for Employees/Projects | 2 weeks |
| **Phase 2: HR & Visa** | Employee directory, attendance, leave approvals, visa registry, renewal workflow | 3 weeks |
| **Phase 3: Operations & Workforce** | Projects CRUD, manpower requests, workforce allocation tracker (with compliance), assignment modal | 2 weeks |
| **Phase 4: Financial** | Invoices, expenses, chart of accounts, journal entries, financial reports | 3 weeks |
| **Phase 5: Supporting Modules** | Contracts, Documents, CRM, Assets | 2 weeks |
| **Phase 6: Reports & Polish** | Report generator, export engine, bilingual RTL, final QA | 2 weeks |

**Total Estimated Timeline:** 14 weeks (with 2 developers)

---

## 8. Open Questions & Future Enhancements

### 8.1 Open Questions
- Will file uploads be stored in Supabase Storage or external CDN?
- Should payroll calculations integrate with local labor law (OMR) for automatic deductions?
- Is offline support (PWA) required for remote construction sites?

### 8.2 Future Enhancements (v2+)
- Mobile companion app for supervisors (attendance, requests).
- Real-time notifications via Supabase Realtime.
- Advanced analytics with forecasting (AI/ML).
- Integration with accounting software (e.g., Zoho Books).
- Digital signatures for contracts.

---

## 9. Appendix

### 9.1 Glossary
- **OMR:** Omani Rial (primary currency).
- **RLS:** Row Level Security.
- **SPA:** Single Page Application.
- **JWT:** JSON Web Token.

### 9.2 References
- `Instructions.docx` – Original project brief and module reference.
- `DESIGN.md` – Visual design system specifications.
- Supabase Documentation: https://supabase.com/docs

---

**Document Approval**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| UI/UX Designer | | | |