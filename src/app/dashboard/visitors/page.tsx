'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Trash2, 
  XCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AttendeesPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/visitors?search=${search}&status=${status}&page=${page}`);
      const data = await res.json();
      setVisitors(data.visitors);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVisitors();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, status, page]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendees</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and track your registered guests.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or pass ID..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-600 appearance-none min-w-[160px]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="entered">Entered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendee</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pass ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="wait">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : visitors.length > 0 ? (
                  visitors.map((visitor, i) => (
                    <motion.tr 
                      key={visitor._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                            {visitor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{visitor.name}</p>
                            <p className="text-xs font-bold text-slate-500">{visitor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {visitor.passId}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-600">{visitor.passType}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          visitor.status === 'entered' ? 'bg-emerald-50 text-emerald-600' :
                          visitor.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            visitor.status === 'entered' ? 'bg-emerald-500' :
                            visitor.status === 'cancelled' ? 'bg-red-500' :
                            'bg-amber-500'
                          }`} />
                          {visitor.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                          <Users size={32} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">No attendees found</h3>
                        <p className="text-sm text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
