"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowRight, CheckCircle2, Command, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const defaultEmail = process.env.NEXT_PUBLIC_AUTH_EMAIL || "abis@datacrumbs.org";
  const defaultPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "abis@datacrumbs.org";

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/dashboard/ecommerce");
        router.refresh();
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl ring-1 ring-indigo-500/30">
            <Command className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Studio Admin</h1>
          <p className="text-slate-400 text-sm">Sign in to access your E-commerce Dashboard</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">{error}</div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abis@datacrumbs.org"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password-input" className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Credentials Info Box */}
          <div className="border-t border-slate-800/80 pt-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Demo Login Credentials (Stored in .env)
            </div>
            <div className="bg-slate-950/80 border border-slate-800/60 rounded-xl p-3 text-xs space-y-1 font-mono text-slate-300">
              <div>
                <span className="text-slate-500">Email:</span>{" "}
                <span className="text-indigo-300">abis@datacrumbs.org</span>
              </div>
              <div>
                <span className="text-slate-500">Password:</span>{" "}
                <span className="text-indigo-300">abis@datacrumbs.org</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
