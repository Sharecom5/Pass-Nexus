"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, Loader2, LogOut, ChevronLeft, Download, FileText, Globe, Calendar, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { PLANS } from "@/lib/plans";

export default function BillingDashboard() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/admin/transactions");
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (err: any) { 
        setError(err.message); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

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
          <img src="/passnexus_logo.png" alt="PassNexus" className="w-8 h-8 object-contain" onError={(e: any) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          <div style={{display:'none'}} className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center text-white font-bold">P</div>
          <span className="font-black text-slate-900 text-lg tracking-tight">Pass<span className="text-blue-600">Nexus</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })} title="Sign Out"
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
             <CreditCard className="w-8 h-8 text-blue-600" /> Billing & Invoices
          </h1>
          <p className="text-slate-500">View your payment history and download invoices.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 border border-red-200 rounded-xl mb-6 font-medium">
                {error}
            </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500 font-black">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Plan Name</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Invoice</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center">
                                        <FileText className="w-10 h-10 mb-3 text-slate-300" />
                                        <p className="font-bold text-slate-500">No transactions found</p>
                                        <p className="text-sm">You haven't made any purchases yet.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={tx._id} 
                                    className="hover:bg-slate-50/50 transition-colors"
                                >
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium whitespace-nowrap text-slate-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {new Date(tx.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                            {(PLANS as any)[tx.planId]?.name || tx.planId.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black whitespace-nowrap text-slate-900">
                                        ₹{tx.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {tx.status === 'success' ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600">
                                                <div className="w-2 h-2 rounded-full bg-green-500" /> Successful
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
                                                <div className="w-2 h-2 rounded-full bg-red-500" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {tx.status === 'success' && (
                                            <Link href={`/admin/dashboard/billing/invoice/${tx._id}`} target="_blank"
                                                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
                                            >
                                                <Download className="w-4 h-4" /> Download
                                            </Link>
                                        )}
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}
