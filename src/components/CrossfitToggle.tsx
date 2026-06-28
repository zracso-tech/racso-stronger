import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CrossfitToggle() {
  const [activo, setActivo] = useState(false);
  const [nota, setNota] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("crossfit")
        .select("nota")
        .eq("fecha", hoy())
        .maybeSingle();
      if (data) {
        setActivo(true);
        setNota(data.nota ?? "");
      }
      setCargando(false);
    })();
  }, []);

  async function toggle() {
    setGuardando(true);
    if (activo) {
      await supabase.from("crossfit").delete().eq("fecha", hoy());
      setActivo(false);
      setNota("");
    } else {
      await supabase.from("crossfit").insert({ fecha: hoy(), nota: nota || null });
      setActivo(true);
    }
    setGuardando(false);
  }

  async function guardarNota(v: string) {
    setNota(v);
    if (!activo) return;
    await supabase.from("crossfit").update({ nota: v || null }).eq("fecha", hoy());
  }

  if (cargando) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-xs text-[var(--color-text-muted)]">
        Cargando…
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        activo
          ? "border-[var(--color-accent-ok)]/40 bg-[var(--color-accent-ok)]/10"
          : "border-[var(--color-border)] bg-[var(--color-surface-2)]"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          disabled={guardando}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold transition-colors disabled:opacity-50 ${
            activo
              ? "bg-[var(--color-accent-ok)] text-white"
              : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]"
          }`}
          aria-label={activo ? "Desmarcar CrossFit" : "Marcar CrossFit"}
        >
          {activo ? "✓" : ""}
        </button>
        <div className="flex-1">
          <div className="text-sm font-semibold">CrossFit hoy</div>
          <div className="text-[11px] text-[var(--color-text-muted)]">
            {activo ? "Marcado como hecho" : "Toca para marcarlo"}
          </div>
        </div>
      </div>

      {activo && (
        <div className="mt-3">
          <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
            WOD / Notas
          </label>
          <textarea
            rows={4}
            value={nota}
            onChange={(e) => guardarNota(e.target.value)}
            placeholder="Escribe el WOD, sensaciones, tiempos, RPE…"
            className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm leading-relaxed focus:border-[var(--color-accent-ok)] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
