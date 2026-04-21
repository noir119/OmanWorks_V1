# Tech Spec - Al Rayaan Admin Dashboard

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM rendering |
| react-router-dom | ^7.0.0 | Client-side routing for 10+ modules |
| chart.js | ^4.4.0 | Revenue trends, expense breakdown, utilization charts |
| chartjs-plugin-datalabels | ^2.2.0 | Data labels on charts |
| lucide-react | ^0.460.0 | Icons (sidebar, actions, status indicators) |
| @radix-ui/react-dialog | ^1.1.0 | Accessible modal primitives (Add/Edit forms) |
| @radix-ui/react-dropdown-menu | ^2.1.0 | Quick actions, user menu |
| @radix-ui/react-tabs | ^1.1.0 | Module tabs (Projects, Workforce, Equipment) |
| @radix-ui/react-select | ^2.1.0 | Trade dropdowns, status filters |
| @radix-ui/react-avatar | ^1.1.0 | User profile avatar |
| @radix-ui/react-toast | ^1.2.0 | Toast notifications for CRUD feedback |
| @radix-ui/react-alert-dialog | ^1.1.0 | Confirmation dialogs for destructive actions |
| date-fns | ^4.0.0 | Date formatting, expiry calculations, payroll periods |
| tailwindcss | ^3.4.0 | Utility-first CSS |
| class-variance-authority | ^0.7.0 | Component variant management (buttons, badges) |
| clsx | ^2.1.0 | Conditional class names |
| tailwind-merge | ^2.6.0 | Tailwind class deduplication |

**Dev Dependencies:**
- typescript, vite, @vitejs/plugin-react, @types/react, @types/react-dom
- postcss, autoprefixer

---

## Component Inventory

### Layout Components (shared across all pages)
- **AppLayout** — Root layout with Header, Sidebar, Main Content area
- **Header** — Fixed top bar with logo, search, notifications, profile
- **Sidebar** — Fixed left nav with navigation groups and active state management
- **PageHeader** — Reusable page title + action button row

### Reusable UI Components
- **KPICard** — Metric card with accent bar, trend indicator
- **DataTable** — Universal table with sorting, search, pagination, row actions
- **StatusBadge** — Color-coded badge (Active, Pending, Expired, etc.)
- **Modal** — Wrapper around Radix Dialog for add/edit forms
- **ConfirmDialog** — Destructive action confirmation
- **Toast** — Success/error feedback notifications
- **FilterBar** — Search input + filter chips + action button
- **FormSection** — Grouped form fields with section header

### Module Pages (route targets)
- **DashboardPage** — KPIs, charts, activity feed, alerts
- **HRPage** — Employee directory, add/edit modal, payroll processing
- **VisaPage** — Visa registry, renewal workflow, expiry monitoring
- **OperationsPage** — Projects, manpower requests, workforce allocation
- **FinancialPage** — Invoices, expenses, chart of accounts, journal entries
- **ContractsPage** — Contract registry, renewal tracking
- **DocumentsPage** — Document library, upload
- **CRMPage** — Client database, interactions, feedback
- **AssetsPage** — Inventory, maintenance scheduling
- **ReportsPage** — Report generator, filters, export

### Charts
- **RevenueChart** — Line chart (Chart.js) for revenue trends
- **ExpenseChart** — Doughnut chart for expense breakdown
- **UtilizationChart** — Doughnut chart for workforce utilization

---

## Animation Implementation

| Animation | Library | Implementation | Complexity |
|-----------|---------|----------------|------------|
| Tab underline slide | CSS transition | `transition-all duration-200` on active tab indicator width/position | Low |
| Sidebar active indicator | CSS only | Static gold left-border, no animation per flat design principle | Low |
| Modal open/close | Radix Dialog | Built-in CSS animation via Radix, override with subtle opacity+scale | Low |
| Toast notification | Radix Toast | Built-in enter/exit animation, slide from top-right | Low |
| Chart data transitions | Chart.js | `animation: { duration: 800, easing: 'easeOutQuart' }` | Low |
| Row hover states | CSS only | Instant `bg-slate-50` on hover, 0ms transition per spec | Low |
| Card accent bar | CSS only | Static 4px top border, no animation | Low |

No GSAP needed — all animations are simple CSS transitions or handled by component libraries.

---

## State & Logic Plan

### Global State (React Context)
- **AppContext** — Active sidebar item, module routing, toast queue
- **AuthContext** — Current user role (Admin, HR, Ops, Finance, etc.), permissions

### Module-Level State (useState/useReducer)
Each module page manages its own:
- **Table state:** search query, filter chips, pagination (page, pageSize)
- **Modal state:** open/close, edit mode, form data
- **CRUD operations:** add, edit, delete with optimistic UI updates

### Mock Data Layer
- `src/data/mockData.ts` — Comprehensive mock data for all 10+ modules
- All CRUD operations modify in-memory arrays (no backend)
- Data persists during session (module state preserved on navigation)

### Routing Structure
```
/ → Dashboard
/hr → HR Management
/visa → Visa & Immigration
/operations → Operations
/financial → Financial
/contracts → Contracts
/documents → Documents
/crm → CRM
/assets → Assets
/reports → Reports & Analytics
```

### Key Logic
- **Payroll calculation:** Edge function mock — compute net pay from attendance + salary rules
- **Visa expiry monitoring:** Date comparison using date-fns, color-code by urgency
- **Workforce allocation:** Compliance hard-block — prevent assignment if visa expires ≤30 days
- **Invoice status workflow:** Draft → Sent → Paid → Overdue transitions
- **Journal entries:** Double-entry validation (debits must equal credits)
- **Report generation:** Filter mock data by date range/employee/project, export to CSV

---

## Other Key Decisions

- **No Supabase integration** — The PRD mentions Supabase but for a functional demo, all data is in-memory mock data. CRUD operations modify local state.
- **No RTL implementation** — The PRD mentions bilingual support but for the demo we'll focus on English UI. The layout structure supports future RTL addition.
- **Plain CSS approach** — All styling via Tailwind utilities, matching the PRD's "no frameworks" spirit while using the modern stack. No styled-components or CSS modules needed.
- **Export functionality** — CSV export via JavaScript blob generation; PDF export mocked (generate CSV with message that PDF requires backend).
