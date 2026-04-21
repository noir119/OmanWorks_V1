import { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileBarChart, Users, Wallet, ClipboardCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { exportToCSV, employees, invoices, visas, attendanceRecords, payrollRecords } from '@/data/mockData';

const reportTemplates = [
  { id: 'payroll', label: 'Payroll Summary', description: 'Employee-wise salary breakdown for selected period', icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'project', label: 'Project P&L', description: 'Revenue and cost analysis by project', icon: FileBarChart, color: 'bg-blue-50 text-blue-600' },
  { id: 'visa', label: 'Visa Expiry Report', description: 'Upcoming visa and license expirations', icon: ClipboardCheck, color: 'bg-amber-50 text-amber-600' },
  { id: 'attendance', label: 'Attendance Report', description: 'Daily attendance and overtime summary', icon: Users, color: 'bg-purple-50 text-purple-600' },
  { id: 'revenue', label: 'Revenue Analysis', description: 'Monthly revenue trends and comparisons', icon: BarChart3, color: 'bg-[#0a1f44]/5 text-[#0a1f44]' },
  { id: 'performance', label: 'Performance Report', description: 'Employee and project performance metrics', icon: FileSpreadsheet, color: 'bg-red-50 text-red-600' },
];

export default function ReportsPage() {
  const { addToast } = useApp();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-04-30');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const handleGenerate = () => {
    let data: Record<string, unknown>[] = [];
    let filename = 'report.csv';

    switch (selectedReport) {
      case 'payroll':
        data = payrollRecords.map(p => ({
          Employee: p.employeeName,
          Period: p.period,
          'Basic Salary': p.basicSalary,
          Allowances: p.allowances,
          Deductions: p.deductions,
          Overtime: p.overtime,
          'Net Pay': p.netPay,
        }));
        filename = 'payroll_summary.csv';
        break;
      case 'visa':
        data = visas.map(v => ({
          Employee: v.employeeName,
          'Visa Number': v.visaNumber,
          Type: v.visaType,
          'Issue Date': v.issueDate,
          'Expiry Date': v.expiryDate,
          Status: v.status,
        }));
        filename = 'visa_expiry_report.csv';
        break;
      case 'attendance':
        data = attendanceRecords.map(a => ({
          Employee: a.employeeName,
          Date: a.date,
          'Check In': a.checkIn || '-',
          'Check Out': a.checkOut || '-',
          Status: a.status,
          Method: a.method || '-',
        }));
        filename = 'attendance_report.csv';
        break;
      case 'revenue':
        data = invoices.map(i => ({
          'Invoice Number': i.number,
          Client: i.clientName,
          'Issue Date': i.issueDate,
          'Due Date': i.dueDate,
          Amount: i.totalAmount,
          Status: i.status,
        }));
        filename = 'revenue_analysis.csv';
        break;
      default:
        data = employees.map(e => ({
          Name: e.name,
          'Employee ID': e.employeeId,
          Position: e.position,
          Trade: e.primaryTrade,
          Status: e.availabilityStatus,
          Email: e.email,
        }));
        filename = 'employee_directory.csv';
    }

    exportToCSV(data, filename);
    addToast('Report generated and downloaded successfully');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">Reports & Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Generate and export pre-built reports with filters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {reportTemplates.map(report => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`text-left bg-white rounded-md border p-5 transition-colors hover:border-[#c5a55a]/30 ${
                isSelected ? 'border-[#c5a55a] ring-1 ring-[#c5a55a]/20' : 'border-[rgba(10,31,68,0.05)]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-md ${report.color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[#0a1f44]">{report.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{report.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedReport && (
        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
          <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-4">
            Generate {reportTemplates.find(r => r.id === selectedReport)?.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-2 block">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-2 block">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-2 block">Employee (Optional)</label>
              <input
                type="text"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                placeholder="Filter by employee..."
                className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a] transition-colors"
          >
            <Download size={16} />
            Generate & Export CSV
          </button>
        </div>
      )}

      {!selectedReport && (
        <div className="text-center py-12">
          <BarChart3 size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Select a report template above to get started.</p>
        </div>
      )}
    </div>
  );
}
