"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LogIn, ArrowRight, Star, Zap, QrCode, Users, Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function EventPassLandingPage() {
  const features = [
    { icon: <Zap className="w-6 h-6 text-blue-600" />, title: "Lightning Fast Setup", description: "Create an event URL in seconds and start accepting registrations immediately. No coding required." },
    { icon: <QrCode className="w-6 h-6 text-blue-600" />, title: "Instant QR Generation", description: "Every attendee automatically receives a unique, scannable QR ticket directly on their device." },
    { icon: <Users className="w-6 h-6 text-blue-600" />, title: "Multi-Event Scalability", description: "Host multiple events simultaneously with separate data silos and customized configurations." },
    { icon: <ShieldCheck className="w-6 h-6 text-blue-600" />, title: "Secure Verification", description: "Scan QR codes at the gate to instantly verify authenticity and prevent duplication." },
    { icon: <Download className="w-6 h-6 text-blue-600" />, title: "One-Click Exports", description: "Download your entire attendee list as a CSV file to import into your CRM easily." },
  ];

  const pricingPlans = Object.values(PLANS);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="PassNexus" className="h-8 w-auto object-contain min-w-[120px]" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 px-4 py-2 rounded-xl font-semibold text-sm transition-all">
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
            <Link href="/admin/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold tracking-wide mb-6">
            ✨ Smart Event Management, Simplified
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 text-slate-900">
            The Ultimate <span className="text-blue-600">Event Pass</span> System
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create events, distribute QR passes, and handle gate check-ins — all from one clean, powerful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/admin/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl w-full sm:w-auto flex items-center justify-center gap-2 text-lg">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/event/demo-event"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-4 rounded-2xl font-semibold transition-all w-full sm:w-auto text-lg">
              Try Live Demo
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400 font-medium">Free to start. No credit card required.</p>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ value: "500+", label: "Events Hosted" }, { value: "50K+", label: "Passes Generated" }, { value: "99.9%", label: "Uptime" }, { value: "< 2s", label: "Gate Scan Time" }].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-black text-blue-600 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">A complete event pass system replacing complex ticketing platforms with a fast, minimal experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-100 p-8 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all group">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Simple, Pass-Based Pricing</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Pay once per plan. No monthly fees, no per-attendee surprises. Your passes, your way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            {pricingPlans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`relative rounded-3xl overflow-hidden flex flex-col ${plan.highlight ? 'ring-2 ring-blue-600 shadow-2xl shadow-blue-200' : 'border border-slate-200 shadow-sm'} bg-white`}>
                {plan.highlight && (
                  <div className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest text-center py-2 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-xs mb-5 min-h-[32px]">{plan.description}</p>

                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-slate-400 ml-1.5 text-xs">/ {plan.period}</span>
                  </div>

                  {/* Key Limits Highlight */}
                  <div className="grid grid-cols-2 gap-2 mb-5 bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Events</p>
                      <p className="text-lg font-black text-blue-700">{plan.eventLimit === -1 ? '∞' : plan.eventLimit}</p>
                    </div>
                    <div className="text-center border-l border-blue-200">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Passes</p>
                      <p className="text-lg font-black text-blue-700">{plan.passLimit === -1 ? '∞' : plan.passLimit.toLocaleString()}</p>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-grow">
                    {plan.features.map((item, j) => (
                      <li key={j} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-slate-600 text-xs">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.id === 'enterprise' ? 'mailto:hello@passnexus.in?subject=PassNexus Enterprise' : '/admin/signup'}
                    className={`w-full py-3.5 rounded-2xl font-bold text-center transition-all block text-sm ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}>
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center max-w-2xl mx-auto bg-blue-50 border border-blue-100 p-6 rounded-2xl">
            <p className="text-sm text-slate-600">
              <span className="font-bold text-slate-900">Need a custom quote?</span> We offer white-label reseller panels, custom licensing, and annual contracts.{" "}
              <a href="mailto:hello@passnexus.in" className="text-blue-600 hover:text-blue-700 underline font-semibold">
                Talk to our team
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
            <Link href="/admin/login" className="hover:text-blue-600 transition-colors">Organizer Login</Link>
          </div>
          <div className="flex flex-col md:flex-row w-full items-center justify-between mt-6 pt-6 border-t border-slate-100">
            <img src="/logo.png" alt="PassNexus" className="h-6 w-auto object-contain min-w-[100px] mb-4 md:mb-0" />
            <p className="text-sm text-slate-400 text-center">
              A product purposefully built by <a href="https://www.andinnovatech.com" className="text-blue-600 hover:underline font-bold" target="_blank" rel="noopener noreferrer">AnD Innovatech</a> • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
