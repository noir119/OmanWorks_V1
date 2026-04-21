import { useState, useMemo } from 'react';
import { Wrench, Truck, Hammer } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { assets, assetMaintenance } from '@/data/mockData';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AssetsPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'inventory' | 'maintenance'>('inventory');
  const [search, setSearch] = useState('');
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showMaintModal, setShowMaintModal] = useState(false);

  const filteredAssets = useMemo(() => {
    return assets.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredMaint = useMemo(() => {
    return assetMaintenance.filter(m =>
      m.assetName.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'equipment': return <Wrench size={16} className="text-blue-500" />;
      case 'vehicle': return <Truck size={16} className="text-emerald-500" />;
      case 'tool': return <Hammer size={16} className="text-[#c5a55a]" />;
      default: return <Wrench size={16} />;
    }
  };

  const statusData = {
    labels: ['Active', 'In Maintenance', 'Retired'],
    datasets: [{
      data: [
        assets.filter(a => a.status === 'active').length,
        assets.filter(a => a.status === 'in-maintenance').length,
        assets.filter(a => a.status === 'retired').length,
      ],
      backgroundColor: ['#0a1f44', '#c5a55a', '#e2e8f0'],
      borderWidth: 0,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } } },
    cutout: '65%',
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">Assets</h2>
        <p className="text-sm text-slate-500 mt-1">Track equipment, vehicles, and tools with maintenance scheduling.</p>
      </div>

      <div className="flex items-center gap-0 border-b border-[#e2e8f0] mb-6">
        {[
          { id: 'inventory' as const, label: 'Inventory' },
          { id: 'maintenance' as const, label: 'Maintenance' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'text-[#0a1f44] border-[#c5a55a] font-semibold' : 'text-slate-500 border-transparent hover:text-[#0a1f44]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'inventory' && (
        <>
          <FilterBar
            searchPlaceholder="Search assets..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="Add Asset"
            onAction={() => setShowAssetModal(true)}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-4 flex items-center gap-4 hover:border-[#c5a55a]/20 transition-colors">
                  <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                    {getAssetIcon(asset.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-[#0a1f44] truncate">{asset.name}</h3>
                      <StatusBadge status={asset.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>S/N: {asset.serialNumber}</span>
                      <span>Purchased: {asset.purchaseDate}</span>
                      <span>Value: OMR {asset.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">Current Value</p>
                    <p className="text-sm font-semibold text-[#0a1f44]">OMR {asset.currentValue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
              <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-4">Asset Status</h3>
              <div className="h-48">
                <Doughnut data={statusData} options={doughnutOptions} />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-slate-600">Total Assets</span><span className="font-medium text-[#0a1f44]">{assets.length}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">Total Value</span><span className="font-medium text-[#0a1f44]">OMR {assets.reduce((s, a) => s + a.value, 0).toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">Current Value</span><span className="font-medium text-[#0a1f44]">OMR {assets.reduce((s, a) => s + a.currentValue, 0).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'maintenance' && (
        <>
          <FilterBar
            searchPlaceholder="Search maintenance records..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="Log Maintenance"
            onAction={() => setShowMaintModal(true)}
          />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Asset</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Description</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Cost (OMR)</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Next Service</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaint.map((m, idx) => (
                    <tr key={m.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{m.assetName}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{m.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{m.description}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right">{m.cost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{m.nextScheduledDate || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowAssetModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Add Asset</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Asset Name</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="e.g., Tower Crane TC-001" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Type</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Equipment</option><option>Vehicle</option><option>Tool</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Serial Number</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Serial number" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Purchase Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Purchase Value (OMR)</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="0.00" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowAssetModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setShowAssetModal(false); addToast('Asset added successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Save Asset</button>
            </div>
          </div>
        </div>
      )}

      {showMaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowMaintModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Log Maintenance</h3></div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs text-slate-500 mb-1 block">Asset</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select asset...</option>{assets.map(a => <option key={a.id}>{a.name}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Cost (OMR)</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="0.00" /></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Description</label><textarea className="w-full h-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 resize-none" placeholder="Maintenance details..." /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Next Scheduled Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowMaintModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setShowMaintModal(false); addToast('Maintenance logged successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Save Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
