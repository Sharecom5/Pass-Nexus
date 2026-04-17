"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Real implementation would send to an API route
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Contact Us</h1>
        <p className="text-slate-500 mb-10 leading-relaxed text-lg">
          Have questions about PassNexus? Looking for an enterprise plan? Drop us a line below and our core nexus administration team will reach out.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
            <p>Thank you for reaching out. We will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
              <textarea required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 resize-none" placeholder="How can we help?" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
