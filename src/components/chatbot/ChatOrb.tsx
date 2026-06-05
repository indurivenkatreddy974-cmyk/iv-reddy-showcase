"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, X } from "lucide-react";
import { ChatPanel } from "./ChatPanel";

export function ChatOrb() {
  const [open, setOpen] = useState(false);
  const orbRef = useRef<HTMLButtonElement>(null);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = orbRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 140) {
        setMagnet({ x: dx * 0.25, y: dy * 0.25 });
      } else {
        setMagnet({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[60] pointer-events-none">
        <motion.div
          animate={{ x: magnet.x, y: magnet.y }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="pointer-events-auto"
        >
          <motion.button
            ref={orbRef}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close assistant" : "Open assistant"}
            className="relative rounded-full flex items-center justify-center group"
            style={{
              width: "clamp(58px, 6vw, 76px)",
              height: "clamp(58px, 6vw, 76px)",
              background:
                "radial-gradient(circle at 30% 30%, rgba(74,158,255,0.35), rgba(12,12,12,0.85) 70%)",
              border: "1px solid rgba(215,226,234,0.25)",
              boxShadow:
                "0 0 0 1px rgba(215,226,234,0.08) inset, 0 12px 40px -10px rgba(74,158,255,0.5), 0 0 40px rgba(118,33,176,0.25)",
              backdropFilter: "blur(20px)",
            }}
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            {/* breathing halo */}
            <motion.span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(74,158,255,0.35), transparent 60%)" }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.4, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="relative z-10">
                  <X className="w-5 h-5 md:w-6 md:h-6 text-[#D7E2EA]" />
                </motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="relative z-10">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-[#D7E2EA]" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      <ChatPanel
        open={open}
        onClose={() => setOpen(false)}
        onSecretTrigger={() => {
          setOpen(false);
          navigate({ to: "/atelier" });
        }}
      />
    </>
  );
}
