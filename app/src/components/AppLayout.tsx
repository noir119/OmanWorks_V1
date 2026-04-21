import { useApp } from '@/context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import ToastContainer from './Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <Sidebar />
      <main
        className={`pt-16 min-h-screen transition-all duration-200 ${
          sidebarOpen ? 'lg:ml-64' : ''
        } ml-0`}
      >
        <div className="p-4 lg:p-8">{children}</div>
      </main>
      <ToastContainer />
    </div>
  );
}
