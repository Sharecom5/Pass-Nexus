import React from "react";
import Link from "next/link";
import { ChevronRight, Shield, Lock, Eye, FileText, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PassNexus",
  description: "Learn how PassNexus handles and protects your data. Transparency and security are our core principles.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Data We Collect",
      content: "We collect information you provide directly to us when you create an account, create an event, or register for an event. This includes your name, email address, phone number, and company details."
    },
    {
      title: "2. How We Use Data",
      content: "We use your data to provide our services, process event registrations, generate digital passes, and communicate with you about your account or events. We do not sell your personal data to third parties."
    },
    {
      title: "3. Data Security",
      content: "PassNexus uses industry-standard encryption and security protocols to protect your data. All attendee information is stored in isolated, encrypted databases to prevent unauthorized access."
    },
    {
      title: "4. Your Rights",
      content: "Under various data protection laws (including GDPR and India's DPDP Act), you have the right to access, rectify, or request the deletion of your personal data. You can contact our support team for any data requests."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/passnexus_logo.png" alt="PassNexus" className="w-8 h-8 object-contain" />
            <span className="font-black text-xl tracking-tight">Pass<span className="text-blue-600">Nexus</span></span>
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: April 18, 2026</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 md:p-16 space-y-12">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              At PassNexus, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information across our platform.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <Lock className="w-6 h-6 text-blue-600 mb-3" />
                 <h4 className="font-black text-slate-900 mb-2">Encryption at Rest</h4>
                 <p className="text-sm text-slate-500">All sensitive attendee data is encrypted before being stored in our primary databases.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                 <Eye className="w-6 h-6 text-blue-600 mb-3" />
                 <h4 className="font-black text-slate-900 mb-2">Data Minimization</h4>
                 <p className="text-sm text-slate-500">We only collect the minimum amount of data required for a successful event entry.</p>
              </div>
            </div>

            <div className="space-y-10">
              {sections.map((section, i) => (
                <div key={i} className="border-t border-slate-100 pt-10 first:border-0 first:pt-0">
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{section.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm mb-4 italic">Have questions about your data? Reach out to us.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-100">
            Contact Data Protection Team
          </Link>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          © 2026 AnD Innovatech • PassNexus Protocol
        </div>
      </footer>
    </div>
  );
}
