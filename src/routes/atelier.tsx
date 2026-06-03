import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, KeyRound, LogIn } from "lucide-react";
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

function AtelierPage() {
  const { authed, isAdmin, loading, email } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a", color: "#D7E2EA" }}>
        <div className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/40">Verifying…</div>
      </div>
    );
  }

  if (!authed) return <AuthGate mode="signin" />;
  if (!isAdmin) return <ClaimAdmin email={email ?? ""} />;
  return <AdminShell />;
}

function AuthGate({ mode: initialMode }: { mode: "signin" | "signup" }) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const signIn = useAdminAuth((s) => s.signIn);
  const signUp = useAdminAuth((s) => s.signUp);

  useEffect(() => {
    void supabase.rpc("admin_exists").then(({ data }) => setAdminExists(!!data));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) setError(error);
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
            <div className="text-lg font-medium text-[#D7E2EA]">{mode === "signin" ? "Sign In" : "Create Admin"}</div>
          </div>
        </div>

        {adminExists === false && mode === "signin" && (
          <div className="text-xs text-[#4a9eff] bg-[#4a9eff]/10 border border-[#4a9eff]/20 rounded-xl px-3 py-2">
            No admin yet. Create an account, then claim admin access.
          </div>
        )}

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/60">Email</span>
            <input
              autoFocus
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 px-4 py-3 rounded-xl focus:outline-none border"
              style={{ borderColor: "rgba(215,226,234,0.18)" }}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D7E2EA]/60">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 px-4 py-3 rounded-xl focus:outline-none border"
              style={{ borderColor: "rgba(215,226,234,0.18)" }}
            />
          </label>
        </div>

        {error && <div className="text-xs text-red-400 uppercase tracking-widest">{error}</div>}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
            className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 hover:text-[#D7E2EA]"
          >
            {mode === "signin" ? "Create account" : "Have an account?"}
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white px-6 py-3 rounded-full disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)", boxShadow: "0 8px 24px -6px rgba(74,158,255,0.5)" }}
          >
            <LogIn className="w-3.5 h-3.5" />
            {busy ? "…" : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function ClaimAdmin({ email }: { email: string }) {
  const claim = useAdminAuth((s) => s.claimAdmin);
  const signOut = useAdminAuth((s) => s.signOut);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClaim = async () => {
    setBusy(true);
    setError(null);
    const { ok, error } = await claim();
    setBusy(false);
    if (!ok) setError(error ?? "Failed to claim admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0a0a0a" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl p-7 md:p-9 flex flex-col gap-6"
        style={{
          background: "linear-gradient(160deg, rgba(20,22,38,0.9), rgba(12,12,12,0.9))",
          border: "1px solid rgba(74,158,255,0.25)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)" }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/60">{email}</div>
            <div className="text-lg font-medium text-[#D7E2EA]">Admin Required</div>
          </div>
        </div>
        <p className="text-sm text-[#D7E2EA]/70 leading-relaxed">
          This account is signed in but isn't an admin. If no admin exists yet, you can claim admin access now (one-time only).
        </p>
        {error && <div className="text-xs text-red-400 uppercase tracking-widest">{error}</div>}
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => void signOut()} className="text-xs uppercase tracking-widest text-[#D7E2EA]/60 hover:text-[#D7E2EA]">
            Sign Out
          </button>
          <button
            onClick={onClaim}
            disabled={busy}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white px-6 py-3 rounded-full disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4a9eff, #7621B0)", boxShadow: "0 8px 24px -6px rgba(74,158,255,0.5)" }}
          >
            <KeyRound className="w-3.5 h-3.5" />
            {busy ? "Claiming…" : "Claim Admin"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
