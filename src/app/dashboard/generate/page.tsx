'use client';

import { useState } from 'react';
import { 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Table, 
  Loader2, 
  ChevronLeft,
  RefreshCw,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BulkGeneratePage() {
  const [step, setStep] = useState(1); // 1: Input, 2: Preview, 3: Success
  const [csvData, setCsvData] = useState('');
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const parseCsv = () => {
    setError('');
    const rows = csvData.split('\n').filter(row => row.trim());
    if (rows.length < 2) {
      setError('Please provide at least a header and one data row.');
      return;
    }

    const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
    const data = rows.slice(1).map(row => {
      const values = row.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });

    // Simple validation
    if (!data.every(row => row.name && row.email)) {
      setError('All rows must contain at least a "name" and "email" field.');
      return;
    }

    setAttendees(data);
    setStep(2);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendees }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Generation failed');
      
      setResult(json);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto pb-20">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bulk Generation</h1>
        <p className="text-slate-500 font-medium">Generate hundreds of secure passes in seconds.</p>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 pt-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${
                step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-blue-600' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-4 text-blue-600">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Table size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight">Required Format</p>
                    <p className="text-xs font-bold text-blue-500 opacity-80">name, email, phone, designation</p>
                  </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                  Download Template
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Paste CSV Data</label>
                <textarea 
                  className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono text-sm shadow-inner"
                  placeholder="name,email,phone,designation&#10;John Doe,john@example.com,+91987654321,Guest&#10;Jane Smith,jane@example.com,+91888777666,Exhibitor"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-3">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button 
                onClick={parseCsv}
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 transition-all group"
              >
                Validate Data <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100"
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Preview Attendees</h3>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                  {attendees.length} Records Found
                </span>
              </div>

              <div className="max-h-96 overflow-y-auto rounded-3xl border border-slate-50">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attendees.map((att, i) => (
                      <tr key={i} className="text-sm">
                        <td className="px-6 py-4 font-bold text-slate-900">{att.name}</td>
                        <td className="px-6 py-4 font-medium text-slate-500">{att.email}</td>
                        <td className="px-6 py-4 font-black uppercase text-blue-500 text-[10px] tracking-tight">
                          {att.designation || 'Visitor'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="w-1/3 h-16 border border-slate-200 text-slate-500 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>Process & Generate <Download size={20} /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-slate-100 text-center"
          >
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Batch Processed!</h2>
            <p className="text-slate-500 font-medium mb-12 max-w-sm mx-auto">
              We've successfully generated <span className="text-blue-600 font-black">{result?.count}</span> digital passes. Attendees will receive their credentials via email.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setStep(1); setCsvData(''); setAttendees([]); }}
                className="h-16 border border-slate-200 text-slate-500 rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                <RefreshCw size={20} /> Start New
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard/visitors'}
                className="h-16 bg-slate-900 text-white rounded-[2rem] font-black flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
              >
                View Attendees <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
