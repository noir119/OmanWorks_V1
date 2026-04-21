import type {
  Employee, Visa, VisaRenewal, Project, ManpowerRequest, Assignment,
  Invoice, Expense, ChartAccount, JournalEntry, Contract, Document,
  Client, ClientInteraction, ClientFeedback, Asset, AssetMaintenance,
  PayrollRecord, AttendanceRecord, LeaveRequest, ActivityItem, User
} from '@/types';

// ─── Employees ─────────────────────────────────────────────
export const employees: Employee[] = [
  { id: 'e1', name: 'Ahmed Al-Busaidi', employeeId: 'ARC-001', position: 'Site Supervisor', primaryTrade: 'Civil Engineering', secondaryTrades: ['Project Management', 'Safety'], availabilityStatus: 'assigned', email: 'ahmed@alrayaan.om', phone: '+968 9123 4567', nationality: 'Omani', joinDate: '2020-03-15', dateOfBirth: '1985-06-12' },
  { id: 'e2', name: 'Mohammed Al-Rashdi', employeeId: 'ARC-002', position: 'Senior Engineer', primaryTrade: 'Structural Engineering', secondaryTrades: ['Concrete Work', 'Steel Work'], availabilityStatus: 'assigned', email: 'mohammed@alrayaan.om', phone: '+968 9234 5678', nationality: 'Omani', joinDate: '2019-07-01', dateOfBirth: '1988-02-25' },
  { id: 'e3', name: 'Khalid Al-Habsi', employeeId: 'ARC-003', position: 'Electrical Foreman', primaryTrade: 'Electrical', secondaryTrades: ['HVAC', 'Fire Alarm'], availabilityStatus: 'available', email: 'khalid@alrayaan.om', phone: '+968 9345 6789', nationality: 'Omani', joinDate: '2021-01-10', dateOfBirth: '1990-11-08' },
  { id: 'e4', name: 'Salim Al-Mamari', employeeId: 'ARC-004', position: 'Plumbing Supervisor', primaryTrade: 'Plumbing', secondaryTrades: ['Drainage', 'Firefighting'], availabilityStatus: 'assigned', email: 'salim@alrayaan.om', phone: '+968 9456 7890', nationality: 'Omani', joinDate: '2020-09-20', dateOfBirth: '1987-04-15' },
  { id: 'e5', name: 'Fahad Al-Balushi', employeeId: 'ARC-005', position: 'Carpenter', primaryTrade: 'Carpentry', secondaryTrades: ['Formwork', 'Finishing'], availabilityStatus: 'available', email: 'fahad@alrayaan.om', phone: '+968 9567 8901', nationality: 'Omani', joinDate: '2022-02-14', dateOfBirth: '1995-08-22' },
  { id: 'e6', name: 'Youssef Al-Riyami', employeeId: 'ARC-006', position: 'Mason', primaryTrade: 'Masonry', secondaryTrades: ['Tiling', 'Plastering'], availabilityStatus: 'on-leave', email: 'youssef@alrayaan.om', phone: '+968 9678 9012', nationality: 'Egyptian', joinDate: '2021-06-01', dateOfBirth: '1992-03-10' },
  { id: 'e7', name: 'Hamza Al-Kharusi', employeeId: 'ARC-007', position: 'Welder', primaryTrade: 'Welding', secondaryTrades: ['Fabrication', 'Steel Erection'], availabilityStatus: 'assigned', email: 'hamza@alrayaan.om', phone: '+968 9789 0123', nationality: 'Omani', joinDate: '2020-11-15', dateOfBirth: '1989-12-05' },
  { id: 'e8', name: 'Rashid Al-Saadi', employeeId: 'ARC-008', position: 'Equipment Operator', primaryTrade: 'Heavy Equipment', secondaryTrades: ['Maintenance', 'Transport'], availabilityStatus: 'available', email: 'rashid@alrayaan.om', phone: '+968 9890 1234', nationality: 'Omani', joinDate: '2023-01-05', dateOfBirth: '1998-07-18' },
  { id: 'e9', name: 'Imran Khan', employeeId: 'ARC-009', position: 'Painter', primaryTrade: 'Painting', secondaryTrades: ['Waterproofing', 'Coating'], availabilityStatus: 'assigned', email: 'imran@alrayaan.om', phone: '+968 9901 2345', nationality: 'Pakistani', joinDate: '2022-08-20', dateOfBirth: '1994-05-30' },
  { id: 'e10', name: 'Bilal Al-Mukhaini', employeeId: 'ARC-010', position: 'Safety Officer', primaryTrade: 'Safety Management', secondaryTrades: ['First Aid', 'Fire Safety'], availabilityStatus: 'assigned', email: 'bilal@alrayaan.om', phone: '+968 9012 3456', nationality: 'Omani', joinDate: '2021-04-12', dateOfBirth: '1991-09-14' },
  { id: 'e11', name: 'Tariq Al-Shanfari', employeeId: 'ARC-011', position: 'Surveyor', primaryTrade: 'Surveying', secondaryTrades: ['GIS', 'AutoCAD'], availabilityStatus: 'available', email: 'tariq@alrayaan.om', phone: '+968 9123 4560', nationality: 'Omani', joinDate: '2023-03-01', dateOfBirth: '1996-01-20' },
  { id: 'e12', name: 'Nasser Al-Jabri', employeeId: 'ARC-012', position: 'Quality Inspector', primaryTrade: 'Quality Control', secondaryTrades: ['Testing', 'Documentation'], availabilityStatus: 'assigned', email: 'nasser@alrayaan.om', phone: '+968 9234 5671', nationality: 'Omani', joinDate: '2022-05-15', dateOfBirth: '1993-10-08' },
];

