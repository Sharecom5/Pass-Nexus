"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CheckCircle2, XCircle, Loader2, UserCheck, Calendar, MapPin, Lock } from "lucide-react";
import Link from "next/link";

export default function PublicVerificationPage() {
  const { passId } = useParams();
  const router = useRouter();
  const [visitor, setVisitor] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  
  // PIN State
  const [showPinScreen, setShowPinScreen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const fetchPassData = async () => {
    try {
      const res = await fetch(`/api/pass/${passId}`);
      if (!res.ok) throw new Error("Pass not found or invalid");
      const data = await res.json();
      setVisitor(data.visitor);
      setEvent(data.eventSettings);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const attemptCheckIn = async (eventId: string, pin: string) => {
    setVerifying(true);
    setPinError("");
    try {
      const res = await fetch(`/api/pass/${passId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkinPin: pin })
      });
      const data = await res.json();
      
      if (res.status === 401) {
        // Invalid PIN
        localStorage.removeItem(`entryflow_pin_${eventId}`);
        setPinError("Invalid Check-in PIN. Please try again.");
        setShowPinScreen(true);
        setVerifying(false);
        return false;
      }
      
      if (!res.ok) throw new Error(data.error || "Check-in failed");
      
      // Success! Update local storage with valid PIN for fast subsequent scans
      localStorage.setItem(`entryflow_pin_${eventId}`, pin);
      setVisitor(data.visitor);
      setShowPinScreen(false);
      return true;
    } catch (err: any) {
      alert(err.message);
      return false;
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const initializeVerification = async () => {
      if (!passId) return;
      const data = await fetchPassData();
      
      if (data && data.visitor && data.eventSettings) {
        // If passenger is already entered, just show it
        if (data.visitor.status === "entered") {
          setLoading(false);
          return;
        }

        // It is not entered yet. Check if device has PIN saved
        const savedPin = localStorage.getItem(`entryflow_pin_${data.eventSettings._id}`);
        
        if (!savedPin) {
          // No PIN saved, show the PIN screen
          setShowPinScreen(true);
        }
      }
      setLoading(false);
    };

    initializeVerification();
  }, [passId]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 1) {
      setPinError("Please enter the PIN");
      return;
    }
    await attemptCheckIn(event._id, pinInput);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-blue-600 font-bold tracking-widest text-sm uppercase">Accessing Pass Data...</p>
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 border border-red-200 p-10 rounded-3xl max-w-sm w-full shadow-xl">
          <XCircle className="w-20 h-20 text-red-500 mb-6 mx-auto" />
          <h1 className="text-3xl font-black text-red-600 mb-2 uppercase">Invalid Pass</h1>
          <p className="text-slate-500 mb-8">This QR code does not link to a valid PassNexus pass.</p>
          <Link href="/pass" className="w-full block bg-slate-100 hover:bg-slate-200 text-slate-800 py-4 rounded-2xl font-bold transition-all text-center">
            Go to Landing Page
          </Link>
        </div>
      </div>
    );
  }

  const isEntered = visitor.status === "entered";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans flex flex-col items-center py-20 px-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 fixed top-0 left-0 right-0 px-6 py-4 flex items-center gap-3 z-10 shadow-sm">
        <img src="/icon.png" alt="PassNexus" className="w-8 h-8 object-contain" />
        <span className="font-black text-slate-900">Pass<span className="text-blue-600">Nexus</span> <span className="font-normal text-slate-400 text-sm hidden sm:inline">· Verifier Terminal</span></span>
      </div>

      <AnimatePresence mode="wait">
        {showPinScreen && !isEntered ? (
          <motion.div
            key="pin-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md mt-16 bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">Staff Verification Verification</h1>
            <p className="text-slate-500 text-sm mb-8">
              Please enter the Event Check-in PIN to authorize entries on this device. You only need to do this once per device.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="Event Check-in PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-center text-2xl tracking-[0.2em] font-black rounded-2xl py-5 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                  autoFocus
                />
                {pinError && <p className="text-red-500 text-sm font-bold mt-2">{pinError}</p>}
              </div>
              <button
                type="submit"
                disabled={verifying || pinInput.length < 1}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {verifying ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify Staff PIN"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="result-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mt-16"
          >
            {/* Status Header */}
            <div className={`py-5 text-center rounded-t-3xl border border-b-0 ${isEntered ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isEntered ? 'text-green-600' : 'text-blue-600'}`}>
                {isEntered ? "Verification Confirmed" : "Security Checkpoint"}
              </p>
            </div>

            {/* Main Card */}
            <div className={`bg-white border border-t-0 ${isEntered ? 'border-green-200' : 'border-slate-200'} p-10 rounded-b-3xl shadow-xl transition-all`}>
              
              {/* Icon */}
              <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 border-4 ${isEntered ? 'bg-green-50 border-green-400 shadow-green-200 shadow-lg scale-110 transition-transform' : 'bg-blue-50 border-blue-400 shadow-blue-200 shadow-lg'}`}>
                {verifying ? (
                   <Loader2 className="w-14 h-14 text-blue-600 animate-spin" />
                ) : isEntered ? (
                   <CheckCircle2 className="w-14 h-14 text-green-600" /> 
                ) : (
                   <ShieldCheck className="w-14 h-14 text-blue-600" />
                )}
              </div>

              <div className="text-center mb-8">
                <h1 className={`text-3xl font-black tracking-tight mb-1 ${isEntered ? 'text-green-600' : 'text-slate-900'}`}>
                   {verifying ? "VERIFYING..." : isEntered ? "ACCESS GRANTED" : "READY FOR CHECK-IN"}
                </h1>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{verifying ? "Processing digital signature" : "Security Checkpoint Terminal"}</p>
              </div>

              {/* Info Block */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-5 mb-8">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Attendee Name</p>
                  <p className="text-xl font-bold text-slate-900">{visitor.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Company</p>
                    <p className="text-sm font-bold text-slate-700">{visitor.company || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Pass ID</p>
                    <p className="font-mono text-blue-600 font-bold text-sm">{visitor.passId}</p>
                  </div>
                </div>
              </div>

              {/* Action Result */}
              {isEntered ? (
                <div className="w-full bg-green-600 text-white font-black py-5 rounded-2xl flex flex-col items-center border-b-4 border-green-800 shadow-lg">
                  <span className="text-lg">ENTRY VERIFIED</span>
                  <span className="text-[10px] font-bold uppercase mt-1 opacity-90 tracking-widest">
                    {visitor.enteredAt ? new Date(visitor.enteredAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Just Now'}
                  </span>
                </div>
              ) : (
                <button
                   onClick={() => {
                     const savedPin = localStorage.getItem(`entryflow_pin_${event._id}`);
                     if (savedPin) {
                       attemptCheckIn(event._id, savedPin);
                     } else {
                       setShowPinScreen(true);
                     }
                   }}
                   disabled={verifying}
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl flex flex-col items-center border-b-4 border-blue-800 shadow-lg transition-all active:scale-95 disabled:opacity-70"
                >
                   {verifying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        <span className="text-lg">CONFIRM ATTENDEE ENTRY</span>
                        <span className="text-[10px] font-bold uppercase mt-1 opacity-90 tracking-widest mx-auto flex items-center gap-1">
                           <UserCheck size={12} /> Secure Verification
                        </span>
                      </>
                   )}
                </button>
              )}
            </div>

            <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
              PassNexus Protocol • Secure Chain Verification
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
