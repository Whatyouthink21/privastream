"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Copy, Check, Eye, EyeOff } from "lucide-react";
import { useUser } from "./UserContext";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, register } = useUser();
  const [mode, setMode] = useState<"signin" | "register">("register");
  const [accountInput, setAccountInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newAccount, setNewAccount] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    const acc = await register();
    if (acc) setNewAccount(acc);
    else setError("Failed to create account. Please try again.");
    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!accountInput.trim()) { setError("Please enter your account number"); return; }
    setLoading(true);
    setError("");
    const success = await signIn(accountInput.trim());
    if (success) onClose();
    else setError("Account not found. Check your 8-digit number.");
    setLoading(false);
  };

  const handleCopy = () => {
    if (newAccount) {
      navigator.clipboard.writeText(newAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => { setNewAccount(null); setError(""); setAccountInput(""); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center modal-backdrop"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative w-[420px] bg-[#111] border border-red-500/20 rounded-3xl p-8 shadow-2xl shadow-red-500/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.8 }}
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
            >
              <X size={16} />
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              className="flex justify-center mb-5"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <span className="text-white font-black text-2xl">P</span>
              </div>
            </motion.div>

            {newAccount ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-center"
              >
                <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
                <p className="text-white/40 text-sm mb-6">
                  Save your <span className="text-red-400 font-bold">8-digit key</span> — it&apos;s the only way to access your account.
                </p>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25, type: "spring" }}
                  className="bg-[#1a1a1a] border border-red-500/20 rounded-2xl p-4 mb-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-2xl font-bold text-red-400 tracking-widest">
                      {showKey ? newAccount : "••••••••"}
                    </span>
                    <div className="flex gap-2">
                      <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setShowKey(!showKey)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={handleCopy} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all">
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6"
                >
                  <Check size={16} className="text-green-400 shrink-0" />
                  <span className="text-green-400 text-sm">Account created successfully!</span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClose}
                  className="w-full py-3 btn-red rounded-full font-bold text-sm"
                >
                  Start Watching
                </motion.button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h2 className="text-xl font-bold text-white text-center mb-1">
                  {mode === "register" ? "Create your account" : "Welcome back"}
                </h2>
                <p className="text-white/30 text-sm text-center mb-6">
                  {mode === "register" ? "Generate your 8-digit account number" : "Enter your 8-digit account number"}
                </p>

                {/* Tabs */}
                <div className="flex bg-[#0a0a0a] rounded-full p-1 mb-6 border border-white/5">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setMode("signin"); setError(""); }}
                    className={cn("flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300", mode === "signin" ? "btn-red" : "text-white/40 hover:text-white")}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setMode("register"); setError(""); }}
                    className={cn("flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300", mode === "register" ? "btn-red" : "text-white/40 hover:text-white")}
                  >
                    Register
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {mode === "register" ? (
                    <motion.div key="register" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="text-center">
                      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Key size={28} className="text-red-400" />
                      </motion.div>
                      <p className="text-white/40 text-sm mb-6">We&apos;ll generate a random <span className="text-red-400 font-bold">8-digit number</span>.<br />That&apos;s your only login — keep it safe.</p>
                      {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleRegister} disabled={loading} className="w-full py-3 btn-red rounded-full font-bold text-sm disabled:opacity-50">
                        {loading ? "Generating..." : "Generate my key"}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div key="signin" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                      <div className="mb-4">
                        <label className="text-xs text-white/40 mb-2 block">Account Number (8 digits)</label>
                        <input
                          type="text"
                          value={accountInput}
                          onChange={e => setAccountInput(e.target.value.replace(/\D/g, "").slice(0, 8))}
                          placeholder="12345678"
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-red-400 font-mono text-lg tracking-widest placeholder:text-white/15 outline-none focus:border-red-500/50 focus:shadow-lg focus:shadow-red-500/10 transition-all text-center"
                          onKeyDown={e => e.key === "Enter" && handleSignIn()}
                        />
                      </div>
                      {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSignIn} disabled={loading || accountInput.length !== 8} className="w-full py-3 btn-red rounded-full font-bold text-sm disabled:opacity-50">
                        {loading ? "Signing in..." : "Sign In"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
