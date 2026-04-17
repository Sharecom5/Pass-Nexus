import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | PassNexus",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2>1. Platform Usage</h2>
          <p>By registering on PassNexus, you agree that you are fully authorized to organize the events you import. You may not use this platform to facilitate fraudulent, illegal, or deceptive gatherings.</p>
          <h2>2. Plans & Payments</h2>
          <p>Premium tiers unlock specific attendee and event capacity limits. Subscriptions are billed directly via Razorpay. All fees are non-refundable unless explicitly required by law.</p>
          <h2>3. Service Reliability</h2>
          <p>While PassNexus emphasizes ultra-resilient architecture, we are not liable for gate slowdowns caused by network interruptions, scanning hardware failures, or user misconfiguration.</p>
        </div>
      </div>
    </div>
  );
}
