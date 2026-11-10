"use client";

import { supabase } from "@/lib/supabase";

export type StudentRecordType = "flashcard_review" | "study_note" | "arcade_score" | "dynamic_test" | "library_bookmark";

/** Reads records for a known user id; the id always comes from Supabase Auth. */
export async function loadStudentRecordsForUser<T>(recordType: StudentRecordType, userId: string): Promise<Record<string, T>> {
  if (!supabase || !userId) return {};
  try {
    const { data, error } = await supabase
      .from("student_learning_records")
      .select("record_key,payload")
      .eq("user_id", userId)
      .eq("record_type", recordType);
    if (error || !data) return {};
    return Object.fromEntries(data.map(row => [row.record_key, row.payload as T]));
  } catch {
    return {};
  }
}

/** Reads the signed-in student's records. If Supabase is unavailable, callers keep using local storage. */
export async function loadStudentRecords<T>(recordType: StudentRecordType): Promise<Record<string, T>> {
  if (!supabase) return {};
  try {
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) return {};
    return loadStudentRecordsForUser<T>(recordType, auth.user.id);
  } catch {
    return {};
  }
}

/** Writes one record under the authenticated user's RLS-protected identity. */
export async function saveStudentRecord<T>(recordType: StudentRecordType, recordKey: string, payload: T): Promise<boolean> {
  if (!supabase || !recordKey.trim()) return false;
  try {
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) return false;
    const { error } = await supabase.from("student_learning_records").upsert({
      user_id: auth.user.id,
      record_type: recordType,
      record_key: recordKey,
      payload,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,record_type,record_key" });
    return !error;
  } catch {
    return false;
  }
}

/** Saves using an authenticated user id already supplied by an Auth event. */
export async function saveStudentRecordForUser<T>(recordType: StudentRecordType, recordKey: string, payload: T, userId: string): Promise<boolean> {
  if (!supabase || !userId || !recordKey.trim()) return false;
  try {
    const { error } = await supabase.from("student_learning_records").upsert({
      user_id: userId,
      record_type: recordType,
      record_key: recordKey,
      payload,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,record_type,record_key" });
    return !error;
  } catch {
    return false;
  }
}

/** Calls back after Auth has delivered a session, outside the Auth callback stack. */
export function subscribeToStudentAuth(callback: (userId: string) => void): () => void {
  if (!supabase) return () => undefined;
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const userId = session?.user?.id;
    if (userId) window.setTimeout(() => callback(userId), 0);
  });
  return () => data.subscription.unsubscribe();
}

/** Removes a student's records of one type, used only by an explicit reset action. */
export async function clearStudentRecords(recordType: StudentRecordType): Promise<void> {
  if (!supabase) return;
  try {
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) return;
    await supabase.from("student_learning_records").delete()
      .eq("user_id", auth.user.id).eq("record_type", recordType);
  } catch {
    // Local records remain available if cloud deletion is temporarily unavailable.
  }
}
