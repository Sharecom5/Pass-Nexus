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
  DollarSign,
  MapPin
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
        // Update stats on client side as well
        setData((prev: any) => ({
          ...prev,
          stats: {
            ...prev.stats,
            total: prev.stats.total - 1,
            pending: prev.stats.total - 1 - prev.stats.entered // Recalculate pending
          }
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

   const currentPasses = activeTab === 'checked-in'
        ? checkedInFilteredAttendees
        : mainFilteredAttendees;

  const currentTitle = activeTab === 'checked-in'
        ? 'Official Entry Log'
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

      {/* Sidebar (Simple Desktop Navigation) */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6 z-20 shadow-sm">
         <Link href="/pass" className="flex items-center gap-3 group font-sans mb-10 px-2">
          <img src="/icon.png" alt="PassNexus" className="w-8 h-8 object-contain" />
          <span className="font-black text-slate-900 text-lg tracking-tight">Pass<span className="text-blue-600">Nexus</span></span>
        </Link>

         <nav className="space-y-1">
            <button 
               onClick={() => setActiveTab("attendees")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'attendees' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
               <Users className="w-4 h-4" /> Attendees
            </button>
            <button 
               onClick={() => setActiveTab("instant-badge")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'instant-badge' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
               <Printer className="w-4 h-4" /> Instant Badge
            </button>
            <button 
               onClick={() => setActiveTab("checked-in")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'checked-in' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
               <UserCheck className="w-4 h-4" /> Entry Log
            </button>
            <button 
               onClick={() => setActiveTab("stats")}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
               <Settings className="w-4 h-4" /> License & Price
            </button>
         </nav>

         <div className="mt-auto pt-10 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 font-bold transition-all" onClick={() => router.push('/admin/login')}>
               <LogOut className="w-4 h-4" /> Logout
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10 relative z-10">
         {/* Top Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
               <h1 className="text-3xl font-black mb-1 text-slate-900">{data?.event?.name || 'Loading...'}</h1>
               <p className="text-slate-500 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                 Admin Dashboard <ChevronRight className="w-3.5 h-3.5 opacity-40" /> {currentTitle}
               </p>
               {data?.event && (
                 <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
                   <div className="flex items-center gap-2 bg-blue-50 w-max px-3 py-1.5 rounded-xl border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Lock className="w-3 h-3" /> Gate Scanner PIN:
                      </span>
                      <code className="text-sm font-mono font-black text-slate-900 tracking-wider">
                        {data.event.checkinPin || '1234'}
                      </code>
                   </div>

                   <div className="flex items-center gap-2 bg-slate-50 w-max pr-1.5 pl-3 py-1.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> Public link:
                      </span>
                      <a href={`/pass/${slug}`} target="_blank" rel="noreferrer" className="text-sm font-mono font-bold text-blue-600 hover:text-blue-700 hover:underline tracking-tight ml-1 mr-2">
                         /{slug}
                      </a>
                      <button 
                        onClick={handleCopyLink} 
                        className={`p-1.5 rounded-lg transition-all border ${copied ? 'bg-green-100 border-green-200 text-green-700 scale-105' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                        title="Copy Public Link"
                      >
                         {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                   </div>
                 </div>
               )}
            </div>
            <div className="flex items-center gap-4 relative">
               <div className="relative group hidden md:block">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Global Search..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-5 w-80 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-900 shadow-sm"
                  />
                  
                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-[50] overflow-hidden"
                      >
                         <div className="p-2 space-y-1">
                           {searchResults.map((a: any) => (
                             <button 
                               key={a._id}
                               onClick={() => { setSelectedAttendee(a); setSearch(""); }}
                               className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all text-left group"
                             >
                               <div>
                                 <p className="font-bold text-slate-900 text-sm">{a.name}</p>
                                 <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{a.passId}</p>
                               </div>
                               <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                             </button>
                           ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               <button 
                onClick={() => { setRefreshing(true); fetchData(); }}
                disabled={refreshing}
                className="bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 transition-all text-slate-600 shadow-sm"
               >
                  <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
               </button>
               <button 
                 onClick={() => setShowAddModal(true)}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
               >
                  <PlusCircle className="w-4 h-4" /> New Pass
               </button>
               <button 
                 onClick={handleExport}
                 className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-bold flex items-center gap-2 border border-slate-200 shadow-sm transition-all"
               >
                  <Download className="w-4 h-4" /> Export CSV
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
         </div>

         {/* Section Content */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-slate-900">{currentTitle}</h2>
               
               {activeTab === 'attendees' && (
                  <div className="flex items-center gap-2">
                     <div className="bg-slate-50 border border-slate-200 rounded-xl p-1 flex items-center">
                        <button 
                           onClick={() => setFilter("all")}
                           className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           All
                        </button>
                        <button 
                           onClick={() => setFilter("entered")}
                           className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'entered' ? 'bg-green-100 text-green-700 shadow-sm border border-green-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           Entered
                        </button>
                        <button 
                           onClick={() => setFilter("pending")}
                           className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'pending' ? 'bg-orange-100 text-orange-700 shadow-sm border border-orange-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           Pending
                        </button>
                     </div>
                  </div>
               )}
            </div>

            {/* List View */}
            {(activeTab === 'attendees' || activeTab === 'instant-log' || activeTab === 'public-log' || activeTab === 'checked-in') && (
               <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold">
                              <th className="px-6 py-4">Attendee Info</th>
                              <th className="px-6 py-4">Contact Details</th>
                              {activeTab === 'checked-in' && <th className="px-6 py-4">Entry Time</th>}
                              <th className="px-6 py-4">Pass ID</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           <AnimatePresence>
                              {currentPasses?.map((attendee: any, i: number) => (
                                 <motion.tr 
                                   key={attendee._id}
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   transition={{ delay: i * 0.05 }}
                                   onClick={() => setSelectedAttendee(attendee)}
                                   className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                 >
                                    <td className="px-6 py-5">
                                       <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black border group-hover:scale-105 transition-transform ${attendee.registrationSource === 'public' ? 'bg-purple-50 text-purple-600 border-purple-100' : attendee.registrationSource === 'instant' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                             {attendee.name.charAt(0)}
                                          </div>
                                          <div>
                                             <p className="font-bold text-slate-900 text-base leading-none mb-1">{attendee.name}</p>
                                             <p className="text-slate-500 text-xs font-medium">{attendee.company || "No Company"}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-700">
                                       <p className="font-medium text-xs">{attendee.email}</p>
                                       <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">{attendee.phone}</p>
                                    </td>
                                    {activeTab === 'checked-in' && (
                                       <td className="px-6 py-5">
                                          <div className="flex items-center gap-2 text-green-600 font-black text-xs">
                                             <Clock className="w-3 h-3" />
                                             {attendee.enteredAt ? new Date(attendee.enteredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just Now'}
                                          </div>
                                       </td>
                                     )}
                                    <td className="px-6 py-5">
                                       <code className="text-blue-600 font-mono text-xs font-bold tracking-tight bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                          {attendee.passId}
                                       </code>
                                    </td>
                                    <td className="px-6 py-5 text-right"><ChevronRight className="w-4 h-4 ml-auto text-slate-300" /></td>
                                 </motion.tr>
                              ))}
                           </AnimatePresence>
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'instant-badge' && (
               <div className="bg-white border border-slate-200 p-8 md:p-16 text-center rounded-3xl shadow-sm flex flex-col items-center justify-center">
                  <Printer className="w-16 h-16 text-blue-100 mb-6" />
                  <h2 className="text-2xl font-black text-slate-900 mb-3">Instant Name Badge</h2>
                  <p className="text-slate-500 max-w-md font-medium mb-8">Generate a minimal, print-friendly badge for walk-ins with no background. Automatically registers the attendee and launches the print dialog.</p>
                  
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setAdding(true);
                    try {
                      const res = await fetch("/api/register", { 
                        method: "POST", 
                        headers: { "Content-Type": "application/json" }, 
                        body: JSON.stringify({ 
                          ...newAttendee,
                          eventSlug: slug, 
                          passType: 'Instant Badge',
                          registrationSource: 'instant',
                          paymentStatus: 'paid'
                        }) 
                      });
                      const d = await res.json();
                      if (!res.ok) throw new Error(d.error);
                      
                      triggerPrint({ ...newAttendee, passId: d.passId, qrCodeUrl: d.qrCodeUrl });
                      setNewAttendee({ name: "", email: "", phone: "", company: "", designation: "" });
                      fetchData();
                    } catch(err: any) { 
                      alert("Failed to generate: " + err.message); 
                    } finally { 
                      setAdding(false); 
                    }
                  }} className="w-full max-w-2xl space-y-4 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required placeholder="Name" value={newAttendee.name} onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold" />
                      <input required type="email" placeholder="Email" value={newAttendee.email} onChange={(e) => setNewAttendee({...newAttendee, email: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required placeholder="Phone" value={newAttendee.phone} onChange={(e) => setNewAttendee({...newAttendee, phone: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold" />
                      <input required placeholder="Company" value={newAttendee.company} onChange={(e) => setNewAttendee({...newAttendee, company: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold" />
                    </div>
                    <button type="submit" disabled={adding} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-md mt-6 disabled:opacity-50">
                      {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Printer className="w-5 h-5 ml-2 inline"/> Generate & Print Badge</>}
                    </button>
                  </form>
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
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${(stats.total / (data?.planLimit || 100)) * 100}%` }} 
                          className="h-full bg-blue-600" 
                        />
                     </div>
                     <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                           {Math.max(0, (data?.planLimit || 0) - stats.total)} Passes Remaining
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 text-right">
                           {stats.total} / {data?.planLimit || '∞'} Used
                        </p>
                     </div>
                  </div>
               </div>
            )}
          </div>
       </main>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedAttendee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-slate-900">
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
                         <h2 className="text-4xl font-black text-slate-900 mt-2">{selectedAttendee.name}</h2>
                         <p className="text-slate-500 font-medium">{selectedAttendee.designation} at {selectedAttendee.company}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                         <div><p className="text-[10px] font-black uppercase text-slate-400 mb-1">Email</p><p className="font-bold text-slate-900 text-xs">{selectedAttendee.email}</p></div>
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

      {/* Add Attendee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-slate-900">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} className="relative z-10 bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-black text-slate-900">{successPassId ? "Pass Generated!" : "Manual Pass Generation"}</h2>
                <button onClick={() => { setShowAddModal(false); setSuccessPassId(null); }} className="text-slate-500 p-2 rounded-xl border border-slate-200"><X className="w-5 h-5" /></button>
              </div>

               {successPassId ? (
                <div className="p-10 text-center space-y-8 bg-white">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-100 mb-2">
                     <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-slate-900">Pass Generated!</h3>
                     <p className="text-slate-500 font-medium">The pass for {newAttendee.name || 'the attendee'} is ready to use.</p>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left ml-2">Secure Pass ID</p>
                     <code className="text-3xl font-mono font-black text-blue-600 block bg-white py-4 rounded-2xl border border-blue-100 shadow-sm">{successPassId}</code>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => {
                        triggerPrint({ ...newAttendee, passId: successPassId });
                       }}
                       className="bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
                     >
                        <Printer className="w-5 h-5" /> Print Pass
                     </button>
                     <button 
                       onClick={() => { setShowAddModal(false); setSuccessPassId(null); }}
                       className="bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95"
                     >
                        Go Back
                     </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddAttendee} className="p-10 space-y-6">
                  <div className="space-y-4">
                    <div className="group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block group-focus-within:text-blue-600 transition-colors">Name & Organization</label>
                       <div className="grid grid-cols-2 gap-3">
                          <input required placeholder="Enter Name" value={newAttendee.name} onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                          <input required placeholder="Organization" value={newAttendee.company} onChange={(e) => setNewAttendee({...newAttendee, company: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                       </div>
                    </div>
                    <div className="group">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block group-focus-within:text-blue-600 transition-colors">Contact Information</label>
                       <div className="grid grid-cols-2 gap-3">
                          <input required type="email" placeholder="Email Address" value={newAttendee.email} onChange={(e) => setNewAttendee({...newAttendee, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                          <input required placeholder="Mobile Number" value={newAttendee.phone} onChange={(e) => setNewAttendee({...newAttendee, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                       </div>
                    </div>
                  </div>
                  <button type="submit" disabled={adding} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                     {adding ? <Loader2 className="animate-spin h-6 w-6"/> : <><PlusCircle className="w-5 h-5"/> Generate Digital Pass</>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Print Layout */}
      {printData && (
        <div className="hidden print:block fixed inset-0 bg-white z-[99999]">
          <style dangerouslySetInnerHTML={{ __html: `
            @page { margin: 0; size: 3.5in 2.25in; }
            @media print {
              body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
              .no-print { display: none !important; }
            }
          `}} />
          <div className="w-[3.5in] h-[2.25in] flex flex-col items-center justify-center text-center p-4 bg-white text-black overflow-hidden m-0">
             <h1 className="text-3xl font-black uppercase text-black leading-none mb-1">{printData.name}</h1>
             {printData.company && <h2 className="text-base font-bold text-gray-800 leading-tight">{printData.company}</h2>}
             {printData.qrCodeUrl && (
               <img 
                 src={printData.qrCodeUrl} 
                 alt="QR Code" 
                 className="w-[1in] h-[1in] mt-2 mb-1 border border-gray-100 p-0.5" 
               />
             )}
             <span className="text-[10px] font-mono font-bold text-black tracking-tighter">{printData.passId}</span>
          </div>
        </div>
      )}
    </div>
  );
}
