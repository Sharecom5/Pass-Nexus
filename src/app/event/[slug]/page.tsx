'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Ticket, 
  ArrowRight, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Tag, 
  CheckCircle2, 
  Loader2,
  Calendar,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventRegistrationPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', designation: '', passType: 'Visitor' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/public?slug=${slug}`);
        const data = await res.json();
        if (data.event) {
          setEvent(data.event);
          if (data.event.passTypes?.length > 0) {
            setForm(f => ({ ...f, passType: data.event.passTypes[0] }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch event');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventId: event._id, eventSlug: slug, eventName: event.name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess(data.visitor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <AlertCircle size={48} className="mx-auto text-slate-300" />
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Event Not Found</h1>
          <p className="text-slate-500 font-medium">The registration link you followed is invalid or has expired.</p>
          <button onClick={() => window.location.href = '/'} className="text-blue-600 font-bold uppercase tracking-widest text-xs py-4">Back to Homepage</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-10 selection:bg-blue-100">
      <div className="max-w-xl w-full">
        
        {/* Event Branding Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[2.5rem] shadow-xl shadow-blue-500/20 mb-6 transition-transform hover:scale-105">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">{event.name}</h1>
          <div className="flex flex-wrap justify-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-600" /> {event.date}</span>
            <span className="flex items-center gap-2"><MapPin size={14} className="text-blue-600" /> {event.venue}</span>
          </div>
        </motion.div>

        <div className="bg-white p-8 sm:p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-200/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">You're Registered!</h2>
                <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed uppercase tracking-widest italic">"{success.name}, see you at the event!"</p>
                <button 
                  onClick={() => router.push(`/pass/${success.passId}`)}
                  className="w-full h-16 bg-blue-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  View Digital Pass <ArrowRight size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-8">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">Registration Form</h3>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl border border-red-100">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Rahul Sharma" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="email" required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="rahul@example.com" />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input required className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91..." />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Company</label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company Name" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Choose Pass Type</label>
                    <div className="flex flex-wrap gap-2">
                       {event.passTypes.map((type: string) => (
                         <button 
                           key={type}
                           type="button"
                           onClick={() => setForm({...form, passType: type})}
                           className={`px-6 py-2.5 rounded-full text-xs font-black transition-all border ${
                             form.passType === type 
                               ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                               : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                           }`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full h-16 bg-blue-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-70 mt-6"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={24} /> : <>Register & Get Pass <ArrowRight size={20} /></>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
          Powered by <Ticket size={14} className="text-blue-400" /> PassNexus
        </p>
      </div>
    </div>
  );
}
