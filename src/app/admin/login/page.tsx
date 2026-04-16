"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      const knownErrors: Record<string, string> = { CredentialsSignin: "Invalid email or password." };
      setError(knownErrors[result.error] || result.error);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/admin/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans flex items-center justify-center px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/pass" className="inline-flex items-center gap-3 mb-8 group">
            <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md group-hover:scale-110 transition-transform">P</div>
            <span className="text-2xl font-black tracking-tight text-slate-900">Pass<span className="text-blue-600">Nexus</span> <span className="text-slate-400 font-normal text-lg">Portal</span></span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to manage your events and passes.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl space-y-6">
          {/* Google */}
          <button onClick={handleGoogleLogin} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-bold py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all active:scale-95 disabled:opacity-70 shadow-sm">
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.7 2.3 30.2 0 24 0 14.8 0 7 5.6 3.4 13.7l7.9 6.1C13.1 13.5 18.1 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10.1 7.1-17z"/>
                <path fill="#FBBC05" d="M11.3 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6L2.4 13.3A24 24 0 0 0 0 24c0 3.8.9 7.4 2.4 10.7l8.9-6.1z"/>
                <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-5.9 0-11-4-12.8-9.3l-7.9 6.1C7 42.4 14.8 48 24 48z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-14 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><LogIn className="w-5 h-5" /> Sign In to Dashboard</>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/admin/signup" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Create one free <ArrowRight className="inline w-3 h-3" />
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">
          PassNexus Secure Portal • Organizer Access Only
        </p>
      </motion.div>
    </div>
  );
}
