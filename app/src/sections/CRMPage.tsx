import { useState, useMemo } from 'react';
import { Users, MessageSquare, Star, Clock, Phone, Mail, MapPin } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { clients, clientInteractions, clientFeedback } from '@/data/mockData';

export default function CRMPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'clients' | 'interactions' | 'feedback'>('clients');
  const [search, setSearch] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [clientList] = useState(clients);

  const filteredClients = useMemo(() => {
    return clientList.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase())
    );
  }, [clientList, search]);

  const filteredInteractions = useMemo(() => {
    return clientInteractions.filter(ci =>
      ci.clientName.toLowerCase().includes(search.toLowerCase()) ||
      ci.notes.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const tabs = [
    { id: 'clients' as const, label: 'Clients', icon: Users },
    { id: 'interactions' as const, label: 'Interactions', icon: MessageSquare },
    { id: 'feedback' as const, label: 'Feedback', icon: Star },
  ];

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone size={14} className="text-emerald-500" />;
      case 'email': return <Mail size={14} className="text-blue-500" />;
      case 'meeting': return <Users size={14} className="text-[#c5a55a]" />;
      case 'visit': return <MapPin size={14} className="text-purple-500" />;
      default: return <MessageSquare size={14} />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">CRM</h2>
        <p className="text-sm text-slate-500 mt-1">Manage client database, log interactions, and track feedback.</p>
      </div>

      <div className="flex items-center gap-0 border-b border-[#e2e8f0] mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'text-[#0a1f44] border-[#c5a55a] font-semibold' : 'text-slate-500 border-transparent hover:text-[#0a1f44]'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'clients' && (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clients..."
                className="w-full h-9 bg-white border border-[#e2e8f0] rounded-sm pl-10 pr-4 text-sm text-[#0a1f44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
              />
            </div>
            <button
              onClick={() => setShowClientModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a] transition-colors"
            >
              <Users size={16} />
              Add Client
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map(client => (
              <div key={client.id} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-5 hover:border-[#c5a55a]/20 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-[#0a1f44]">{client.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{client.contactPerson}</p>
                  </div>
                  <StatusBadge status={client.status} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    {client.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={14} className="text-slate-400" />
                    {client.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'interactions' && (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-xs">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search interactions..."
                className="w-full h-9 bg-white border border-[#e2e8f0] rounded-sm pl-10 pr-4 text-sm text-[#0a1f44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
              />
            </div>
            <button
              onClick={() => setShowInteractionModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a] transition-colors"
            >
              <MessageSquare size={16} />
              Log Interaction
            </button>
          </div>
          <div className="space-y-3">
            {filteredInteractions.map(ci => (
              <div key={ci.id} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {getInteractionIcon(ci.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-[#0a1f44]">{ci.clientName}</p>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={ci.type} />
                        <span className="text-xs text-slate-400">{ci.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{ci.notes}</p>
                    {ci.followUpDate && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-[#c5a55a]">
                        <Clock size={12} />
                        Follow-up: {ci.followUpDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {clientFeedback.map(cf => (
            <div key={cf.id} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-[#0a1f44]">{cf.clientName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cf.date}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= cf.rating ? 'text-[#c5a55a] fill-[#c5a55a]' : 'text-slate-200'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600">{cf.comment}</p>
            </div>
          ))}
        </div>
      )}

      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowClientModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Add Client</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Company Name</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Company name" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Contact Person</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Full name" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Phone</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="+968 XXXX XXXX" /></div>
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Email</label><input type="email" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="email@company.om" /></div>
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Address</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Full address" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowClientModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setShowClientModal(false); addToast('Client added successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Save Client</button>
            </div>
          </div>
        </div>
      )}

      {showInteractionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowInteractionModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Log Interaction</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">Client</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select client...</option>{clients.map(c => <option key={c.id}>{c.name}</option>)}</select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Type</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Call</option><option>Email</option><option>Meeting</option><option>Visit</option></select></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Notes</label><textarea className="w-full h-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 resize-none" placeholder="Interaction details..." /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Follow-up Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowInteractionModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setShowInteractionModal(false); addToast('Interaction logged successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Save Interaction</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
