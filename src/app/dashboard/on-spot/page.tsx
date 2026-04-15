'use client';

import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Tag, 
  CheckCircle2, 
  Loader2,
  Printer,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnSpotPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', designation: '', passType: 'Visitor' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data.events || []);
        if (data.events?.length > 0) setSelectedEvent(data.events[0]);
      } catch (err) {
        console.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/on-spot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventId: selectedEvent._id, eventName: selectedEvent.name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setSuccess(data.visitor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">On-Spot Desk</h1>
        <p className="text-slate-500 font-medium italic">Generate instant credentials for walk-in attendees.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10 items-start">
        {/* Registration Form */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Pass Generated!</h2>
                <p className="text-slate-500 font-bold text-sm mb-12">Entry permitted for {success.name}.</p>
                
                <div className="flex gap-4">
                  <button onClick={() => window.print()} className="flex-1 h-16 bg-slate-900 text-white rounded-[2rem] font-black flex items-center justify-center gap-2">
                    <Printer size={20} /> Print
                  </button>
                  <button 
                    onClick={() => { setSuccess(null); setForm({ name: '', email: '', phone: '', company: '', designation: '', passType: selectedEvent.passTypes[0] }); }}
                    className="flex-1 h-16 bg-blue-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={20} /> Next
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Event</label>
                  <select 
                    value={selectedEvent?._id} 
                    onChange={(e) => setSelectedEvent(events.find(ev => ev._id === e.target.value))}
                    className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-sm text-blue-600"
                  >
                    {events.map((ev: any) => (
                      <option key={ev._id} value={ev._id}>{ev.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Attendee Name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Pass Type</label>
                    <select 
                      value={form.passType} 
                      onChange={e => setForm({...form, passType: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-sm text-slate-600"
                    >
                      {selectedEvent?.passTypes?.map((t: string) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                    <input type="email" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone</label>
                    <input className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91..." />
                  </div>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-[10px] font-black uppercase tracking-widest">{error}</div>}

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full h-16 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="animate-spin" size={24} /> : <>Generate Official Pass <ArrowRight size={20} /></>}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>

        {/* Live Preview / Helper */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
            <Ticket size={120} className="absolute bottom-0 right-0 text-white/5 -mb-6 -mr-6" />
            <h3 className="text-xl font-black mb-4">Print Support</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">Connect a thermal or standard printer to this machine to instantly hand out physical badges.</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <Printer size={20} className="text-blue-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Printer Ready</span>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 p-10">
            <div className="flex items-center gap-3 mb-6">
               <AlertCircle size={20} className="text-amber-500" />
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Usage Note</h3>
            </div>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">This portal bypasses standard email verification. Every pass created here is marked as verified and ready for immediate entry.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
