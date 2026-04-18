"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Camera, RefreshCw, Zap, Scan, User, Briefcase, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ScanVerificationPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 }, false);

    const onScanSuccess = async (decodedText: string) => {
      let passId = "";
      if (decodedText.includes('/')) {
        const cleanUrl = decodedText.endsWith('/') ? decodedText.slice(0, -1) : decodedText;
        passId = cleanUrl.split('/').pop() || "";
      } else if (decodedText.includes('ID:')) {
        const match = decodedText.match(/ID:\s*([\w-]+)/);
        passId = match ? match[1] : "";
      } else {
        passId = decodedText;
      }
      if (passId && isScanning) { 
        scanner.pause(); 
        setIsScanning(false); 
        handleVerification(passId); 
      }
    };

    scanner.render(onScanSuccess, () => {});
    return () => { scanner.clear().catch(console.error); };
  }, [slug]);

  const handleVerification = async (passId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pass/${passId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug: slug })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setResult(data.visitor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => { setResult(null); setError(null); setIsScanning(true); window.location.reload(); };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex flex-col items-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-4 pb-8">
        <button onClick={() => router.back()} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-md transition-all border border-white/10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black tracking-tight flex items-center gap-2 justify-center">
            <Scan className="w-5 h-5 text-blue-400" />
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Scanner</span>
          </h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">{slug}</p>
        </div>
        <Link href={`/admin/${slug}`} className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-2xl backdrop-blur-md transition-all border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Zap className="w-5 h-5" />
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md z-10 flex-1 flex flex-col justify-center pb-12">
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                
                {/* Camera Container with Target Brackets */}
                <div className="relative rounded-[2rem] overflow-hidden bg-black/50 border border-white/5 aspect-square flex items-center justify-center">
                  
                  {/* Target Brackets */}
                  <div className="absolute inset-6 z-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl opacity-80" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl opacity-80" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl opacity-80" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl opacity-80" />
                  </div>
                  
                  <div id="reader" className="w-[150%] h-[150%] -ml-[25%] -mt-[25%] scale-[0.7]"></div>
                </div>

                <div className="mt-8 text-center pb-4">
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-bold mb-3 text-xs tracking-widest uppercase">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Camera Active
                  </div>
                  <p className="text-sm text-slate-400">Align QR code within the frame</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-center"
            >
              {loading ? (
                <div className="py-16 flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-blue-400 animate-spin mb-6" />
                  <h2 className="text-xl font-bold tracking-tight text-white">Authenticating...</h2>
                </div>
              ) : result ? (
                <div className="py-4">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-500/20 to-transparent pointer-events-none" />
                  
                  <div className="w-24 h-24 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)] relative">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                    <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20" />
                  </div>
                  
                  <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tight">Access Granted</h2>
                  <p className="text-green-400 text-sm font-bold tracking-widest uppercase mb-8">Valid Pass Detected</p>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left mb-8 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                        <User className="w-5 h-5 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Attendee</p>
                        <p className="text-lg font-black text-white">{result.name}</p>
                      </div>
                    </div>
                    
                    {(result.company || result.designation) && (
                      <div className="flex gap-4 border-t border-white/5 pt-5">
                        <Briefcase className="w-5 h-5 text-slate-500 shrink-0 mt-2" />
                        <div>
                          {result.company && <p className="text-sm font-bold text-slate-200 uppercase">{result.company}</p>}
                          {result.designation && <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">{result.designation}</p>}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 border-t border-white/5 pt-5">
                      <Ticket className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Pass Category</p>
                        <p className="text-sm font-bold text-blue-400">{result.passType}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">ID</p>
                        <p className="text-sm font-mono font-bold text-white uppercase">{result.passId}</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={resetScanner} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
                    <RefreshCw className="w-4 h-4" /> Scan Next Pass
                  </button>
                </div>
              ) : error ? (
                <div className="py-4">
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-500/20 to-transparent pointer-events-none" />
                  
                  <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)] relative">
                    <XCircle className="w-12 h-12 text-red-400" />
                    <div className="absolute inset-0 bg-red-400 blur-2xl opacity-20" />
                  </div>
                  
                  <h2 className="text-3xl font-black text-white mb-1 uppercase tracking-tight">Access Denied</h2>
                  <p className="text-slate-400 text-sm mb-8">{error}</p>
                  
                  <button onClick={resetScanner} className="w-full bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm">
                    <RefreshCw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
