"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, Printer, CheckCircle2 } from "lucide-react";
import { PLANS } from "@/lib/plans";

export default function InvoicePage() {
  const params = useParams();
  const [data, setData] = useState<{ transaction: any; organizer: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const id = await Promise.resolve(params.id);
        const res = await fetch(`/api/admin/transactions/${id}`);
        if (!res.ok) throw new Error("Could not fetch invoice details");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">!</div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Invoice Not Found</h2>
          <p className="text-slate-500">{error || "The requested invoice could not be located."}</p>
      </div>
    </div>
  );

  const { transaction: tx, organizer } = data;
  const planName = (PLANS as any)[tx.planId]?.name || tx.planId.toUpperCase();
  const invoiceNumber = `INV-${tx.razorpayOrderId.replace('order_', '').substring(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-100 font-sans py-12 px-4 print:py-0 print:bg-white flex flex-col items-center">
      
      {/* Top action bar - Hidden during print */}
      <div className="max-w-4xl w-full flex justify-end mb-6 print:hidden">
         <button onClick={() => window.print()} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
            <Printer className="w-4 h-4" /> Print Invoice
         </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-12 print:shadow-none print:p-0 print:rounded-none">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-16">
          <div>
            <div className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
               <img src="/passnexus_logo.png" alt="PassNexus Logo" className="w-10 h-10 object-contain grayscale" />
               PassNexus
            </div>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              455 Capitol Mall<br/>
              Suite 1150A<br/>
              Sacramento, California (CA) 95814<br/>
              hello@passnexus.in
            </p>
          </div>
          
          <div className="text-right">
             <h1 className="text-4xl font-black text-slate-200 mb-2 print:text-slate-400">INVOICE</h1>
             <p className="text-slate-900 font-bold mb-1">Receipt #: {invoiceNumber}</p>
             <p className="text-slate-500 font-medium text-sm">Date: {new Date(tx.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
             {tx.status === 'success' && (
                 <div className="inline-flex mt-4 items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold print:border-black print:text-black">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                 </div>
             )}
          </div>
        </div>

        {/* Billed To */}
        <div className="grid grid-cols-2 gap-12 mb-16 pt-8 border-t border-slate-100">
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</p>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{organizer.name}</h3>
              {organizer.companyName && <p className="text-slate-600 mb-1 font-medium">{organizer.companyName}</p>}
              <p className="text-slate-500 text-sm">{organizer.email}</p>
           </div>
           
           <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Payment Details</p>
              <p className="text-slate-600 font-medium mb-1">Razorpay ID:</p>
              <p className="text-slate-500 text-sm break-all font-mono">{tx.razorpayPaymentId}</p>
           </div>
        </div>

        {/* Invoice Table */}
        <div className="mb-16">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="border-b-2 border-slate-900 text-slate-900 text-sm uppercase tracking-wider">
                 <th className="py-4 px-2 font-black">Description</th>
                 <th className="py-4 px-2 font-black text-center text-slate-500">Qty</th>
                 <th className="py-4 px-2 font-black text-right text-slate-500">Unit Price</th>
                 <th className="py-4 px-2 font-black text-right">Amount</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
               <tr>
                 <td className="py-6 px-2">
                    <p className="font-bold text-slate-900 text-base mb-1">PassNexus {planName} Plan</p>
                    <p className="text-slate-500">Plan upgrade including increased event limits and standard premium features.</p>
                 </td>
                 <td className="py-6 px-2 text-center font-medium">1</td>
                 <td className="py-6 px-2 text-right font-medium">₹{tx.amount.toLocaleString()}</td>
                 <td className="py-6 px-2 text-right font-black text-slate-900">₹{tx.amount.toLocaleString()}</td>
               </tr>
            </tbody>
          </table>
          
          <div className="flex justify-end pt-6 border-t-2 border-slate-900">
             <div className="w-64">
                <div className="flex justify-between py-2 text-sm text-slate-600 font-medium">
                   <span>Subtotal</span>
                   <span>₹{tx.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-sm text-slate-600 font-medium border-b border-slate-200">
                   <span>Tax (Included)</span>
                   <span>₹0.00</span>
                </div>
                <div className="flex justify-between py-4 text-xl font-black text-slate-900">
                   <span>Total</span>
                   <span>₹{tx.amount.toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-8 mt-16 text-center text-sm text-slate-400">
           <p className="font-bold text-slate-500 mb-2">Thank you for your business.</p>
           <p>This is a computer-generated document. No signature is required.</p>
        </div>

      </div>
    </div>
  );
}
