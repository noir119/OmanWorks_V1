import { useState, useMemo, useEffect, useCallback } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';
import { differenceInDays, parseISO } from 'date-fns';

export default function ContractsPage() {
  const { addToast, dir } = useApp();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [showRenewModal, setShowRenewModal] = useState(false);
  
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<any[]>('/contracts');
      setContracts(data);
    } catch (error: any) {
      addToast(error.message || 'Failed to fetch contracts', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredContracts = useMemo(() => {
    return contracts
      .map(c => ({
        ...c,
        daysLeft: c.endDate ? differenceInDays(parseISO(c.endDate), new Date()) : 0,
      }))
      .filter(c =>
        (c.contractNumber && c.contractNumber.toLowerCase().includes(search.toLowerCase())) ||
        (c.contractType && c.contractType.toLowerCase().includes(search.toLowerCase()))
      );
  }, [contracts, search]);

  const handleRenew = () => {
    setShowRenewModal(false);
    addToast('Contract renewal initiated successfully');
  };

  const isRtl = dir === 'rtl';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">{t('common.contracts')}</h2>
        <p className="text-sm text-slate-500 mt-1">Manage employee, client, and subcontractor contracts with renewal tracking.</p>
      </div>

      <FilterBar
        searchPlaceholder={t('common.search')}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#c5a55a] animate-spin mb-4" />
          <p className="text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0a1f44]">
                  <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>Contract #</th>
                  <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.type')}</th>
                  <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('financial.amount_omr')}</th>
                  <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.start_date')}</th>
                  <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.end_date')}</th>
                  <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('visa.days_left')}</th>
                  <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                  <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">{t('visa.action')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((ct, idx) => (
                  <tr key={ct.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{ct.contractNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{ct.contractType}</td>
                    <td className={`px-4 py-3 text-sm text-slate-600 ${isRtl ? 'text-left' : 'text-right'}`}>{ct.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{ct.startDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{ct.endDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${ct.daysLeft <= 60 ? 'text-red-600' : ct.daysLeft <= 180 ? 'text-[#c5a55a]' : 'text-emerald-600'}`}>
                        {ct.daysLeft > 0 ? ct.daysLeft : t('visa.expired')}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={ct.status} /></td>
                    <td className="px-4 py-3 text-center">
                      {ct.daysLeft <= 90 && ct.status === 'active' && (
                        <button onClick={() => setShowRenewModal(true)} className="p-1.5 text-[#c5a55a] hover:bg-amber-50 rounded" title="Renew Contract">
                          <RefreshCw size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredContracts.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
          )}
        </div>
      )}

      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowRenewModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4 p-6" dir={dir}>
            <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-2">Renew Contract</h3>
            <p className="text-sm text-slate-500 mb-4">Initiate the contract renewal process. A new contract will be drafted based on the existing terms.</p>
            <div className="space-y-4 mb-6">
              <div><label className="text-xs text-slate-500 mb-1 block">New End Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Renewal Notes</label><textarea className="w-full h-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 resize-none" placeholder="Any changes to terms..." /></div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRenewModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={handleRenew} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
