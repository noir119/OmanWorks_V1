import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { contracts } from '@/data/mockData';
import { differenceInDays, parseISO } from 'date-fns';

export default function ContractsPage() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [contractList] = useState(contracts);

  const filteredContracts = useMemo(() => {
    return contractList
      .map(c => ({
        ...c,
        daysLeft: differenceInDays(parseISO(c.endDate), new Date()),
      }))
      .filter(c =>
        c.partyName.toLowerCase().includes(search.toLowerCase()) ||
        c.contractType.toLowerCase().includes(search.toLowerCase())
      );
  }, [contractList, search]);

  const handleRenew = () => {
    setShowRenewModal(false);
    addToast('Contract renewal initiated successfully');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">Contracts</h2>
        <p className="text-sm text-slate-500 mt-1">Manage employee, client, and subcontractor contracts with renewal tracking.</p>
      </div>

      <FilterBar
        searchPlaceholder="Search contracts by party or type..."
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0a1f44]">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Party</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Party Type</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Contract Type</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Value (OMR)</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Start Date</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">End Date</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Days Left</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((ct, idx) => (
                <tr key={ct.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{ct.partyName}</td>
                  <td className="px-4 py-3"><StatusBadge status={ct.partyType} /></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{ct.contractType}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">{ct.value > 0 ? ct.value.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{ct.startDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{ct.endDate}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${ct.daysLeft <= 60 ? 'text-red-600' : ct.daysLeft <= 180 ? 'text-[#c5a55a]' : 'text-emerald-600'}`}>
                      {ct.daysLeft > 0 ? ct.daysLeft : 'Expired'}
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
          <p className="text-sm text-slate-400 text-center py-8">No contracts found matching your search.</p>
        )}
      </div>

      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowRenewModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4 p-6">
            <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-2">Renew Contract</h3>
            <p className="text-sm text-slate-500 mb-4">Initiate the contract renewal process. A new contract will be drafted based on the existing terms.</p>
            <div className="space-y-4 mb-6">
              <div><label className="text-xs text-slate-500 mb-1 block">New End Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Renewal Notes</label><textarea className="w-full h-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 resize-none" placeholder="Any changes to terms..." /></div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRenewModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleRenew} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Initiate Renewal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
