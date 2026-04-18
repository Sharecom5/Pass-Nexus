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
  QrCode
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

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
    name: "", email: "", phone: "", company: "", designation: "", passType: "Walk-in Badge"
  });
  const [copied, setCopied] = useState(false);
  const [printData, setPrintData] = useState<any>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/${slug}`);
      if (!res.ok) throw new Error("Could not fetch admin data");
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [slug]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${slug}`;
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
          registrationSource: 'manual'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Registration failed");
      
      setSuccessPassId(data.passId);
      setNewAttendee({ name: "", email: "", phone: "", company: "", designation: "", passType: "Walk-in Badge" });
      
      setData((prev: any) => ({
        ...prev,
        stats: {
          ...prev.stats,
          total: (prev.stats.total || 0) + 1,
          pending: (prev.stats.pending || 0) + 1
        }
      }));

      fetchData();
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
        setData((prev: any) => ({
          ...prev,
          stats: {
            ...prev.stats,
            total: Math.max(0, (prev.stats.total || 0) - 1),
            pending: Math.max(0, (prev.stats.pending || 0) - 1)
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
    
    const headers = ["PassID", "Name", "Email", "Phone", "Company", "PassType", "Status", "EnteredAt", "Source"];
    const rows = data.attendees.map((a: any) => [
      a.passId,
      a.name,
      a.email,
      a.phone,
      a.company || "",
      a.passType,
      a.status,
      a.enteredAt || "",
      a.registrationSource || "manual"
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
    if (filter === "walkin") return matchesSearch && (a.registrationSource === "instant" || a.passType === "Instant Badge" || a.passType === "Walk-in Badge" || a.passType === "VIP");
    return matchesSearch;
  });

  const searchResults = search.length > 1 ? filteredAttendees?.slice(0, 5) : [];

  const mainFilteredAttendees = filteredAttendees;
  const instantFilteredAttendees = filteredAttendees?.filter((a: any) => a.registrationSource === 'instant' || a.passType === 'Instant Badge' || a.passType === 'Walk-in Badge' || a.passType === 'VIP');
  const publicFilteredAttendees = filteredAttendees?.filter((a: any) => a.registrationSource === 'public');
  const checkedInFilteredAttendees = filteredAttendees?.filter((a: any) => a.status === 'entered');

  const currentPasses = activeTab === 'instant-badge' 
    ? instantFilteredAttendees 
    : activeTab === 'public-log' 
      ? publicFilteredAttendees 
      : activeTab === 'checked-in'
        ? checkedInFilteredAttendees
        : mainFilteredAttendees;

  const currentTitle = activeTab === 'instant-badge'
    ? 'Walk-Ins Database'
    : activeTab === 'public-log'
      ? 'Public Registration Log'
      : activeTab === 'checked-in'
        ? 'Real-time Checked-In Log'
        : 'Attendee Management';

  const stats = data?.stats || { total: 0, entered: 0, pending: 0 };

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
         </nav>

         <div className="mt-auto pt-10 border-t border-slate-100">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 font-bold transition-all">
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
                      <a href={`/${slug}`} target="_blank" rel="noreferrer" className="text-sm font-mono font-bold text-blue-600 hover:text-blue-700 hover:underline tracking-tight ml-1 mr-2">
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
                    placeholder="Global Search: Pass ID, Name..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-5 w-80 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-900 shadow-sm"
                  />
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
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                     <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Total Registrations</span>
               </div>
               <p className="text-4xl font-black text-slate-900">{stats.total || 0}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                     <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Gate Checks</span>
               </div>
               <p className="text-4xl font-black text-slate-900">{stats.entered || 0}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                     <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Pending Entry</span>
               </div>
               <p className="text-4xl font-black text-slate-900">{stats.pending || 0}</p>
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
                        <button 
                           onClick={() => setFilter("walkin")}
                           className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'walkin' ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           Walk-ins
                        </button>
                     </div>
                  </div>
               )}
            </div>

            {/* List View */}
            {(activeTab === 'attendees' || activeTab === 'checked-in') && (
               <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                              <th className="px-6 py-4">Attendee Info</th>
                              <th className="px-6 py-4">Contact Details</th>
                              {activeTab === 'checked-in' && <th className="px-6 py-4">Entry Time</th>}
                              <th className="px-6 py-4">Pass ID</th>
                              {activeTab === 'attendees' && <th className="px-6 py-4 text-center">Source</th>}
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
                                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black border group-hover:scale-105 transition-transform ${attendee.registrationSource === 'public' ? 'bg-purple-50 text-purple-600 border-purple-100' : (attendee.registrationSource === 'instant' || attendee.passType === 'VIP' || attendee.passType === 'Walk-in Badge') ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                             {attendee.name.charAt(0)}
                                          </div>
                                          <div>
                                             <p className="font-bold text-slate-900 text-base leading-none mb-1">{attendee.name}</p>
                                             <p className="text-slate-500 text-xs font-medium">{attendee.company || "No Company"}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-5">
                                       <p className="text-slate-700 font-medium">{attendee.email}</p>
                                       <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tight opacity-50">{attendee.phone}</p>
                                    </td>
                                    {activeTab === 'checked-in' && (
                                       <td className="px-6 py-5">
                                          <div className="flex items-center gap-2 text-green-600 font-black text-xs">
                                             <Clock className="w-3 h-3" />
                                             {attendee.enteredAt ? new Date(attendee.enteredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                                          </div>
                                       </td>
                                    )}
                                    <td className="px-6 py-5">
                                       <code className="text-blue-600 font-mono text-xs font-bold tracking-tight bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                                          {attendee.passId}
                                       </code>
                                    </td>
                                    {activeTab === 'attendees' && (
                                       <td className="px-6 py-5 text-center">
                                          <div className={`text-[9px] font-black uppercase tracking-wider inline-flex px-2 py-1 rounded-md ${attendee.registrationSource === 'public' ? 'bg-purple-50 text-purple-700 border border-purple-100' : (attendee.registrationSource === 'instant' || attendee.passType === 'VIP') ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
                                             {attendee.passType === 'VIP' ? 'VIP PASS' : (attendee.registrationSource === 'instant' ? 'Walk-in' : (attendee.registrationSource || 'Manual'))}
                                          </div>
                                       </td>
                                    )}
                                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                       <div className="flex items-center justify-end gap-2">
                                         <button 
                                           onClick={() => triggerPrint(attendee)}
                                           className="bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                                         >
                                             <Printer className="w-3.5 h-3.5" /> Print
                                         </button>
                                         <button 
                                           onClick={() => window.open(`/${slug}/${attendee.passId}`, '_blank')}
                                           className="bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                                         >
                                             <Ticket className="w-3.5 h-3.5" /> View
                                         </button>
                                       </div>
                                    </td>
                                 </motion.tr>
                              ))}
                           </AnimatePresence>
                           {currentPasses?.length === 0 && (
                               <tr>
                                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500 bg-slate-50/50">
                                     <div className="flex flex-col items-center justify-center">
                                       <Search className="w-8 h-8 text-slate-300 mb-3" />
                                       <p className="font-medium text-slate-500 italic">No attendees found in this log selection.</p>
                                     </div>
                                  </td>
                               </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'instant-badge' && (
               <div className="space-y-8">
                 {/* Generation Form Card */}
                 <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
                   <Printer className="w-12 h-12 text-blue-100 mb-4" />
                   <h2 className="text-2xl font-black text-slate-900 mb-2">Walk-in Name Badge</h2>
                   <p className="text-slate-500 max-w-md font-medium mb-8">Generate a print-friendly badge for walk-ins. Automatically registers the attendee and launches the print dialog.</p>
                   
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
                            passType: newAttendee.passType || 'Walk-in Badge',
                            registrationSource: 'instant' 
                          }) 
                        });
                        const d = await res.json();
                        if (!res.ok) throw new Error(d.message || d.error || "Failed to generate");
                        
                        triggerPrint({ ...newAttendee, passId: d.passId, qrCodeUrl: d.qrCodeUrl });
                        
                        // ADD IMMEDIATE LOCAL FEEDBACK
                        setData((prev: any) => ({
                          ...prev,
                          attendees: [{ ...newAttendee, passId: d.passId, _id: d.passId, status: 'registered', registrationSource: 'instant', createdAt: new Date().toISOString() }, ...prev.attendees],
                          stats: {
                            ...prev.stats,
                            total: (prev.stats.total || 0) + 1,
                            pending: (prev.stats.pending || 0) + 1
                          }
                        }));

                        setNewAttendee({ name: "", email: "", phone: "", company: "", designation: "", passType: "Walk-in Badge" });
                        fetchData();
                     } catch(err: any) { 
                        alert("Failed to generate: " + err.message); 
                     } finally { 
                        setAdding(false); 
                     }
                   }} className="w-full max-w-2xl space-y-4 text-left">
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name *</label>
                         <input required placeholder="Attendee Name" value={newAttendee.name} onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 mt-1 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900" />
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address *</label>
                         <input required type="email" placeholder="Email@example.com" value={newAttendee.email} onChange={(e) => setNewAttendee({...newAttendee, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 mt-1 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900" />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone Number *</label>
                         <input required placeholder="Contact Number" value={newAttendee.phone} onChange={(e) => setNewAttendee({...newAttendee, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 mt-1 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900" />
                       </div>
                       <div>
                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Company *</label>
                         <input required placeholder="Organization" value={newAttendee.company} onChange={(e) => setNewAttendee({...newAttendee, company: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 mt-1 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900" />
                       </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Designation</label>
                          <input placeholder="e.g. Director" value={newAttendee.designation} onChange={(e) => setNewAttendee({...newAttendee, designation: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 mt-1 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 mb-2">Pass Category</label>
                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => setNewAttendee({...newAttendee, passType: 'Walk-in Badge'})}
                              className={`flex-1 py-3 px-4 rounded-xl font-bold text-[10px] transition-all border ${newAttendee.passType !== 'VIP' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                            >
                              STANDARD
                            </button>
                            <button 
                              type="button"
                              onClick={() => setNewAttendee({...newAttendee, passType: 'VIP'})}
                              className={`flex-1 py-3 px-4 rounded-xl font-bold text-[10px] transition-all border ${newAttendee.passType === 'VIP' ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                            >
                              VIP PASS
                            </button>
                          </div>
                        </div>
                      </div>
                     
                     <button type="submit" disabled={adding} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-md mt-6 disabled:opacity-50">
                       {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Printer className="w-5 h-5"/> Generate &amp; Print Badge</>}
                     </button>
                   </form>
                 </div>

                 {/* Walk-Ins Log */}
                 <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <ClipboardList className="w-5 h-5 text-orange-500" />
                       <h3 className="font-black text-slate-900 text-lg">Walk-Ins Database</h3>
                     </div>
                     <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                       {instantFilteredAttendees?.length || 0} badges
                     </span>
                   </div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead>
                         <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                           <th className="px-6 py-4">Attendee</th>
                           <th className="px-6 py-4">Contact</th>
                           <th className="px-6 py-4 text-center">Category</th>
                           <th className="px-6 py-4 text-right">Actions</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {instantFilteredAttendees?.length === 0 && (
                           <tr>
                             <td colSpan={4} className="px-6 py-16 text-center">
                               <div className="flex flex-col items-center gap-3 text-slate-400">
                                 <Printer className="w-8 h-8 text-slate-200" />
                                 <p className="font-medium italic">No walk-in badges generated yet.</p>
                               </div>
                             </td>
                           </tr>
                         )}
                         {instantFilteredAttendees?.map((attendee: any, i: number) => (
                           <motion.tr
                             key={attendee._id}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: i * 0.04 }}
                             onClick={() => setSelectedAttendee(attendee)}
                             className="hover:bg-orange-50/40 transition-colors cursor-pointer group"
                           >
                             <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                 <div className={`w-9 h-9 rounded-xl font-black flex items-center justify-center border ${attendee.passType === 'VIP' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{attendee.name.charAt(0)}</div>
                                 <div>
                                   <p className="font-bold text-slate-900">{attendee.name}</p>
                                   <p className="text-slate-400 text-xs">{attendee.designation || attendee.company || "—"}</p>
                                 </div>
                               </div>
                             </td>
                             <td className="px-6 py-4">
                               <p className="text-slate-700 font-medium text-sm">{attendee.email}</p>
                               <p className="text-slate-400 text-xs">{attendee.phone}</p>
                             </td>
                             <td className="px-6 py-4 text-center">
                               <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${attendee.passType === 'VIP' ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                                 {attendee.passType === 'VIP' ? 'VIP' : 'Standard'}
                               </span>
                             </td>
                             <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                               <div className="flex items-center justify-end gap-2">
                                 <button onClick={() => triggerPrint(attendee)} className="bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm">
                                   <Printer className="w-3.5 h-3.5" /> Print
                                 </button>
                                 <button onClick={() => window.open(`/${slug}/${attendee.passId}`, '_blank')} className="bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm">
                                   <Ticket className="w-3.5 h-3.5" /> View
                                 </button>
                               </div>
                             </td>
                           </motion.tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
            )}
         </div>
      </main>

      {/* Add Attendee Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative z-10 bg-white border border-slate-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{successPassId ? "Pass Generated!" : "Manual Pass Generation"}</h2>
                  <p className="text-slate-500 text-xs font-medium mt-1">
                    {successPassId ? "The attendee has been registered successfully." : "Add an attendee manually from the admin panel."}
                  </p>
                </div>
                <button 
                  onClick={() => { setShowAddModal(false); setSuccessPassId(null); }} 
                  className="bg-white hover:bg-slate-100 text-slate-500 p-2 rounded-xl transition-all border border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {successPassId ? (
                <div className="p-8 space-y-6 text-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-green-100 shadow-inner">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-500 font-bold text-sm">Unique Pass ID issued:</p>
                    <code className="text-2xl font-mono font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 inline-block shadow-sm">
                      {successPassId}
                    </code>
                  </div>
                  <div className="flex flex-col gap-3 pt-4">
                    <button 
                      onClick={() => window.open(`/${slug}/${successPassId}`, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Ticket className="w-5 h-5" /> Open Full Pass (Ticket)
                    </button>
                    <button 
                      onClick={() => {
                        const attendee = data?.attendees?.find((a: any) => a.passId === successPassId);
                        if (attendee) triggerPrint(attendee);
                      }}
                      className="bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Printer className="w-5 h-5" /> Print Instant Badge
                    </button>
                    <button 
                      onClick={() => { setShowAddModal(false); setSuccessPassId(null); }}
                      className="text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-widest pt-2 transition-colors"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddAttendee} className="p-8 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Doe" 
                        value={newAttendee.name}
                        onChange={(e) => setNewAttendee({...newAttendee, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com" 
                          value={newAttendee.email}
                          onChange={(e) => setNewAttendee({...newAttendee, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="tel" 
                          placeholder="+91..." 
                          value={newAttendee.phone}
                          onChange={(e) => setNewAttendee({...newAttendee, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Company</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Acme Corp" 
                          value={newAttendee.company}
                          onChange={(e) => setNewAttendee({...newAttendee, company: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Designation</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. Director" 
                          value={newAttendee.designation}
                          onChange={(e) => setNewAttendee({...newAttendee, designation: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Pass Category</label>
                    <select 
                      value={newAttendee.passType}
                      onChange={(e) => setNewAttendee({...newAttendee, passType: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-black text-slate-900 text-sm appearance-none cursor-pointer"
                    >
                      <option value="Walk-in Badge">Standard Delegate</option>
                      <option value="VIP">VIP Pass</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={adding}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <><PlusCircle className="w-5 h-5" /> Generate Manual Pass</>}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedAttendee && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedAttendee(null)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative z-10 bg-white border border-slate-200 w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]"
             >
                <div className="w-full md:w-2/5 bg-slate-50 border-r border-slate-100 p-10 flex flex-col items-center justify-center text-center">
                   <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-xl border border-slate-200 mb-6 group relative">
                      <QrCode className="w-full h-full text-slate-900 group-hover:scale-95 transition-transform" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => window.open(`/${slug}/${selectedAttendee.passId}`, '_blank')} className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
                            <ExternalLink className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                   <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Official Event Pass</h3>
                   <code className="text-2xl font-mono font-black text-slate-900 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
                      {selectedAttendee.passId}
                   </code>
                   <div className="mt-8 flex gap-3">
                      <button onClick={() => triggerPrint(selectedAttendee)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg">
                        <Printer className="w-4 h-4" /> Print
                      </button>
                   </div>
                </div>

                <div className="flex-1 p-10 md:p-14 relative">
                   <button onClick={() => setSelectedAttendee(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                   
                   <div className="space-y-10">
                      <div>
                         <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full border inline-block ${selectedAttendee.status === 'entered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                            {selectedAttendee.status === 'entered' ? 'Entry Confirmed' : 'Awaiting Check-in'}
                         </div>
                         <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mt-2">{selectedAttendee.name}</h2>
                         <p className="text-slate-500 text-lg font-medium mt-3">{selectedAttendee.designation || 'Special Guest'} at <span className="text-slate-900 font-bold">{selectedAttendee.company || 'Private Entity'}</span></p>
                      </div>

                      <div className="grid grid-cols-2 gap-10">
                         <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                            <p className="text-lg font-bold text-slate-900 flex items-center gap-2"><Mail className="w-4 h-4 opacity-30" /> {selectedAttendee.email}</p>
                         </div>
                         <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Number</p>
                            <p className="text-lg font-bold text-slate-900 flex items-center gap-2"><Phone className="w-4 h-4 opacity-30" /> {selectedAttendee.phone}</p>
                         </div>
                         <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registration Date</p>
                            <p className="text-lg font-bold text-slate-900 flex items-center gap-2"><Clock className="w-4 h-4 opacity-30" /> {new Date(selectedAttendee.createdAt || Date.now()).toLocaleDateString()}</p>
                         </div>
                         <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Source Entry</p>
                            <p className="text-lg font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                               {selectedAttendee.registrationSource === 'public' ? <Globe className="w-4 h-4 text-purple-500" /> : <User className="w-4 h-4 text-blue-500" />}
                               {selectedAttendee.registrationSource || 'Manual'}
                            </p>
                         </div>
                      </div>

                      <div className="pt-10 border-t border-slate-100 flex justify-between items-center">
                         <button onClick={() => handleDeleteVisitor(selectedAttendee._id, selectedAttendee.name)} className="text-red-400 hover:text-red-600 font-bold text-xs flex items-center gap-2 transition-colors">
                            <Trash2 className="w-4 h-4" /> Revoke Pass Access
                         </button>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-30">PassNexus Security Protocol v2.0</p>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Print Layout */}
      {printData && (
        <div className="hidden print:block fixed inset-0 bg-white z-[99999] p-0 m-0 overflow-visible">
          <style dangerouslySetInnerHTML={{ __html: `
            @page { 
              margin: 0; 
              size: 100mm 150mm !important; 
            }
            @media print {
              html, body {
                height: 150mm !important;
                width: 100mm !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                -webkit-print-color-adjust: exact;
                visibility: hidden !important;
              }
              .print-container { 
                visibility: visible !important;
                display: block !important;
                width: 100mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #fff !important;
              }
              .badge-page {
                page-break-after: always;
                height: 150mm !important;
                width: 100mm !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
              }
              .badge-page:last-child {
                page-break-after: auto;
              }
              .print-container * { 
                visibility: visible !important;
              }
            }
          `}} />
          <div className="print-container">
            {/* 1. Standard Pass */}
            <div className="badge-page">
              <div className="w-full flex flex-col items-center">
                {(data?.event as any)?.logoUrl && (
                  <img src={(data?.event as any).logoUrl} alt="Logo" className="w-24 h-24 object-contain mb-8 opacity-90" />
                )}

                {(data?.event as any)?.passSettings?.showName !== false && (
                  <h1 className={`${
                    printData.name && printData.name.length > 25 ? 'text-2xl' : 
                    printData.name && printData.name.length > 20 ? 'text-3xl' : 'text-4xl'
                  } font-black uppercase text-black leading-tight w-full mb-4 px-4 text-center`}>
                    {printData.name}
                  </h1>
                )}
                
                <div className="flex flex-col gap-2 mb-8 text-center px-4 w-full">
                  {((data?.event as any)?.passSettings?.showDesignation !== false && printData.designation) && (
                    <p className="text-xl font-bold text-blue-700 uppercase tracking-wide">
                      {printData.designation}
                    </p>
                  )}
                  {((data?.event as any)?.passSettings?.showCompany !== false && printData.company) && (
                    <p className="text-lg font-semibold text-slate-700 uppercase tracking-widest">
                      {printData.company}
                    </p>
                  )}
                </div>

                {printData.qrCodeUrl && (
                  <div className="bg-white p-2 rounded-xl mb-6 shadow-sm border border-slate-100">
                    <img src={printData.qrCodeUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                  </div>
                )}
                
                <div className="mt-4 flex flex-col items-center gap-1">
                  <span className="text-sm font-black text-slate-400 tracking-[0.3em] uppercase">{printData.passType || 'Attendee'}</span>
                  <span className="text-xs font-mono text-slate-300 font-bold uppercase">{printData.passId}</span>
                </div>
              </div>
            </div>

            {/* 2. Instant Badge */}
            <div className="badge-page border-[12px] border-black">
              <div className="w-full h-full flex flex-col items-center justify-between py-10">
                <div className="bg-black text-white w-full py-4 text-center">
                  <h2 className="text-3xl font-black tracking-tighter italic">INSTANT BADGE</h2>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center w-full px-6">
                  {(data?.event as any)?.passSettings?.showName !== false && (
                    <h1 className={`${
                      printData.name && printData.name.length > 25 ? 'text-3xl' : 
                      printData.name && printData.name.length > 20 ? 'text-4xl' : 'text-5xl'
                    } font-black uppercase text-black leading-none mb-6 text-center w-full px-2`}>
                      {printData.name}
                    </h1>
                  )}
                  
                  <div className="flex flex-col gap-3 mb-10 text-center w-full">
                    {((data?.event as any)?.passSettings?.showDesignation !== false && printData.designation) && (
                      <p className="text-2xl font-extrabold text-black uppercase">{printData.designation}</p>
                    )}
                    {((data?.event as any)?.passSettings?.showCompany !== false && printData.company) && (
                      <p className="text-xl font-bold text-black border-t-2 border-black pt-2 uppercase">{printData.company}</p>
                    )}
                  </div>

                  {printData.qrCodeUrl && (
                    <div className="mb-6">
                      <img src={printData.qrCodeUrl} alt="QR Code" className="w-44 h-44 object-contain grayscale" />
                    </div>
                  )}
                </div>

                <div className="w-full px-10">
                   <div className="h-1 bg-black w-full mb-2"></div>
                   <div className="flex justify-between items-center text-xs font-bold font-mono text-black">
                      <span>ID: {printData.passId}</span>
                      <span>DATE: {new Date().toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
