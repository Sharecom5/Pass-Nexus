"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, AlertTriangle,
  Loader2, ShieldCheck, User, Building2,
  Ticket, Lock, Briefcase
} from "lucide-react";

type ScanResult = "idle" | "loading" | "granted" | "duplicate" | "denied" | "wrong_pin" | "error";

export default function VerifyPage() {
  const { passId } = useParams();
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [result, setResult] = useState<ScanResult>("idle");
  const [visitor, setVisitor] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    setPinError("");
    setResult("loading");

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passId, pin }),
      });
      const data = await res.json();

      if (data.status === "wrong_pin") {
        setResult("idle");
        setPinError("Incorrect PIN. Please try again.");
        setPin("");
        return;
      }

      if (data.status === "granted") {
        setVisitor(data.visitor);
        setResult("granted");
      } else if (data.status === "duplicate") {
        setVisitor(data.visitor);
        setResult("duplicate");
      } else {
        setResult("denied");
      }
    } catch {
      setResult("error");
    }
  };

  const reset = () => {
    window.location.href = "/gate";
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 font-sans">

      {/* Header */}
      <div className="flex items-center gap-2 mb-10">
        <ShieldCheck className="w-7 h-7 text-blue-400" />
        <span className="font-black text-white text-xl tracking-tight">
          Pass<span className="text-blue-400">Nexus</span>
          <span className="text-slate-500 font-normal text-base ml-2">Check-In</span>
        </span>
      </div>

      <AnimatePresence mode="wait">

        {/* PIN Entry */}
        {result === "idle" && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800 border border-slate-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-blue-500/10 border border-blue-500/30 w-20 h-20 rounded-2xl flex items-center justify-center">
                <Lock className="w-10 h-10 text-blue-400" />
              </div>
            </div>

            <h1 className="text-white font-black text-2xl text-center mb-1">Enter Check-In PIN</h1>
            <p className="text-slate-400 text-sm text-center mb-2">
              Enter the organizer&apos;s PIN to verify this pass
            </p>
            <p className="text-slate-600 text-xs text-center font-mono mb-8 truncate px-2">
              ID: {String(passId)}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                autoFocus
                maxLength={8}
                className="w-full bg-slate-700 border border-slate-600 text-white text-center text-4xl font-black py-5 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 tracking-[0.5em] placeholder:text-slate-600 placeholder:text-2xl placeholder:tracking-normal"
              />

              {pinError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center font-semibold"
                >
                  {pinError}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={!pin}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:bg-slate-700 disabled:text-slate-500 text-white font-black py-4 rounded-2xl transition-all text-lg"
              >
                Verify Pass
              </button>
            </form>
          </motion.div>
        )}

        {/* Loading */}
        {result === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-300 font-bold text-xl">Verifying...</p>
          </motion.div>
        )}

        {/* ✅ GRANTED */}
        {result === "granted" && (
          <motion.div
            key="granted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm space-y-4"
          >
            <div className="bg-green-500 rounded-3xl p-8 text-center shadow-2xl shadow-green-500/20">
              <CheckCircle2 className="w-20 h-20 text-white mx-auto mb-3" />
              <h1 className="text-white font-black text-4xl mb-1">GRANTED</h1>
              <p className="text-green-100 font-semibold">Please allow entry</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3">
              <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={visitor?.name} bold />
              {visitor?.company && <InfoRow icon={<Building2 className="w-4 h-4" />} label="Company" value={visitor.company} />}
              {visitor?.designation && <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Designation" value={visitor.designation} />}
              <InfoRow icon={<Ticket className="w-4 h-4" />} label="Pass Type" value={visitor?.passType} />
            </div>
          </motion.div>
        )}

        {/* ⚠️ DUPLICATE */}
        {result === "duplicate" && (
          <motion.div
            key="duplicate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm space-y-4"
          >
            <div className="bg-orange-500 rounded-3xl p-8 text-center shadow-2xl shadow-orange-500/20">
              <AlertTriangle className="w-20 h-20 text-white mx-auto mb-3" />
              <h1 className="text-white font-black text-4xl mb-1">DUPLICATE</h1>
              <p className="text-orange-100 font-semibold">Already entered — do not allow</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-3">
              <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={visitor?.name} bold />
              <InfoRow icon={<Ticket className="w-4 h-4" />} label="Pass Type" value={visitor?.passType} />
            </div>
          </motion.div>
        )}

        {/* ❌ DENIED / ERROR */}
        {(result === "denied" || result === "error") && (
          <motion.div
            key="denied"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm"
          >
            <div className="bg-red-600 rounded-3xl p-8 text-center shadow-2xl shadow-red-600/20">
              <XCircle className="w-20 h-20 text-white mx-auto mb-3" />
              <h1 className="text-white font-black text-4xl mb-1">DENIED</h1>
              <p className="text-red-100 font-semibold">
                {result === "error" ? "System error. Please try again." : "Pass is invalid or cancelled."}
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Scan Another */}
      {result !== "idle" && result !== "loading" && (
        <button
          onClick={reset}
          className="mt-8 text-slate-400 hover:text-white font-bold text-sm transition-colors underline underline-offset-4"
        >
          ← Scan Another Pass
        </button>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value, bold }: { icon: React.ReactNode; label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
        <p className={`text-white ${bold ? "font-black text-lg" : "font-semibold text-sm"}`}>{value}</p>
      </div>
    </div>
  );
}
