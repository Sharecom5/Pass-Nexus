'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  MoreVertical, 
  Loader2,
  CalendarDays,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', slug: '', date: '', venue: '' });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm)
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewForm({ name: '', slug: '', date: '', venue: '' });
        fetchEvents();
      }
    } catch (error) {
      console.error('Failed to create event');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Events</h1>
          <p className="text-slate-500 font-medium mt-1">Manage multiple conferences, expos, and gatherings.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95"
        >
          <Plus size={20} />
          Create New Event
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event, i) => (
            <motion.div 
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest leading-none">
                  {event.status}
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-blue-600 transition-colors">{event.name}</h2>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <Calendar size={18} className="text-blue-500" />
                  {event.date}
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <MapPin size={18} className="text-blue-500" />
                  {event.venue}
                </div>
                <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-widest pt-2">
                  <Tag size={16} />
                  {event.passTypes.join(', ')}
                </div>
              </div>

              <div className="flex gap-4 border-t border-slate-50 pt-8 mt-auto">
                <Link 
                  href={`/event/${event.slug}`} 
                  target="_blank"
                  className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all text-center"
                >
                  <ExternalLink size={14} /> Public Link
                </Link>
                <button className="flex-1 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all border border-slate-100">
                  Manage Event
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 border-dashed py-32 text-center max-w-2xl mx-auto">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
             <CalendarDays size={40} />
           </div>
           <h3 className="text-2xl font-black text-slate-900 mb-2">No events created yet</h3>
           <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">Click the button above to launch your first event and start generating passes.</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl"
            >
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight text-center">New Event</h2>
              
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Event Name</label>
                    <input required className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={newForm.name} onChange={e => setNewForm({...newForm, name: e.target.value})} placeholder="e.g. World Tech Expo 2026" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unique Slug (URL)</label>
                    <input required className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={newForm.slug} onChange={e => setNewForm({...newForm, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} placeholder="world-tech-expo" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                      <input required className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={newForm.date} onChange={e => setNewForm({...newForm, date: e.target.value})} placeholder="Aug 24, 2026" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Venue</label>
                      <input required className="w-full mt-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm" value={newForm.venue} onChange={e => setNewForm({...newForm, venue: e.target.value})} placeholder="London" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600">Cancel</button>
                   <button type="submit" disabled={createLoading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-70 flex items-center justify-center">
                     {createLoading ? <Loader2 size={24} className="animate-spin" /> : 'Create Event'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
