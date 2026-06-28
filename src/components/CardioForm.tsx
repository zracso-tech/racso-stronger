import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { CARDIO_TIPOS, type CardioTipo } from "../data/routine";
import type { CardioRow } from "../lib/supabase";

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

function labelTipo(tipo: CardioTipo) {
  return CARDIO_TIPOS.find((t) => t.value === tipo)?.label ?? tipo;
}

export default function CardioForm() {
  const [tipo, setTipo] = useState<CardioTipo>("bici");
  const [minutos, setMinutos] = useState("");
  const [km, setKm] = useState("");
  const [kcal, setKcal] = useState("");
  const [sesiones, setSesiones] = useState<CardioRow[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    const { data } = await supabase
      .from("cardio")
      .select("*")
      .eq("fecha", hoy())
      .order("created_at", { ascending: false });
    setSesiones((data as CardioRow[]) ?? []);
    setCargando(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!minutos && !km && !kcal) return;
    setGuardando(true);
    await supabase.from("cardio").insert({
      fecha: hoy(),
      tipo,
      minutos: minutos ? parseInt(minutos) : null,
      km: km ? parseFloat(km) : null,
      kcal: kcal ? parseInt(kcal) : null,
    });
    setMinutos("");
    setKm("");
    setKcal("");
    setGuardando(false);
    cargar();
  }

  async function borrar(id: number) {
    await supabase.from("cardio").delete().eq("id", id);
    cargar();
  }

  const totales = sesiones.reduce(
    (acc, s) => ({
      min: acc.min + (s.minutos ?? 0),
      km: acc.km + (s.km ?? 0),
      kcal: acc.kcal + (s.kcal ?? 0),
    }),
    { min: 0, km: 0, kcal: 0 },
  );

  return (
    <div className="space-y-3">
      <form onSubmit={guardar} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {CARDIO_TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTipo(t.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                tipo === t.value
                  ? "bg-[var(--color-accent-warm)] text-[var(--color-bg)]"
                  : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Field label="Min" v={minutos} on={setMinutos} placeholder="30" step="1" />
          <Field label="Km" v={km} on={setKm} placeholder="5.0" step="0.1" />
          <Field label="Kcal" v={kcal} on={setKcal} placeholder="250" step="1" />
        </div>

        <button
          type="submit"
          disabled={guardando || (!minutos && !km && !kcal)}
          className="mt-3 w-full rounded-lg bg-[var(--color-accent-warm)] py-2.5 text-sm font-bold uppercase tracking-wider text-[var(--color-bg)] disabled:opacity-50"
        >
          {guardando ? "Guardando…" : "Añadir sesión"}
        </button>
      </form>

      {cargando ? null : sesiones.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-center text-xs text-[var(--color-text-muted)]">
          Sin cardio registrado hoy
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-[var(--color-accent-warm)]/30 bg-[var(--color-accent-warm)]/10 px-4 py-3 text-xs text-[var(--color-accent-warm)]">
            <div className="font-semibold uppercase tracking-wider opacity-80">Total hoy</div>
            <div className="mt-1 flex gap-4 tabular-nums">
              <span><strong>{totales.min}</strong> min</span>
              <span><strong>{totales.km.toFixed(1)}</strong> km</span>
              <span><strong>{totales.kcal}</strong> kcal</span>
            </div>
          </div>

          <ul className="space-y-2">
            {sesiones.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
              >
                <div className="flex-1">
                  <div className="text-xs font-semibold">{labelTipo(s.tipo)}</div>
                  <div className="mt-0.5 text-[11px] text-[var(--color-text-muted)] tabular-nums">
                    {s.minutos ? `${s.minutos} min` : ""}
                    {s.km ? ` · ${s.km} km` : ""}
                    {s.kcal ? ` · ${s.kcal} kcal` : ""}
                  </div>
                </div>
                <button
                  onClick={() => borrar(s.id)}
                  className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] hover:text-red-400"
                  aria-label="Borrar sesión"
                >
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  v,
  on,
  placeholder,
  step,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  placeholder: string;
  step: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={v}
        onChange={(e) => on(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-center text-sm font-bold tabular-nums focus:border-[var(--color-accent-warm)] focus:outline-none"
      />
    </label>
  );
}
