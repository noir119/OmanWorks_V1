import { useState, useMemo } from 'react';
import { FileText, Search, Upload, Download } from 'lucide-react';
import { documents } from '@/data/mockData';

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [docFilter, setDocFilter] = useState('all');

  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      const matchesSearch = d.fileName.toLowerCase().includes(search.toLowerCase()) ||
        d.entityName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = docFilter === 'all' || d.entityType === docFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, docFilter]);

  const filters = [
    { label: 'All', value: 'all', active: docFilter === 'all', onClick: () => setDocFilter('all') },
    { label: 'Employee', value: 'employee', active: docFilter === 'employee', onClick: () => setDocFilter('employee') },
    { label: 'Client', value: 'client', active: docFilter === 'client', onClick: () => setDocFilter('client') },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-secondary text-2xl font-bold text-[#0a1f44]">Documents</h2>
        <p className="text-sm text-slate-500 mt-1">Central library for all employee and client documents.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full h-9 bg-white border border-[#e2e8f0] rounded-sm pl-10 pr-4 text-sm text-[#0a1f44] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#c5a55a]/40"
            />
          </div>
          <div className="flex items-center gap-1">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={f.onClick}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                  f.active ? 'bg-[#c5a55a] text-white' : 'bg-white border border-[#e2e8f0] text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#c5a55a] text-white rounded-sm text-sm font-semibold hover:bg-[#b08d4a] transition-colors">
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      <div className="bg-white rounded-md border border-[rgba(10,31,68,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0a1f44]">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Document</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Entity</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Type</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Upload Date</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Expiry Date</th>
                <th className="text-center px-4 py-3 text-[11px] uppercase tracking-widest-custom text-white/80 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, idx) => (
                <tr key={doc.id} className={`border-t border-[#e2e8f0] hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-[#f8fafc]' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center">
                        <FileText size={14} className="text-red-500" />
                      </div>
                      <span className="text-sm font-medium text-[#0a1f44]">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-[#0a1f44]">{doc.entityName}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{doc.entityType}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{doc.documentType}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{doc.uploadDate}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{doc.expiryDate || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-1.5 text-slate-400 hover:text-[#c5a55a] hover:bg-amber-50 rounded">
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDocs.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No documents found.</p>
        )}
      </div>
    </div>
  );
}