// ─── Visas ─────────────────────────────────────────────────
export const visas: Visa[] = [
  { id: 'v1', employeeId: 'e6', employeeName: 'Youssef Al-Riyami', visaNumber: 'V-2024-001', issueDate: '2024-06-01', expiryDate: '2025-05-31', status: 'expiring-soon', passportNumber: 'A1234567', visaType: 'Work Visa' },
  { id: 'v2', employeeId: 'e9', employeeName: 'Imran Khan', visaNumber: 'V-2024-002', issueDate: '2024-03-15', expiryDate: '2025-03-14', status: 'expiring-soon', passportNumber: 'PK9876543', visaType: 'Work Visa' },
  { id: 'v3', employeeId: 'e1', employeeName: 'Ahmed Al-Busaidi', visaNumber: 'V-2023-001', issueDate: '2023-01-01', expiryDate: '2026-01-01', status: 'active', passportNumber: 'OMA111111', visaType: 'Residence' },
  { id: 'v4', employeeId: 'e2', employeeName: 'Mohammed Al-Rashdi', visaNumber: 'V-2023-002', issueDate: '2023-02-01', expiryDate: '2026-02-01', status: 'active', passportNumber: 'OMA222222', visaType: 'Residence' },
  { id: 'v5', employeeId: 'e7', employeeName: 'Hamza Al-Kharusi', visaNumber: 'V-2023-003', issueDate: '2023-03-01', expiryDate: '2026-03-01', status: 'active', passportNumber: 'OMA333333', visaType: 'Residence' },
  { id: 'v6', employeeId: 'e5', employeeName: 'Fahad Al-Balushi', visaNumber: 'V-2024-003', issueDate: '2024-01-10', expiryDate: '2025-01-09', status: 'expired', passportNumber: 'OMA444444', visaType: 'Work Visa' },
  { id: 'v7', employeeId: 'e8', employeeName: 'Rashid Al-Saadi', visaNumber: 'V-2025-001', issueDate: '2025-01-05', expiryDate: '2026-01-05', status: 'active', passportNumber: 'OMA555555', visaType: 'Work Visa' },
];

// ─── Visa Renewals ─────────────────────────────────────────
export const visaRenewals: VisaRenewal[] = [
  { id: 'vr1', visaId: 'v6', employeeName: 'Fahad Al-Balushi', requestedDate: '2025-01-15', approvedDate: null, status: 'applied' },
  { id: 'vr2', visaId: 'v1', employeeName: 'Youssef Al-Riyami', requestedDate: '2025-04-01', approvedDate: '2025-04-05', status: 'approved' },
];

// ─── Projects ──────────────────────────────────────────────
export const projects: Project[] = [
  { id: 'p1', name: 'Muscat Grand Mall Extension', client: 'Al-Ruwad Properties', valueOMR: 2500000, startDate: '2024-01-15', endDate: '2025-06-30', status: 'in-progress', description: 'Three-story commercial extension with parking facility' },
  { id: 'p2', name: 'Salalah Medical Center', client: 'Ministry of Health', valueOMR: 4200000, startDate: '2024-03-01', endDate: '2026-02-28', status: 'in-progress', description: '200-bed medical facility with specialized departments' },
  { id: 'p3', name: 'Sohar Industrial Warehouse', client: 'Oman Steel Co.', valueOMR: 850000, startDate: '2025-01-10', endDate: '2025-08-15', status: 'in-progress', description: '15,000 sqm warehouse with loading docks' },
  { id: 'p4', name: 'Nizwa Residential Complex', client: 'Al-Amal Development', valueOMR: 1800000, startDate: '2024-06-01', endDate: '2025-12-31', status: 'in-progress', description: '40-unit residential complex with amenities' },
  { id: 'p5', name: 'Duqm Port Road Works', client: 'Ministry of Transport', valueOMR: 5600000, startDate: '2023-09-01', endDate: '2025-09-30', status: 'in-progress', description: '25km road infrastructure for port access' },
  { id: 'p6', name: 'Al-Khuwair Office Tower', client: 'Gulf Real Estate', valueOMR: 3200000, startDate: '2024-08-01', endDate: '2026-06-30', status: 'planning', description: '12-story commercial office building' },
  { id: 'p7', name: 'Seeb School Renovation', client: 'Ministry of Education', valueOMR: 450000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'completed', description: 'Complete renovation of 3 school buildings' },
];

