"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, User, Building2, MapPin, Calendar, Loader2, AlertCircle, Download, Smartphone, QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PassPage() {
  const { slug, passId } = useParams();
  const router = useRouter();
  const [visitor, setVisitor] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchPass = async () => {
      try {
        const res = await fetch(`/api/pass/${passId}`);
        if (!res.ok) throw new Error("Pass not found");
        const data = await res.json();
        setVisitor(data.visitor);
        const ev = data.eventSettings;
        setSettings(ev ? { ...ev.passSettings, endDate: ev.endDate } : null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (passId) fetchPass();
  }, [passId]);

  const markAsUsed = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/pass/${passId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      setVisitor({ ...visitor, status: "entered" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const downloadPass = () => {
    // Rely on native browser print sheet which handles CORS images correctly and can "Save as PDF" natively on mobile/desktop
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Pass</h1>
        <p className="text-slate-500 mb-6">This event pass could not be found or has been revoked.</p>
        <button onClick={() => router.push(`/${slug}`)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">
          Register New Pass
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans relative print:bg-white print:min-h-0 print:p-0">
      <style jsx global>{`
        @media print {
          html, body {
            height: 520px !important;
            width: 709px !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            visibility: hidden !important;
          }
          #pass-card, #pass-card * {
            visibility: visible !important;
          }
          #pass-card { 
            position: fixed !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 520px !important; 
            height: 709px !important; 
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            z-index: 9999999 !important;
            background: white !important;
          }
          @page {
            size: 520px 709px !important;
            margin: 0 !important;
          }
        }
      `}</style>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 print:hidden">
        <Link href="/pass" className="flex items-center gap-3">
          <img src="/icon.png" alt="PassNexus" className="w-8 h-8 object-contain" />
          <span className="font-black text-slate-900">Pass<span className="text-blue-600">Nexus</span></span>
        </Link>
      </div>

      <div className="flex flex-col items-center py-12 px-6 print:p-0">
        <motion.div
          id="pass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full max-w-[520px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden relative ${settings?.customBackgroundUrl ? 'aspect-[520/709]' : ''}`}
        >


          {settings?.customBackgroundUrl && (
            <img 
              src={settings.customBackgroundUrl} 
              alt="Pass Background" 
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-fill z-0" 
            />
          )}

          <div className="relative z-10 w-full h-full">
            {!settings?.customBackgroundUrl && (
              <div className="bg-blue-600 py-4 text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-200">PassNexus Digital Pass</p>
                <p className="text-white font-black text-xl mt-1">{visitor.eventName || "Event Pass"}</p>
              </div>
            )}

            <div className={`w-full h-full flex flex-col items-center ${settings?.customBackgroundUrl ? 'p-0' : 'p-8'}`}>
              
              {/* QR Code */}
              <div 
                className={`${settings?.customBackgroundUrl ? 'absolute left-1/2 -translate-x-1/2 bg-white p-3 rounded-2xl border-4' : 'bg-white p-4 rounded-2xl border-4 mb-6'} ${visitor.status === 'entered' ? 'border-green-500 shadow-lg shadow-green-200' : settings?.customBackgroundUrl ? 'border-slate-100 shadow-lg' : 'border-blue-500 shadow-lg shadow-blue-200'}`}
                style={settings?.customBackgroundUrl ? { top: `${settings.qrPosition}%` } : {}}
              >
                <img src={visitor.qrCodeUrl} alt="QR Code" className={`${settings?.customBackgroundUrl ? 'w-32 h-32 md:w-36 md:h-36' : 'w-48 h-48 md:w-56 md:h-56'}`} />
              </div>

              {/* Attendee Info */}
              <div 
                className={`${settings?.customBackgroundUrl ? 'absolute left-0 w-full px-6' : 'mb-8'} text-center`}
                style={settings?.customBackgroundUrl ? { top: `${settings.infoPosition}%` } : {}}
              >
                {settings?.showName !== false && (
                  <h2 className="text-[85px] font-black text-slate-900 leading-none mb-4 tracking-tighter w-full drop-shadow-sm uppercase">{visitor.name}</h2>
                )}
                {settings?.showDesignation !== false && visitor.designation && (
                  <p className="text-blue-700 font-bold text-sm uppercase tracking-widest drop-shadow-sm">{visitor.designation}</p>
                )}
                {settings?.showCompany !== false && visitor.company && (
                  <p className="text-slate-800 text-sm mt-1 font-semibold">{visitor.company}</p>
                )}
              </div>


            </div>

            {!settings?.customBackgroundUrl && (
              <div className="px-8 pb-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 bg-slate-50 mt-8">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Venue</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{visitor.eventVenue}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Pass ID</p>
                  <p className="text-sm font-mono font-bold text-blue-600">{visitor.passId}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Utility Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 print:hidden">
          <button
            onClick={downloadPass}
            disabled={downloading}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            SAVE PASS
          </button>
          <Link
            href="/pass/recover"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold"
          >
            <Smartphone className="w-4 h-4" /> RECOVER PASS
          </Link>
        </div>

        <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-widest font-bold print:hidden">
          Verified Digital Pass • PassNexus Protocol
        </p>
      </div>
    </div>
  );
}
