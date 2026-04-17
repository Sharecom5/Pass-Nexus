import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "About Us | PassNexus",
  description: "Learn more about the team behind PassNexus and our mission to simplify event passage.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">About PassNexus</h1>
        <div className="prose prose-slate prose-lg max-w-none text-slate-600 space-y-6 leading-relaxed">
          <p>
            PassNexus was built out of a simple frustration: event management should not be complicated. 
            Conferences, meetups, and summits require powerful attendee tracking without the clunky interfaces and exorbitant fees of legacy ticketing systems.
          </p>
          <p>
            Our core protocol simplifies generation, allowing organizers to rapidly deploy dynamic QR codes wrapped in beautiful, customizable digital passes.
          </p>
          <p>
            <strong>Our Mission</strong><br/>
            To empower organizers worldwide with lighting-fast event entry tools capable of processing thousands of visitors seamlessly. 
            We secure your gates and eliminate bottlenecks.
          </p>
          <p>
            A product thoughtfully designed and developed by <a href="https://andinnovatech.com" className="text-blue-600 font-bold hover:underline">AnD Innovatech</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
