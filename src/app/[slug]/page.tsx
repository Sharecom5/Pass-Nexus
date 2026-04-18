"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, User, Mail, Phone, Building2, Send, Loader2, AlertCircle, MapPin, Briefcase, Lock, CreditCard } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function RegistrationPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [planLimitReached, setPlanLimitReached] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    designation: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/public?slug=${slug}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data.event);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchEvent();
  }, [slug]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setSubmitting(true);
      
      // 1. Create Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          eventSlug: slug, 
          amount: event.ticketPrice,
          currency: event.currency || 'INR'
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // 2. Initialize Razorpay
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PassNexus",
        description: `Registration for ${event.name}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            // 4. Finalize Registration
            submitRegistration({
              paymentStatus: 'paid',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              amountPaid: event.ticketPrice
            });
          } else {
            setError("Payment verification failed. Please contact support.");
            setSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      paymentObject.on("payment.failed", function (response: any) {
        setError("Payment failed: " + response.error.description);
        setSubmitting(false);
      });

    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const submitRegistration = async (paymentInfo: any = {}) => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          eventSlug: slug, 
          registrationSource: 'public',
          ...paymentInfo
        }),
      });

      const data = await res.json();

      if (res.status === 402 || data.error === 'PLAN_LIMIT_REACHED') {
        setPlanLimitReached(true);
        setSubmitting(false);
        return;
      }

      if (!res.ok) throw new Error(data.error || "Registration failed");
      router.push(`/${slug}/${data.passId}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (event?.ticketPrice > 0) {
      handlePayment();
    } else {
      submitRegistration();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const settings = event?.passSettings || { showName: true, showDesignation: true, showPhone: true, showCompany: true };
  const displayEventName = event?.name || "Event Registration";

  if (planLimitReached) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 font-sans flex items-center justify-center px-6">
        <div className="bg-white border border-orange-200 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="bg-orange-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-200">
            <Lock className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Registration Temporarily Unavailable</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            This event organizer has reached their pass limit. To resume registrations, the organizer needs to upgrade their plan.
          </p>
          <a href="mailto:hello@passnexus.in" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all mb-4">
            Contact Organizer
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans relative">
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <Link href="/pass" className="flex items-center gap-3 group font-sans">
          <img src="/icon.png" alt="PassNexus" className="w-8 h-8 object-contain" />
          <span className="font-black text-slate-900">Pass<span className="text-blue-600">Nexus</span></span>
        </Link>
      </div>

      <div className="max-w-xl mx-auto pt-12 pb-20 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 p-8 md:p-10 rounded-3xl shadow-xl">
          <div className="text-center mb-10">
            <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
              <Ticket className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">{displayEventName}</h1>
            <p className="text-slate-500 text-sm">Fill out the form below to receive your unique QR entry pass.</p>
            
            {event?.ticketPrice > 0 && (
               <div className="mt-4 flex items-center justify-center gap-2 text-blue-700 font-black text-lg bg-blue-50 py-2 px-4 rounded-xl border border-blue-100 w-max mx-auto">
                 <CreditCard className="w-5 h-5" /> 
                 {event.currency || 'INR'} {event.ticketPrice}
               </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {settings.showCompany && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" required={settings.showCompany} placeholder="Your Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Office Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" required placeholder="Office Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
              </div>
            </div>

            <div className={`grid grid-cols-1 ${settings.showDesignation ? 'md:grid-cols-2' : ''} gap-5`}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contact Person</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                </div>
              </div>
              {settings.showDesignation && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" required={settings.showDesignation} placeholder="Job Title" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                  </div>
                </div>
              )}
            </div>

            <div className={`grid grid-cols-1 ${settings.showPhone ? 'md:grid-cols-2' : ''} gap-5`}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" required placeholder="+91..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" required placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 mt-2">
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {event?.ticketPrice > 0 ? 'Processing Payment...' : 'Generating Pass...'}</>
              ) : (
                <>{event?.ticketPrice > 0 ? <><CreditCard className="w-5 h-5" /> Pay & Get Pass</> : <><Send className="w-5 h-5" /> Get My Entry Pass</>}</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
