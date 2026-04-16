'use client';

import { useState, useEffect } from 'react';
import { 
  History, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2
} from 'lucide-react';

export default function ScanLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/scan-logs?page=${page}&filter=${filter}&limit=20`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filter]);

  const exportCSV = () => {
    const header = 'Pass ID,Visitor Name,Result,Scanned At\n';
    const rows = logs.map(l =>
      `${l.passId},"${l.visitorName || 'Unknown'}",${l.result},"${new Date(l.scannedAt).toLocaleString()}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'granted':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest"><CheckCircle2 size={14} /> Granted</span>;
      case 'duplicate':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-black uppercase tracking-widest"><AlertTriangle size={14} /> Duplicate</span>;
      case 'denied':
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest"><XCircle size={14} /> Denied</span>;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access History Log</h1>
          <p className="text-slate-500 font-medium mt-1">Review {total} chronological scan records.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-8 border-b border-slate-100 flex items-center gap-4">
          <Filter size={20} className="text-slate-400" />
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Scans' },
              { id: 'granted', label: 'Granted Only' },
              { id: 'denied', label: 'Denied & Duplicates' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setFilter(f.id); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  filter === f.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 uppercase tracking-widest text-[10px] font-black text-slate-400">
                <th className="p-6 rounded-tl-[3rem] pl-8">Pass ID</th>
                <th className="p-6">Visitor</th>
                <th className="p-6">Status</th>
                <th className="p-6 pr-8">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-500 font-bold">
                    <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    No scan records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0">
                    <td className="p-6 pl-8">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-sm">{log.passId}</span>
                    </td>
                    <td className="p-6 font-bold text-slate-900">{log.visitorName || 'Unknown'}</td>
                    <td className="p-6">{getResultBadge(log.result)}</td>
                    <td className="p-6 pr-8 text-sm font-medium text-slate-500">
                      {new Date(log.scannedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
