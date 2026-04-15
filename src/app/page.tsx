'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Zap, Shield, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">
              PASS<span className="text-blue-600">NEXUS</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-all">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="hero-glow opacity-50" />
        <div className="bg-mesh absolute inset-0 opacity-100" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-8">
                <Zap size={14} className="fill-current" />
                Next-Gen Event System
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8 text-slate-900">
                Premium <br />
                <span className="gradient-text">Event Pass</span> <br />
                Management.
              </h1>
              
              <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-lg font-medium">
                The evolution of EntryFlow. Experience the most aesthetic and high-performance digital ticketing platform for elite corporate events.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link 
                  href="/signup" 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white h-16 px-10 rounded-2xl flex items-center justify-center gap-3 text-lg font-black transition-all hover:scale-105 shadow-xl shadow-blue-500/30"
                >
                  Create Event <ArrowRight size={20} />
                </Link>
                <Link 
                  href="/demo" 
                  className="w-full sm:w-auto h-16 px-10 rounded-2xl border border-slate-200 flex items-center justify-center gap-3 text-lg font-bold hover:bg-slate-50 transition-all text-slate-600"
                >
                  See Demo
                </Link>
              </div>

              <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-slate-100 pt-12">
                {[
                  { label: 'Cloud Hosted', icon: Zap },
                  { label: 'Secure QR', icon: Shield },
                  { label: 'Real-time Stats', icon: Globe }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-400">
                    <item.icon size={18} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Premium Light Pass Mockup */}
              <div className="glass-card p-1 rounded-[3rem] relative z-20 overflow-hidden group">
                <div className="bg-white rounded-[2.8rem] p-10 shadow-inner">
                  <div className="flex justify-between items-start mb-16">
                    <div>
                      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                        EXHIBITOR PASS
                      </div>
                      <h3 className="text-3xl font-black text-slate-900">Sarah Jenkins</h3>
                      <p className="text-slate-500 text-sm font-bold">Innovation Summit 2026</p>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <Ticket size={32} className="text-blue-600" />
                    </div>
                  </div>

                  <div className="aspect-square w-full max-w-[240px] mx-auto bg-slate-50 rounded-3xl p-6 mb-12 border border-slate-100 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=PASSNEXUS-LIGHT" 
                      alt="Sample QR Code" 
                      className="w-full h-full relative z-10 mix-blend-multiply"
                    />
                  </div>

                  <div className="border-t border-slate-50 pt-8 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Pass ID</p>
                      <p className="text-sm font-bold text-blue-600 font-mono">PN-4402-LX</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Access</p>
                      <p className="text-sm font-bold text-slate-900">Main Arena - B4</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-32 relative bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Simplicity <span className="text-blue-600">Perfected.</span></h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">We took the best parts of our previous systems and rebuilt them with a focus on speed, reliability, and modern aesthetics.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Clean Interface', 
                desc: 'A distraction-free Light Theme designed for ultra-clear visibility in any environment.',
                icon: Zap 
              },
              { 
                title: 'High-Density QR', 
                desc: 'Optimized QR patterns for 100% first-scan success rates on any smartphone screen.',
                icon: CheckCircle2 
              },
              { 
                title: 'Data Sovereignty', 
                desc: 'Total control over your attendee data with secure export and encrypted database logs.',
                icon: Globe 
              }
            ].map((f, i) => (
              <div key={i} className="bg-white border border-slate-200 p-10 rounded-3xl hover:shadow-xl hover:translate-y-[-5px] transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-black mb-4 text-slate-900">{f.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                PASS<span className="text-blue-600">NEXUS</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              © 2026 Pass Nexus AI. Elevating Events.
            </p>

            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Link href="mailto:hello@passnexus.in" className="hover:text-blue-600 transition-colors">hello@passnexus.in</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
