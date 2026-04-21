import { useState, useMemo } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { FileText, RefreshCw } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { visas, visaRenewals } from '@/data/mockData';

export default function VisaPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'registry' | 'renewals'>('registry');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  const visaList = useMemo(() => {
    return visas.map(v => ({
      ...v,
      daysLeft: differenceInDays(parseISO(v.expiryDate), new Date()),
    }));
  }, []);

  const filteredVisas = useMemo(() => {
    let result = visaList;
    if (filter !== 'all') {
      result = result.filter(v => v.status === filter);
    }
    if (search) {
      result = result.filter(v =>
        v.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        v.visaNumber.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [visaList, filter, search]);

  const filters = [
    { label: 'All', value: 'all', active: filter === 'all', onClick: () => setFilter('all') },
    { label: 'Active', value: 'active', active: filter === 'active', onClick: () => setFilter('active') },
    { label: 'Expiring Soon', value: 'expiring-soon', active: filter === 'expiring-soon', onClick: () => setFilter('expiring-soon') },
    { label: 'Expired', value: 'expired', active: filter === 'expired', onClick: () => setFilter('expired') },
  ];

  const handleRenewal = () => {
    setShowRenewalModal(false);
    addToast('Visa renewal application submitted successfully');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">Visa & Immigration</h2>
        <p className="text-sm text-slate-500 mt-1">Track visa statuses, manage renewals, and monitor expiry dates.</p>
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
            {tab === 'registry' ? 'Visa Registry' : 'Renewal Applications'}
          </button>
        ))}
      </div>

      {activeTab === 'registry' && (
        <>
          <FilterBar
            searchPlaceholder="Search by employee name or visa number..."
            searchValue={search}
            onSearchChange={setSearch}
            filters={filters}
          />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Employee</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Visa Number</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Type</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Issue Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Expiry Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Days Left</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                    <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisas.map((visa, idx) => (
                    <tr key={visa.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{visa.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{visa.visaNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{visa.visaType}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{visa.issueDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{visa.expiryDate}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${
                          visa.daysLeft <= 30 ? 'text-red-600' : visa.daysLeft <= 60 ? 'text-[#c5a55a]' : 'text-emerald-600'
                        }`}>
                          {visa.daysLeft > 0 ? visa.daysLeft : 'Expired'}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={visa.status} /></td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setShowRenewalModal(true)} className="p-1.5 text-[#c5a55a] hover:bg-amber-50 rounded" title="Initiate Renewal">
                          <RefreshCw size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredVisas.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No visas found matching your criteria.</p>
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
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Employee</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Requested Date</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Approved Date</th>
                  <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {visaRenewals.map((vr, idx) => (
                  <tr key={vr.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{vr.employeeName}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{vr.requestedDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{vr.approvedDate || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={vr.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showRenewalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowRenewalModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]">
              <h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Visa Renewal Application</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-md border border-amber-100">
                <FileText size={18} className="text-amber-600 shrink-0" />
                <p className="text-sm text-amber-800">Complete the three-step renewal process: Apply, Approve, and Issued.</p>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Employee</label>
                <select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40">
                  <option>Select employee...</option>
                  {visas.filter(v => v.status === 'expiring-soon' || v.status === 'expired').map(v => (
                    <option key={v.id} value={v.id}>{v.employeeName} - {v.visaNumber}</option>
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
              <button onClick={() => setShowRenewalModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleRenewal} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
