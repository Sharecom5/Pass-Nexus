'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  ShieldCheck, 
  XCircle, 
  AlertTriangle, 
  History, 
  ArrowLeft,
  User,
  Ticket,
  Loader2,
  Camera,
  Keyboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function GatePage() {
  const [scanMode, setScanMode] = useState<'barcode' | 'camera'>('barcode');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const isScanning = useRef(false);

  // Keep input focused for physical scanners if in barcode mode
  useEffect(() => {
    if (scanMode === 'barcode') {
      const focusTimer = setInterval(() => {
        inputRef.current?.focus();
      }, 1000);
      return () => clearInterval(focusTimer);
    }
  }, [scanMode]);

  useEffect(() => {
    let scanner: any = null;
    
    if (scanMode === 'camera') {
      // Import dynamically to avoid SSR issues
      import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
        scanner = new Html5QrcodeScanner("reader", { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        }, false);
        
        scanner.render(
          (decodedText: string) => {
            if (!isScanning.current) {
              executeScan(decodedText);
            }
          },
          (err: any) => { /* ignore normal scanning errors */ }
        );
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, [scanMode]);

  const executeScan = async (passIdStr: string) => {
    if (!passIdStr.trim()) return;
    
    setLoading(true);
    setResult(null);
    isScanning.current = true;

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passId: passIdStr.trim() }),
      });
      const data = await res.json();
      
      setResult(data);
      setHistory(prev => [data, ...prev].slice(0, 5));
      
      // Auto-clear after 3 seconds for next scan
      setTimeout(() => {
        setResult(null);
        setInput('');
        isScanning.current = false;
      }, 3000);

    } catch (error) {
      console.error('Scan failed');
      isScanning.current = false;
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && !isScanning.current) {
      executeScan(input);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-y-auto p-6 md:p-10 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold hidden sm:inline">Exit Mode</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">
            PASS<span className="text-blue-500">NEXUS</span> <span className="text-slate-500 text-xs ml-2 font-bold select-none px-2 py-0.5 bg-slate-800 rounded">GATE v2.0</span>
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col items-center gap-8">
        
        {/* Toggle Mode */}
        <div className="w-full max-w-md bg-slate-900 rounded-2xl p-1.5 flex gap-2 border border-slate-800">
          <button
            onClick={() => setScanMode('camera')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              scanMode === 'camera' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera size={18} /> Mobile Camera
          </button>
          <button
            onClick={() => setScanMode('barcode')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              scanMode === 'barcode' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard size={18} /> Barcode Device
          </button>
        </div>

        {/* Verification Status Banner */}
        <div className="w-full min-h-[320px] relative">
          <AnimatePresence mode="wait">
            {!result && loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full border-4 border-slate-800 rounded-[3rem] bg-slate-900 flex flex-col items-center justify-center text-center p-10"
              >
                <Loader2 size={48} className="text-blue-500 animate-spin mb-6" />
                <h2 className="text-2xl font-black text-blue-400 tracking-tight animate-pulse uppercase">Verifying Pass...</h2>
              </motion.div>
            ) : !result ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full h-full border-4 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-center p-10"
              >
                {scanMode === 'camera' ? (
                  <div className="w-full max-w-sm mx-auto overflow-hidden rounded-3xl border-2 border-slate-800">
                    <div id="reader" className="w-full bg-black"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Scan size={48} className="text-slate-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-500 tracking-tight">READY TO SCAN</h2>
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-xs mt-2">Waiting for Pass ID from USB/Bluetooth Scanner...</p>
                  </>
                )}
              </motion.div>
            ) : result.success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full bg-emerald-500 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl shadow-emerald-500/20"
              >
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck size={56} className="text-white" />
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">ACCESS GRANTED</h2>
                <p className="text-emerald-100 text-lg font-bold mb-6 italic">"{result.message}"</p>
                <div className="bg-white/10 px-8 py-4 rounded-3xl backdrop-blur-md">
                  <p className="text-white text-2xl font-black">{result.visitor.name}</p>
                  <p className="text-emerald-100 text-sm font-bold uppercase tracking-widest">{result.visitor.passType}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="fail"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full h-full ${result.status === 'duplicate' ? 'bg-amber-500' : 'bg-red-600'} rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl`}
              >
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  {result.status === 'duplicate' ? <AlertTriangle size={56} /> : <XCircle size={56} />}
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">ENTRY DENIED</h2>
                <p className="text-white/80 text-lg font-bold mb-6 italic">{result.message}</p>
                {result.visitor && (
                  <div className="bg-black/10 px-8 py-4 rounded-3xl backdrop-blur-md">
                    <p className="text-white text-2xl font-black">{result.visitor.name}</p>
                    <p className="text-white/60 text-sm font-bold uppercase tracking-widest">{result.visitor.passType}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {scanMode === 'barcode' && (
          <form onSubmit={handleFormSubmit} className="w-full max-w-xl">
            <div className="relative group">
              <input 
                ref={inputRef}
                type="text" 
                className="w-full bg-slate-800 border-2 border-transparent h-20 px-10 rounded-full text-center text-3xl font-black tracking-widest text-emerald-400 outline-none focus:border-blue-500 focus:bg-slate-900 transition-all shadow-2xl placeholder:text-slate-700"
                placeholder="PASS-ID-TOKEN"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>
          </form>
        )}

        {/* Recent History Table */}
        <div className="w-full max-w-2xl bg-white/5 rounded-[2.5rem] border border-white/5 p-8 mt-auto">
           <div className="flex items-center gap-2 mb-6 px-2">
             <History size={18} className="text-slate-500" />
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Recent Activity</h3>
           </div>
           
           <div className="space-y-4">
             {history.length > 0 ? history.map((log, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                     log.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                   }`}>
                     <User size={18} />
                   </div>
                   <div>
                     <p className="text-sm font-black text-white">{log.visitor?.name || 'Unknown'}</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.visitor?.passType || 'Scan'}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className={`text-[10px] font-black uppercase tracking-widest ${
                     log.success ? 'text-emerald-500' : 'text-red-500'
                   }`}>
                     {log.success ? 'Granted' : 'Denied'}
                   </p>
                   <p className="text-[10px] font-bold text-slate-600 uppercase">Just Now</p>
                 </div>
               </div>
             )) : (
               <div className="py-10 text-center">
                 <p className="text-xs font-black text-slate-700 uppercase tracking-widest">No scan history in this session</p>
               </div>
             )}
           </div>
        </div>
      </main>
    </div>
  );
}
