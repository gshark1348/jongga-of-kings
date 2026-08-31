import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "./supabase/client";

export async function callGameApi<T>(payload: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new Error("Supabase 연결 정보가 없습니다.");
  const { data, error } = await supabase.functions.invoke("game-api", { body: payload });
  if (error instanceof FunctionsHttpError) {
    const response = await error.context.json().catch(() => null) as { error?: string } | null;
    throw new Error(response?.error ?? error.message);
  }
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as T;
}
