import { Search, Bell, HelpCircle, Menu, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const { t, language, setLanguage } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a1f44] flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white/70 hover:text-white transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c5a55a] rounded flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6" />
            </svg>
          </div>
          <div>
            <h1 className="font-secondary text-white font-semibold text-lg leading-tight">Al Rayaan</h1>
            <p className="text-white/60 text-[10px] leading-tight">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full h-9 bg-white/10 text-white placeholder:text-white/40 rounded-md pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 text-white/60 hover:text-white transition-colors text-xs font-medium bg-white/5 rounded-md border border-white/10"
        >
          <Globe size={14} />
          {language === 'en' ? 'العربية' : 'English'}
        </button>
        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#c5a55a] rounded-full" />
        </button>
        <button className="p-2 text-white/60 hover:text-white transition-colors">
          <HelpCircle size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c5a55a] to-[#a0843c] border-2 border-[#c5a55a] flex items-center justify-center text-white text-xs font-semibold ml-2">
          AR
        </div>
      </div>
    </header>
  );
}
