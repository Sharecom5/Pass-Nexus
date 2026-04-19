import React from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Scale, Gavel, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | PassNexus",
  description: "Read the legal terms and conditions for using the PassNexus event management platform.",
};

export default function TermsPage() {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using PassNexus, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our platform."
    },
    {
      title: "2. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information when creating an account."
    },
    {
      title: "3. Event Management",
      content: "Organizers are solely responsible for the content and legality of their events. PassNexus reserves the right to suspend any event that violates our acceptable use policy or local laws."
    },
    {
      title: "4. Payments and Refunds",
      content: "All payments made for PassNexus subscriptions are processed via authorized payment gateways. Refunds are handled on a case-by-case basis as per our refund policy."
    },
    {
      title: "5. Limitation of Liability",
      content: "PassNexus shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services."
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
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-slate-500 font-medium">Last updated: April 18, 2026</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 md:p-16">
          <div className="prose prose-slate max-w-none">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 items-start mb-12">
               <div className="shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-blue-100 shadow-sm">
                 <CheckCircle className="w-4 h-4 text-blue-600" />
               </div>
               <p className="text-sm text-blue-700 leading-relaxed italic">
                 Welcome to PassNexus. By using our platform, you agree to these terms. We have designed our service to be as transparent and fair as possible for both organizers and attendees.
               </p>
            </div>

            <div className="space-y-12">
              {terms.map((term, i) => (
                <div key={i}>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{term.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{term.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center space-y-6">
           <div className="flex justify-center items-center gap-12 text-blue-600">
              <div className="flex flex-col items-center">
                 <FileText className="w-6 h-6 mb-2" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Document</span>
              </div>
              <div className="flex flex-col items-center">
                 <Gavel className="w-6 h-6 mb-2" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Binding Agreement</span>
              </div>
           </div>
           <p className="text-slate-400 text-sm max-w-md mx-auto">
             If you have any questions about these terms, please please feel free to contact us.
           </p>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          © 2026 AnD Innovatech • PassNexus Legal
        </div>
      </footer>
    </div>
  );
}
