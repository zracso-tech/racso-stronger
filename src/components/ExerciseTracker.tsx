import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import type { DiaCode } from "../data/routine";

interface Props {
  dia: DiaCode;
  ejercicioId: string;
}

interface Registro {
  peso: string;
  nota: string;
  fecha: string;
}

export default function ExerciseTracker({ dia, ejercicioId }: Props) {
  const [peso, setPeso] = useState("");
  const [nota, setNota] = useState("");
  const [ultimo, setUltimo] = useState<Registro | null>(null);
  const [estado, setEstado] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setHasSession(!!data.session);
      if (!data.session) return;
      const { data: rows } = await supabase
        .from("entrenos")
        .select("peso,nota,fecha")
        .eq("dia", dia)
        .eq("ejercicio_id", ejercicioId)
        .order("fecha", { ascending: false })
        .limit(1);
      if (active && rows && rows.length > 0) {
        const r = rows[0];
        setUltimo({ peso: r.peso?.toString() ?? "", nota: r.nota ?? "", fecha: r.fecha });
        setPeso(r.peso?.toString() ?? "");
        setNota(r.nota ?? "");
      }
    });
    return () => {
      active = false;
    };
  }, [dia, ejercicioId]);

  async function guardar() {
    if (!hasSession) return;
    setEstado("saving");
    const hoy = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("entrenos").upsert(
      {
        fecha: hoy,
        dia,
        ejercicio_id: ejercicioId,
        peso: peso === "" ? null : Number(peso),
        nota,
      },
      { onConflict: "user_id,dia,ejercicio_id,fecha", ignoreDuplicates: false },
    );
    if (error) {
      console.error(error);
      setEstado("err");
      setTimeout(() => setEstado("idle"), 2500);
      return;
    }
    setEstado("ok");
    setUltimo({ peso, nota, fecha: hoy });
    setTimeout(() => setEstado("idle"), 2000);
  }

  function onChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => guardar(), 900);
    };
  }

  if (hasSession === null) return null;

  if (!hasSession) {
    return (
      <a
        href="/login"
        className="mt-3 inline-block text-[11px] text-[var(--color-accent)] underline-offset-2 hover:underline"
      >
        Inicia sesión para registrar peso →
      </a>
    );
  }

  return (
    <div className="mt-3 border-t border-[var(--color-border)] pt-3">
      <div className="flex items-center gap-2">
        <label className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Peso hoy
        </label>
        <input
          type="number"
          inputMode="decimal"
          step="0.5"
          value={peso}
          onChange={onChange(setPeso)}
          placeholder="kg"
          className="ml-auto w-24 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-right text-sm font-bold tabular-nums focus:border-[var(--color-accent)] focus:outline-none"
        />
        <span className="text-xs text-[var(--color-text-muted)]">kg</span>
      </div>

      <textarea
        rows={1}
        value={nota}
        onChange={onChange(setNota)}
        placeholder="Notas…"
        className="mt-2 w-full resize-none rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs focus:border-[var(--color-accent-warm)] focus:outline-none"
      />

      <div className="mt-1.5 flex min-h-[14px] items-center justify-between text-[10px]">
        <span className="text-[var(--color-text-muted)]">
          {ultimo
            ? `Último: ${ultimo.peso || "—"} kg · ${ultimo.fecha}`
            : "Sin registros previos"}
        </span>
        <span
          className={
            estado === "saving"
              ? "text-[var(--color-accent-warm)]"
              : estado === "ok"
                ? "text-[var(--color-accent-ok)]"
                : estado === "err"
                  ? "text-red-400"
                  : "text-transparent"
          }
        >
          {estado === "saving"
            ? "Guardando…"
            : estado === "ok"
              ? "✓ Guardado"
              : estado === "err"
                ? "Error"
                : "·"}
        </span>
      </div>
    </div>
  );
}
