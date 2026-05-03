// src/pages/Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Key, Mail } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Helper: post to backend
  async function doLogin(payload) {
    return axios.post("http://127.0.0.1:5000/login", payload, { timeout: 20000 });
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setBusy(true);
    try {
      const res = await doLogin({ email, password });
      // Accept both styles: either success boolean in data, or HTTP 200 with message
      const data = res?.data ?? {};
      const ok = data.success === true || res.status === 200;
      if (ok) {
        // store user info and go to dashboard
        localStorage.setItem("userEmail", email);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid login.");
      }
    } catch (err) {
      console.error(err);
      // Get backend message when possible
      const msg = err?.response?.data?.message || "Unable to login. Check backend or network.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
      >
        {/* Hidden dummy fields to prevent Chrome autofill hijack */}
        <form style={{ display: "none" }} aria-hidden="true" autoComplete="on">
          <input name="fakeusernameremembered" />
          <input name="fakepasswordremembered" />
        </form>

        <div className="mb-4 text-center">
          <h1 className="text-2xl font-semibold text-white drop-shadow-sm">AI Interview Evaluator</h1>
          <p className="text-sm text-white/80 mt-1">Sign in to your HR dashboard</p>
        </div>

        {error && (
          <div className="mb-3 p-2 rounded bg-red-600/10 border border-red-600/20 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-white/85 text-sm">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-white/60" size={18} />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="hr@company.com"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/6 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

          <label className="block text-white/85 text-sm">Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-3 text-white/60" size={18} />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // prevent browser autofill / breached-password banner
              autoComplete="new-password"
              placeholder="Enter a secure password"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/6 border border-white/10 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-[#22D3EE] text-slate-900 font-semibold shadow hover:scale-[1.01] transition transform"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-white/70">
          <a href="/register" className="underline">Create an account</a> • Use a strong password (example: <span className="font-mono">EvalAI@2025!</span>)
        </div>
      </motion.div>
    </div>
  );
}