// ─── Manpower Requests ────────────────────────────────────
export const manpowerRequests: ManpowerRequest[] = [
  { id: 'mr1', projectId: 'p3', projectName: 'Sohar Industrial Warehouse', tradeRequired: 'Welding', quantity: 4, status: 'pending', requestDate: '2025-04-01', notes: 'Need certified welders for steel structure' },
  { id: 'mr2', projectId: 'p1', projectName: 'Muscat Grand Mall Extension', tradeRequired: 'Electrical', quantity: 6, status: 'approved', requestDate: '2025-03-15', notes: 'Electrical fit-out phase starting' },
  { id: 'mr3', projectId: 'p4', projectName: 'Nizwa Residential Complex', tradeRequired: 'Plumbing', quantity: 3, status: 'fulfilled', requestDate: '2025-02-20', notes: 'Plumbing rough-in for all units' },
  { id: 'mr4', projectId: 'p2', projectName: 'Salalah Medical Center', tradeRequired: 'HVAC', quantity: 5, status: 'pending', requestDate: '2025-04-10', notes: 'Medical-grade HVAC installation' },
  { id: 'mr5', projectId: 'p5', projectName: 'Duqm Port Road Works', tradeRequired: 'Heavy Equipment', quantity: 8, status: 'approved', requestDate: '2025-03-25', notes: 'Earthworks phase expansion' },
];

// ─── Assignments ──────────────────────────────────────────
export const assignments: Assignment[] = [
  { id: 'a1', employeeId: 'e1', employeeName: 'Ahmed Al-Busaidi', projectId: 'p1', projectName: 'Muscat Grand Mall Extension', requestId: null, role: 'Site Supervisor', isActive: true, startDate: '2024-01-15' },
  { id: 'a2', employeeId: 'e2', employeeName: 'Mohammed Al-Rashdi', projectId: 'p2', projectName: 'Salalah Medical Center', requestId: null, role: 'Lead Engineer', isActive: true, startDate: '2024-03-01' },
  { id: 'a3', employeeId: 'e4', employeeName: 'Salim Al-Mamari', projectId: 'p4', projectName: 'Nizwa Residential Complex', requestId: 'mr3', role: 'Plumbing Lead', isActive: true, startDate: '2025-02-25' },
  { id: 'a4', employeeId: 'e7', employeeName: 'Hamza Al-Kharusi', projectId: 'p3', projectName: 'Sohar Industrial Warehouse', requestId: null, role: 'Steel Fabricator', isActive: true, startDate: '2025-01-10' },
  { id: 'a5', employeeId: 'e9', employeeName: 'Imran Khan', projectId: 'p1', projectName: 'Muscat Grand Mall Extension', requestId: null, role: 'Painter', isActive: true, startDate: '2024-06-01' },
  { id: 'a6', employeeId: 'e10', employeeName: 'Bilal Al-Mukhaini', projectId: 'p5', projectName: 'Duqm Port Road Works', requestId: null, role: 'Safety Officer', isActive: true, startDate: '2023-09-01' },
  { id: 'a7', employeeId: 'e12', employeeName: 'Nasser Al-Jabri', projectId: 'p2', projectName: 'Salalah Medical Center', requestId: null, role: 'QA Inspector', isActive: true, startDate: '2024-03-01' },
];

// ─── Invoices ──────────────────────────────────────────────
export const invoices: Invoice[] = [
  { id: 'i1', number: 'INV-2025-001', clientId: 'c1', clientName: 'Al-Ruwad Properties', issueDate: '2025-03-01', dueDate: '2025-04-01', totalAmount: 125000, status: 'paid', items: [{ id: 'ii1', description: 'Phase 1 Construction', quantity: 1, unitPrice: 100000, amount: 100000 }, { id: 'ii2', description: 'Materials Supply', quantity: 1, unitPrice: 25000, amount: 25000 }] },
  { id: 'i2', number: 'INV-2025-002', clientId: 'c2', clientName: 'Ministry of Health', issueDate: '2025-03-15', dueDate: '2025-04-15', totalAmount: 280000, status: 'sent', items: [{ id: 'ii3', description: 'Structural Works - Milestone 2', quantity: 1, unitPrice: 280000, amount: 280000 }] },
  { id: 'i3', number: 'INV-2025-003', clientId: 'c3', clientName: 'Oman Steel Co.', issueDate: '2025-02-01', dueDate: '2025-03-01', totalAmount: 95000, status: 'overdue', items: [{ id: 'ii4', description: 'Foundation Works', quantity: 1, unitPrice: 95000, amount: 95000 }] },
  { id: 'i4', number: 'INV-2025-004', clientId: 'c1', clientName: 'Al-Ruwad Properties', issueDate: '2025-04-01', dueDate: '2025-05-01', totalAmount: 187500, status: 'sent', items: [{ id: 'ii5', description: 'Phase 2 Construction', quantity: 1, unitPrice: 150000, amount: 150000 }, { id: 'ii6', description: 'MEP Rough-in', quantity: 1, unitPrice: 37500, amount: 37500 }] },
  { id: 'i5', number: 'INV-2025-005', clientId: 'c4', clientName: 'Al-Amal Development', issueDate: '2025-04-05', dueDate: '2025-05-05', totalAmount: 72000, status: 'draft', items: [{ id: 'ii7', description: 'Unit Construction - Block A', quantity: 1, unitPrice: 72000, amount: 72000 }] },
];

