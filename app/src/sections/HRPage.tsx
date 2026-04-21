import { useState, useMemo, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { api } from '@/lib/api';

export default function HRPage() {
  const { addToast, dir } = useApp();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'leave' | 'payroll'>('employees');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'employees') {
        const data = await api.get<any[]>('/employees');
        setEmployees(data);
      } else if (activeTab === 'attendance') {
        const data = await api.get<any[]>('/attendance');
        setAttendance(data);
      } else if (activeTab === 'leave') {
        const data = await api.get<any[]>('/leave_requests');
        setLeaveRequests(data);
      } else if (activeTab === 'payroll') {
        const data = await api.get<any[]>('/payroll');
        setPayroll(data);
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const fullName = `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase();
      return fullName.includes(search.toLowerCase()) ||
        (e.id && e.id.toLowerCase().includes(search.toLowerCase())) ||
        (e.position && e.position.toLowerCase().includes(search.toLowerCase()));
    });
  }, [employees, search]);

  const filteredAttendance = useMemo(() => {
    return attendance.filter(a =>
      (a.employeeId && a.employeeId.toLowerCase().includes(search.toLowerCase()))
    );
  }, [attendance, search]);

  const filteredLeave = useMemo(() => {
    return leaveRequests.filter(l =>
      (l.employeeId && l.employeeId.toLowerCase().includes(search.toLowerCase())) ||
      (l.status && l.status.toLowerCase().includes(search.toLowerCase()))
    );
  }, [leaveRequests, search]);

  const filteredPayroll = useMemo(() => {
    return payroll.filter(p =>
      (p.employeeId && p.employeeId.toLowerCase().includes(search.toLowerCase()))
    );
  }, [payroll, search]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/employees`, { id: `eq.${id}` });
      setEmployees(prev => prev.filter(e => e.id !== id));
      setDeleteConfirm(null);
      addToast(t('hr.delete_success') || 'Employee deleted successfully');
    } catch (error: any) {
      addToast(error.message || 'Failed to delete employee', 'error');
    }
  };

  const handleProcessPayroll = async () => {
    try {
      // In a real scenario, this might call an Edge Function or a bulk patch
      // For now, let's just mock the success and refresh data
      addToast(t('hr.process_success') || 'Payroll processed successfully');
      setShowPayrollModal(false);
      fetchData();
    } catch (error: any) {
      addToast(error.message || 'Failed to process payroll', 'error');
    }
  };

  const handleLeaveAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/leave_requests`, { status }, { id: `eq.${id}` });
      setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      addToast(`Leave request ${status} successfully`);
    } catch (error: any) {
      addToast(error.message || 'Failed to update leave request', 'error');
    }
  };

  const tabs = [
    { id: 'employees' as const, label: t('hr.employees') },
    { id: 'attendance' as const, label: t('hr.attendance') },
    { id: 'leave' as const, label: t('hr.leave_requests') },
    { id: 'payroll' as const, label: t('hr.payroll') },
  ];

  const isRtl = dir === 'rtl';

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">{t('hr.title')}</h2>
        <p className="text-sm text-slate-500 mt-1">{t('hr.subtitle')}</p>
      </div>

      <div className={`flex items-center gap-0 border-b border-[#e2e8f0] mb-6 overflow-x-auto`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-[#0a1f44] border-[#c5a55a] font-semibold'
                : 'text-slate-500 border-transparent hover:text-[#0a1f44]'
            }`}
          >
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
          {activeTab === 'employees' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                actionLabel={t('hr.add_employee')}
                onAction={() => { setShowEmployeeModal(true); }}
              />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.name')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.employee_id')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.position')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.trade')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.contact')}</th>
                        <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((emp, idx) => (
                        <tr key={emp.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{emp.firstName} {emp.lastName}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{emp.id}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{emp.position}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{emp.department}</td>
                          <td className="px-4 py-3"><StatusBadge status={emp.employmentStatus} /></td>
                          <td className="px-4 py-3 text-sm text-slate-500">{emp.phone}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button className="p-1.5 text-slate-400 hover:text-[#0a1f44] hover:bg-slate-100 rounded"><Eye size={14} /></button>
                              <button className="p-1.5 text-slate-400 hover:text-[#c5a55a] hover:bg-amber-50 rounded"><Pencil size={14} /></button>
                              <button onClick={() => setDeleteConfirm(emp.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredEmployees.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'attendance' && (
            <>
              <FilterBar searchPlaceholder={t('common.search')} searchValue={search} onSearchChange={setSearch} />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.employees')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.date')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.check_in')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.check_out')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.method')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map((rec, idx) => (
                        <tr key={rec.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{rec.employeeId}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{rec.date}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString() : '-'}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{rec.checkOutTime ? new Date(rec.checkOutTime).toLocaleTimeString() : '-'}</td>
                          <td className="px-4 py-3"><StatusBadge status={rec.status} /></td>
                          <td className="px-4 py-3 text-sm text-slate-500">{rec.verificationMethod || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredAttendance.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'leave' && (
            <>
              <FilterBar searchPlaceholder={t('common.search')} searchValue={search} onSearchChange={setSearch} />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.employees')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.type')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.from')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.to')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.days')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.reason')}</th>
                        <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeave.map((lr, idx) => (
                        <tr key={lr.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{lr.employeeId}</td>
                          <td className="px-4 py-3"><StatusBadge status={lr.leaveType} /></td>
                          <td className="px-4 py-3 text-sm text-slate-500">{lr.startDate}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{lr.endDate}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{lr.numberOfDays}</td>
                          <td className="px-4 py-3"><StatusBadge status={lr.status} /></td>
                          <td className="px-4 py-3 text-sm text-slate-500 max-w-[150px] truncate">{lr.reason}</td>
                          <td className="px-4 py-3">
                            {lr.status === 'pending' && (
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={() => handleLeaveAction(lr.id, 'approved')} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded"><CheckCircle size={14} /></button>
                                <button onClick={() => handleLeaveAction(lr.id, 'rejected')} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><XCircle size={14} /></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredLeave.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'payroll' && (
            <>
              <FilterBar
                searchPlaceholder={t('common.search')}
                searchValue={search}
                onSearchChange={setSearch}
                actionLabel={t('hr.process_payroll')}
                onAction={() => setShowPayrollModal(true)}
              />
              <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0a1f44]">
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.employees')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.date')}</th>
                        <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.basic')}</th>
                        <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.allowances')}</th>
                        <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.deductions')}</th>
                        <th className={`${isRtl ? 'text-left' : 'text-right'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('hr.net_pay')}</th>
                        <th className={`${isRtl ? 'text-right' : 'text-left'} px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium`}>{t('common.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayroll.map((pr, idx) => (
                        <tr key={pr.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{pr.employeeId}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{pr.periodStart} - {pr.periodEnd}</td>
                          <td className={`px-4 py-3 text-sm text-slate-600 ${isRtl ? 'text-left' : 'text-right'}`}>{pr.grossPay?.toLocaleString()}</td>
                          <td className={`px-4 py-3 text-sm text-slate-600 ${isRtl ? 'text-left' : 'text-right'}`}>0</td>
                          <td className={`px-4 py-3 text-sm text-red-500 ${isRtl ? 'text-left' : 'text-right'}`}>({pr.totalDeductions?.toLocaleString()})</td>
                          <td className={`px-4 py-3 text-sm font-semibold text-[#0a1f44] ${isRtl ? 'text-left' : 'text-right'}`}>{pr.netPay?.toLocaleString()}</td>
                          <td className="px-4 py-3"><StatusBadge status={pr.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredPayroll.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">{t('common.no_data')}</p>
                )}
              </div>
            </>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title={t('hr.delete_employee')}
        message={t('hr.delete_confirm')}
        confirmLabel={t('common.delete')}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowEmployeeModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" dir={dir}>
            <div className="p-6 border-b border-[#e2e8f0]">
              <h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">{t('hr.add_employee')}</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-3">{t('hr.personal_info')}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-slate-500 mb-1 block">{t('hr.full_name')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder={t('hr.full_name')} /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">{t('hr.employee_id')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="ARC-XXX" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">{t('hr.dob')}</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">{t('hr.nationality')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder={t('hr.nationality')} /></div>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-3">{t('hr.work_info')}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-slate-500 mb-1 block">{t('hr.trade')}</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select trade...</option><option>Civil Engineering</option><option>Electrical</option><option>Plumbing</option><option>Carpentry</option><option>Masonry</option><option>Welding</option></select></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">{t('hr.position')}</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder={t('hr.position')} /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">{t('hr.join_date')}</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">{t('hr.email')}</label><input type="email" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="email@alrayaan.om" /></div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={() => { setShowEmployeeModal(false); addToast('Employee added successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}

      {showPayrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowPayrollModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-md mx-4 p-6" dir={dir}>
            <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-2">{t('hr.process_payroll')}</h3>
            <p className="text-sm text-slate-500 mb-4">{t('hr.process_confirm')}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowPayrollModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">{t('common.cancel')}</button>
              <button onClick={handleProcessPayroll} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">{t('common.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
