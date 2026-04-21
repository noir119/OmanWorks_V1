import { useState, useMemo, useEffect, useCallback } from 'react';
import { Users, MessageSquare, Star, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';

export default function CRMPage() {
  const { addToast, dir } = useApp();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'clients' | 'interactions' | 'feedback'>('clients');
  const [search, setSearch] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  
  const [clients, setClients] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'clients') {
        const data = await api.get<any[]>('/clients');
        setClients(data);
      } else if (activeTab === 'interactions') {
        const data = await api.get<any[]>('/client_interactions');
        setInteractions(data);
      } else if (activeTab === 'feedback') {
        const data = await api.get<any[]>('/client_feedback');
        setFeedback(data);
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to fetch CRM data', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredClients = useMemo(() => {
    return clients.filter(c =>
      (c.companyName && c.companyName.toLowerCase().includes(search.toLowerCase())) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(search.toLowerCase()))
    );
  }, [clients, search]);

  const filteredInteractions = useMemo(() => {
    return interactions.filter(ci =>
      (ci.clientId && ci.clientId.toLowerCase().includes(search.toLowerCase())) ||
      (ci.interactionType && ci.interactionType.toLowerCase().includes(search.toLowerCase()))
    );
  }, [interactions, search]);

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

  const isRtl = dir === 'rtl';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">CRM</h2>
        <p className="text-sm text-slate-500 mt-1">Manage client database, log interactions, and track feedback.</p>
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
          {activeTab === 'clients' && (
            <>
              <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="relative flex-1 max-w-xs">
                  <Users className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('common.search')}
                    className={`w-full h-9 bg-white border border-[#e2e8f0] rounded-sm ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-[#0a1f44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40`}
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
                        <h3 className="font-medium text-[#0a1f44]">{client.companyName}</h3>
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
                        {client.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredClients.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
              )}
            </>
          )}

          {activeTab === 'interactions' && (
            <>
              <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="relative flex-1 max-w-xs">
                  <MessageSquare className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('common.search')}
                    className={`w-full h-9 bg-white border border-[#e2e8f0] rounded-sm ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-[#0a1f44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40`}
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
                    <div className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        {getInteractionIcon(ci.interactionType)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-[#0a1f44]">{ci.clientId}</p>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={ci.interactionType} />
                            <span className="text-xs text-slate-400">{ci.interactionDate}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{ci.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredInteractions.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
              )}
            </>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {feedback.map(cf => (
                <div key={cf.id} className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-5">
                  <div className={`flex items-start justify-between mb-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <h3 className="font-medium text-[#0a1f44]">{cf.clientId}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{cf.feedbackDate}</p>
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
              {feedback.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
              )}
            </div>
          )}
        </>
      )}

      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowClientModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
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
              <button onClick={() => setShowClientModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={() => { setShowClientModal(false); addToast('Client added successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {showInteractionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowInteractionModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Log Interaction</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">Client</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select client...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}</select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Type</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Call</option><option>Email</option><option>Meeting</option><option>Visit</option></select></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Notes</label><textarea className="w-full h-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 resize-none" placeholder="Interaction details..." /></div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowInteractionModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={() => { setShowInteractionModal(false); addToast('Interaction logged successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
