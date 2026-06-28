import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    "Faltan PUBLIC_SUPABASE_URL y/o PUBLIC_SUPABASE_ANON_KEY en .env",
  );
}

export const supabase: SupabaseClient = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface EntrenoRow {
  id: number;
  user_id: string;
  fecha: string;
  dia: "L" | "M" | "X" | "J" | "V";
  ejercicio_id: string;
  peso: number | null;
  nota: string | null;
  created_at: string;
  updated_at: string;
}

export interface CardioRow {
  id: number;
  user_id: string;
  fecha: string;
  tipo: "bici" | "cinta_andar" | "cinta_correr";
  minutos: number | null;
  km: number | null;
  kcal: number | null;
  nota: string | null;
  created_at: string;
}

export interface CrossfitRow {
  id: number;
  user_id: string;
  fecha: string;
  nota: string | null;
  created_at: string;
}
