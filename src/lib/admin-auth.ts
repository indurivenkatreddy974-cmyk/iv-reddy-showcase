import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

const PORTAL_EMAIL = "reddy.admin@portfolio.local";
const PORTAL_PASSWORD = "Venkatreddy60@";

type AuthState = {
  authed: boolean;
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  claimAdmin: () => Promise<{ ok: boolean; error?: string }>;
};

async function loadRole(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Failed to load admin role", error.message);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Failed to load admin role", error);
    return false;
  }
}

export const useAdminAuth = create<AuthState>((set, get) => ({
  authed: false,
  isAdmin: false,
  userId: null,
  email: null,
  loading: true,
  refresh: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to load admin user", error.message);
        set({ authed: false, isAdmin: false, userId: null, email: null, loading: false });
        return;
      }

      const user = data.user;
      if (!user) {
        set({ authed: false, isAdmin: false, userId: null, email: null, loading: false });
        return;
      }

      const isAdmin = await loadRole(user.id);
      set({ authed: true, isAdmin, userId: user.id, email: user.email ?? null, loading: false });
    } catch (error) {
      console.error("Failed to refresh admin auth", error);
      set({ authed: false, isAdmin: false, userId: null, email: null, loading: false });
    }
  },
  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await get().refresh();
    return {};
  },
  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined" ? window.location.origin + "/atelier" : undefined,
      },
    });
    if (error) return { error: error.message };
    await get().refresh();
    return {};
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ authed: false, isAdmin: false, userId: null, email: null });
  },
  claimAdmin: async () => {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Admin already exists" };
    await get().refresh();
    return { ok: true };
  },
}));

export async function unlockAdminPortal(
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  if (password !== PORTAL_PASSWORD) {
    return { ok: false, error: "Incorrect password" };
  }

  const { signIn, signUp, claimAdmin, refresh } = useAdminAuth.getState();

  let result = await signIn(PORTAL_EMAIL, PORTAL_PASSWORD);

  if (result.error) {
    const created = await signUp(PORTAL_EMAIL, PORTAL_PASSWORD);
    if (created.error && !/registered|already/i.test(created.error)) {
      return { ok: false, error: "Unable to unlock portal" };
    }

    result = await signIn(PORTAL_EMAIL, PORTAL_PASSWORD);
    if (result.error) {
      return { ok: false, error: "Unable to unlock portal" };
    }
  }

  const { data: adminExists, error: adminCheckError } = await supabase.rpc("admin_exists");
  if (adminCheckError) {
    return { ok: false, error: adminCheckError.message };
  }

  if (!adminExists) {
    const claim = await claimAdmin();
    if (!claim.ok) {
      return { ok: false, error: claim.error ?? "Unable to grant admin access" };
    }
  }

  await refresh();

  const state = useAdminAuth.getState();
  if (!state.authed || !state.isAdmin) {
    return { ok: false, error: "Admin access is not ready yet" };
  }

  return { ok: true };
}

// Subscribe to auth changes once (client-only)
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange(() => {
    void useAdminAuth.getState().refresh();
  });
  void useAdminAuth.getState().refresh();
}

// Legacy compat for any leftover imports
export async function verifyCredentials(): Promise<boolean> {
  return false;
}
export type AccessLogEntry = { time: string; userAgent: string; platform: string };
export function recordAccess(): AccessLogEntry {
  const entry: AccessLogEntry = {
    time: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    platform: typeof navigator !== "undefined" ? navigator.platform : "unknown",
  };
  if (typeof window !== "undefined") {
    const key = "iv-admin-access-log";
    const existing: AccessLogEntry[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    existing.unshift(entry);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
  }
  return entry;
}
export function getAccessLog(): AccessLogEntry[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("iv-admin-access-log") ?? "[]");
}
