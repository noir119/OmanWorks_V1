import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface KPICardProps {
  label: string;
  value: string;
  trend?: { value: number; positive: boolean };
  accent: 'gold' | 'navy' | 'green' | 'red';
}

const accentMap = {
  gold: 'border-t-[#c5a55a]',
  navy: 'border-t-[#0a1f44]',
  green: 'border-t-emerald-500',
  red: 'border-t-red-500',
};

export default function KPICard({ label, value, trend, accent }: KPICardProps) {
  const { t } = useTranslation();
  return (
    <div className={`bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6 border-t-4 ${accentMap[accent]}`}>
      <p className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-2">{label}</p>
      <p className="font-secondary text-3xl font-bold text-[#0a1f44] mb-2">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 text-sm ${trend.positive ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend.value}% {t('dashboard.this_month') || 'this month'}</span>
        </div>
      )}
    </div>
  );
}
