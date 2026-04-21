import { useMemo, useEffect, useState } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import {
  AlertTriangle, Loader2
} from 'lucide-react';
import KPICard from '@/components/KPICard';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

export default function DashboardPage() {
  const { addToast, dir } = useApp();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    employees: [],
    visas: [],
    invoices: [],
    projects: [],
    payroll: [],
    expenses: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [emp, visa, inv, proj, pay, exp] = await Promise.all([
          api.get<any[]>('/employees'),
          api.get<any[]>('/employee_visas'),
          api.get<any[]>('/invoices'),
          api.get<any[]>('/construction_projects'),
          api.get<any[]>('/payroll'),
          api.get<any[]>('/expenses'),
        ]);
        setData({ employees: emp, visas: visa, invoices: inv, projects: proj, payroll: pay, expenses: exp });
      } catch (error: any) {
        addToast(error.message || 'Failed to fetch dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [addToast]);

  const stats = useMemo(() => {
    const activeEmployees = data.employees.filter((e: any) => e.employmentStatus === 'active').length;
    const totalPayroll = data.payroll.reduce((sum: number, p: any) => sum + (p.netPay || 0), 0);
    const pendingInvoices = data.invoices.filter((i: any) => i.status === 'pending').length;
    const activeProjectsCount = data.projects.filter((p: any) => p.projectStatus === 'in_progress').length;

    const visaAlerts = data.visas
      .map((v: any) => ({ ...v, daysLeft: v.visaExpiryDate ? differenceInDays(parseISO(v.visaExpiryDate), new Date()) : 999 }))
      .filter((v: any) => v.daysLeft <= 60)
      .sort((a: any, b: any) => a.daysLeft - b.daysLeft);

    return { activeEmployees, totalPayroll, pendingInvoices, activeProjectsCount, visaAlerts };
  }, [data]);

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: '2025',
        data: [4500, 5200, 4800, 6100, 5800, 6500],
        borderColor: '#0a1f44',
        backgroundColor: 'rgba(10, 31, 68, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#0a1f44',
      }
    ],
  };

  const doughnutData = {
    labels: ['Labor', 'Materials', 'Equipment', 'Other'],
    datasets: [{
      data: [40, 30, 20, 10],
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

  const isRtl = dir === 'rtl';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-[#c5a55a] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">{t('dashboard.welcome')}</h2>
          <p className="text-sm text-slate-500 mt-1">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          label={t('dashboard.active_employees')}
          value={stats.activeEmployees.toLocaleString()}
          trend={{ value: 5, positive: true }}
          accent="navy"
        />
        <KPICard
          label={t('dashboard.monthly_payroll')}
          value={`${stats.totalPayroll.toLocaleString()}`}
          trend={{ value: 3, positive: true }}
          accent="gold"
        />
        <KPICard
          label={t('dashboard.pending_invoices')}
          value={stats.pendingInvoices.toString()}
          trend={{ value: 12, positive: false }}
          accent="red"
        />
        <KPICard
          label={t('dashboard.active_projects')}
          value={stats.activeProjectsCount.toString()}
          trend={{ value: 8, positive: true }}
          accent="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
          <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('dashboard.revenue_trend')}</h3>
            <div className="flex items-center gap-1">
              {['2025', '2024'].map(year => (
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
          <h3 className={`font-secondary text-lg font-semibold text-[#0a1f44] mb-4 ${isRtl ? 'text-right' : ''}`}>{t('dashboard.expense_breakdown')}</h3>
          <div className="h-56">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="mt-4 space-y-2">
            {doughnutData.labels.map((label, i) => (
              <div key={label} className={`flex items-center justify-between text-xs ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className={`flex items-center gap-2 text-slate-600 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }} />
                  {label}
                </span>
                <span className="font-medium text-[#0a1f44]">{doughnutData.datasets[0].data[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
          <h3 className={`font-secondary text-lg font-semibold text-[#0a1f44] mb-4 ${isRtl ? 'text-right' : ''}`}>{t('dashboard.recent_activity')}</h3>
          <div className="space-y-3">
            <p className="text-sm text-slate-400 text-center py-8">No recent activities found.</p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
          <div className={`flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('dashboard.visa_alerts')}</h3>
            <span className="text-xs text-slate-400">{stats.visaAlerts.length} requiring attention</span>
          </div>
          <div className="space-y-3">
            {stats.visaAlerts.slice(0, 5).map((visa: any) => (
              <div key={visa.id} className={`flex items-center gap-3 p-3 rounded-md hover:bg-slate-50 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  visa.daysLeft <= 30 ? 'bg-red-50' : 'bg-amber-50'
                }`}>
                  <AlertTriangle size={14} className={visa.daysLeft <= 30 ? 'text-red-500' : 'text-amber-500'} />
                </div>
                <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : ''}`}>
                  <p className="text-sm text-[#0a1f44] font-medium truncate">{visa.employeeId}</p>
                  <p className="text-[11px] text-slate-400">{visa.visaNumber} | {visa.visaType}</p>
                </div>
                <div className={`text-right shrink-0 ${isRtl ? 'text-left' : ''}`}>
                  <p className={`text-sm font-bold ${visa.daysLeft <= 30 ? 'text-red-600' : 'text-[#c5a55a]'}`}>
                    {visa.daysLeft} {t('dashboard.remaining').split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-400">{t('dashboard.remaining')}</p>
                </div>
              </div>
            ))}
            {stats.visaAlerts.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No visa alerts at this time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
