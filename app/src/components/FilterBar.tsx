import { Search, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actionLabel?: string;
  onAction?: () => void;
  filters?: { label: string; value: string; active: boolean; onClick: () => void }[];
}

export default function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  actionLabel,
  onAction,
  filters,
}: FilterBarProps) {
  const { dir } = useApp();
  const isRtl = dir === 'rtl';

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-3 flex-1 w-full sm:w-auto ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className="relative flex-1 max-w-xs">
          <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={`w-full h-9 bg-white border border-[#e2e8f0] rounded-sm ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-[#0a1f44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40`}
          />
        </div>
        {filters && (
          <div className="flex items-center gap-1">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={f.onClick}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                  f.active
                    ? 'bg-[#c5a55a] text-white'
                    : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a] transition-colors"
        >
          <Plus size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