// ─── Expenses ──────────────────────────────────────────────
export const expenses: Expense[] = [
  { id: 'ex1', accountId: 'a-501', accountName: 'Equipment Rental', amount: 15000, date: '2025-03-01', description: 'Crane rental - Monthly', category: 'equipment' },
  { id: 'ex2', accountId: 'a-502', accountName: 'Material Purchase', amount: 45000, date: '2025-03-05', description: 'Steel reinforcement bars', category: 'materials' },
  { id: 'ex3', accountId: 'a-503', accountName: 'Fuel & Transport', amount: 8200, date: '2025-03-10', description: 'Fleet fuel and logistics', category: 'utilities' },
  { id: 'ex4', accountId: 'a-504', accountName: 'Safety Equipment', amount: 5600, date: '2025-03-12', description: 'PPE restock for all sites', category: 'equipment' },
  { id: 'ex5', accountId: 'a-505', accountName: 'Site Utilities', amount: 3200, date: '2025-03-15', description: 'Electricity and water connections', category: 'utilities' },
  { id: 'ex6', accountId: 'a-506', accountName: 'Subcontractor Payment', amount: 28000, date: '2025-03-20', description: 'Specialized concrete work', category: 'labor' },
  { id: 'ex7', accountId: 'a-507', accountName: 'Office Rent', amount: 4500, date: '2025-03-25', description: 'Head office monthly rent', category: 'utilities' },
  { id: 'ex8', accountId: 'a-508', accountName: 'Vehicle Maintenance', amount: 7800, date: '2025-03-28', description: 'Fleet servicing and repairs', category: 'equipment' },
];

// ─── Chart of Accounts ────────────────────────────────────
export const chartAccounts: ChartAccount[] = [
  { id: 'ca-100', parentId: null, name: 'Assets', type: 'asset', balance: 4850000, children: [
    { id: 'ca-110', parentId: 'ca-100', name: 'Current Assets', type: 'asset', balance: 2100000, children: [
      { id: 'ca-111', parentId: 'ca-110', name: 'Cash & Bank', type: 'asset', balance: 850000 },
      { id: 'ca-112', parentId: 'ca-110', name: 'Accounts Receivable', type: 'asset', balance: 1250000 },
    ]},
    { id: 'ca-120', parentId: 'ca-100', name: 'Fixed Assets', type: 'asset', balance: 2750000, children: [
      { id: 'ca-121', parentId: 'ca-120', name: 'Equipment & Machinery', type: 'asset', balance: 1800000 },
      { id: 'ca-122', parentId: 'ca-120', name: 'Vehicles', type: 'asset', balance: 950000 },
    ]},
  ]},
  { id: 'ca-200', parentId: null, name: 'Liabilities', type: 'liability', balance: 1680000, children: [
    { id: 'ca-210', parentId: 'ca-200', name: 'Current Liabilities', type: 'liability', balance: 980000, children: [
      { id: 'ca-211', parentId: 'ca-210', name: 'Accounts Payable', type: 'liability', balance: 620000 },
      { id: 'ca-212', parentId: 'ca-210', name: 'Short-term Loans', type: 'liability', balance: 360000 },
    ]},
    { id: 'ca-220', parentId: 'ca-200', name: 'Long-term Liabilities', type: 'liability', balance: 700000, children: [
      { id: 'ca-221', parentId: 'ca-220', name: 'Bank Loan', type: 'liability', balance: 700000 },
    ]},
  ]},
  { id: 'ca-300', parentId: null, name: 'Equity', type: 'equity', balance: 3170000, children: [
    { id: 'ca-310', parentId: 'ca-300', name: 'Share Capital', type: 'equity', balance: 2000000 },
    { id: 'ca-320', parentId: 'ca-300', name: 'Retained Earnings', type: 'equity', balance: 1170000 },
  ]},
  { id: 'ca-400', parentId: null, name: 'Revenue', type: 'revenue', balance: 8200000, children: [
    { id: 'ca-410', parentId: 'ca-400', name: 'Construction Revenue', type: 'revenue', balance: 7500000 },
    { id: 'ca-420', parentId: 'ca-400', name: 'Consulting Revenue', type: 'revenue', balance: 700000 },
  ]},
  { id: 'ca-500', parentId: null, name: 'Expenses', type: 'expense', balance: 4230000, children: [
    { id: 'ca-510', parentId: 'ca-500', name: 'Direct Costs', type: 'expense', balance: 3200000, children: [
      { id: 'ca-511', parentId: 'ca-510', name: 'Labor Costs', type: 'expense', balance: 1800000 },
      { id: 'ca-512', parentId: 'ca-510', name: 'Material Costs', type: 'expense', balance: 1400000 },
    ]},
    { id: 'ca-520', parentId: 'ca-500', name: 'Operating Expenses', type: 'expense', balance: 1030000, children: [
      { id: 'ca-521', parentId: 'ca-520', name: 'Administrative', type: 'expense', balance: 450000 },
      { id: 'ca-522', parentId: 'ca-520', name: 'Marketing', type: 'expense', balance: 180000 },
      { id: 'ca-523', parentId: 'ca-520', name: 'Maintenance', type: 'expense', balance: 400000 },
    ]},
  ]},
];

