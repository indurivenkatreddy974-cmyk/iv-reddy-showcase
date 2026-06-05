"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Lock, ArrowRight } from "lucide-react";

export function SecretModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

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
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
            className="relative w-full max-w-md rounded-3xl p-7 md:p-8 flex flex-col gap-6"
            style={{
              background: "linear-gradient(160deg, rgba(20,22,38,0.95), rgba(12,12,12,0.95))",
              border: "1px solid rgba(74,158,255,0.4)",
              boxShadow: "0 0 60px rgba(74,158,255,0.2), 0 30px 80px -20px rgba(0,0,0,0.8)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)" }}>
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/60">Secret Access</div>
                <div className="text-lg font-medium text-[#D7E2EA]">Control Room Awaits</div>
              </div>
            </div>
            <p className="text-sm text-[#D7E2EA]/70 leading-relaxed">
              You've unlocked the gateway. Continue to the Atelier and enter only the portal password to manage your portfolio.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={onClose} className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 hover:text-[#D7E2EA] px-4 py-2">
                Cancel
              </button>
              <button
                onClick={() => { onClose(); navigate({ to: "/atelier" }); }}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-white px-6 py-3 rounded-full"
                style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)", boxShadow: "0 8px 24px -6px rgba(74,158,255,0.5)" }}
              >
                Enter Atelier <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
