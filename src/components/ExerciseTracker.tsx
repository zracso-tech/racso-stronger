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
  const [dirty, setDirty] = useState(false);
  const cargadoRef = useRef(false);

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
        const pesoStr = r.peso?.toString() ?? "";
        const notaStr = r.nota ?? "";
        setUltimo({ peso: pesoStr, nota: notaStr, fecha: r.fecha });
        setPeso(pesoStr);
        setNota(notaStr);
      }
      cargadoRef.current = true;
    });
    return () => {
      active = false;
    };
  }, [dia, ejercicioId]);

  // Debounce de guardado: cada cambio en peso/nota programa un save a 900ms,
  // cancelando el pendiente. useEffect cleanup garantiza closures frescas.
  useEffect(() => {
    if (!dirty || !hasSession) return;
    const t = setTimeout(() => {
      void guardar(peso, nota);
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peso, nota, dirty, hasSession]);

  async function guardar(pesoActual: string, notaActual: string) {
    setEstado("saving");
    const hoy = new Date().toISOString().slice(0, 10);
    const pesoVal = pesoActual === "" ? null : Number(pesoActual.replace(",", "."));
    if (pesoVal !== null && Number.isNaN(pesoVal)) {
      setEstado("err");
      setTimeout(() => setEstado("idle"), 2500);
      return;
    }

    const { data: existente, error: errSelect } = await supabase
      .from("entrenos")
      .select("id")
      .eq("dia", dia)
      .eq("ejercicio_id", ejercicioId)
      .eq("fecha", hoy)
      .maybeSingle();

    if (errSelect) {
      console.error("select", errSelect);
      setEstado("err");
      setTimeout(() => setEstado("idle"), 2500);
      return;
    }

    let error;
    if (existente) {
      ({ error } = await supabase
        .from("entrenos")
        .update({ peso: pesoVal, nota: notaActual })
        .eq("id", existente.id));
    } else {
      ({ error } = await supabase
        .from("entrenos")
        .insert({ fecha: hoy, dia, ejercicio_id: ejercicioId, peso: pesoVal, nota: notaActual }));
    }

    if (error) {
      console.error("save", error);
      setEstado("err");
      setTimeout(() => setEstado("idle"), 2500);
      return;
    }
    setEstado("ok");
    setUltimo({ peso: pesoActual, nota: notaActual, fecha: hoy });
    setTimeout(() => setEstado("idle"), 2000);
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
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          maxLength={6}
          value={peso}
          onChange={(e) => {
            const v = e.target.value;
            // permitir solo dígitos y un único punto/coma
            if (/^\d{0,3}([.,]\d{0,2})?$/.test(v)) {
              setPeso(v);
              setDirty(true);
            }
          }}
          placeholder="0"
          className="ml-auto w-28 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-2 text-right text-base font-bold tabular-nums focus:border-[var(--color-accent)] focus:outline-none"
        />
        <span className="text-xs text-[var(--color-text-muted)]">kg</span>
      </div>

      <textarea
        rows={2}
        value={nota}
        onChange={(e) => {
          setNota(e.target.value);
          setDirty(true);
        }}
        placeholder="Notas…"
        className="mt-2 w-full resize-y rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-xs leading-relaxed focus:border-[var(--color-accent-warm)] focus:outline-none"
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
