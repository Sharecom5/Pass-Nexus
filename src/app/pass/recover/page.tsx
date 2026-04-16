"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mail, Ticket, Loader2, ArrowRight, MapPin, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PassRecoveryPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch(`/api/pass/recover?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to find passes");
      setResults(data.passes);
      if (data.passes.length === 0) setError("No active passes found for this email address.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <Link href="/pass" className="flex items-center gap-3">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm">E</div>
          <span className="font-black text-slate-900">Entry<span className="text-blue-600">Flow</span></span>
        </Link>
      </div>

      <main className="max-w-xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center mb-10">
          <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
            <Search className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Recover Your Pass</h1>
          <p className="text-slate-500 text-lg">Enter the email you used to register and we'll find all your passes.</p>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Registration Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Find My Passes <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-red-50 border border-red-200 text-red-600 p-5 rounded-2xl flex items-center gap-4"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p className="font-medium text-sm">{error}</p>
            </motion.div>
          )}

          {results && results.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Found {results.length} Passes</p>
              {results.map((pass) => (
                <Link
                  key={pass.passId}
                  href={`/pass/${pass.eventSlug || 'event'}/${pass.passId}`}
                  className="block bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 p-6 rounded-2xl transition-all shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                        <Ticket className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{pass.eventName || 'Official Event'}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(pass.eventDate).toLocaleDateString([], {month:'short', day:'numeric', year:'numeric'})}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium truncate max-w-[140px]">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {pass.eventVenue}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${pass.status === 'entered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {pass.status === 'entered' ? 'Used' : 'Active'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{pass.passId}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-16 text-center text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">
          PassNexus Secure Pass Recovery
        </p>
      </main>
    </div>
  );
}
