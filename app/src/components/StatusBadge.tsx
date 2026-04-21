interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  // General
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  fulfilled: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
  planning: 'bg-purple-50 text-purple-700 border-purple-200',
  'on-hold': 'bg-slate-100 text-slate-600 border-slate-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  sent: 'bg-blue-50 text-blue-700 border-blue-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  // Visa
  'expiring-soon': 'bg-amber-50 text-amber-700 border-amber-200',
  expired: 'bg-red-50 text-red-700 border-red-200',
  'renewal-pending': 'bg-purple-50 text-purple-700 border-purple-200',
  // Assignment
  assigned: 'bg-blue-50 text-blue-700 border-blue-200',
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'on-leave': 'bg-orange-50 text-orange-700 border-orange-200',
  terminated: 'bg-red-50 text-red-700 border-red-200',
  // Assets
  'in-maintenance': 'bg-orange-50 text-orange-700 border-orange-200',
  retired: 'bg-slate-100 text-slate-500 border-slate-200',
  // CRM
  call: 'bg-blue-50 text-blue-700 border-blue-200',
  email: 'bg-purple-50 text-purple-700 border-purple-200',
  meeting: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  visit: 'bg-orange-50 text-orange-700 border-orange-200',
  // Expense categories
  equipment: 'bg-blue-50 text-blue-700 border-blue-200',
  materials: 'bg-amber-50 text-amber-700 border-blue-200',
  utilities: 'bg-slate-100 text-slate-600 border-slate-200',
  labor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  processed: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-block rounded-sm font-medium border ${sizeClass} ${style}`}>
      {status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}
