import { useState, useMemo } from 'react';
import { FileText, Wallet, BookOpen, ClipboardList, BarChart3, Download, Plus } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { invoices, expenses, chartAccounts, journalEntries, exportToCSV } from '@/data/mockData';

export default function FinancialPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses' | 'accounts' | 'journal' | 'reports'>('invoices');
  const [search, setSearch] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [expandedAccounts, setExpandedAccounts] = useState<string[]>(['ca-100', 'ca-200', 'ca-300', 'ca-400', 'ca-500']);
  const [invoiceList] = useState(invoices);
  const [expenseList] = useState(expenses);
  const [journalList] = useState(journalEntries);

  const filteredInvoices = useMemo(() => {
    return invoiceList.filter(i =>
      i.number.toLowerCase().includes(search.toLowerCase()) ||
      i.clientName.toLowerCase().includes(search.toLowerCase())
    );
  }, [invoiceList]);

  const filteredExpenses = useMemo(() => {
    return expenseList.filter(e =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.accountName.toLowerCase().includes(search.toLowerCase())
    );
  }, [expenseList]);

  const toggleAccount = (id: string) => {
    setExpandedAccounts(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleExport = (type: string) => {
    if (type === 'invoices') exportToCSV(invoiceList.map(i => ({ Number: i.number, Client: i.clientName, Amount: i.totalAmount, Status: i.status, 'Due Date': i.dueDate })), 'invoices.csv');
    else if (type === 'expenses') exportToCSV(expenseList.map(e => ({ Description: e.description, Category: e.category, Amount: e.amount, Date: e.date })), 'expenses.csv');
    addToast('Export completed successfully');
  };

  const tabs = [
    { id: 'invoices' as const, label: 'Invoices', icon: FileText },
    { id: 'expenses' as const, label: 'Expenses', icon: Wallet },
    { id: 'accounts' as const, label: 'Chart of Accounts', icon: BookOpen },
    { id: 'journal' as const, label: 'Journal Entries', icon: ClipboardList },
    { id: 'reports' as const, label: 'Reports', icon: BarChart3 },
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

  const renderAccountTree = (accounts: typeof chartAccounts, level = 0) => {
    return accounts.map(account => {
      const hasChildren = account.children && account.children.length > 0;
      const isExpanded = expandedAccounts.includes(account.id);
      return (
        <div key={account.id}>
          <div
            className="flex items-center justify-between py-2 px-4 hover:bg-slate-50 cursor-pointer border-t border-[rgba(10,31,68,0.03)]"
            style={{ paddingLeft: `${16 + level * 24}px` }}
            onClick={() => hasChildren && toggleAccount(account.id)}
          >
            <div className="flex items-center gap-2">
              {hasChildren && (
                <span className="text-slate-400 text-xs w-4">{isExpanded ? '−' : '+'}</span>
              )}
              {!hasChildren && <span className="w-4" />}
              <span className={`text-sm font-medium ${level === 0 ? 'text-[#0a1f44]' : 'text-slate-700'}`}>{account.name}</span>
              <span className={`text-[10px] uppercase tracking-wider ${getTypeColor(account.type)} bg-slate-50 px-1.5 py-0.5 rounded`}>{account.type}</span>
            </div>
            <span className="text-sm font-medium text-[#0a1f44]">OMR {account.balance.toLocaleString()}</span>
          </div>
          {hasChildren && isExpanded && renderAccountTree(account.children!, level + 1)}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">Financial Management</h2>
        <p className="text-sm text-slate-500 mt-1">Manage invoices, expenses, chart of accounts, and generate financial reports.</p>
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

      {activeTab === 'invoices' && (
        <>
          <FilterBar
            searchPlaceholder="Search invoices by number or client..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="Create Invoice"
            onAction={() => setShowInvoiceModal(true)}
          />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Invoice #</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Client</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Amount (OMR)</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Issue Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Due Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                    <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv, idx) => (
                    <tr key={inv.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''} ${inv.status === 'overdue' ? 'border-l-4 border-l-red-500' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{inv.number}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{inv.clientName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right font-medium">{inv.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{inv.issueDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{inv.dueDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleExport('invoices')} className="p-1.5 text-slate-400 hover:text-[#c5a55a] hover:bg-amber-50 rounded"><Download size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'expenses' && (
        <>
          <FilterBar
            searchPlaceholder="Search expenses..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="Log Expense"
            onAction={() => setShowExpenseModal(true)}
          />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Description</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Category</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Account</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Amount (OMR)</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Date</th>
                    <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((exp, idx) => (
                    <tr key={exp.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{exp.description}</td>
                      <td className="px-4 py-3"><StatusBadge status={exp.category} /></td>
                      <td className="px-4 py-3 text-sm text-slate-600">{exp.accountName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right font-medium">{exp.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{exp.date}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleExport('expenses')} className="p-1.5 text-slate-400 hover:text-[#c5a55a] hover:bg-amber-50 rounded"><Download size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'accounts' && (
        <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
          <div className="p-4 bg-[#0a1f44] flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Account Name</span>
            <span className="text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Balance (OMR)</span>
          </div>
          {renderAccountTree(chartAccounts)}
        </div>
      )}

      {activeTab === 'journal' && (
        <>
          <FilterBar
            searchPlaceholder="Search journal entries..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="New Entry"
            onAction={() => setShowJournalModal(true)}
          />
          <div className="space-y-4">
            {journalList.map(entry => {
              const totalDebit = entry.lines.reduce((sum, l) => sum + l.debit, 0);
              const totalCredit = entry.lines.reduce((sum, l) => sum + l.credit, 0);
              return (
                <div key={entry.id} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                  <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#0a1f44]">{entry.description}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{entry.date}</p>
                    </div>
                    <span className={`text-xs font-medium ${totalDebit === totalCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                      {totalDebit === totalCredit ? 'Balanced' : 'Unbalanced'}
                    </span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-medium">Account</th>
                        <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-medium">Debit</th>
                        <th className="text-right px-4 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-medium">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.lines.map(line => (
                        <tr key={line.id} className="border-t border-[rgba(10,31,68,0.03)]">
                          <td className="px-4 py-2 text-sm text-slate-700">{line.accountName}</td>
                          <td className="px-4 py-2 text-sm text-slate-600 text-right">{line.debit > 0 ? line.debit.toLocaleString() : '-'}</td>
                          <td className="px-4 py-2 text-sm text-slate-600 text-right">{line.credit > 0 ? line.credit.toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-[#e2e8f0] bg-slate-50">
                        <td className="px-4 py-2 text-xs font-semibold text-[#0a1f44]">Total</td>
                        <td className="px-4 py-2 text-xs font-semibold text-[#0a1f44] text-right">{totalDebit.toLocaleString()}</td>
                        <td className="px-4 py-2 text-xs font-semibold text-[#0a1f44] text-right">{totalCredit.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Profit & Loss Statement', 'Balance Sheet', 'Cash Flow Statement', 'Trial Balance'].map(report => (
            <div key={report} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6 hover:border-[#c5a55a]/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-secondary text-base font-semibold text-[#0a1f44]">{report}</h3>
                  <p className="text-xs text-slate-500 mt-1">Generated as of April 2025</p>
                </div>
                <BarChart3 size={20} className="text-[#c5a55a]" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div><label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">From</label><input type="date" className="h-8 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                <div><label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">To</label><input type="date" className="h-8 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              </div>
              <button
                onClick={() => { handleExport('invoices'); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#0a1f44] text-white rounded-sm text-sm font-medium hover:bg-[#0a1f44]/90 transition-colors"
              >
                <Download size={14} />
                Export to CSV
              </button>
            </div>
          ))}
        </div>
      )}

      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowInvoiceModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Create Invoice</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">Invoice Number</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="INV-2025-XXX" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Client</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select client...</option><option>Al-Ruwad Properties</option><option>Ministry of Health</option><option>Oman Steel Co.</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Issue Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Due Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Description</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Service description" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">Quantity</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="1" /></div>
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Unit Price (OMR)</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="0.00" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setShowInvoiceModal(false); addToast('Invoice created successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Create Invoice</button>
            </div>
          </div>
        </div>
      )}

      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowExpenseModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Log Expense</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">Category</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Equipment</option><option>Materials</option><option>Utilities</option><option>Labor</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Amount (OMR)</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="0.00" /></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Description</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Expense description" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowExpenseModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setShowExpenseModal(false); addToast('Expense logged successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Save Expense</button>
            </div>
          </div>
        </div>
      )}

      {showJournalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowJournalModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">New Journal Entry</h3></div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs text-slate-500 mb-1 block">Description</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Entry description" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium">Entry Lines</p>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5"><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-sm"><option>Account</option></select></div>
                  <div className="col-span-3"><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-sm" placeholder="Debit" /></div>
                  <div className="col-span-3"><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-2 text-sm" placeholder="Credit" /></div>
                  <div className="col-span-1"><button className="w-full h-9 flex items-center justify-center text-[#c5a55a] hover:bg-amber-50 rounded-sm"><Plus size={16} /></button></div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowJournalModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setShowJournalModal(false); addToast('Journal entry created successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
