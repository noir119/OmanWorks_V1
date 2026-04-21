import { useState, useMemo, useEffect, useCallback } from 'react';
import { Building2, Users, Wrench, Loader2 } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';
import { differenceInDays, parseISO } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OperationsPage() {
  const { addToast, dir } = useApp();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'projects' | 'manpower' | 'workforce'>('projects');
  const [search, setSearch] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const [projects, setProjects] = useState<any[]>([]);
  const [manpowerRequests, setManpowerRequests] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [visas, setVisas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const data = await api.get<any[]>('/construction_projects');
        setProjects(data);
      } else if (activeTab === 'manpower') {
        const data = await api.get<any[]>('/manpower_requests');
        setManpowerRequests(data);
      } else if (activeTab === 'workforce') {
        const [asgnData, empData, visaData] = await Promise.all([
          api.get<any[]>('/assignments'),
          api.get<any[]>('/employees'),
          api.get<any[]>('/employee_visas'),
        ]);
        setAssignments(asgnData);
        setEmployees(empData);
        setVisas(visaData);
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to fetch operations data', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      (p.projectName && p.projectName.toLowerCase().includes(search.toLowerCase())) ||
      (p.clientId && p.clientId.toLowerCase().includes(search.toLowerCase()))
    );
  }, [projects, search]);

  const filteredRequests = useMemo(() => {
    return manpowerRequests.filter(r =>
      (r.projectId && r.projectId.toLowerCase().includes(search.toLowerCase())) ||
      (r.tradeRequired && r.tradeRequired.toLowerCase().includes(search.toLowerCase()))
    );
  }, [manpowerRequests, search]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a =>
      (a.employeeId && a.employeeId.toLowerCase().includes(search.toLowerCase())) ||
      (a.projectId && a.projectId.toLowerCase().includes(search.toLowerCase()))
    );
  }, [assignments, search]);

  const handleCreateProject = async () => {
    setShowProjectModal(false);
    addToast(t('operations.project_created') || 'Project created successfully');
    fetchData();
  };

  const handleCreateRequest = async () => {
    setShowRequestModal(false);
    addToast(t('operations.request_created') || 'Manpower request created successfully');
    fetchData();
  };

  const handleAssign = async () => {
    setShowAssignModal(false);
    addToast(t('operations.assigned_success') || 'Employee assigned to project successfully');
    fetchData();
  };

  const availableEmployees = useMemo(() => employees.filter(e => e.employmentStatus === 'active'), [employees]);
  const assignedEmployees = useMemo(() => assignments.filter(a => a.status === 'active'), [assignments]);

  const utilizationData = {
    labels: [t('operations.assigned'), t('operations.available')],
    datasets: [{
      data: [assignedEmployees.length, Math.max(0, availableEmployees.length - assignedEmployees.length)],
      backgroundColor: ['#0a1f44', '#c5a55a'],
      borderWidth: 0,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } } },
    cutout: '65%',
  };

  const canAssign = (employeeId: string) => {
    const empVisa = visas.find(v => v.employeeId === employeeId);
    if (!empVisa || !empVisa.visaExpiryDate) return true;
    const daysLeft = differenceInDays(parseISO(empVisa.visaExpiryDate), new Date());
    return daysLeft > 30;
  };

  const isRtl = dir === 'rtl';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">{t('operations.title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('operations.subtitle')}</p>
      </div>

      <div className="flex items-center gap-0 border-b border-[#e2e8f0] mb-6 overflow-x-auto">
        {[
          { id: 'projects' as const, label: t('operations.projects'), icon: Building2 },
          { id: 'manpower' as const, label: t('operations.manpower_requests'), icon: Users },
          { id: 'workforce' as const, label: t('operations.workforce_allocation'), icon: Wrench },
        ].map(tab => (
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
          {activeTab === 'projects' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                actionLabel={t('operations.create_project')}
                onAction={() => setShowProjectModal(true)}
              />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.project_name')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.client')}</th>
                        <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.value_omr')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.start_date')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.end_date')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((proj, idx) => (
                        <tr key={proj.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{proj.projectName}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{proj.clientId}</td>
                          <td className={`px-4 py-3 text-sm text-slate-600 ${isRtl ? 'text-left' : 'text-right'} font-medium`}>{proj.budgetAmount?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{proj.startDate}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{proj.endDate}</td>
                          <td className="px-4 py-3"><StatusBadge status={proj.projectStatus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredProjects.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'manpower' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                actionLabel={t('operations.new_request')}
                onAction={() => setShowRequestModal(true)}
              />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.projects')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.trade_required')}</th>
                        <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.quantity')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.date')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.description')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((req, idx) => (
                        <tr key={req.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{req.projectId}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{req.tradeRequired}</td>
                          <td className={`px-4 py-3 text-sm text-slate-600 ${isRtl ? 'text-left' : 'text-right'}`}>{req.quantity}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{req.requestDate}</td>
                          <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                          <td className="px-4 py-3 text-sm text-slate-500 max-w-[200px] truncate">{req.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredRequests.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'workforce' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                actionLabel={t('operations.assign_employee')}
                onAction={() => setShowAssignModal(true)}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#0a1f44]">
                          <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.employees')}</th>
                          <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.projects')}</th>
                          <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.role')}</th>
                          <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('operations.start_date')}</th>
                          <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssignments.map((asgn, idx) => (
                          <tr key={asgn.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                            <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{asgn.employeeId}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{asgn.projectId}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{asgn.role}</td>
                            <td className="px-4 py-3 text-sm text-slate-500">{asgn.startDate}</td>
                            <td className="px-4 py-3"><StatusBadge status={asgn.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredAssignments.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                  )}
                </div>
                <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
                  <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-4">{t('operations.utilization')}</h3>
                  <div className="h-48">
                    <Doughnut data={utilizationData} options={doughnutOptions} />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-slate-600">{t('operations.total_employees')}</span><span className="font-medium text-[#0a1f44]">{employees.length}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-600">{t('operations.assigned')}</span><span className="font-medium text-[#0a1f44]">{assignedEmployees.length}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-600">{t('operations.available')}</span><span className="font-medium text-[#c5a55a]">{Math.max(0, availableEmployees.length - assignedEmployees.length)}</span></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowProjectModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('operations.create_project')}</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">{t('operations.project_name')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder={t('operations.project_name')} /></div>
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">{t('operations.client')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder={t('operations.client')} /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.value_omr')}</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="0.00" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('common.status')}</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Planning</option><option>In Progress</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.start_date')}</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.end_date')}</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowProjectModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={handleCreateProject} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowRequestModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('operations.new_request')}</h3></div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.projects')}</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select project...</option>{projects.map(p => <option key={p.id}>{p.projectName}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.trade_required')}</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select trade...</option><option>Civil Engineering</option><option>Electrical</option><option>Plumbing</option><option>Carpentry</option><option>Masonry</option><option>Welding</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.quantity')}</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Number of workers" /></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">{t('common.description')}</label><textarea className="w-full h-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 resize-none" placeholder="Additional requirements..." /></div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowRequestModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={handleCreateRequest} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowAssignModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('operations.assign_employee')}</h3></div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">{t('hr.employees')}</label>
                <select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40">
                  <option>Select employee...</option>
                  {availableEmployees.map(emp => {
                    const canAssignEmp = canAssign(emp.id);
                    return (
                      <option key={emp.id} value={emp.id} disabled={!canAssignEmp}>
                        {emp.firstName} {emp.lastName} - {emp.department} {!canAssignEmp ? `(${t('operations.visa_warning')})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.projects')}</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select project...</option>{projects.filter(p => p.projectStatus === 'in_progress').map(p => <option key={p.id}>{p.projectName}</option>)}</select></div>
              <div><label className="text-xs text-slate-500 mb-1 block">{t('operations.role')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="e.g., Site Engineer" /></div>
              <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
                <p className="text-xs text-amber-800"><strong>{t('common.actions')}:</strong> {t('operations.visa_warning')}</p>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={handleAssign} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
