import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Zap, Globe, Users, Sparkles, Building2, Mail, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About PassNexus | The Future of Event Entry",
  description: "Learn how PassNexus is revolutionizing event management with lightning-fast digital passes and secure gate scanning.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/icon.png" alt="PassNexus" className="w-8 h-8 object-contain transition-transform group-hover:rotate-12" />
            <span className="font-black text-xl tracking-tight">Pass<span className="text-blue-600">Nexus</span></span>
          </Link>
          <div className="flex items-center gap-8 text-sm font-bold text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <Link href="/admin/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Our Mission
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-slate-900">
            Reimagining the <span className="text-blue-600">Gate Experience.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            PassNexus was built to eliminate the clunky, expensive legacy ticketing systems that slow down event entry. We empower organizers with high-speed, secure digital pass protocols.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             <div className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm italic text-slate-400 text-sm">
                Proudly developed by <span className="font-bold text-slate-900">AnD Innovatech</span>
             </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4">Zero Bottlenecks</h3>
              <p className="text-slate-500 leading-relaxed">
                Legacy systems cause queues. Our protocol checks in attendees in under 500ms, ensuring your event flow stays fast and seamless from door one.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4">Rock-Solid Security</h3>
              <p className="text-slate-500 leading-relaxed">
                Encrypted QR tokens ensure that passes cannot be forged or reused. Your gate security is only as strong as your protocol — we make it bulletproof.
              </p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black mb-4">Global Protocol</h3>
              <p className="text-slate-500 leading-relaxed">
                Used for summits, conferences, and exhibitions globally, our system handles diverse network conditions and massive visitor scale with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Designed for organizers who value <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">time.</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-500 leading-relaxed">
                <p>
                  At PassNexus, we believe that the first impression of any event happens at the gate. A slow check-in process ruins the attendee experience before it even begins.
                </p>
                <p>
                  That's why we built a unified nexus for event entry. One place to manage registration, design high-fidelity passes, and deploy secure mobile scanners instantly on any device.
                </p>
              </div>
              <div className="pt-6">
                <Link href="/admin/signup" className="inline-flex items-center gap-2 text-blue-600 font-black text-lg group">
                  Start building your event <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full max-w-lg">
               <div className="relative">
                  <div className="absolute -inset-4 bg-blue-100 rounded-[3rem] -rotate-3 blur-sm" />
                  <div className="relative bg-white border border-slate-200 p-8 rounded-[3rem] shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">PN</div>
                      <div>
                        <p className="font-bold text-slate-900">PassNexus Core</p>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-black">v2.0 Protocol</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                       {[1,2,3].map(i => (
                         <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg shadow-green-100" />
                              <div className="w-24 h-2 bg-slate-200 rounded-full" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300">SECURE_AUTH</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-slate-900 text-white text-center">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               <div>
                  <div className="text-4xl md:text-5xl font-black mb-2">500ms</div>
                  <div className="text-blue-400 text-xs font-black uppercase tracking-widest">Entry Speed</div>
               </div>
               <div>
                  <div className="text-4xl md:text-5xl font-black mb-2">100%</div>
                  <div className="text-blue-400 text-xs font-black uppercase tracking-widest">Digital Auth</div>
               </div>
               <div>
                  <div className="text-4xl md:text-5xl font-black mb-2">24/7</div>
                  <div className="text-blue-400 text-xs font-black uppercase tracking-widest">Gate Security</div>
               </div>
               <div>
                  <div className="text-4xl md:text-5xl font-black mb-2">0</div>
                  <div className="text-blue-400 text-xs font-black uppercase tracking-widest">Bottlenecks</div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm mb-6">© 2026 PassNexus by AnD Innovatech. All rights reserved.</p>
          <div className="flex justify-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
