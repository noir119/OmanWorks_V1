import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  LayoutDashboard, Users, FileText, Briefcase, Wallet,
  ClipboardList, FolderOpen, MessageSquare, Wrench, BarChart3
} from 'lucide-react';

const navGroups = [
  {
    label: 'main',
    items: [
      { id: 'dashboard', translationKey: 'common.dashboard', icon: LayoutDashboard },
      { id: 'reports', translationKey: 'common.reports', icon: BarChart3 },
    ],
  },
  {
    label: 'management',
    items: [
      { id: 'hr', translationKey: 'common.hr', icon: Users },
      { id: 'visa', translationKey: 'common.visa', icon: FileText },
      { id: 'operations', translationKey: 'common.operations', icon: Briefcase },
      { id: 'financial', translationKey: 'common.financial', icon: Wallet },
    ],
  },
  {
    label: 'records',
    items: [
      { id: 'contracts', translationKey: 'common.contracts', icon: ClipboardList },
      { id: 'documents', translationKey: 'common.documents', icon: FolderOpen },
      { id: 'crm', translationKey: 'common.crm', icon: MessageSquare },
      { id: 'assets', translationKey: 'common.assets', icon: Wrench },
    ],
  },
];

export default function Sidebar() {
  const { activeModule, setActiveModule, sidebarOpen, dir } = useApp();
  const { t } = useTranslation();

  const isRtl = dir === 'rtl';

  return (
    <aside
      className={`fixed ${isRtl ? 'right-0' : 'left-0'} top-16 bottom-0 bg-[#f1f5f9] border-r border-[rgba(10,31,68,0.05)] transition-all duration-200 z-40 overflow-y-auto ${
        sidebarOpen ? 'w-64 translate-x-0' : `w-64 ${isRtl ? 'translate-x-64' : '-translate-x-64'} lg:translate-x-0`
      }`}
    >
      <nav className="py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-6 text-[10px] font-medium text-slate-400 uppercase tracking-widest-custom mb-2">
              {t(`common.${group.label}`)}
            </p>
            {group.items.map((item) => {
              const isActive = activeModule === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`relative w-[calc(100%-1rem)] ${isRtl ? 'text-right' : 'text-left'} flex items-center gap-3 py-3 px-4 mx-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-[#0a1f44] font-semibold'
                      : 'text-slate-500 hover:bg-white hover:text-[#0a1f44]'
                  }`}
                >
                  {isActive && (
                    <span className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-0 bottom-0 w-1 bg-[#c5a55a] ${isRtl ? 'rounded-l' : 'rounded-r'}`} />
                  )}
                  <Icon size={18} className={isActive ? 'text-[#c5a55a]' : ''} />
                  {t(item.translationKey)}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
