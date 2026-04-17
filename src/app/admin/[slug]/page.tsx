"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Search, Download, CheckCircle, Clock, 
  UserCheck, ShieldAlert, PlusCircle, X,
  Building2, Briefcase, Mail, Phone, User,
  Loader2, RefreshCcw, ChevronRight, LogOut, Ticket, Lock, Globe, Copy, Printer, ClipboardList, Trash2,
  ExternalLink,
  BarChart3,
  QrCode,
  CreditCard,
  Settings,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const [successPassId, setSuccessPassId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("attendees");
  const [newAttendee, setNewAttendee] = useState({
    name: "", email: "", phone: "", company: "", designation: ""
  });
  const [copied, setCopied] = useState(false);
  const [printData, setPrintData] = useState<any>(null);

  // Pricing State
  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [priceData, setPriceData] = useState({ ticketPrice: 0, currency: 'INR' });

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/${slug}`);
      if (!res.ok) throw new Error("Could not fetch admin data");
      const d = await res.json();
      setData(d);
      setPriceData({ 
        ticketPrice: d.event?.ticketPrice || 0, 
        currency: d.event?.currency || 'INR' 
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);

  const handleUpdatePrice = async () => {
    setUpdatingPrice(true);
    try {
      const res = await fetch(`/api/admin/${slug}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceData)
      });
      if (!res.ok) throw new Error("Failed to update pricing");
      alert("Pricing updated successfully!");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingPrice(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/pass/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerPrint = (attendee: any) => {
    setPrintData(attendee);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...newAttendee, 
          eventSlug: slug,
          registrationSource: 'manual',
          paymentStatus: 'paid' // Admin entries are always marked as paid
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add attendee");
      
      setSuccessPassId(data.passId);
      setNewAttendee({ name: "", email: "", phone: "", company: "", designation: "" });
      fetchData(); // Refresh list
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteVisitor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the pass for "${name}"? This action cannot be undone.`)) return;
    
    try {
      const res = await fetch(`/api/admin/visitors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setData((prev: any) => ({
          ...prev,
          attendees: prev.attendees.filter((a: any) => a._id !== id)
        }));
        if (selectedAttendee?._id === id) setSelectedAttendee(null);
      } else {
        const d = await res.json();
        alert(d.error || "Failed to delete attendee");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting attendee");
    }
  };

  const handleExport = () => {
    if (!data?.attendees) return;
    
    const headers = ["PassID", "Name", "Email", "Phone", "Company", "PassType", "Status", "EnteredAt", "Source", "Payment"];
    const rows = data.attendees.map((a: any) => [
      a.passId,
      a.name,
      a.email,
      a.phone,
      a.company || "",
      a.passType,
      a.status,
      a.enteredAt || "",
      a.registrationSource || "manual",
      a.paymentStatus || "pending"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${slug}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const filteredAttendees = data?.attendees?.filter((a: any) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.email.toLowerCase().includes(search.toLowerCase()) ||
                          a.passId.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "entered") return matchesSearch && a.status === "entered";
    if (filter === "pending") return matchesSearch && a.status === "registered";
    return matchesSearch;
  });

  const searchResults = search.length > 1 ? filteredAttendees?.slice(0, 5) : [];

  const mainFilteredAttendees = filteredAttendees;
  const instantFilteredAttendees = filteredAttendees?.filter((a: any) => a.registrationSource === 'instant' || a.passType === 'Instant Badge');
  const publicFilteredAttendees = filteredAttendees?.filter((a: any) => a.registrationSource === 'public');
  const checkedInFilteredAttendees = filteredAttendees?.filter((a: any) => a.status === 'entered');

  const currentPasses = activeTab === 'instant-log' 
    ? instantFilteredAttendees 
    : activeTab === 'public-log' 
      ? publicFilteredAttendees 
      : activeTab === 'checked-in'
        ? checkedInFilteredAttendees
        : mainFilteredAttendees;

  const currentTitle = activeTab === 'instant-log'
    ? 'Walk-Ins Database'
    : activeTab === 'public-log'
      ? 'Public Registration Log'
      : activeTab === 'checked-in'
        ? 'Real-time Checked-In Log'
        : 'Attendee Management';

  const stats = data?.stats || { total: 0, entered: 0, pending: 0 };
  const publicCount = data?.attendees?.filter((a: any) => a.registrationSource === 'public').length || 0;
  const manualCount = data?.attendees?.filter((a: any) => a.registrationSource === 'manual' || !a.registrationSource).length || 0;
  const instantCount = data?.attendees?.filter((a: any) => a.registrationSource === 'instant').length || 0;
  const totalPaidRevenue = data?.attendees?.reduce((acc: number, a: any) => a.paymentStatus === 'paid' ? acc + (a.amountPaid || 0) : acc, 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans text-sm pb-20">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 z-20 shadow-sm">
         <Link href="/pass" className="flex items-center gap-3 group font-sans mb-10 px-2">
          <img src="/icon.png" alt="PassNexus" className="w-8 h-8 object-contain" />
          <span className="font-black text-slate-900 text-lg tracking-tight">Pass<span className="text-blue-600">Nexus</span></span>
        </Link>

         <nav className="space-y-1">
            <button onClick={() => setActiveTab("attendees")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'attendees' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
               <Users className="w-4 h-4" /> Attendees
            </button>
            <button onClick={() => setActiveTab("instant-badge")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'instant-badge' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
               <Printer className="w-4 h-4" /> Instant Badge
            </button>
            <button onClick={() => setActiveTab("instant-log")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'instant-log' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
               <ClipboardList className="w-4 h-4" /> Walk-Ins
            </button>
            <button onClick={() => setActiveTab("public-log")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'public-log' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
               <Globe className="w-4 h-4" /> Public Log
            </button>
            <button onClick={() => setActiveTab("checked-in")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'checked-in' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
               <UserCheck className="w-4 h-4" /> Checked-In
            </button>
            <button onClick={() => setActiveTab("stats")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
               <ShieldAlert className="w-4 h-4" /> License & Price
            </button>
         </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10 relative z-10">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
               <h1 className="text-3xl font-black mb-1 text-slate-900">{data?.event?.name || 'Loading...'}</h1>
               <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{currentTitle}</p>
            </div>
            <div className="flex items-center gap-4 relative">
               <div className="relative group hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600" />
                  <input type="text" placeholder="Global Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-5 w-80 outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium text-slate-900 shadow-sm" />
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[50] overflow-hidden">
                         <div className="p-2 space-y-1">
                           {searchResults.map((a: any) => (
                             <button key={a._id} onClick={() => { setSelectedAttendee(a); setSearch(""); }} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all text-left">
                               <div><p className="font-bold text-slate-900 text-sm">{a.name}</p><p className="text-slate-500 text-[10px] uppercase font-bold">{a.passId}</p></div>
                               <ChevronRight className="w-4 h-4 text-slate-300" />
                             </button>
                           ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                  <PlusCircle className="w-4 h-4" /> New Pass
               </button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Total Passes</p>
               <p className="text-3xl font-black text-slate-900">{stats.total || 0}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Gate Checks</p>
               <p className="text-3xl font-black text-green-600">{stats.entered || 0}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Pending</p>
               <p className="text-3xl font-black text-orange-500">{stats.pending || 0}</p>
            </div>
            <div className="bg-blue-600 border border-blue-700 p-6 rounded-2xl shadow-lg relative overflow-hidden">
               <CreditCard className="absolute -right-2 -bottom-2 w-20 h-20 text-blue-500 opacity-20" />
               <p className="text-[10px] font-bold text-blue-100 uppercase mb-2">Event Revenue</p>
               <p className="text-3xl font-black text-white">{priceData.currency} {totalPaidRevenue.toLocaleString()}</p>
            </div>
         </div>

         {/* Content Tabs */}
         <div className="space-y-6">
            {(activeTab === 'attendees' || activeTab === 'instant-log' || activeTab === 'public-log' || activeTab === 'checked-in') && (
               <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold">
                              <th className="px-6 py-4">Attendee</th>
                              <th className="px-6 py-4">Contact</th>
                              <th className="px-6 py-4">Payment</th>
                              <th className="px-6 py-4">Pass ID</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {currentPasses?.map((attendee: any) => (
                              <tr key={attendee._id} onClick={() => setSelectedAttendee(attendee)} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                 <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${attendee.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                                          {attendee.name.charAt(0)}
                                       </div>
                                       <div>
                                          <p className="font-bold text-slate-900">{attendee.name}</p>
                                          <p className="text-slate-500 text-[10px]">{attendee.company}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-5 text-xs text-slate-600">
                                    {attendee.email}<br/><span className="text-[10px] font-bold opacity-50">{attendee.phone}</span>
                                 </td>
                                 <td className="px-6 py-5">
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase ${attendee.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                       {attendee.paymentStatus === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                       {attendee.paymentStatus || 'Pending'}
                                    </div>
                                 </td>
                                 <td className="px-6 py-5 font-mono text-xs font-bold text-blue-600">{attendee.passId}</td>
                                 <td className="px-6 py-5 text-right"><ChevronRight className="w-4 h-4 ml-auto text-slate-300" /></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'stats' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* License Card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                     <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" /> License Consumption
                     </h3>
                     <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.total / 1000) * 100}%` }} className="h-full bg-blue-600" />
                     </div>
                     <p className="text-xs font-bold text-slate-500 text-right">{stats.total} / 1000 Passes Used</p>
                  </div>

                  {/* Pricing Settings Card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                     <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" /> Ticket Pricing Settings
                     </h3>
                     <div className="space-y-4">
                        <div className="flex gap-4">
                           <div className="flex-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Currency</label>
                              <select 
                                value={priceData.currency} 
                                onChange={(e) => setPriceData({...priceData, currency: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 mt-1 outline-none font-bold"
                              >
                                 <option value="INR">INR (₹)</option>
                                 <option value="USD">USD ($)</option>
                                 <option value="AED">AED (د.إ)</option>
                              </select>
                           </div>
                           <div className="flex-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Base Price</label>
                              <div className="relative mt-1">
                                 <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                 <input 
                                   type="number" 
                                   value={priceData.ticketPrice} 
                                   onChange={(e) => setPriceData({...priceData, ticketPrice: Number(e.target.value)})}
                                   className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none font-bold"
                                 />
                              </div>
                           </div>
                        </div>
                        <button 
                          onClick={handleUpdatePrice}
                          disabled={updatingPrice}
                          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                           {updatingPrice ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Pricing Changes'}
                        </button>
                        <p className="text-[10px] text-slate-400 font-medium italic text-center">Note: Price changes only apply to future registrations.</p>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </main>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedAttendee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAttendee(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
                <div className="w-full md:w-2/5 bg-slate-50 border-r border-slate-100 p-10 flex flex-col items-center justify-center text-center">
                   <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-xl border border-slate-200 mb-6"><QrCode className="w-full h-full text-slate-900" /></div>
                   <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4">Official Event Pass</h3>
                   <code className="text-2xl font-mono font-black text-slate-900 bg-white px-6 py-3 rounded-2xl border border-slate-200">{selectedAttendee.passId}</code>
                </div>
                <div className="flex-1 p-10 md:p-14 relative">
                   <button onClick={() => setSelectedAttendee(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X className="w-6 h-6" /></button>
                   <div className="space-y-8">
                      <div>
                         <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${selectedAttendee.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            {selectedAttendee.paymentStatus === 'paid' ? 'Transaction Verified' : 'Payment Required'}
                         </div>
                         <h2 className="text-4xl font-black text-slate-900 mt-2">{selectedAttendee.name}</h2>
                         <p className="text-slate-500 font-medium">{selectedAttendee.designation} at {selectedAttendee.company}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                         <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Payment ID</p><p className="font-bold text-slate-900 break-all">{selectedAttendee.razorpayPaymentId || 'N/A'}</p></div>
                         <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Amount Received</p><p className="font-bold text-slate-900">{priceData.currency} {selectedAttendee.amountPaid || 0}</p></div>
                         <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Email</p><p className="font-bold text-slate-900">{selectedAttendee.email}</p></div>
                         <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Phone</p><p className="font-bold text-slate-900">{selectedAttendee.phone}</p></div>
                      </div>
                      <div className="pt-8 border-t border-slate-100 flex justify-between">
                         <button onClick={() => handleDeleteVisitor(selectedAttendee._id, selectedAttendee.name)} className="text-red-400 hover:text-red-600 font-bold text-xs"><Trash2 className="w-4 h-4 inline mr-1" /> Delete Pass</button>
                         <button onClick={() => triggerPrint(selectedAttendee)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Printer className="w-4 h-4" /> Print</button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      ...
