'use client';

import { useState } from 'react';
import { 
  Ticket, 
  ArrowRight, 
  Mail, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function RecoveryPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Recovery failed');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-10 selection:bg-blue-100">
      <div className="max-w-md w-full">
        
        {/* Branding */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            PASS<span className="text-blue-600">NEXUS</span>
          </span>
        </Link>

        <div className="bg-white p-10 sm:p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center animate-in zoom-in-95 data-[state=pass]:duration-500 w-full"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-3xl tracking-tight">Pass Recovered!</h3>
                <p className="text-sm font-bold text-slate-500 mt-2 mb-8 uppercase tracking-widest italic">An email was sent, but you can also download it below.</p>

                {/* Pass Mini-Card */}
                <div className="bg-slate-900 text-white rounded-[2rem] p-6 sm:p-8 relative overflow-hidden mb-6 text-left shadow-2xl">
                  <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                    <div>
                      <span className="bg-blue-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{(success as any).passType || 'Visitor'}</span>
                      <h4 className="text-3xl font-black mt-4 mb-1">{(success as any).name}</h4>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{(success as any).eventName || 'Event Entry'}</p>
                    </div>
                    <div className="bg-white p-2 rounded-2xl flex-shrink-0 shadow-lg">
                      <img src={(success as any).qrCode} alt="Pass QR" className="w-[100px] h-[100px] sm:w-32 sm:h-32 object-contain mix-blend-multiply" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg">{(success as any).passId}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valid Entry</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => window.location.href = `/pass/${(success as any).passId}`}
                    className="flex-1 py-4 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-700 transition-colors shadow-xl shadow-blue-500/30 flex justify-center items-center gap-2"
                  >
                    Save Digital Pass <ArrowRight size={18} />
                  </button>
                  <button 
                    onClick={() => { setSuccess(false); setEmail(''); }}
                    className="py-4 px-6 bg-slate-100 text-slate-600 font-black rounded-[1.5rem] hover:bg-slate-200 transition-colors flex justify-center items-center gap-2"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recover Pass</h1>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Lost your QR code? No problem.</p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl border border-red-100 flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        required 
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="you@example.com" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-blue-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <>Recover Digital Pass <ArrowRight size={20} /></>}
                  </button>
                </form>

                <div className="pt-8 border-t border-slate-50 text-center">
                   <p className="text-xs font-bold text-slate-400">
                     Remembered your details? <Link href="/" className="text-blue-600 hover:underline">Back Home</Link>
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
          Secure Cloud Retrieval &bull; PassNexus
        </p>
      </div>
    </div>
  );
}
