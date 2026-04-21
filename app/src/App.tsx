import { AppProvider, useApp } from '@/context/AppContext';
import AppLayout from '@/components/AppLayout';
import DashboardPage from '@/sections/DashboardPage';
import HRPage from '@/sections/HRPage';
import VisaPage from '@/sections/VisaPage';
import OperationsPage from '@/sections/OperationsPage';
import FinancialPage from '@/sections/FinancialPage';
import ContractsPage from '@/sections/ContractsPage';
import DocumentsPage from '@/sections/DocumentsPage';
import CRMPage from '@/sections/CRMPage';
import AssetsPage from '@/sections/AssetsPage';
import ReportsPage from '@/sections/ReportsPage';

function PageRouter() {
  const { activeModule } = useApp();

  switch (activeModule) {
    case 'dashboard': return <DashboardPage />;
    case 'hr': return <HRPage />;
    case 'visa': return <VisaPage />;
    case 'operations': return <OperationsPage />;
    case 'financial': return <FinancialPage />;
    case 'contracts': return <ContractsPage />;
    case 'documents': return <DocumentsPage />;
    case 'crm': return <CRMPage />;
    case 'assets': return <AssetsPage />;
    case 'reports': return <ReportsPage />;
    default: return <DashboardPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout>
        <PageRouter />
      </AppLayout>
    </AppProvider>
  );
}
