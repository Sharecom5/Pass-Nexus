'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Calendar, 
  MapPin, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: 'Registered', value: data?.stats?.totalVisitors || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Checked In', value: data?.stats?.enteredCount || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Waiting', value: data?.stats?.pendingCount || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Scan Rate', value: data?.stats?.scanRate || '0%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time performance of your live event.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all relative overflow-hidden group"
          >
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 ring-8 ring-transparent group-hover:ring-slate-50 transition-all`}>
              <stat.icon size={28} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ArrowUpRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Event Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Event
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
                  {data?.activeEvent?.name || 'Innovation Summit 2026'}
                </h2>
                <div className="flex flex-wrap gap-6 text-slate-500 font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    {data?.activeEvent?.date || 'August 24, 2026'}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    {data?.activeEvent?.venue || 'Expo Center, North Hall'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                    <p className="text-xl font-black text-slate-900">500 Passes</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                    <p className="text-xl font-black text-slate-900">Single Entry</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-64 aspect-square bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed flex flex-col items-center justify-center p-8 text-center group-hover:bg-white group-hover:border-blue-200 transition-all cursor-pointer">
                <Ticket size={40} className="text-slate-300 mb-4 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">Click to view public portal</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-[3rem] p-10 text-white relative overflow-hidden">
            <TrendingUp size={120} className="absolute bottom-0 right-0 text-white/10 -mb-10 -mr-10" />
            <h3 className="text-2xl font-black mb-4">Ready for the gate?</h3>
            <p className="text-blue-100 font-medium max-w-md mb-8 leading-relaxed">Switch to Door Mode to start scanning attendees at high speed. Optimized for mobile QR verification.</p>
            <button className="bg-white text-blue-600 px-8 py-3.5 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl shadow-blue-800/20 active:scale-95">Open Gate Portal</button>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 h-full">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Scans</h3>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live Logs</span>
          </div>

          <div className="space-y-6">
            {data?.recentScans?.length > 0 ? (
              data.recentScans.map((log: any, i: number) => (
                <div key={i} className="flex gap-4 group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    log.result === 'granted' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0 border-b border-slate-50 pb-4 group-last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-black text-slate-900 truncate">{log.visitorName || 'Unknown'}</p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${
                      log.result === 'granted' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {log.result === 'granted' ? 'Access Granted' : 'Entry Denied'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-slate-200 mx-auto" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No entry logs yet</p>
              </div>
            )}
          </div>

          {data?.recentScans?.length > 0 && (
            <button className="w-full mt-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
              View All Logs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
