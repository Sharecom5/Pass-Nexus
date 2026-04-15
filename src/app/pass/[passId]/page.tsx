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

        // Generate QR code
        const qr = await QRCode.toDataURL(json.pass.passId, {
          width: 400,
          margin: 2,
          color: {
            dark: '#0a0f1d',
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
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Verifying Pass Identity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-3xl font-black mb-4">Access Denied</h1>
        <p className="text-slate-400 max-w-sm mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { pass, event } = data;

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white selection:bg-blue-500/30 overflow-x-hidden p-6 md:p-12">
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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">Pass<span className="text-blue-500">Nexus</span> Verified</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">{event?.name || 'Your Event Pass'}</h1>
            <p className="text-slate-500 font-medium">Please present this pass at the entry gate.</p>
          </div>

          {/* Digital Pass Card */}
          <div className="glass-card rounded-[3rem] overflow-hidden shadow-2xl">
            {/* Top Stripe */}
            <div className="h-3 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600" />
            
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex-1 space-y-8">
                  <div>
                    <span className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-4">
                      {pass.passType} PASS
                    </span>
                    <h2 className="text-4xl font-black leading-none mb-2">{pass.name}</h2>
                    <p className="text-slate-400 font-bold">{pass.designation || 'Attendee'}</p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Date</p>
                        <p className="text-sm font-bold">{event?.date || 'TBA'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Venue</p>
                        <p className="text-sm font-bold leading-tight">{event?.venue || 'See event details'}</p>
                      </div>
                    </div>

                    {pass.company && (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Organization</p>
                          <p className="text-sm font-bold">{pass.company}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Section */}
                <div className="w-full md:w-auto flex flex-col items-center gap-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
                  <div className="bg-white p-3 rounded-2xl shadow-glow-blue group transition-transform hover:scale-105 duration-300">
                    <img src={qrCode} alt="Pass QR Code" className="w-[180px] h-[180px]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Security Token</p>
                    <p className="text-xs font-mono font-bold text-blue-400">{pass.passId}</p>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pass Active</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Issued via Pass Nexus v2.0</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="bg-white text-black h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all hover:bg-slate-200 active:scale-95"
              onClick={() => window.print()}
            >
              <Download size={20} /> Download PDF
            </button>
            <button 
              className="bg-white/5 border border-white/10 text-white h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all hover:bg-white/10 active:scale-95"
              onClick={() => window.print()}
            >
              <Printer size={20} /> Print Pass
            </button>
          </div>

          <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest pt-4">
            Authorized Digital Credential &bull; Non-Transferable
          </p>
        </motion.div>
      </div>
    </div>
  );
}
