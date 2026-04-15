'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Zap, Shield, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 border-b border-white/5 bg-[#0a0f1d]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-glow-blue">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              PASS<span className="text-blue-500">NEXUS</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-all">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-glow-blue"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="hero-glow" />
        <div className="bg-mesh absolute inset-0 opacity-40" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
                <Zap size={14} className="fill-current" />
                V2.0 Now Live
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8">
                The Future of <br />
                <span className="gradient-text">Event Ticketing</span> <br />
                is Digital.
              </h1>
              
              <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-lg">
                Stop using paper. Start using Pass Nexus. The most advanced digital ticketing platform for modern events, exhibitions, and corporate summits.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link 
                  href="/signup" 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white h-16 px-10 rounded-2xl flex items-center justify-center gap-3 text-lg font-black transition-all hover:scale-105 shadow-glow-blue"
                >
                  Start Organizing <ArrowRight size={20} />
                </Link>
                <Link 
                  href="/demo" 
                  className="w-full sm:w-auto h-16 px-10 rounded-2xl border border-white/10 flex items-center justify-center gap-3 text-lg font-bold hover:bg-white/5 transition-all"
                >
                  View Demo
                </Link>
              </div>

              <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-white/5 pt-12">
                {[
                  { label: 'Instant Delivery', icon: Zap },
                  { label: 'Secure QR Scans', icon: Shield },
                  { label: 'Global Scale', icon: Globe }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-500">
                    <item.icon size={18} className="text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-widest leading-none">{item.label}</span>
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
              {/* Futuristic Pass Card Mockup */}
              <div className="glass-card p-1 rounded-[3rem] relative z-20 overflow-hidden group">
                <div className="bg-gradient-to-br from-[#1e293b] to-[#0a0f1d] rounded-[2.8rem] p-10">
                  <div className="flex justify-between items-start mb-16">
                    <div>
                      <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                        VIP PASS
                      </div>
                      <h3 className="text-3xl font-black">Alex Rivers</h3>
                      <p className="text-slate-500 text-sm">Global Tech Summit 2026</p>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                      <Ticket size={32} className="text-blue-500" />
                    </div>
                  </div>

                  <div className="aspect-square w-full max-w-[240px] mx-auto bg-white rounded-3xl p-6 mb-12 shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=PASSNEXUS-SAMPLE" 
                      alt="Sample QR Code" 
                      className="w-full h-full relative z-10"
                    />
                  </div>

                  <div className="border-t border-white/5 pt-8 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Pass ID</p>
                      <p className="text-sm font-bold text-blue-400 font-mono">PN-8829-XQ</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Gate</p>
                      <p className="text-sm font-bold text-white">North Hall - A1</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-12">Trusted by Innovation Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {['AnD Innovatech', 'Quantum Core', 'Aura Soft', 'Nexis Corp', 'Echo Digital'].map((brand) => (
              <span key={brand} className="text-xl md:text-2xl font-black tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="section-container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Engineered for Your <span className="text-blue-500">Success.</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to manage entries, registrations, and analytics for thousands of guests in one unified platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Instant Registration', 
                desc: 'Guests can register and get their digital pass in less than 30 seconds via WhatsApp or Email.',
                icon: Zap 
              },
              { 
                title: 'Ultra-Fast Scanning', 
                desc: 'Optimize entry gate wait times with our high-speed QR engine capable of 120 scans per minute.',
                icon: CheckCircle2 
              },
              { 
                title: 'Real-Time Insights', 
                desc: 'Track attendee flow, peak entry times, and registration velocity as it happens.',
                icon: Globe 
              }
            ].map((f, i) => (
              <div key={i} className="glass-card p-10 rounded-3xl hover:border-blue-500/50 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#050810]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter">
                PASS<span className="text-blue-500">NEXUS</span>
              </span>
            </div>
            
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              © 2026 Pass Nexus. All rights reserved.
            </p>

            <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
