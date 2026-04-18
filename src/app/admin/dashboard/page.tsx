"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Calendar, MapPin, Globe, Settings, Loader2, Search,
  PlusCircle, LayoutDashboard, LogOut, ChevronRight, Camera, X, AlertCircle, Upload, Image as ImageIcon,
  Zap, TrendingUp, Pencil, Trash2, Smartphone, CheckCircle, Phone
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { PLANS } from "@/lib/plans";

export default function MyEventsDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [usage, setUsage] = useState<{ plan: string; totalPasses: number; passLimit: number; totalEvents: number; eventLimit: number; isPassLimited: boolean; isEventLimited: boolean; isLimited: boolean } | null>(null);
  const [formData, setFormData] = useState({
    name: "", slug: "", date: "", endDate: "", venue: "", description: "", checkinPin: "1234", phone: "",
    passSettings: { showName: true, showDesignation: true, showPhone: true, showCompany: true, customBackgroundUrl: "", qrPosition: 40, infoPosition: 65 }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const [evRes, usageRes] = await Promise.all([
        fetch("/api/admin/events"),
        fetch("/api/admin/usage")
      ]);
      if (evRes.status === 401) { router.push("/admin/login"); return; }
      if (!evRes.ok) throw new Error("Server error");
      const evData = await evRes.json();
      setEvents(evData.events || []);
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setUsage(usageData);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchasePlan = async (planId: string) => {
    if (planId === 'enterprise') {
      window.location.href = "mailto:hello@passnexus.in?subject=PassNexus Enterprise Upgrade";
      return;
    }
    try {
      setPurchasingPlan(planId);
      
      const orderRes = await fetch("/api/payments/create-plan-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setPurchasingPlan(null);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PassNexus",
        description: `Upgrade to ${(PLANS as any)[planId]?.name} Plan`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payments/verify-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: planId
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Upgrade successful!");
            setShowUpgradeModal(false);
            fetchEvents();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      paymentObject.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPurchasingPlan(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2MB."); return; }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData(prev => ({ ...prev, passSettings: { ...prev.passSettings, customBackgroundUrl: ev.target?.result as string } }));
      setIsUploading(false);
    };
    reader.onerror = () => { alert("Failed to read image."); setIsUploading(false); };
    reader.readAsDataURL(file);
  };

  useEffect(() => { fetchEvents(); }, []);
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'unset';
    if (!showModal) {
      setIsEditing(false);
      setEditEventId(null);
      setFormData({ name: "", slug: "", date: "", endDate: "", venue: "", description: "", checkinPin: "1234", phone: "", passSettings: { showName: true, showDesignation: true, showPhone: true, showCompany: true, customBackgroundUrl: "", qrPosition: 40, infoPosition: 65 } });
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  const handleEditClick = (event: any) => {
    setFormData({
      name: event.name,
      slug: event.slug,
      date: event.date ? (typeof event.date === 'string' ? event.date.split('T')[0] : new Date(event.date).toISOString().split('T')[0]) : "",
      endDate: event.endDate ? (typeof event.endDate === 'string' ? event.endDate.split('T')[0] : new Date(event.endDate).toISOString().split('T')[0]) : "",
      venue: event.venue,
      description: event.description || "",
      checkinPin: event.checkinPin || "1234",
      phone: event.phone || "",
      passSettings: event.passSettings || { showName: true, showDesignation: true, showPhone: false, showCompany: true, customBackgroundUrl: "", qrPosition: 40, infoPosition: 65 }
    });
    setEditEventId(event._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteEvent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete ALL attendees. This cannot be undone.`)) return;
    
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents(events.filter(e => e._id !== id));
      } else {
        const d = await res.json();
        alert(d.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting event");
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const url = isEditing ? `/api/admin/events/${editEventId}` : "/api/admin/events";
      const method = isEditing ? "PUT" : "POST";
      
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save event");
      
      if (isEditing) {
        setEvents(events.map(e => e._id === editEventId ? data.event : e));
      } else {
        setEvents([data.event, ...events]);
      }
      
      setShowModal(false);
    } catch (err: any) { setError(err.message); } finally { setIsSubmitting(false); }
  };

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.slug.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 text-sm";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <Link href="/pass" className="flex items-center gap-3 font-sans">
          <img src="/icon.png" alt="PassNexus" className="w-8 h-8 object-contain" />
          <span className="font-black text-slate-900 text-lg tracking-tight">Pass<span className="text-blue-600">Nexus</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </div>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} title="Sign Out"
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">My Events</h1>
            <p className="text-slate-500">Manage your event registrations and attendee access.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            disabled={!!(usage?.plan === 'free' && usage?.isEventLimited)}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:active:scale-100"
            title={usage?.plan === 'free' && usage?.isEventLimited ? 'Upgrade to create more events' : 'Create New Event'}>
            <PlusCircle className="w-5 h-5" /> Create New Event
            {usage?.plan === 'free' && usage?.isEventLimited && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-md">Upgrade</span>}
          </button>
        </div>

        {/* Freemium Usage Banner */}
        {usage && usage.plan === 'free' && (
          <div className={`mb-8 p-5 rounded-2xl border flex flex-col md:flex-row md:items-center gap-4 ${
            usage.isEventLimited || usage.isPassLimited ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex-1 space-y-3">
              {/* Event limit row */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${usage.isEventLimited ? 'text-red-500' : 'text-blue-600'}`} />
                    <p className={`text-sm font-black ${usage.isEventLimited ? 'text-red-700' : 'text-slate-800'}`}>
                      Events: {usage.totalEvents} / {usage.eventLimit} {usage.isEventLimited ? '— Limit Reached' : ''}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-2 border border-slate-200">
                  <div className={`h-2 rounded-full transition-all ${usage.isEventLimited ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min((usage.totalEvents / usage.eventLimit) * 100, 100)}%` }} />
                </div>
              </div>
              {/* Pass limit row */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${usage.isPassLimited ? 'text-red-500' : usage.totalPasses >= usage.passLimit * 0.8 ? 'text-orange-500' : 'text-blue-600'}`} />
                    <p className={`text-sm font-black ${usage.isPassLimited ? 'text-red-700' : 'text-slate-800'}`}>
                      Passes: {usage.totalPasses} / {usage.passLimit} {usage.isPassLimited ? '— Limit Reached' : ''}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-2 border border-slate-200">
                  <div className={`h-2 rounded-full transition-all ${usage.isPassLimited ? 'bg-red-500' : usage.totalPasses >= usage.passLimit * 0.8 ? 'bg-orange-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min((usage.totalPasses / usage.passLimit) * 100, 100)}%` }} />
                </div>
              </div>
              {(usage.isEventLimited || usage.isPassLimited) && (
                <p className="text-xs text-red-600 font-medium">Upgrade your plan to unlock unlimited events and passes.</p>
              )}
            </div>
            <button onClick={() => setShowUpgradeModal(true)}
              className="shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-3 rounded-xl shadow-md transition-all text-sm">
              <Zap className="w-4 h-4" /> Upgrade Plan
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="text" placeholder="Search by event name or slug..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 shadow-sm" />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, i) => (
            <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-blue-300 hover:shadow-lg transition-all group">
              <div className="flex justify-between items-start mb-5">
                <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-600 font-black text-lg group-hover:scale-110 transition-transform">
                  {event.name.charAt(0)}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/scan/${event.slug}`}
                    className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-all border border-green-100" title="Gate Scanner">
                    <Camera className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleEditClick(event)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all border border-blue-100" title="Edit Event">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <Link href={`/${event.slug}`} target="_blank"
                    className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all border border-slate-200" title="Public Page">
                    <Globe className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{event.name}</h3>

              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-2.5 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4 shrink-0 text-blue-400" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  /{event.slug}
                </div>
                <Link href={`/admin/${event.slug}`} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                  Manage <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full py-24 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="bg-slate-100 p-5 rounded-full mb-5">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-black text-slate-700 mb-2">No events yet</h3>
              <p className="text-slate-400 max-w-xs mx-auto mb-8 text-sm">Create your first event to start generating QR passes for attendees.</p>
              <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all">
                Create Your First Event
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">

              <div className="flex items-center justify-between p-8 pb-0 mb-6 font-sans">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{isEditing ? "Edit Event" : "Create New Event"}</h2>
                  <p className="text-slate-500 text-sm mt-1">Configure your event and custom pass layout.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row">
                <form onSubmit={handleCreateEvent} className="px-8 pb-8 space-y-5 flex-1 max-w-full lg:max-w-[60%] border-r border-slate-100">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />{error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Event Name *</label>
                    <input type="text" required placeholder="Tech Summit 2026" value={formData.name}
                      onChange={(e) => { setFormData(prev => ({ ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })); }}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>URL Slug *</label>
                    <input type="text" required placeholder="tech-summit-2026" value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Start Date *</label>
                    <input type="date" required value={formData.date} onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>End Date</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Venue *</label>
                    <input type="text" required placeholder="Convention Center" value={formData.venue}
                      onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Gate Check-In PIN *</label>
                    <input type="text" required maxLength={6} placeholder="1234" value={formData.checkinPin}
                      onChange={(e) => setFormData(prev => ({ ...prev, checkinPin: e.target.value.replace(/\D/g, '') }))} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="tel" required placeholder="+91 98765 43210" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea rows={2} placeholder="Brief event description..." value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className={inputCls + " resize-none"} />
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
                  <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-4">Pass Fields</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: "showName", label: "Name" },
                      { key: "showDesignation", label: "Designation" },
                      { key: "showPhone", label: "Phone" },
                      { key: "showCompany", label: "Company" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 p-3 rounded-xl hover:border-blue-300 transition-colors">
                        <input type="checkbox" checked={(formData.passSettings as any)[key]}
                          onChange={(e) => setFormData(prev => ({ ...prev, passSettings: { ...prev.passSettings, [key]: e.target.checked } }))}
                          className="w-4 h-4 rounded accent-blue-600" />
                        <span className="text-xs font-bold text-slate-600">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Custom Pass Background</label>
                  <div className="flex items-center gap-3 mb-2">
                    <label className="flex-1 flex items-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 cursor-pointer transition-colors">
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-blue-600" /> : formData.passSettings.customBackgroundUrl ? <ImageIcon className="w-5 h-5 text-green-500" /> : <Upload className="w-5 h-5 text-slate-400" />}
                      <span className="text-slate-500 text-sm font-medium">
                        {isUploading ? "Uploading..." : formData.passSettings.customBackgroundUrl ? "✅ Background set" : "Upload image (max 2MB)"}
                      </span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleFileUpload} />
                    </label>
                    {formData.passSettings.customBackgroundUrl && (
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, passSettings: { ...prev.passSettings, customBackgroundUrl: "" } }))}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-4 rounded-xl border border-red-200 transition-colors" title="Remove Background">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {formData.passSettings.customBackgroundUrl && (
                  <div className="border border-blue-100 bg-blue-50/50 rounded-2xl p-5 space-y-4">
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest text-center mb-2">Adjust Custom Layout</p>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-slate-600">QR Code Top Position</span>
                        <span className="text-xs text-blue-600 font-black">{formData.passSettings.qrPosition}%</span>
                      </div>
                      <input 
                        type="range" min="10" max="90" 
                        value={formData.passSettings.qrPosition}
                        onChange={(e) => setFormData(prev => ({ ...prev, passSettings: { ...prev.passSettings, qrPosition: parseInt(e.target.value) } }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-slate-600">Attendee Info Top Position</span>
                        <span className="text-xs text-blue-600 font-black">{formData.passSettings.infoPosition}%</span>
                      </div>
                      <input 
                        type="range" min="10" max="90" 
                        value={formData.passSettings.infoPosition}
                        onChange={(e) => setFormData(prev => ({ ...prev, passSettings: { ...prev.passSettings, infoPosition: parseInt(e.target.value) } }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-4 border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl font-bold transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isEditing ? <CheckCircle className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />} {isEditing ? "Save Changes" : "Create Event"}</>}
                  </button>
                </div>
                </form>

                {/* Live Preview Panel */}
                <div className="hidden lg:block flex-1 bg-slate-50 p-8">
                   <div className="sticky top-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Live Pass Preview</p>
                      
                      {/* Preview Container */}
                      <div className="relative w-full aspect-[2.25/3.5] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mx-auto max-w-[280px]">
                         {formData.passSettings.customBackgroundUrl ? (
                           <img src={formData.passSettings.customBackgroundUrl} className="absolute inset-0 w-full h-full object-cover" alt="Pass Background" />
                         ) : (
                           <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-slate-200" />
                           </div>
                         )}
                         
                         {/* Mock QR Code */}
                         <div 
                           className="absolute left-1/2 -translate-x-1/2 w-28 h-28 bg-white p-2 rounded-lg shadow-md flex items-center justify-center border border-slate-100"
                           style={{ top: `${formData.passSettings.qrPosition}%` }}
                         >
                         {/* Proper QR mock */}
                         <div className="w-full h-full bg-white p-1.5 rounded">
                           <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-[2px]">
                             {Array.from({ length: 25 }).map((_, i) => (
                               <div key={i} className={`rounded-[1px] ${[0,1,5,6,10,4,9,14,20,21,24,23,22,3,15,11,16,8].includes(i) ? 'bg-slate-900' : 'bg-slate-200'}`} />
                             ))}
                           </div>
                         </div>
                         </div>
                         
                         {/* Mock Attendee Info */}
                         <div 
                           className="absolute left-0 right-0 text-center px-4 pointer-events-none"
                           style={{ top: `${formData.passSettings.infoPosition}%` }}
                         >
                             <div className={`${formData.passSettings.customBackgroundUrl ? 'bg-white/90 backdrop-blur-sm rounded-xl shadow border border-slate-100' : 'bg-white/80 rounded-xl border border-slate-100'} px-3 py-2`}>
                               <div className="text-[9px] font-black text-slate-800 truncate text-center">{formData.name || 'Attendee Name'}</div>
                               {formData.passSettings.showDesignation && <div className="text-[8px] text-slate-500 text-center">Designation</div>}
                               {formData.passSettings.showCompany && <div className="text-[8px] text-slate-400 text-center">Company</div>}
                             </div>
                         </div>
                      </div>
                      
                      <div className="mt-8 space-y-3">
                         <div className="flex items-center gap-3 text-slate-400">
                            <Smartphone className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Device Mockup View</span>
                         </div>
                         <p className="text-[10px] text-slate-400 leading-relaxed italic">
                           This is a real-time visualization. The elements will appear at these relative positions on the final physical and digital passes.
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade Plan Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl my-auto">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Zap className="w-6 h-6 text-blue-600" /> Unlock More Value
                  </h2>
                </div>
                <button onClick={() => setShowUpgradeModal(false)}
                  className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 pb-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {Object.values(PLANS).filter((p: any) => p.id !== 'free').map((plan: any) => (
                      <div key={plan.id} className={`flex flex-col border rounded-3xl p-6 ${plan.highlight ? 'border-blue-600 shadow-xl bg-blue-50/20' : 'border-slate-200 shadow-sm bg-white'}`}>
                         <h3 className="text-lg font-black text-slate-900 mb-1">{plan.name}</h3>
                         <div className="text-2xl font-black text-slate-900 mb-4">{plan.price}</div>
                         <ul className="space-y-3 mb-6 flex-1 text-sm font-medium text-slate-600">
                           {plan.features.map((f: string, i: number) => (
                             <li key={i} className="flex gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0" /> {f}</li>
                           ))}
                         </ul>
                         <button 
                           onClick={() => handlePurchasePlan(plan.id)}
                           disabled={purchasingPlan === plan.id}
                           className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                         >
                           {purchasingPlan === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                           {plan.id === 'enterprise' ? 'Contact Sales' : 'Buy Now'}
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