// ─── Journal Entries ──────────────────────────────────────
export const journalEntries: JournalEntry[] = [
  { id: 'je1', date: '2025-03-31', description: 'Record March payroll expense', lines: [
    { id: 'jel1', accountId: 'ca-511', accountName: 'Labor Costs', debit: 150000, credit: 0 },
    { id: 'jel2', accountId: 'ca-111', accountName: 'Cash & Bank', debit: 0, credit: 150000 },
  ]},
  { id: 'je2', date: '2025-03-15', description: 'Invoice #INV-2025-001 payment received', lines: [
    { id: 'jel3', accountId: 'ca-111', accountName: 'Cash & Bank', debit: 125000, credit: 0 },
    { id: 'jel4', accountId: 'ca-112', accountName: 'Accounts Receivable', debit: 0, credit: 125000 },
  ]},
  { id: 'je3', date: '2025-03-10', description: 'Material purchase - Steel reinforcement', lines: [
    { id: 'jel5', accountId: 'ca-512', accountName: 'Material Costs', debit: 45000, credit: 0 },
    { id: 'jel6', accountId: 'ca-211', accountName: 'Accounts Payable', debit: 0, credit: 45000 },
  ]},
];

// ─── Contracts ────────────────────────────────────────────
export const contracts: Contract[] = [
  { id: 'ct1', partyType: 'employee', partyName: 'Ahmed Al-Busaidi', contractType: 'Employment Contract', startDate: '2024-01-01', endDate: '2026-12-31', value: 0, status: 'active', terms: 'Permanent position, 30 days annual leave' },
  { id: 'ct2', partyType: 'client', partyName: 'Al-Ruwad Properties', contractType: 'Construction Agreement', startDate: '2024-01-15', endDate: '2025-06-30', value: 2500000, status: 'active', terms: 'Fixed-price contract with milestone payments' },
  { id: 'ct3', partyType: 'subcontractor', partyName: 'Oman Electrical Solutions LLC', contractType: 'Subcontract', startDate: '2024-03-01', endDate: '2025-03-01', value: 350000, status: 'expiring', terms: 'Full electrical installation and commissioning' },
  { id: 'ct4', partyType: 'client', partyName: 'Ministry of Health', contractType: 'Government Tender', startDate: '2024-03-01', endDate: '2026-02-28', value: 4200000, status: 'active', terms: 'Cost-plus contract with 10% fee cap' },
  { id: 'ct5', partyType: 'employee', partyName: 'Mohammed Al-Rashdi', contractType: 'Employment Contract', startDate: '2023-07-01', endDate: '2026-06-30', value: 0, status: 'active', terms: 'Senior engineer position, 35 days annual leave' },
];

// ─── Documents ────────────────────────────────────────────
export const documents: Document[] = [
  { id: 'd1', entityId: 'e1', entityName: 'Ahmed Al-Busaidi', entityType: 'employee', documentType: 'Passport', fileName: 'passport_ahmed.pdf', uploadDate: '2024-01-10', expiryDate: '2028-06-12' },
  { id: 'd2', entityId: 'e1', entityName: 'Ahmed Al-Busaidi', entityType: 'employee', documentType: 'Employment Contract', fileName: 'contract_ahmed.pdf', uploadDate: '2024-01-10', expiryDate: null },
  { id: 'd3', entityId: 'e6', entityName: 'Youssef Al-Riyami', entityType: 'employee', documentType: 'Work Visa', fileName: 'visa_youssef.pdf', uploadDate: '2024-06-05', expiryDate: '2025-05-31' },
  { id: 'd4', entityId: 'c1', entityName: 'Al-Ruwad Properties', entityType: 'client', documentType: 'Commercial Registration', fileName: 'cr_ruwad.pdf', uploadDate: '2024-01-15', expiryDate: '2026-01-15' },
  { id: 'd5', entityId: 'e2', entityName: 'Mohammed Al-Rashdi', entityType: 'employee', documentType: 'Engineering License', fileName: 'license_mohammed.pdf', uploadDate: '2024-02-01', expiryDate: '2025-12-31' },
  { id: 'd6', entityId: 'e9', entityName: 'Imran Khan', entityType: 'employee', documentType: 'Work Visa', fileName: 'visa_imran.pdf', uploadDate: '2024-03-20', expiryDate: '2025-03-14' },
];

