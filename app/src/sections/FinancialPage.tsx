import { useState, useMemo, useEffect, useCallback } from 'react';
import { FileText, Wallet, BookOpen, ClipboardList, BarChart3, Download, Plus, Loader2 } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';

export default function FinancialPage() {
  const { addToast, dir } = useApp();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses' | 'accounts' | 'journal' | 'reports'>('invoices');
  const [search, setSearch] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [chartAccounts, setChartAccounts] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'invoices') {
        const data = await api.get<any[]>('/invoices');
        setInvoices(data);
      } else if (activeTab === 'expenses') {
        const data = await api.get<any[]>('/expenses');
        setExpenses(data);
      } else if (activeTab === 'accounts') {
        const data = await api.get<any[]>('/chart_of_accounts');
        setChartAccounts(data);
      } else if (activeTab === 'journal') {
        const data = await api.get<any[]>('/journal_entries');
        setJournalEntries(data);
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to fetch financial data', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(i =>
      (i.invoiceNumber && i.invoiceNumber.toLowerCase().includes(search.toLowerCase())) ||
      (i.clientId && i.clientId.toLowerCase().includes(search.toLowerCase()))
    );
  }, [invoices, search]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e =>
      (e.description && e.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [expenses, search]);

  const handleExport = () => {
    addToast(t('common.export_success') || 'Export completed successfully');
  };

  const tabs = [
    { id: 'invoices' as const, label: t('financial.invoices'), icon: FileText },
    { id: 'expenses' as const, label: t('financial.expenses'), icon: Wallet },
    { id: 'accounts' as const, label: t('financial.chart_of_accounts'), icon: BookOpen },
    { id: 'journal' as const, label: t('financial.journal_entries'), icon: ClipboardList },
    { id: 'reports' as const, label: t('financial.reports'), icon: BarChart3 },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'text-emerald-600';
      case 'liability': return 'text-red-600';
      case 'equity': return 'text-blue-600';
      case 'revenue': return 'text-[#c5a55a]';
      case 'expense': return 'text-purple-600';
      default: return 'text-slate-600';
    }
  };

  const isRtl = dir === 'rtl';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">{t('financial.title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('financial.subtitle')}</p>
      </div>

      <div className="flex items-center gap-0 border-b border-[#e2e8f0] mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'text-[#0a1f44] border-[#c5a55a] font-semibold' : 'text-slate-500 border-transparent hover:text-[#0a1f44]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
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
          {activeTab === 'invoices' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                actionLabel={t('financial.create_invoice')}
                onAction={() => setShowInvoiceModal(true)}
              />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('financial.invoice_number')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.client')}</th>
                        <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('financial.amount_omr')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('financial.issue_date')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('financial.due_date')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                        <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv, idx) => (
                        <tr key={inv.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{inv.invoiceNumber}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{inv.clientId}</td>
                          <td className={`px-4 py-3 text-sm text-slate-600 ${isRtl ? 'text-left' : 'text-right'} font-medium`}>{inv.totalAmount?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{inv.invoiceDate}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{inv.dueDate}</td>
                          <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => handleExport()} className="p-1.5 text-slate-400 hover:text-[#c5a55a] hover:bg-amber-50 rounded"><Download size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredInvoices.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'expenses' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                actionLabel={t('financial.log_expense')}
                onAction={() => setShowExpenseModal(true)}
              />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.description')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('financial.category')}</th>
                        <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('financial.amount_omr')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.date')}</th>
                        <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((exp, idx) => (
                        <tr key={exp.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{exp.description}</td>
                          <td className="px-4 py-3"><StatusBadge status={exp.category} /></td>
                          <td className={`px-4 py-3 text-sm text-slate-600 ${isRtl ? 'text-left' : 'text-right'} font-medium`}>{exp.amount?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{exp.date}</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => handleExport()} className="p-1.5 text-slate-400 hover:text-[#c5a55a] hover:bg-amber-50 rounded"><Download size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredExpenses.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'accounts' && (
            <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
              <div className="p-4 bg-[#0a1f44] flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">{t('financial.account_name')}</span>
                <span className="text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">{t('financial.balance_omr')}</span>
              </div>
              {chartAccounts.map(account => (
                <div key={account.id} className="flex items-center justify-between py-2 px-4 hover:bg-slate-50 border-t border-[rgba(10,31,68,0.03)]">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium text-[#0a1f44]`}>{account.accountName}</span>
                    <span className={`text-[10px] uppercase tracking-wider ${getTypeColor(account.accountType)} bg-slate-50 px-1.5 py-0.5 rounded`}>{account.accountType}</span>
                  </div>
                  <span className="text-sm font-medium text-[#0a1f44]">OMR {account.currentBalance?.toLocaleString()}</span>
                </div>
              ))}
              {chartAccounts.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
              )}
            </div>
          )}

          {activeTab === 'journal' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                actionLabel={t('financial.new_entry')}
                onAction={() => setShowJournalModal(true)}
              />
              <div className="space-y-4">
                {journalEntries.map(entry => (
                  <div key={entry.id} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                    <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#0a1f44]">{entry.description}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{entry.entryDate}</p>
                      </div>
                    </div>
                    <div className="p-4 text-sm text-slate-600">
                      <p>{t('financial.account')}: {entry.accountId}</p>
                      <p>{t('financial.amount_omr')}: {entry.amount?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {journalEntries.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Profit & Loss Statement', 'Balance Sheet', 'Cash Flow Statement', 'Trial Balance'].map(report => (
                <div key={report} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6 hover:border-[#c5a55a]/30 transition-colors" dir={dir}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-secondary text-base font-semibold text-[#0a1f44]">{report}</h3>
                      <p className="text-xs text-slate-500 mt-1">Generated as of April 2025</p>
                    </div>
                    <BarChart3 size={20} className="text-[#c5a55a]" />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div><label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">{t('hr.from')}</label><input type="date" className="h-8 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                    <div><label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">{t('hr.to')}</label><input type="date" className="h-8 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                  </div>
                  <button
                    onClick={() => { handleExport(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0a1f44] text-white rounded-sm text-sm font-medium hover:bg-[#0a1f44]/90 transition-colors"
                  >
                    <Download size={14} />
                    {t('financial.export_csv')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowInvoiceModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('financial.create_invoice')}</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">{t('financial.invoice_number')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="INV-2025-XXX" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.client')}</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select client...</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('financial.issue_date')}</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('financial.due_date')}</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">{t('common.description')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Service description" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.quantity')}</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="1" /></div>
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">{t('financial.amount_omr')}</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="0.00" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={() => { setShowInvoiceModal(false); addToast('Invoice created successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowExpenseModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('financial.log_expense')}</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">{t('financial.category')}</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Equipment</option><option>Materials</option><option>Utilities</option><option>Labor</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('financial.amount_omr')}</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="0.00" /></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">{t('common.description')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Expense description" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">{t('common.date')}</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowExpenseModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={() => { setShowExpenseModal(false); addToast('Expense logged successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {showJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowJournalModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('financial.new_entry')}</h3></div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs text-slate-500 mb-1 block">{t('common.description')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Entry description" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">{t('common.date')}</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium">Entry Lines</p>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5"><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-sm"><option>Account</option></select></div>
                  <div className="col-span-3"><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-sm" placeholder={t('financial.debit')} /></div>
                  <div className="col-span-3"><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-sm" placeholder={t('financial.credit')} /></div>
                  <div className="col-span-1"><button className="w-full h-9 flex items-center justify-center text-[#c5a55a] hover:bg-amber-50 rounded-sm"><Plus size={16} /></button></div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowJournalModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={() => { setShowJournalModal(false); addToast('Journal entry created successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
