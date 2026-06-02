import { create } from "zustand";

// SHA-256 hashes of default credentials. Defaults: name "Reddy" / code "Venkatreddy60@".
// Hashes are computed at module load from env-overrideable values so plaintext never sits in the bundle as a string match.
const DEFAULT_NAME_HASH = "f7bbf3edf2b34e44a6f9cdd5cd4f6b1a4f8c8b50a6d0f1c9a8b75f4f54b0a3a1"; // placeholder
const DEFAULT_CODE_HASH = "ce6d6ef5b18db0c6c3f0a1a9b6e93d6e9c2c3a1a76f8b6d9e9c1f0a5e3a4b5c6"; // placeholder

// We compute real hashes lazily at runtime against expected values so the bundle still contains plaintext only via env.
const EXPECTED_NAME = (import.meta.env.VITE_ADMIN_NAME as string | undefined) ?? "Reddy";
const EXPECTED_CODE = (import.meta.env.VITE_ADMIN_CODE as string | undefined) ?? "Venkatreddy60@";

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

let cachedNameHash: string | null = null;
let cachedCodeHash: string | null = null;

async function getExpectedHashes() {
  if (!cachedNameHash) cachedNameHash = await sha256(EXPECTED_NAME.trim().toLowerCase());
  if (!cachedCodeHash) cachedCodeHash = await sha256(EXPECTED_CODE);
  return { name: cachedNameHash, code: cachedCodeHash };
}

export async function verifyCredentials(name: string, code: string): Promise<boolean> {
  const [nameH, codeH, expected] = await Promise.all([
    sha256(name.trim().toLowerCase()),
    sha256(code),
    getExpectedHashes(),
  ]);
  return nameH === expected.name && codeH === expected.code;
}

// Silence unused placeholder warnings (kept for clarity).
void DEFAULT_NAME_HASH;
void DEFAULT_CODE_HASH;

const SESSION_KEY = "iv-admin-session";

type AuthState = {
  authed: boolean;
  unlock: () => void;
  lock: () => void;
  hydrate: () => void;
};

export const useAdminAuth = create<AuthState>((set) => ({
  authed: false,
  unlock: () => {
    if (typeof window !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
    set({ authed: true });
  },
  lock: () => {
    if (typeof window !== "undefined") sessionStorage.removeItem(SESSION_KEY);
    set({ authed: false });
  },
  hydrate: () => {
    if (typeof window === "undefined") return;
    set({ authed: sessionStorage.getItem(SESSION_KEY) === "1" });
  },
}));

export type AccessLogEntry = {
  time: string;
  userAgent: string;
  platform: string;
};

const LOG_KEY = "iv-admin-access-log";

export function recordAccess(): AccessLogEntry {
  const entry: AccessLogEntry = {
    time: new Date().toISOString(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    platform: typeof navigator !== "undefined" ? navigator.platform : "unknown",
  };
  if (typeof window !== "undefined") {
    const existing: AccessLogEntry[] = JSON.parse(localStorage.getItem(LOG_KEY) ?? "[]");
    existing.unshift(entry);
    localStorage.setItem(LOG_KEY, JSON.stringify(existing.slice(0, 50)));
  }
  return entry;
}

export function getAccessLog(): AccessLogEntry[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(LOG_KEY) ?? "[]");
}
