import { useApp } from '@/context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import ToastContainer from './Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, dir } = useApp();
  const isRtl = dir === 'rtl';

  return (
    <div className="min-h-screen bg-[#f8fafc]" dir={dir}>
      <Header />
      <Sidebar />
      <main
        className={`pt-16 min-h-screen transition-all duration-200 ${
          sidebarOpen ? (isRtl ? 'lg:mr-64' : 'lg:ml-64') : ''
        } ml-0 mr-0`}
      >
        <div className="p-4 lg:p-8">{children}</div>
      </main>
      <ToastContainer />
    </div>
  );
}
