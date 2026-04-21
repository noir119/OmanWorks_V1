import { useMemo } from 'react';
import { format, differenceInDays, parseISO } from 'date-fns';
import {
  Users, FileText, Wallet, Building2, Clock, AlertTriangle
} from 'lucide-react';
import KPICard from '@/components/KPICard';
import {
  employees, visas, invoices, projects, activities, payrollRecords, revenueData, expenseBreakdown
} from '@/data/mockData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

export default function DashboardPage() {
  const activeEmployees = useMemo(() => employees.filter(e => e.availabilityStatus !== 'terminated').length, []);
  const totalPayroll = useMemo(() => payrollRecords.reduce((sum, p) => sum + p.netPay, 0), []);
  const pendingInvoices = useMemo(() => invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length, []);
  const activeProjectsCount = useMemo(() => projects.filter(p => p.status === 'in-progress').length, []);

  const visaAlerts = useMemo(() => {
    const today = new Date();
    return visas
      .map(v => ({ ...v, daysLeft: differenceInDays(parseISO(v.expiryDate), today) }))
      .filter(v => v.daysLeft <= 60)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, []);

  const lineChartData = {
    labels: revenueData.labels,
    datasets: [
      {
        label: '2025',
        data: revenueData.datasets[0].data,
        borderColor: '#0a1f44',
        backgroundColor: 'rgba(10, 31, 68, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#0a1f44',
      },
      {
        label: '2024',
        data: revenueData.datasets[1].data,
        borderColor: '#94a3b8',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#94a3b8',
        borderDash: [5, 5],
      },
    ],
  };

  const doughnutData = {
    labels: expenseBreakdown.labels,
    datasets: [{
      data: expenseBreakdown.data,
      backgroundColor: ['#0a1f44', '#c5a55a', '#64748b', '#e2e8f0'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(10,31,68,0.03)' }, ticks: { font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } },
    },
    cutout: '65%',
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invoice': return <Wallet size={14} className="text-[#c5a55a]" />;
      case 'employee': return <Users size={14} className="text-blue-500" />;
      case 'visa': return <FileText size={14} className="text-purple-500" />;
      case 'project': return <Building2 size={14} className="text-emerald-500" />;
      case 'expense': return <Wallet size={14} className="text-red-500" />;
      case 'contract': return <FileText size={14} className="text-slate-500" />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">Welcome back, Administrator</h2>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening across your projects today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          label="Active Employees"
          value={activeEmployees.toLocaleString()}
          trend={{ value: 5, positive: true }}
          accent="navy"
        />
        <KPICard
          label="Monthly Payroll (OMR)"
          value={`${totalPayroll.toLocaleString()}`}
          trend={{ value: 3, positive: true }}
          accent="gold"
        />
        <KPICard
          label="Pending Invoices"
          value={pendingInvoices.toString()}
          trend={{ value: 12, positive: false }}
          accent="red"
        />
        <KPICard
          label="Active Projects"
          value={activeProjectsCount.toString()}
          trend={{ value: 8, positive: true }}
          accent="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Revenue Trend</h3>
            <div className="flex items-center gap-1">
              {['2025', '2024', '2023'].map(year => (
                <button key={year} className={`px-3 py-1 text-xs rounded-sm font-medium ${year === '2025' ? 'bg-[#0a1f44] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
          <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-4">Expense Breakdown</h3>
          <div className="h-56">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="mt-4 space-y-2">
            {expenseBreakdown.labels.map((label, i) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#0a1f44', '#c5a55a', '#64748b', '#e2e8f0'][i] }} />
                  {label}
                </span>
                <span className="font-medium text-[#0a1f44]">OMR {expenseBreakdown.data[i].toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
          <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activities.slice(0, 5).map(activity => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0a1f44] font-medium truncate">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-400">{activity.user}</span>
                    <span className="text-[11px] text-slate-300">|</span>
                    <span className="text-[11px] text-slate-400">{format(parseISO(activity.timestamp), 'MMM d, h:mm a')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Visa & License Alerts</h3>
            <span className="text-xs text-slate-400">{visaAlerts.length} requiring attention</span>
          </div>
          <div className="space-y-3">
            {visaAlerts.slice(0, 5).map(visa => (
              <div key={visa.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  visa.daysLeft <= 30 ? 'bg-red-50' : 'bg-amber-50'
                }`}>
                  <AlertTriangle size={14} className={visa.daysLeft <= 30 ? 'text-red-500' : 'text-amber-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0a1f44] font-medium truncate">{visa.employeeName}</p>
                  <p className="text-[11px] text-slate-400">{visa.visaNumber} | {visa.visaType}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${visa.daysLeft <= 30 ? 'text-red-600' : 'text-[#c5a55a]'}`}>
                    {visa.daysLeft} days
                  </p>
                  <p className="text-[10px] text-slate-400">remaining</p>
                </div>
              </div>
            ))}
            {visaAlerts.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No visa alerts at this time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
