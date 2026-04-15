'use client';

import React, { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, MapPin, User, Building2, Download, Printer, Loader2, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';

export default function DigitalPassPage({ params }: { params: Promise<{ passId: string }> }) {
  const { passId } = use(params);
  const [data, setData] = useState<any>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pass/${passId}`);
        if (!res.ok) throw new Error('Pass not found or expired');
        const json = await res.json();
        setData(json);

        const qr = await QRCode.toDataURL(json.pass.passId, {
          width: 400,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
        setQrCode(qr);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (passId) fetchData();
  }, [passId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Authorizing Credential...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 border border-red-100">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-black mb-4 text-slate-900">Access Restricted</h1>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg"
        >
          Check Again
        </button>
      </div>
    );
  }

  const { pass, event } = data;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 overflow-x-hidden p-6 md:p-12">
      <div className="hero-glow opacity-30" />
      
      <div className="max-w-xl mx-auto relative z-10 pt-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-slate-900">Pass<span className="text-blue-600">Nexus</span></span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">{event?.name || 'Your Event Pass'}</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Official Digital Entry Credential</p>
          </div>

          {/* Digital Pass Card */}
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-200/50 relative">
            {/* Security Top Stripe */}
            <div className="h-3 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
            
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex-1 space-y-8">
                  <div>
                    <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4 border border-blue-100">
                      {pass.passType} ACCESS
                    </span>
                    <h2 className="text-4xl font-black leading-none mb-2 text-slate-900">{pass.name}</h2>
                    <p className="text-blue-600 font-black text-sm uppercase tracking-widest">{pass.designation || 'Attendee'}</p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Event Date</p>
                        <p className="text-sm font-black text-slate-900">{event?.date || 'TBA'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Location</p>
                        <p className="text-sm font-black text-slate-900 leading-tight">{event?.venue || 'Venue TBD'}</p>
                      </div>
                    </div>

                    {pass.company && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Affiliation</p>
                          <p className="text-sm font-black text-slate-900">{pass.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Section */}
                <div className="w-full md:w-auto flex flex-col items-center gap-4 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 group transition-transform hover:scale-105 duration-300">
                    <img src={qrCode} alt="Pass QR Code" className="w-[180px] h-[180px] mix-blend-multiply" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Pass ID Token</p>
                    <p className="text-xs font-mono font-black text-blue-600">{pass.passId}</p>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verification Active</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Authored by Pass Nexus</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="bg-slate-900 text-white h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/10"
              onClick={() => window.print()}
            >
              <Download size={20} /> Save PDF
            </button>
            <button 
              className="bg-white border border-slate-200 text-slate-900 h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all hover:bg-slate-50 active:scale-95 shadow-sm"
              onClick={() => window.print()}
            >
              <Printer size={20} /> Print Pass
            </button>
          </div>

          <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest pt-4">
            Authorized Digital Credential &bull; ID Required at Entry
          </p>
        </motion.div>
      </div>
    </div>
  );
}