// ─── Clients ──────────────────────────────────────────────
export const clients: Client[] = [
  { id: 'c1', name: 'Al-Ruwad Properties', contactPerson: 'Said Al-Ruwadi', phone: '+968 2456 7890', email: 'info@alruwad.om', address: 'Muscat, Al-Khuwair', status: 'active' },
  { id: 'c2', name: 'Ministry of Health', contactPerson: 'Dr. Fatima Al-Harthi', phone: '+968 2476 5432', email: 'procurement@moh.gov.om', address: 'Muscat, Ruwi', status: 'active' },
  { id: 'c3', name: 'Oman Steel Co.', contactPerson: 'Hilal Al-Zadjali', phone: '+968 2687 3456', email: 'contracts@omansteel.om', address: 'Sohar Industrial Area', status: 'active' },
  { id: 'c4', name: 'Al-Amal Development', contactPerson: 'Muna Al-Siyabi', phone: '+968 2543 2109', email: 'projects@alamal.om', address: 'Nizwa', status: 'active' },
  { id: 'c5', name: 'Ministry of Transport', contactPerson: 'Eng. Nasser Al-Mawali', phone: '+968 2468 1357', email: 'tenders@motc.gov.om', address: 'Muscat, Seeb', status: 'active' },
];

// ─── Client Interactions ──────────────────────────────────
export const clientInteractions: ClientInteraction[] = [
  { id: 'ci1', clientId: 'c1', clientName: 'Al-Ruwad Properties', type: 'meeting', date: '2025-04-01', notes: 'Discussed Phase 3 timeline and budget adjustment', followUpDate: '2025-04-15' },
  { id: 'ci2', clientId: 'c2', clientName: 'Ministry of Health', type: 'email', date: '2025-04-02', notes: 'Submitted monthly progress report for Medical Center', followUpDate: null },
  { id: 'ci3', clientId: 'c3', clientName: 'Oman Steel Co.', type: 'call', date: '2025-04-03', notes: 'Follow-up on pending payment for Invoice #INV-2025-003', followUpDate: '2025-04-10' },
  { id: 'ci4', clientId: 'c1', clientName: 'Al-Ruwad Properties', type: 'meeting', date: '2025-03-25', notes: 'Site inspection and quality review', followUpDate: null },
  { id: 'ci5', clientId: 'c4', clientName: 'Al-Amal Development', type: 'email', date: '2025-04-05', notes: 'Shared updated architectural drawings for approval', followUpDate: '2025-04-12' },
];

// ─── Client Feedback ──────────────────────────────────────
export const clientFeedback: ClientFeedback[] = [
  { id: 'cf1', clientId: 'c7', clientName: 'Seeb School Renovation', rating: 5, comment: 'Excellent work quality and timely completion. Very professional team.', date: '2025-01-10' },
  { id: 'cf2', clientId: 'c1', clientName: 'Al-Ruwad Properties', rating: 4, comment: 'Good progress so far. Would like more frequent updates.', date: '2025-03-20' },
  { id: 'cf3', clientId: 'c3', clientName: 'Oman Steel Co.', rating: 3, comment: 'Quality is good but timeline is slipping. Need better coordination.', date: '2025-03-15' },
];

// ─── Assets ───────────────────────────────────────────────
export const assets: Asset[] = [
  { id: 'as1', name: 'Tower Crane TC-001', type: 'equipment', serialNumber: 'TC-LIEB-2020-001', purchaseDate: '2020-03-15', value: 450000, currentValue: 320000, status: 'active' },
  { id: 'as2', name: 'Excavator CAT-320', type: 'equipment', serialNumber: 'CAT-320-2021-045', purchaseDate: '2021-06-01', value: 180000, currentValue: 145000, status: 'active' },
  { id: 'as3', name: 'Toyota Hilux Pickup', type: 'vehicle', serialNumber: 'MH-12345', purchaseDate: '2022-01-10', value: 25000, currentValue: 18000, status: 'active' },
  { id: 'as4', name: 'Concrete Mixer CM-002', type: 'equipment', serialNumber: 'CM-SIL-2022-002', purchaseDate: '2022-08-20', value: 85000, currentValue: 72000, status: 'in-maintenance' },
  { id: 'as5', name: 'Welding Machine Set', type: 'tool', serialNumber: 'WM-LIN-2023-001', purchaseDate: '2023-02-14', value: 12000, currentValue: 10500, status: 'active' },
  { id: 'as6', name: 'Nissan Patrol', type: 'vehicle', serialNumber: 'MH-67890', purchaseDate: '2021-11-15', value: 35000, currentValue: 28000, status: 'active' },
  { id: 'as7', name: 'Scaffolding Set 1000m2', type: 'equipment', serialNumber: 'SCF-PER-2020-100', purchaseDate: '2020-09-01', value: 95000, currentValue: 48000, status: 'active' },
];

