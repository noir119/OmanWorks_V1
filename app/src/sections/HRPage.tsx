import { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useApp } from '@/context/AppContext';
import { employees, leaveRequests, attendanceRecords, payrollRecords } from '@/data/mockData';

export default function HRPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance' | 'leave' | 'payroll'>('employees');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [employeeList, setEmployeeList] = useState(employees);
  const [payrollList, setPayrollList] = useState(payrollRecords);

  const filteredEmployees = useMemo(() => {
    return employeeList.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
    );
  }, [employeeList, search]);

  const filteredAttendance = useMemo(() => {
    return attendanceRecords.filter(a =>
      a.employeeName.toLowerCase().includes(search.toLowerCase())
    );
  }, []);

  const filteredLeave = useMemo(() => {
    return leaveRequests.filter(l =>
      l.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      l.status.includes(search.toLowerCase())
    );
  }, []);

  const filteredPayroll = useMemo(() => {
    return payrollList.filter(p =>
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.period.includes(search)
    );
  }, [payrollList, search]);

  const handleDelete = (id: string) => {
    setEmployeeList(prev => prev.filter(e => e.id !== id));
    setDeleteConfirm(null);
    addToast('Employee deleted successfully');
  };

  const handleProcessPayroll = () => {
    setPayrollList(prev => prev.map(p => ({ ...p, status: 'paid' as const })));
    setShowPayrollModal(false);
    addToast('Payroll processed successfully for all employees');
  };

  const handleLeaveAction = (_id: string, action: 'approved' | 'rejected') => {
    addToast(`Leave request ${action} successfully`);
  };

  const tabs = [
    { id: 'employees' as const, label: 'Employees' },
    { id: 'attendance' as const, label: 'Attendance' },
    { id: 'leave' as const, label: 'Leave Requests' },
    { id: 'payroll' as const, label: 'Payroll' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">HR Management</h2>
        <p className="text-sm text-slate-500 mt-1">Manage employees, attendance, leave requests, and payroll.</p>
      </div>

      <div className="flex items-center gap-0 border-b border-[#e2e8f0] mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-[#0a1f44] border-[#c5a55a] font-semibold'
                : 'text-slate-500 border-transparent hover:text-[#0a1f44]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'employees' && (
        <>
          <FilterBar
            searchPlaceholder="Search employees by name, ID, or position..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="Add Employee"
            onAction={() => { setShowEmployeeModal(true); }}
          />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">ID</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Position</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Trade</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Contact</th>
                    <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, idx) => (
                    <tr key={emp.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{emp.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{emp.employeeId}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{emp.position}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{emp.primaryTrade}</td>
                      <td className="px-4 py-3"><StatusBadge status={emp.availabilityStatus} /></td>
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
              <p className="text-sm text-slate-400 text-center py-8">No employees found matching your search.</p>
            )}
          </div>
        </>
      )}

      {activeTab === 'attendance' && (
        <>
          <FilterBar searchPlaceholder="Search attendance records..." searchValue={search} onSearchChange={setSearch} />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Employee</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Check In</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Check Out</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((rec, idx) => (
                    <tr key={rec.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{rec.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{rec.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{rec.checkIn || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{rec.checkOut || '-'}</td>
                      <td className="px-4 py-3"><StatusBadge status={rec.status} /></td>
                      <td className="px-4 py-3 text-sm text-slate-500">{rec.method || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'leave' && (
        <>
          <FilterBar searchPlaceholder="Search leave requests..." searchValue={search} onSearchChange={setSearch} />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Employee</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Type</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">From</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">To</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Days</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Reason</th>
                    <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeave.map((lr, idx) => (
                    <tr key={lr.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{lr.employeeName}</td>
                      <td className="px-4 py-3"><StatusBadge status={lr.type} /></td>
                      <td className="px-4 py-3 text-sm text-slate-500">{lr.startDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{lr.endDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{lr.days}</td>
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
          </div>
        </>
      )}

      {activeTab === 'payroll' && (
        <>
          <FilterBar
            searchPlaceholder="Search payroll records..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="Process Payroll"
            onAction={() => setShowPayrollModal(true)}
          />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Employee</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Period</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Basic</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Allowances</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Deductions</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Overtime</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Net Pay</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayroll.map((pr, idx) => (
                    <tr key={pr.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{pr.employeeName}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{pr.period}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right">{pr.basicSalary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right">{pr.allowances.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-red-500 text-right">({pr.deductions.toLocaleString()})</td>
                      <td className="px-4 py-3 text-sm text-emerald-600 text-right">{pr.overtime.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#0a1f44] text-right">{pr.netPay.toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={pr.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowEmployeeModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e2e8f0]">
              <h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Add New Employee</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-3">Personal Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-slate-500 mb-1 block">Full Name</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Enter full name" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Employee ID</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="ARC-XXX" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Date of Birth</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Nationality</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Nationality" /></div>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest-custom text-slate-500 font-medium mb-3">Work Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-slate-500 mb-1 block">Primary Trade</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select trade...</option><option>Civil Engineering</option><option>Electrical</option><option>Plumbing</option><option>Carpentry</option><option>Masonry</option><option>Welding</option></select></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Position</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Position" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Join Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                  <div><label className="text-xs text-slate-500 mb-1 block">Email</label><input type="email" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="email@alrayaan.om" /></div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setShowEmployeeModal(false); addToast('Employee added successfully'); }} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Save Employee</button>
            </div>
          </div>
        </div>
      )}

      {showPayrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowPayrollModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-md mx-4 p-6">
            <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-2">Process Payroll</h3>
            <p className="text-sm text-slate-500 mb-4">This will mark all payroll records as paid for the current period. Are you sure?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowPayrollModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleProcessPayroll} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Confirm Process</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
