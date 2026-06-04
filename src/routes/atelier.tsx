import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/lib/admin-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/atelier")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "—" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AtelierPage,
});

// Fixed credentials — only this name + password unlocks the portal.
const REQUIRED_NAME = "Reddy";
const REQUIRED_PASSWORD = "Venkatreddy60@";
// Backend-mapped Supabase identity (hidden from the user).
const BACKEND_EMAIL = "reddy.admin@portfolio.local";

function AtelierPage() {
  const { authed, isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a", color: "#D7E2EA" }}>
        <div className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/40">Verifying…</div>
      </div>
    );
  }

  if (!authed || !isAdmin) return <AuthGate />;
  return <AdminShell />;
}

function AuthGate() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const signIn = useAdminAuth((s) => s.signIn);
  const signUp = useAdminAuth((s) => s.signUp);
  const claimAdmin = useAdminAuth((s) => s.claimAdmin);
  const refresh = useAdminAuth((s) => s.refresh);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim() !== REQUIRED_NAME || password !== REQUIRED_PASSWORD) {
      setError("Invalid credentials");
      return;
    }

    setBusy(true);
    try {
      // Try to sign in to the backend identity. If it doesn't exist yet, create it.
      let res = await signIn(BACKEND_EMAIL, REQUIRED_PASSWORD);
      if (res.error) {
        const up = await signUp(BACKEND_EMAIL, REQUIRED_PASSWORD);
        if (up.error && !/registered|already/i.test(up.error)) {
          setError("Access denied");
          setBusy(false);
          return;
        }
        // After signup, ensure we have a session
        res = await signIn(BACKEND_EMAIL, REQUIRED_PASSWORD);
        if (res.error) {
          setError("Access denied");
          setBusy(false);
          return;
        }
      }

      // Ensure this account holds the admin role (one-time claim if none exists).
      const { data: adminAlready } = await supabase.rpc("admin_exists");
      if (!adminAlready) {
        await claimAdmin();
      }
      await refresh();
    } catch {
      setError("Access denied");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0a0a0a" }}>
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        className="w-full max-w-md rounded-3xl p-7 md:p-9 flex flex-col gap-6"
        style={{
          background: "linear-gradient(160deg, rgba(20,22,38,0.9), rgba(12,12,12,0.9))",
          border: "1px solid rgba(74,158,255,0.25)",
          boxShadow: "0 0 80px rgba(74,158,255,0.15), 0 40px 100px -20px rgba(0,0,0,0.8)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)" }}>
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/60">IV · Atelier</div>
            <div className="text-lg font-medium text-[#D7E2EA]">Sign In</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/60">Name</span>
            <input
              autoFocus
              type="text"
              required
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 px-4 py-3 rounded-xl focus:outline-none border"
              style={{ borderColor: "rgba(215,226,234,0.18)" }}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/60">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 px-4 py-3 rounded-xl focus:outline-none border"
              style={{ borderColor: "rgba(215,226,234,0.18)" }}
            />
          </label>
        </div>

        {error && <div className="text-xs text-red-400 uppercase tracking-widest">{error}</div>}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white px-6 py-3 rounded-full disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)", boxShadow: "0 8px 24px -6px rgba(74,158,255,0.5)" }}
          >
            <LogIn className="w-3.5 h-3.5" />
            {busy ? "…" : "Enter"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