// ─── Asset Maintenance ────────────────────────────────────
export const assetMaintenance: AssetMaintenance[] = [
  { id: 'am1', assetId: 'as1', assetName: 'Tower Crane TC-001', date: '2025-03-15', cost: 3500, description: 'Monthly safety inspection and lubrication', nextScheduledDate: '2025-04-15' },
  { id: 'am2', assetId: 'as4', assetName: 'Concrete Mixer CM-002', date: '2025-04-01', cost: 8500, description: 'Engine overhaul and drum replacement', nextScheduledDate: '2025-05-01' },
  { id: 'am3', assetId: 'as2', assetName: 'Excavator CAT-320', date: '2025-03-20', cost: 2200, description: 'Hydraulic system check and filter replacement', nextScheduledDate: '2025-04-20' },
  { id: 'am4', assetId: 'as3', assetName: 'Toyota Hilux Pickup', date: '2025-03-10', cost: 450, description: 'Regular service - oil change, filters', nextScheduledDate: '2025-06-10' },
];

// ─── Payroll Records ──────────────────────────────────────
export const payrollRecords: PayrollRecord[] = [
  { id: 'pr1', employeeId: 'e1', employeeName: 'Ahmed Al-Busaidi', period: '2025-03', basicSalary: 2500, allowances: 800, deductions: 350, overtime: 400, netPay: 3350, status: 'paid' },
  { id: 'pr2', employeeId: 'e2', employeeName: 'Mohammed Al-Rashdi', period: '2025-03', basicSalary: 2800, allowances: 900, deductions: 420, overtime: 0, netPay: 3280, status: 'paid' },
  { id: 'pr3', employeeId: 'e3', employeeName: 'Khalid Al-Habsi', period: '2025-03', basicSalary: 1800, allowances: 500, deductions: 250, overtime: 600, netPay: 2650, status: 'paid' },
  { id: 'pr4', employeeId: 'e4', employeeName: 'Salim Al-Mamari', period: '2025-03', basicSalary: 2000, allowances: 600, deductions: 280, overtime: 300, netPay: 2620, status: 'paid' },
  { id: 'pr5', employeeId: 'e5', employeeName: 'Fahad Al-Balushi', period: '2025-03', basicSalary: 1200, allowances: 300, deductions: 150, overtime: 450, netPay: 1800, status: 'paid' },
  { id: 'pr6', employeeId: 'e6', employeeName: 'Youssef Al-Riyami', period: '2025-03', basicSalary: 1000, allowances: 250, deductions: 120, overtime: 500, netPay: 1630, status: 'paid' },
  { id: 'pr7', employeeId: 'e7', employeeName: 'Hamza Al-Kharusi', period: '2025-03', basicSalary: 1500, allowances: 450, deductions: 200, overtime: 350, netPay: 2100, status: 'paid' },
  { id: 'pr8', employeeId: 'e8', employeeName: 'Rashid Al-Saadi', period: '2025-03', basicSalary: 1100, allowances: 280, deductions: 130, overtime: 200, netPay: 1450, status: 'paid' },
  { id: 'pr9', employeeId: 'e9', employeeName: 'Imran Khan', period: '2025-03', basicSalary: 900, allowances: 200, deductions: 100, overtime: 400, netPay: 1400, status: 'paid' },
  { id: 'pr10', employeeId: 'e10', employeeName: 'Bilal Al-Mukhaini', period: '2025-03', basicSalary: 1600, allowances: 400, deductions: 220, overtime: 0, netPay: 1780, status: 'paid' },
  { id: 'pr11', employeeId: 'e11', employeeName: 'Tariq Al-Shanfari', period: '2025-03', basicSalary: 1400, allowances: 350, deductions: 180, overtime: 150, netPay: 1720, status: 'paid' },
  { id: 'pr12', employeeId: 'e12', employeeName: 'Nasser Al-Jabri', period: '2025-03', basicSalary: 1700, allowances: 420, deductions: 210, overtime: 0, netPay: 1910, status: 'paid' },
];

