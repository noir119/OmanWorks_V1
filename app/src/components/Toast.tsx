import { useApp } from '@/context/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-md border text-sm min-w-[300px] animate-in slide-in-from-right ${
            toast.type === 'success'
              ? 'bg-white border-green-200 text-green-800'
              : toast.type === 'error'
              ? 'bg-white border-red-200 text-red-800'
              : 'bg-white border-blue-200 text-blue-800'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={16} className="text-green-600" />}
          {toast.type === 'error' && <XCircle size={16} className="text-red-600" />}
          {toast.type === 'info' && <Info size={16} className="text-blue-600" />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
