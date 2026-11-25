"use client";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabase = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
  : null;

// A troca de identidade encerra o estado React mantido pela conta anterior.
// A sessão Supabase já foi persistida antes de SIGNED_IN/SIGNED_OUT ser emitido.
if (typeof window !== "undefined" && supabase) {
  let activeUserId: string | null = null;
  supabase.auth.onAuthStateChange((event, session) => {
    const nextUserId = session?.user?.id ?? null;
    if (event === "INITIAL_SESSION") {
      activeUserId = nextUserId;
      return;
    }
    if ((event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_DELETED") && activeUserId !== nextUserId) {
      activeUserId = nextUserId;
      window.setTimeout(() => window.location.reload(), 0);
    }
  });
}