// ─── Attendance Records ───────────────────────────────────
export const attendanceRecords: AttendanceRecord[] = [
  { id: 'at1', employeeId: 'e1', employeeName: 'Ahmed Al-Busaidi', date: '2025-04-18', checkIn: '07:00', checkOut: '17:00', status: 'present', method: 'gps' },
  { id: 'at2', employeeId: 'e2', employeeName: 'Mohammed Al-Rashdi', date: '2025-04-18', checkIn: '06:45', checkOut: '16:30', status: 'present', method: 'gps' },
  { id: 'at3', employeeId: 'e3', employeeName: 'Khalid Al-Habsi', date: '2025-04-18', checkIn: '07:15', checkOut: '17:30', status: 'present', method: 'manual' },
  { id: 'at4', employeeId: 'e4', employeeName: 'Salim Al-Mamari', date: '2025-04-18', checkIn: null, checkOut: null, status: 'on-leave', method: null },
  { id: 'at5', employeeId: 'e5', employeeName: 'Fahad Al-Balushi', date: '2025-04-18', checkIn: '07:30', checkOut: null, status: 'late', method: 'gps' },
  { id: 'at6', employeeId: 'e7', employeeName: 'Hamza Al-Kharusi', date: '2025-04-18', checkIn: '06:30', checkOut: '17:00', status: 'present', method: 'gps' },
];

// ─── Leave Requests ───────────────────────────────────────
export const leaveRequests: LeaveRequest[] = [
  { id: 'lr1', employeeId: 'e4', employeeName: 'Salim Al-Mamari', type: 'annual', startDate: '2025-04-18', endDate: '2025-04-25', days: 8, status: 'approved', reason: 'Family vacation' },
  { id: 'lr2', employeeId: 'e6', employeeName: 'Youssef Al-Riyami', type: 'sick', startDate: '2025-04-15', endDate: '2025-04-17', days: 3, status: 'approved', reason: 'Flu recovery' },
  { id: 'lr3', employeeId: 'e8', employeeName: 'Rashid Al-Saadi', type: 'annual', startDate: '2025-05-01', endDate: '2025-05-07', days: 7, status: 'pending', reason: 'Wedding attendance' },
  { id: 'lr4', employeeId: 'e11', employeeName: 'Tariq Al-Shanfari', type: 'emergency', startDate: '2025-04-20', endDate: '2025-04-21', days: 2, status: 'pending', reason: 'Family emergency' },
  { id: 'lr5', employeeId: 'e3', employeeName: 'Khalid Al-Habsi', type: 'annual', startDate: '2025-06-01', endDate: '2025-06-15', days: 15, status: 'pending', reason: 'Summer vacation' },
];

// ─── Activity Items ───────────────────────────────────────
export const activities: ActivityItem[] = [
  { id: 'act1', type: 'invoice', description: 'Invoice #INV-2025-001 marked as paid by Al-Ruwad Properties', timestamp: '2025-04-01T10:30:00', user: 'Finance Manager' },
  { id: 'act2', type: 'employee', description: 'New employee Fahad Al-Balushi added to the system', timestamp: '2025-03-28T14:15:00', user: 'HR Manager' },
  { id: 'act3', type: 'visa', description: 'Visa renewal initiated for Youssef Al-Riyami', timestamp: '2025-03-25T09:00:00', user: 'HR Manager' },
  { id: 'act4', type: 'project', description: 'Sohar Industrial Warehouse project moved to Phase 2', timestamp: '2025-03-20T16:45:00', user: 'Operations Manager' },
  { id: 'act5', type: 'expense', description: 'Equipment expense of OMR 15,000 approved', timestamp: '2025-03-18T11:20:00', user: 'Finance Manager' },
  { id: 'act6', type: 'contract', description: 'Employment contract renewed for Mohammed Al-Rashdi', timestamp: '2025-03-15T13:00:00', user: 'HR Manager' },
  { id: 'act7', type: 'invoice', description: 'Invoice #INV-2025-004 sent to Al-Ruwad Properties', timestamp: '2025-04-02T09:30:00', user: 'Finance Manager' },
  { id: 'act8', type: 'employee', description: 'Rashid Al-Saadi assigned to Duqm Port Road Works', timestamp: '2025-04-03T10:00:00', user: 'Operations Manager' },
];

// ─── Revenue Data (for charts) ────────────────────────────
export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    { label: '2025', data: [320000, 280000, 450000, 390000, 420000, 380000, 0, 0, 0, 0, 0, 0] },
    { label: '2024', data: [290000, 310000, 380000, 340000, 360000, 400000, 420000, 380000, 350000, 410000, 390000, 450000] },
  ]
};

export const expenseBreakdown = {
  labels: ['Equipment', 'Labor', 'Materials', 'Utilities'],
  data: [156500, 1800000, 1400000, 872700],
};

// ─── Current User ─────────────────────────────────────────
export const currentUser: User = {
  id: 'u1',
  name: 'Administrator',
  email: 'admin@alrayaan.om',
  role: 'admin',
  avatar: '',
};

// ─── Helper: Export to CSV ────────────────────────────────
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
