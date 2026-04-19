import React from "react";
import Link from "next/link";
import { ChevronRight, Mail, MapPin, Phone, MessageSquare, Sparkles, Send, Globe, Building2 } from "lucide-react";

export const metadata = {
  title: "Contact Us | PassNexus Support",
  description: "Get in touch with the PassNexus team for support, enterprise queries, or feedback on our digital pass protocol.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/passnexus_logo.png" alt="PassNexus" className="w-8 h-8 object-contain transition-transform group-hover:rotate-12" />
            <span className="font-black text-xl tracking-tight">Pass<span className="text-blue-600">Nexus</span></span>
          </Link>
          <div className="flex items-center gap-8 text-sm font-bold text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/admin/login" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Left Side: Info */}
          <div className="flex-1 space-y-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-6 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5" /> Support Center
              </span>
              <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                Get in touch with <span className="text-blue-600">our team.</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
                Have questions about PassNexus? Looking for an enterprise plan or need technical assistance? We are here to help.
              </p>
            </div>

            <div className="space-y-8">
               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:border-blue-400 group-hover:shadow-lg transition-all">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Email Support</h3>
                    <p className="text-slate-500 text-sm mb-1">Response time: &lt; 2 hours</p>
                    <a href="mailto:hello@passnexus.in" className="text-blue-600 font-bold hover:underline">hello@passnexus.in</a>
                  </div>
               </div>

               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:border-blue-400 group-hover:shadow-lg transition-all">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Call Us</h3>
                    <p className="text-slate-500 text-sm mb-1">Available Mon-Fri, 9am - 6pm</p>
                    <p className="text-slate-900 font-bold">+91 98765 43210</p>
                  </div>
               </div>

               <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:border-blue-400 group-hover:shadow-lg transition-all">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Headquarters</h3>
                    <p className="text-slate-500 text-sm mb-1">Visit our innovation hub</p>
                    <p className="text-slate-900 font-bold max-w-xs">AnD Innovatech, Tech Park Sector 62, Noida, India</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 w-full max-w-xl">
             <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -z-0" />
                <form className="space-y-6 relative z-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email address</label>
                        <input type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium" />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none">
                         <option>General Inquiry</option>
                         <option>Enterprise / Bulk Passes</option>
                         <option>Technical Support</option>
                         <option>Feedback</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                      <textarea rows={4} placeholder="How can we help you?" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium resize-none"></textarea>
                   </div>

                   <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]">
                      Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                   <p className="text-center text-[10px] text-slate-400 font-medium">By submitting this form, you agree to our privacy policy.</p>
                </form>
             </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/passnexus_logo.png" alt="PassNexus" className="w-6 h-6 object-contain" />
            <span className="font-black text-lg tracking-tight text-slate-900">Pass<span className="text-blue-600">Nexus</span></span>
          </div>
          <div className="flex gap-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
          </div>
          <p className="text-slate-400 text-xs font-medium">© 2026 AnD Innovatech</p>
        </div>
      </footer>
    </div>
  );
}
