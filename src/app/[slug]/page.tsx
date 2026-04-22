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
    designation: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      console.log(`[Page] Fetching event for slug: "${slug}"`);
      try {
        const res = await fetch(`/api/events/public?slug=${slug}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error(`[Page] Fetch failed: ${res.status}`, errorData);
          throw new Error(errorData.error || "Event not found");
        }
        const data = await res.json();
        console.log(`[Page] Event fetched successfully:`, data.event?.name);
        setEvent(data.event);
      } catch (err: any) {
        console.error(`[Page] Error in fetchEvent:`, err.message);
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

      if (!res.ok) throw new Error(data.message || data.error || "Registration failed");
      router.push(`/${slug}/${data.passId}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict Validation
    if (formData.name.trim().length < 2) return setError("Please enter a valid Full Name.");
    if (formData.phone.length !== 10) return setError("Please enter a valid 10-digit phone number.");
    if (formData.company.trim().length < 2) return setError("Please enter a valid Company Name.");
    if (settings.showDesignation !== false && formData.designation.trim().length < 2) return setError("Please enter a valid Designation.");
    
    setError("");

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

  // Show error if event could not be loaded (fetch failed)
  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 font-sans flex items-center justify-center px-6">
        <div className="bg-white border border-red-200 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="bg-red-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-200">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Event Not Found</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            This registration link is invalid or the event no longer exists.
          </p>
          <Link href="/" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all">
            Go to PassNexus
          </Link>
        </div>
      </div>
    );
  }

  // Show "Registration Closed" if the event is not open
  if (event.registrationOpen === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex items-center justify-center px-6">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200">
            <Lock className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Registration Closed</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Registrations for <strong>{displayEventName}</strong> are currently closed.
          </p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans relative overflow-x-hidden">
      {/* Premium Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="flex items-center justify-center p-2.5 bg-blue-50/50 rounded-2xl group-hover:bg-blue-100/50 transition-all duration-300">
            <img src="/passnexus_logo.png" alt="PassNexus" className="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            Pass<span className="text-blue-600 tracking-tighter">Nexus</span>
          </span>
        </Link>
        <div className="hidden md:block">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Secure Entry Systems</span>
        </div>
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

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Company / Organization *</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" required placeholder="Organization Name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
              </div>
            </div>



            <div className={`grid grid-cols-1 ${settings.showDesignation !== false ? 'md:grid-cols-2' : ''} gap-5`}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" required placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                </div>
              </div>
              {settings.showDesignation !== false && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" required={settings.showDesignation !== false} placeholder="Job Title" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
                  </div>
                </div>
              )}
            </div>

            <div className={`grid grid-cols-1 ${settings.showPhone ? 'md:grid-cols-2' : ''} gap-5`}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="tel" pattern="[0-9]{10}" maxLength={10} required placeholder="10-digit number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900" />
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
