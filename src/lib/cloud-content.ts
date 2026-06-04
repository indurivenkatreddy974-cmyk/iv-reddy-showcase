import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { useContent, type ContentState } from "@/lib/content-store";
import { useAdminAuth } from "@/lib/admin-auth";

export type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";
type SyncedKey = "hero" | "about" | "contact";
const KEYS: SyncedKey[] = ["hero", "about", "contact"];

type CloudStatusState = {
  hydrated: boolean;
  status: Record<SyncedKey, SaveStatus>;
  lastError: Record<SyncedKey, string | null>;
  setStatus: (k: SyncedKey, s: SaveStatus, err?: string | null) => void;
  setHydrated: (v: boolean) => void;
};

export const useCloudStatus = create<CloudStatusState>((set) => ({
  hydrated: false,
  status: { hero: "idle", about: "idle", contact: "idle" },
  lastError: { hero: null, about: null, contact: null },
  setStatus: (k, s, err = null) =>
    set((st) => ({
      status: { ...st.status, [k]: s },
      lastError: { ...st.lastError, [k]: err },
    })),
  setHydrated: (v) => set({ hydrated: v }),
}));

let bootstrapped = false;
let hydrating = false;
const timers: Partial<Record<SyncedKey, ReturnType<typeof setTimeout>>> = {};
const lastSerialized: Partial<Record<SyncedKey, string>> = {};

async function hydrate() {
  hydrating = true;
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value")
      .in("key", KEYS);
    if (error) throw error;
    const map = new Map((data ?? []).map((r) => [r.key as SyncedKey, r.value as unknown]));
    const store = useContent.getState();
    for (const k of KEYS) {
      const remote = map.get(k);
      if (remote && typeof remote === "object") {
        // Merge to avoid dropping any new local default fields
        const merged = { ...(store[k] as object), ...(remote as object) } as ContentState[SyncedKey];
        useContent.setState({ [k]: merged } as Partial<ContentState>);
        lastSerialized[k] = JSON.stringify(merged);
      } else {
        lastSerialized[k] = JSON.stringify(store[k]);
      }
    }
  } catch (e) {
    console.error("[cloud-content] hydrate failed", e);
  } finally {
    hydrating = false;
    useCloudStatus.getState().setHydrated(true);
  }
}

async function saveSection(key: SyncedKey) {
  const value = useContent.getState()[key];
  const setStatus = useCloudStatus.getState().setStatus;
  setStatus(key, "saving");
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) {
    setStatus(key, "error", error.message);
    return;
  }
  lastSerialized[key] = JSON.stringify(value);
  setStatus(key, "saved");
  setTimeout(() => {
    if (useCloudStatus.getState().status[key] === "saved") setStatus(key, "idle");
  }, 1800);
}

function scheduleSave(key: SyncedKey) {
  if (timers[key]) clearTimeout(timers[key]);
  useCloudStatus.getState().setStatus(key, "dirty");
  timers[key] = setTimeout(() => void saveSection(key), 700);
}

export function bootstrapCloudContent() {
  if (bootstrapped || typeof window === "undefined") return;
  bootstrapped = true;
  void hydrate();

  useContent.subscribe((state, prev) => {
    if (hydrating) return;
    const { isAdmin } = require("@/lib/admin-auth").useAdminAuth.getState() as { isAdmin: boolean };
    if (!isAdmin) return;
    for (const k of KEYS) {
      if (state[k] !== prev[k]) {
        const ser = JSON.stringify(state[k]);
        if (ser !== lastSerialized[k]) scheduleSave(k);
      }
    }
  });
}

export async function flushPending() {
  await Promise.all(
    KEYS.filter((k) => useCloudStatus.getState().status[k] === "dirty" || useCloudStatus.getState().status[k] === "saving").map(
      (k) => saveSection(k),
    ),
  );
}
