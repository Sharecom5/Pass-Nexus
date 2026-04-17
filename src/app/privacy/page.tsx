import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PassNexus",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2>1. Information We Collect</h2>
          <p>We log email, names, and encrypted event attendee data necessary to generate digital passes on behalf of event organizers.</p>
          <h2>2. Use of Information</h2>
          <p>PassNexus uses data solely to render QR code tickets, enforce secure gate access, and track payment histories using third-party integrations like Razorpay and Resend.</p>
          <h2>3. Data Protection</h2>
          <p>All sensitive information generated on passnexus.in is secured via encrypted tokens and isolated event silos. We do not sell your personal data.</p>
        </div>
      </div>
    </div>
  );
}
