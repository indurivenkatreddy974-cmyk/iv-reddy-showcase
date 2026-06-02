"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Lock, Check } from "lucide-react";
import { verifyCredentials, useAdminAuth, recordAccess } from "@/lib/admin-auth";
import { notifyAdminAccess } from "@/lib/admin-notify";

export function SecretModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "err" | "ok" | "checking">("idle");
  const navigate = useNavigate();
  const unlock = useAdminAuth((s) => s.unlock);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("checking");
    const ok = await verifyCredentials(name, code);
    if (!ok) {
      setStatus("err");
      setTimeout(() => setStatus("idle"), 1200);
      return;
    }
    setStatus("ok");
    unlock();
    const entry = recordAccess();
    void notifyAdminAccess(entry);
    setTimeout(() => {
      onClose();
      setName("");
      setCode("");
      setStatus("idle");
      navigate({ to: "/atelier" });
    }, 700);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(16px)" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.form
            onSubmit={submit}
            animate={status === "err" ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(20px)" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...({ animate: { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" } } as any)}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            className="relative w-full max-w-md rounded-3xl p-7 md:p-8 flex flex-col gap-6"
            style={{
              background: "linear-gradient(160deg, rgba(20,22,38,0.95), rgba(12,12,12,0.95))",
              border:
                status === "err"
                  ? "1px solid rgba(255,80,80,0.55)"
                  : status === "ok"
                    ? "1px solid rgba(74,158,255,0.6)"
                    : "1px solid rgba(215,226,234,0.2)",
              boxShadow:
                status === "err"
                  ? "0 0 60px rgba(255,80,80,0.35), 0 30px 80px -20px rgba(0,0,0,0.8)"
                  : "0 0 60px rgba(74,158,255,0.2), 0 30px 80px -20px rgba(0,0,0,0.8)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)" }}
              >
                {status === "ok" ? <Check className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/60">Secret Access</div>
                <div className="text-lg font-medium text-[#D7E2EA]">Enter Secret Code</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/60">Name</span>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="bg-transparent text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 px-4 py-3 rounded-xl focus:outline-none border"
                  style={{ borderColor: "rgba(215,226,234,0.18)" }}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/60">Secret Code</span>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter secret code"
                  className="bg-transparent text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 px-4 py-3 rounded-xl focus:outline-none border"
                  style={{ borderColor: "rgba(215,226,234,0.18)" }}
                />
              </label>
            </div>

            <AnimatePresence>
              {status === "err" && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400 uppercase tracking-widest"
                >
                  Access denied
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 hover:text-[#D7E2EA] px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "checking" || status === "ok"}
                className="text-xs uppercase tracking-widest text-white px-6 py-3 rounded-full disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #4a9eff, #7621B0)",
                  boxShadow: "0 8px 24px -6px rgba(74,158,255,0.5)",
                }}
              >
                {status === "ok" ? "Unlocked" : status === "checking" ? "Verifying…" : "Unlock"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
