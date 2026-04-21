export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  primaryTrade: string;
  secondaryTrades: string[];
  availabilityStatus: 'available' | 'assigned' | 'on-leave' | 'terminated';
  email: string;
  phone: string;
  nationality: string;
  joinDate: string;
  dateOfBirth: string;
}

export interface Visa {
  id: string;
  employeeId: string;
  employeeName: string;
  visaNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expiring-soon' | 'expired' | 'renewal-pending';
  passportNumber: string;
  visaType: string;
}

export interface VisaRenewal {
  id: string;
  visaId: string;
  employeeName: string;
  requestedDate: string;
  approvedDate: string | null;
  status: 'applied' | 'approved' | 'issued' | 'rejected';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  valueOMR: number;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  description: string;
}

export interface ManpowerRequest {
  id: string;
  projectId: string;
  projectName: string;
  tradeRequired: string;
  quantity: number;
  status: 'pending' | 'approved' | 'fulfilled' | 'rejected';
  requestDate: string;
  notes: string;
}

export interface Assignment {
  id: string;
  employeeId: string;
  employeeName: string;
  projectId: string;
  projectName: string;
  requestId: string | null;
  role: string;
  isActive: boolean;
  startDate: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Expense {
  id: string;
  accountId: string;
  accountName: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export interface ChartAccount {
  id: string;
  parentId: string | null;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  children?: ChartAccount[];
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  lines: JournalEntryLine[];
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface Contract {
  id: string;
  partyType: 'employee' | 'client' | 'subcontractor';
  partyName: string;
  contractType: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'active' | 'expiring' | 'expired' | 'terminated';
  terms: string;
}

export interface Document {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'employee' | 'client';
  documentType: string;
  fileName: string;
  uploadDate: string;
  expiryDate: string | null;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
}

export interface ClientInteraction {
  id: string;
  clientId: string;
  clientName: string;
  type: 'call' | 'email' | 'meeting' | 'visit';
  date: string;
  notes: string;
  followUpDate: string | null;
}

export interface ClientFeedback {
  id: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'equipment' | 'vehicle' | 'tool';
  serialNumber: string;
  purchaseDate: string;
  value: number;
  currentValue: number;
  status: 'active' | 'in-maintenance' | 'retired';
}

export interface AssetMaintenance {
  id: string;
  assetId: string;
  assetName: string;
  date: string;
  cost: number;
  description: string;
  nextScheduledDate: string | null;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  overtime: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'on-leave';
  method: 'gps' | 'manual' | null;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'emergency' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface ActivityItem {
  id: string;
  type: 'employee' | 'invoice' | 'visa' | 'project' | 'expense' | 'contract';
  description: string;
  timestamp: string;
  user: string;
}

export type UserRole = 'admin' | 'hr-manager' | 'ops-manager' | 'finance-manager' | 'supervisor' | 'client-relations';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}
