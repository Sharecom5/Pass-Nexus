"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Camera, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ScanVerificationPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 }, false);

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
      if (passId) { scanner.pause(); setIsScanning(false); handleVerification(passId); }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans flex flex-col items-center justify-center p-6 pb-20">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 px-6 py-4 flex items-center gap-4 z-10 shadow-sm">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-black text-slate-900">Gate Verification</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{slug}</p>
        </div>
        <Link href="/admin/dashboard" className="ml-auto flex items-center gap-2 text-xs text-blue-600 font-bold px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          Dashboard
        </Link>
      </div>

      {/* Scanner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm mt-24 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl"
      >
        {isScanning ? (
          <div className="p-6">
            <div id="reader" className="overflow-hidden rounded-2xl border border-slate-200"></div>
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-blue-600 font-bold mb-1 text-sm">
                <Camera className="w-4 h-4" />
                Scanner Active
              </div>
              <p className="text-xs text-slate-400">Center the attendee&apos;s QR code in the frame to verify entry.</p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            {loading ? (
              <div className="py-12 flex flex-col items-center">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
                <h2 className="text-xl font-bold text-slate-900">Verifying Pass...</h2>
                <p className="text-sm text-slate-400 mt-2">Checking database for this pass ID.</p>
              </div>
            ) : result ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-400 shadow-lg shadow-green-200">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-black text-green-600 mb-1 uppercase tracking-tight">Access Granted</h2>
                <p className="text-slate-400 text-sm mb-8">Attendee successfully checked in</p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-6 space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Name</p>
                    <p className="text-lg font-black text-slate-900">{result.name}</p>
                  </div>
                  {result.company && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Company</p>
                      <p className="text-sm font-bold text-slate-700">{result.company}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Pass ID</p>
                      <p className="font-mono text-blue-600 font-bold text-sm">{result.passId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Type</p>
                      <p className="font-bold text-slate-700 text-sm">{result.passType}</p>
                    </div>
                  </div>
                </div>

                <button onClick={resetScanner}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Scan Next
                </button>
              </motion.div>
            ) : error ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-4">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-400 shadow-lg shadow-red-200">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-red-500 mb-1 uppercase tracking-tight">Access Denied</h2>
                <p className="text-slate-500 text-sm mb-8">{error}</p>
                <button onClick={resetScanner}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Try Again
                </button>
              </motion.div>
            ) : null}
          </div>
        )}
      </motion.div>

      {/* Status Bar */}
      <div className="mt-6 w-full max-w-sm grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Gate Mode</p>
          <p className="text-blue-600 font-bold text-sm">Entry Only</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Connection</p>
          <p className="text-green-600 font-bold text-sm flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span> Live
          </p>
        </div>
      </div>
    </div>
  );
}
