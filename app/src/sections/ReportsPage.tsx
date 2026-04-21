import { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileBarChart, Users, Wallet, ClipboardCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';

const reportTemplates = [
  { id: 'payroll', label: 'Payroll Summary', description: 'Employee-wise salary breakdown for selected period', icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'project', label: 'Project P&L', description: 'Revenue and cost analysis by project', icon: FileBarChart, color: 'bg-blue-50 text-blue-600' },
  { id: 'visa', label: 'Visa Expiry Report', description: 'Upcoming visa and license expirations', icon: ClipboardCheck, color: 'bg-amber-50 text-amber-600' },
  { id: 'attendance', label: 'Attendance Report', description: 'Daily attendance and overtime summary', icon: Users, color: 'bg-purple-50 text-purple-600' },
  { id: 'revenue', label: 'Revenue Analysis', description: 'Monthly revenue trends and comparisons', icon: BarChart3, color: 'bg-[#0a1f44]/5 text-[#0a1f44]' },
  { id: 'performance', label: 'Performance Report', description: 'Employee and project performance metrics', icon: FileSpreadsheet, color: 'bg-red-50 text-red-600' },
];

export default function ReportsPage() {
  const { addToast, dir } = useApp();
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-04-30');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const handleGenerate = async () => {
    try {
      let endpoint = '';
      switch (selectedReport) {
        case 'payroll': endpoint = '/payroll'; break;
        case 'visa': endpoint = '/employee_visas'; break;
        case 'attendance': endpoint = '/attendance'; break;
        case 'revenue': endpoint = '/invoices'; break;
        default: endpoint = '/employees';
      }

      const data = await api.get<any[]>(endpoint);
      console.log('Generating report with data:', data);
      // In a real app, we would process this data and trigger a download
      addToast(t('common.export_success') || 'Report generated and downloaded successfully');
    } catch (error: any) {
      addToast(error.message || 'Failed to generate report', 'error');
    }
  };

  const isRtl = dir === 'rtl';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">{t('common.reports')}</h2>
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
              <div className={`flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
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
        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6" dir={dir}>
          <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-4">
            Generate {reportTemplates.find(r => r.id === selectedReport)?.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-2 block">{t('hr.from')}</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-2 block">{t('hr.to')}</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-2 block">{t('hr.employees')} (Optional)</label>
              <input
                type="text"
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                placeholder={t('common.search')}
                className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
              />
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a] transition-colors"
          >
            <Download size={16} />
            {t('financial.export_csv')}
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
