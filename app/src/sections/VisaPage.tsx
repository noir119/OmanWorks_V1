import { useState, useMemo, useEffect, useCallback } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { FileText, RefreshCw, Loader2 } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';

export default function VisaPage() {
  const { addToast, dir } = useApp();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'registry' | 'renewals'>('registry');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  
  const [visas, setVisas] = useState<any[]>([]);
  const [renewals, setRenewals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'registry') {
        const data = await api.get<any[]>('/employee_visas');
        setVisas(data);
      } else {
        const data = await api.get<any[]>('/visa_renewals');
        setRenewals(data);
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to fetch visa data', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const visaList = useMemo(() => {
    return visas.map(v => ({
      ...v,
      daysLeft: v.visaExpiryDate ? differenceInDays(parseISO(v.visaExpiryDate), new Date()) : 0,
    }));
  }, [visas]);

  const filteredVisas = useMemo(() => {
    let result = visaList;
    if (filter !== 'all') {
      if (filter === 'expiring-soon') {
        result = result.filter(v => v.daysLeft > 0 && v.daysLeft <= 60);
      } else if (filter === 'expired') {
        result = result.filter(v => v.daysLeft <= 0);
      } else {
        result = result.filter(v => v.visaStatus === filter);
      }
    }
    if (search) {
      result = result.filter(v =>
        (v.employeeId && v.employeeId.toLowerCase().includes(search.toLowerCase())) ||
        (v.visaNumber && v.visaNumber.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return result;
  }, [visaList, filter, search]);

  const filters = [
    { label: t('visa.all'), value: 'all', active: filter === 'all', onClick: () => setFilter('all') },
    { label: t('visa.active'), value: 'active', active: filter === 'active', onClick: () => setFilter('active') },
    { label: t('visa.expiring_soon'), value: 'expiring-soon', active: filter === 'expiring-soon', onClick: () => setFilter('expiring-soon') },
    { label: t('visa.expired'), value: 'expired', active: filter === 'expired', onClick: () => setFilter('expired') },
  ];

  const handleRenewal = async () => {
    try {
      // Logic for submitting renewal would go here
      addToast(t('visa.renewal_submitted') || 'Visa renewal application submitted successfully');
      setShowRenewalModal(false);
      fetchData();
    } catch (error: any) {
      addToast(error.message || 'Failed to submit renewal', 'error');
    }
  };

  const isRtl = dir === 'rtl';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">{t('visa.title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('visa.subtitle')}</p>
      </div>

      <div className="flex items-center gap-0 border-b border-[#e2e8f0] mb-6">
        {['registry', 'renewals'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'registry' | 'renewals')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'text-[#0a1f44] border-[#c5a55a] font-semibold' : 'text-slate-500 border-transparent hover:text-[#0a1f44]'
            }`}
          >
            {tab === 'registry' ? t('visa.registry') : t('visa.renewals')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#c5a55a] animate-spin mb-4" />
          <p className="text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      ) : (
        <>
          {activeTab === 'registry' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                filters={filters}
              />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.employees')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('visa.visa_number')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.type')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('visa.issue_date')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('visa.expiry_date')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('visa.days_left')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                        <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">{t('visa.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisas.map((visa, idx) => (
                        <tr key={visa.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{visa.employeeId}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{visa.visaNumber}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{visa.visaType}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{visa.issueDate}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{visa.visaExpiryDate}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-semibold ${
                              visa.daysLeft <= 30 ? 'text-red-600' : visa.daysLeft <= 60 ? 'text-[#c5a55a]' : 'text-emerald-600'
                            }`}>
                              {visa.daysLeft > 0 ? visa.daysLeft : t('visa.expired')}
                            </span>
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={visa.visaStatus} /></td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => setShowRenewalModal(true)} className="p-1.5 text-[#c5a55a] hover:bg-amber-50 rounded" title={t('visa.renew')}>
                              <RefreshCw size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredVisas.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'renewals' && (
            <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0a1f44]">
                      <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.employees')}</th>
                      <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('visa.application_date')}</th>
                      <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('visa.approved_date')}</th>
                      <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renewals.map((vr, idx) => (
                      <tr key={vr.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                        <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{vr.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{vr.applicationDate}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{vr.approvedDate || '-'}</td>
                        <td className="px-4 py-3"><StatusBadge status={vr.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renewals.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
              )}
            </div>
          )}
        </>
      )}

      {showRenewalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowRenewalModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]">
              <h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('visa.initiate_renewal')}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-md border border-amber-100">
                <FileText size={18} className="text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800">Complete the three-step renewal process: Apply, Approve, and Issued.</p>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">{t('hr.employees')}</label>
                <select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40">
                  <option>Select employee...</option>
                  {visas.filter(v => v.visaStatus === 'expiring-soon' || v.visaStatus === 'expired').map(v => (
                    <option key={v.id} value={v.id}>{v.employeeId} - {v.visaNumber}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Renewal Type</label>
                <select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40">
                  <option>Work Visa Renewal</option>
                  <option>Residence Renewal</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Notes</label>
                <textarea className="w-full h-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 resize-none" placeholder="Additional notes..." />
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowRenewalModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={handleRenewal} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
