import { useState, useMemo } from 'react';
import { Building2, Users, Wrench } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import StatusBadge from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { projects, manpowerRequests, assignments, employees, visas } from '@/data/mockData';
import { differenceInDays, parseISO } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OperationsPage() {
  const { addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'projects' | 'manpower' | 'workforce'>('projects');
  const [search, setSearch] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [projectList] = useState(projects);
  const [requestList] = useState(manpowerRequests);
  const [assignmentList] = useState(assignments);

  const filteredProjects = useMemo(() => {
    return projectList.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
    );
  }, [projectList]);

  const filteredRequests = useMemo(() => {
    return requestList.filter(r =>
      r.projectName.toLowerCase().includes(search.toLowerCase()) ||
      r.tradeRequired.toLowerCase().includes(search.toLowerCase())
    );
  }, [requestList]);

  const filteredAssignments = useMemo(() => {
    return assignmentList.filter(a =>
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.projectName.toLowerCase().includes(search.toLowerCase())
    );
  }, [assignmentList]);

  const handleCreateProject = () => {
    setShowProjectModal(false);
    addToast('Project created successfully');
  };

  const handleCreateRequest = () => {
    setShowRequestModal(false);
    addToast('Manpower request created successfully');
  };

  const handleAssign = () => {
    setShowAssignModal(false);
    addToast('Employee assigned to project successfully');
  };

  const availableEmployees = employees.filter(e => e.availabilityStatus === 'available');
  const assignedEmployees = assignmentList.filter(a => a.isActive);

  const utilizationData = {
    labels: ['Assigned', 'Available', 'On Leave'],
    datasets: [{
      data: [assignedEmployees.length, availableEmployees.length, employees.filter(e => e.availabilityStatus === 'on-leave').length],
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

  const canAssign = (employeeId: string) => {
    const empVisa = visas.find(v => v.employeeId === employeeId);
    if (!empVisa) return true;
    const daysLeft = differenceInDays(parseISO(empVisa.expiryDate), new Date());
    return daysLeft > 30;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">Operations</h2>
        <p className="text-sm text-slate-500 mt-1">Manage construction projects, manpower requests, and workforce allocation.</p>
      </div>

      <div className="flex items-center gap-0 border-b border-[#e2e8f0] mb-6">
        {[
          { id: 'projects' as const, label: 'Projects', icon: Building2 },
          { id: 'manpower' as const, label: 'Manpower Requests', icon: Users },
          { id: 'workforce' as const, label: 'Workforce Allocation', icon: Wrench },
        ].map(tab => (
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

      {activeTab === 'projects' && (
        <>
          <FilterBar
            searchPlaceholder="Search projects by name or client..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="Create Project"
            onAction={() => setShowProjectModal(true)}
          />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Project Name</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Client</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Value (OMR)</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Start Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">End Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((proj, idx) => (
                    <tr key={proj.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{proj.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{proj.client}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right font-medium">{proj.valueOMR.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{proj.startDate}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{proj.endDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={proj.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'manpower' && (
        <>
          <FilterBar
            searchPlaceholder="Search manpower requests..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="New Request"
            onAction={() => setShowRequestModal(true)}
          />
          <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1f44]">
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Project</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Trade Required</th>
                    <th className="text-right px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Quantity</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Request Date</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req, idx) => (
                    <tr key={req.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{req.projectName}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{req.tradeRequired}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right">{req.quantity}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{req.requestDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                      <td className="px-4 py-3 text-sm text-slate-500 max-w-[200px] truncate">{req.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'workforce' && (
        <>
          <FilterBar
            searchPlaceholder="Search assignments..."
            searchValue={search}
            onSearchChange={setSearch}
            actionLabel="Assign Employee"
            onAction={() => setShowAssignModal(true)}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0a1f44]">
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Employee</th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Project</th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Role</th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Start Date</th>
                      <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.map((asgn, idx) => (
                      <tr key={asgn.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                        <td className="px-4 py-3 text-sm font-medium text-[#0a1f44]">{asgn.employeeName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{asgn.projectName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{asgn.role}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{asgn.startDate}</td>
                        <td className="px-4 py-3"><StatusBadge status={asgn.isActive ? 'active' : 'inactive'} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] p-6">
              <h3 className="font-secondary text-lg font-semibold text-[#0a1f44] mb-4">Utilization</h3>
              <div className="h-48">
                <Doughnut data={utilizationData} options={doughnutOptions} />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs"><span className="text-slate-600">Total Employees</span><span className="font-medium text-[#0a1f44]">{employees.length}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">Assigned</span><span className="font-medium text-[#0a1f44]">{assignedEmployees.length}</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-600">Available</span><span className="font-medium text-[#c5a55a]">{availableEmployees.length}</span></div>
              </div>
            </div>
          </div>
        </>
      )}

      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowProjectModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Create New Project</h3></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Project Name</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Enter project name" /></div>
                <div className="col-span-2"><label className="text-xs text-slate-500 mb-1 block">Client</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Client name" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Contract Value (OMR)</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="0.00" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Status</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Planning</option><option>In Progress</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Start Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
                <div><label className="text-xs text-slate-500 mb-1 block">End Date</label><input type="date" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" /></div>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowProjectModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreateProject} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Create Project</button>
            </div>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowRequestModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">New Manpower Request</h3></div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs text-slate-500 mb-1 block">Project</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select project...</option>{projects.map(p => <option key={p.id}>{p.name}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-slate-500 mb-1 block">Trade Required</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select trade...</option><option>Civil Engineering</option><option>Electrical</option><option>Plumbing</option><option>Carpentry</option><option>Masonry</option><option>Welding</option></select></div>
                <div><label className="text-xs text-slate-500 mb-1 block">Quantity</label><input type="number" className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="Number of workers" /></div>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Notes</label><textarea className="w-full h-20 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40 resize-none" placeholder="Additional requirements..." /></div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowRequestModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleCreateRequest} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#0a1f44]/30" onClick={() => setShowAssignModal(false)} />
          <div className="relative bg-white rounded-lg border border-[#e2e8f0] w-full max-w-lg mx-4">
            <div className="p-6 border-b border-[#e2e8f0]"><h3 className="font-secondary text-lg font-semibold text-[#0a1f44]">Assign Employee to Project</h3></div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Employee</label>
                <select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40">
                  <option>Select employee...</option>
                  {availableEmployees.map(emp => {
                    const canAssignEmp = canAssign(emp.id);
                    return (
                      <option key={emp.id} value={emp.id} disabled={!canAssignEmp}>
                        {emp.name} - {emp.primaryTrade} {!canAssignEmp ? '(Visa expiring soon)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div><label className="text-xs text-slate-500 mb-1 block">Project</label><select className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"><option>Select project...</option>{projects.filter(p => p.status === 'in-progress').map(p => <option key={p.id}>{p.name}</option>)}</select></div>
              <div><label className="text-xs text-slate-500 mb-1 block">Role</label><input className="w-full h-9 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40" placeholder="e.g., Site Engineer" /></div>
              <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
                <p className="text-xs text-amber-800"><strong>Note:</strong> Employees with visas expiring within 30 days cannot be assigned to projects.</p>
              </div>
            </div>
            <div className="p-6 border-t border-[#e2e8f0] flex justify-end gap-3">
              <button onClick={() => setShowAssignModal(false)} className="px-4 py-2 border border-[#e2e8f0] rounded-sm text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleAssign} className="px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a]">Assign Employee</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
