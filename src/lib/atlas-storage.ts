"use client";

type AuthScope = { owner: string };

/**
 * Reads the persisted Supabase Auth identity without waiting for React effects.
 * The client uses Supabase's default localStorage key: sb-<project-ref>-auth-token.
 */
function getAuthScope(): AuthScope {
  if (typeof window === "undefined") return { owner: "guest" };
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return { owner: "guest" };
  try {
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    const raw = window.localStorage.getItem(`sb-${projectRef}-auth-token`);
    if (!raw) return { owner: "guest" };
    const decoded = raw.startsWith("base64-") ? window.atob(raw.slice(7)) : raw;
    const parsed = JSON.parse(decoded) as {
      user?: { id?: unknown };
      currentSession?: { user?: { id?: unknown } };
    };
    const id = parsed.user?.id ?? parsed.currentSession?.user?.id;
    if (typeof id === "string" && id.length > 0) return { owner: `user:${id}` };
    // Fail closed if an Auth token exists but its identity cannot be read.
    return { owner: "identity-unresolved" };
  } catch {
    return { owner: "identity-unresolved" };
  }
}

/**
 * Guest data and each student's local data occupy distinct namespaces.
 * Legacy unscoped keys are intentionally left untouched and are not imported
 * automatically: older versions could have mixed visitor and account data.
 */
export function getAtlasStorageKey(baseKey: string): string {
  const scope = getAuthScope();
  return `atlas:v2:${scope.owner}:${baseKey}`;
}
