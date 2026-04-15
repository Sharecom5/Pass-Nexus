'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Users, 
  Zap, 
  Loader2,
  Lock,
  Eye,
  Bell,
  CheckCircle2,
  Save,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    siteName: 'Pass Nexus',
    allowPublicRegistration: true,
    requireEmailVerification: false,
    multipleEntries: false,
    autoApproveVisitors: true,
    scannerStrictMode: true
  });

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulated save
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Configure global event rules and scanner behavior.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95 disabled:opacity-70"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Rules */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex items-center gap-3 mb-2">
             <ShieldCheck className="text-blue-600" size={24} />
             <h3 className="text-lg font-black text-slate-900 tracking-tight">Scanner Behavior</h3>
           </div>
           
           <div className="space-y-6">
             <label className="flex items-start justify-between gap-4 cursor-pointer group">
               <div className="flex-1">
                 <p className="font-black text-slate-900 text-sm">Allow Multiple Entries</p>
                 <p className="text-xs text-slate-400 font-medium mt-1">Permit users to scan their pass multiple times for the same event.</p>
               </div>
               <input 
                 type="checkbox" 
                 checked={config.multipleEntries} 
                 onChange={e => setConfig({...config, multipleEntries: e.target.checked})}
                 className="w-6 h-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
               />
             </label>

             <label className="flex items-start justify-between gap-4 cursor-pointer group">
               <div className="flex-1">
                 <p className="font-black text-slate-900 text-sm">Strict Scanning Mode</p>
                 <p className="text-xs text-slate-400 font-medium mt-1">Deny access immediately if the pass status is not 'pending'.</p>
               </div>
               <input 
                 type="checkbox" 
                 checked={config.scannerStrictMode} 
                 onChange={e => setConfig({...config, scannerStrictMode: e.target.checked})}
                 className="w-6 h-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
               />
             </label>
           </div>
        </div>

        {/* Access Control */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex items-center gap-3 mb-2">
             <Users className="text-blue-600" size={24} />
             <h3 className="text-lg font-black text-slate-900 tracking-tight">Access Control</h3>
           </div>
           
           <div className="space-y-6">
             <label className="flex items-start justify-between gap-4 cursor-pointer group">
               <div className="flex-1">
                 <p className="font-black text-slate-900 text-sm">Auto-Approve Visitors</p>
                 <p className="text-xs text-slate-400 font-medium mt-1">Automatically set pass status to 'pending' upon registration.</p>
               </div>
               <input 
                 type="checkbox" 
                 checked={config.autoApproveVisitors} 
                 onChange={e => setConfig({...config, autoApproveVisitors: e.target.checked})}
                 className="w-6 h-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
               />
             </label>

             <label className="flex items-start justify-between gap-4 cursor-pointer group">
               <div className="flex-1">
                 <p className="font-black text-slate-900 text-sm">Public Registration</p>
                 <p className="text-xs text-slate-400 font-medium mt-1">Allow anyone with the public link to register for an event.</p>
               </div>
               <input 
                 type="checkbox" 
                 checked={config.allowPublicRegistration} 
                 onChange={e => setConfig({...config, allowPublicRegistration: e.target.checked})}
                 className="w-6 h-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" 
               />
             </label>
           </div>
        </div>

        {/* Branding (Demo) */}
        <div className="md:col-span-2 bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
           <Globe className="absolute bottom-0 right-0 text-white/5 -mb-10 -mr-10" size={200} />
           
           <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Bell className="text-blue-400" /> System Identity
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Application Name</label>
                  <input className="w-full mt-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-all font-bold" value={config.siteName} onChange={e => setConfig({...config, siteName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Verification URL Base</label>
                  <input readOnly className="w-full mt-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none opacity-50 font-mono text-xs" value="https://passnexus.in/pass/" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
