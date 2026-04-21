import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Users, FileText, Briefcase, Wallet,
  ClipboardList, FolderOpen, MessageSquare, Wrench, BarChart3
} from 'lucide-react';

const navGroups = [
  {
    label: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { id: 'hr', label: 'HR Management', icon: Users },
      { id: 'visa', label: 'Visa & Immigration', icon: FileText },
      { id: 'operations', label: 'Operations', icon: Briefcase },
      { id: 'financial', label: 'Financial', icon: Wallet },
    ],
  },
  {
    label: 'RECORDS',
    items: [
      { id: 'contracts', label: 'Contracts', icon: ClipboardList },
      { id: 'documents', label: 'Documents', icon: FolderOpen },
      { id: 'crm', label: 'CRM', icon: MessageSquare },
      { id: 'assets', label: 'Assets', icon: Wrench },
    ],
  },
];

export default function Sidebar() {
  const { activeModule, setActiveModule, sidebarOpen } = useApp();

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-[#f1f5f9] border-r border-[rgba(10,31,68,0.05)] transition-all duration-200 z-40 overflow-y-auto ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-64 lg:translate-x-0'
      }`}
    >
      <nav className="py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-6 text-[10px] font-medium text-slate-400 uppercase tracking-widest-custom mb-2">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = activeModule === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`relative w-full text-left flex items-center gap-3 py-3 px-4 mx-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-[#0a1f44] font-semibold'
                      : 'text-slate-500 hover:bg-white hover:text-[#0a1f44]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#c5a55a] rounded-r" />
                  )}
                  <Icon size={18} className={isActive ? 'text-[#c5a55a]' : ''} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
