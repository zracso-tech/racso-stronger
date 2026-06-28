import { useEffect, useMemo, useState } from "react";
import { supabase, type EntrenoRow, type CardioRow, type CrossfitRow } from "../lib/supabase";
import { RUTINA, DIA_COLORS, CARDIO_TIPOS, type DiaCode } from "../data/routine";

type Tab = "pesos" | "cardio" | "crossfit";

function isoSemana(fecha: string): string {
  const d = new Date(fecha + "T00:00:00Z");
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const diff = (d.getTime() - firstThursday.getTime()) / 86400000;
  const week = 1 + Math.round((diff - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export default function Progreso() {
  const [tab, setTab] = useState<Tab>("pesos");
  const [pesos, setPesos] = useState<EntrenoRow[]>([]);
  const [cardio, setCardio] = useState<CardioRow[]>([]);
  const [crossfit, setCrossfit] = useState<CrossfitRow[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      const [a, b, c] = await Promise.all([
        supabase.from("entrenos").select("*").order("fecha", { ascending: true }),
        supabase.from("cardio").select("*").order("fecha", { ascending: true }),
        supabase.from("crossfit").select("*").order("fecha", { ascending: true }),
      ]);
      setPesos((a.data as EntrenoRow[]) ?? []);
      setCardio((b.data as CardioRow[]) ?? []);
      setCrossfit((c.data as CrossfitRow[]) ?? []);
      setCargando(false);
    })();
  }, []);

  function exportCSV() {
    const rows: string[] = ["seccion,fecha,clave,valor,extra"];
    pesos.forEach((p) => rows.push(`pesos,${p.fecha},${p.ejercicio_id},${p.peso ?? ""},"${p.nota ?? ""}"`));
    cardio.forEach((c) =>
      rows.push(`cardio,${c.fecha},${c.tipo},${c.minutos ?? ""},${c.km ?? ""}|${c.kcal ?? ""}`),
    );
    crossfit.forEach((c) => rows.push(`crossfit,${c.fecha},hecho,1,"${c.nota ?? ""}"`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `racso_progreso_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div>
      <div className="mb-4 flex gap-1.5">
        {(["pesos", "cardio", "crossfit"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg border py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              tab === t
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-6 text-center text-xs text-[var(--color-text-muted)]">
          Cargando…
        </div>
      ) : tab === "pesos" ? (
        <SeccionPesos rows={pesos} />
      ) : tab === "cardio" ? (
        <SeccionCardio rows={cardio} />
      ) : (
        <SeccionCrossfit rows={crossfit} />
      )}

      <button
        onClick={exportCSV}
        className="mt-6 w-full rounded-lg border border-[var(--color-accent-ok)] py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-ok)]"
      >
        Exportar CSV
      </button>
    </div>
  );
}

function SeccionPesos({ rows }: { rows: EntrenoRow[] }) {
  const porDia = useMemo(() => {
    const map = new Map<DiaCode, Map<string, EntrenoRow[]>>();
    rows.forEach((r) => {
      if (!map.has(r.dia)) map.set(r.dia, new Map());
      const dMap = map.get(r.dia)!;
      if (!dMap.has(r.ejercicio_id)) dMap.set(r.ejercicio_id, []);
      dMap.get(r.ejercicio_id)!.push(r);
    });
    return map;
  }, [rows]);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center text-xs text-[var(--color-text-muted)]">
        Aún no hay pesos registrados. Ve a Entreno y empieza a apuntar.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {RUTINA.map((dia) => {
        const dMap = porDia.get(dia.code);
        if (!dMap || dMap.size === 0) return null;
        return (
          <section key={dia.code}>
            <div className={`mb-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${DIA_COLORS[dia.code].chip}`}>
              {dia.nombre} · {dia.titulo}
            </div>
            <ul className="space-y-1.5">
              {dia.bloques.flatMap((b) => b.ejercicios).map((ex) => {
                const hist = dMap.get(ex.id);
                if (!hist) return null;
                const pesos = hist.map((h) => h.peso ?? 0);
                const max = Math.max(...pesos, 0);
                const ult = pesos[pesos.length - 1];
                const prev = pesos.length > 1 ? pesos[pesos.length - 2] : null;
                const delta = prev !== null ? ult - prev : 0;
                return (
                  <li
                    key={ex.id}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-semibold">{ex.nombre}</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">
                          {hist.length} sesiones · máx {max} kg
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold tabular-nums">{ult} kg</div>
                        {delta !== 0 && (
                          <div
                            className={`text-[10px] tabular-nums ${
                              delta > 0 ? "text-[var(--color-accent-ok)]" : "text-red-400"
                            }`}
                          >
                            {delta > 0 ? "+" : ""}
                            {delta} kg
                          </div>
                        )}
                      </div>
                    </div>
                    <Sparkline values={pesos} />
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 100;
  const h = 24;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-6 w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="var(--color-accent-warm)" strokeWidth="1.5" />
    </svg>
  );
}

function SeccionCardio({ rows }: { rows: CardioRow[] }) {
  const semanas = useMemo(() => {
    const map = new Map<string, { min: number; km: number; kcal: number; tipos: Record<string, number> }>();
    rows.forEach((r) => {
      const w = isoSemana(r.fecha);
      const x = map.get(w) ?? { min: 0, km: 0, kcal: 0, tipos: {} };
      x.min += r.minutos ?? 0;
      x.km += r.km ?? 0;
      x.kcal += r.kcal ?? 0;
      x.tipos[r.tipo] = (x.tipos[r.tipo] ?? 0) + 1;
      map.set(w, x);
    });
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [rows]);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center text-xs text-[var(--color-text-muted)]">
        Sin sesiones de cardio aún. Empieza desde Diario.
      </div>
    );
  }

  const tot = rows.reduce(
    (a, r) => ({ min: a.min + (r.minutos ?? 0), km: a.km + (r.km ?? 0), kcal: a.kcal + (r.kcal ?? 0) }),
    { min: 0, km: 0, kcal: 0 },
  );

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Stat label="Min totales" valor={tot.min} />
        <Stat label="Km totales" valor={tot.km.toFixed(1)} />
        <Stat label="Kcal totales" valor={tot.kcal} />
      </div>

      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
        Por semana
      </h3>
      <ul className="space-y-2">
        {semanas.map(([w, v]) => (
          <li key={w} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">{w}</div>
              <div className="flex gap-3 text-[11px] tabular-nums text-[var(--color-text-secondary)]">
                <span>{v.min} min</span>
                <span>{v.km.toFixed(1)} km</span>
                <span>{v.kcal} kcal</span>
              </div>
            </div>
            <div className="mt-1.5 flex gap-1">
              {CARDIO_TIPOS.map((t) =>
                v.tipos[t.value] ? (
                  <span
                    key={t.value}
                    className="rounded-md bg-[var(--color-accent-warm)]/15 px-1.5 py-0.5 text-[10px] text-[var(--color-accent-warm)]"
                  >
                    {t.label} ×{v.tipos[t.value]}
                  </span>
                ) : null,
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, valor }: { label: string; valor: number | string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">{label}</div>
      <div className="mt-1 text-xl font-bold tabular-nums text-[var(--color-accent-warm)]">{valor}</div>
    </div>
  );
}

function SeccionCrossfit({ rows }: { rows: CrossfitRow[] }) {
  const set = useMemo(() => new Set(rows.map((r) => r.fecha)), [rows]);

  const dias: { fecha: string; hecho: boolean }[] = [];
  const hoy = new Date();
  for (let i = 41; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    dias.push({ fecha: iso, hecho: set.has(iso) });
  }

  const total = rows.length;
  const ultimas4 = rows.filter((r) => {
    const diff = (Date.now() - new Date(r.fecha + "T00:00:00").getTime()) / 86400000;
    return diff <= 28;
  }).length;

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Stat label="Sesiones totales" valor={total} />
        <Stat label="Últimas 4 semanas" valor={ultimas4} />
      </div>

      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
        Calendario (6 semanas)
      </h3>
      <div className="grid grid-cols-7 gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
        {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="text-center text-[9px] uppercase text-[var(--color-text-muted)]">
            {d}
          </div>
        ))}
        {dias.map((d) => (
          <div
            key={d.fecha}
            title={d.fecha}
            className={`aspect-square rounded-md ${
              d.hecho
                ? "bg-[var(--color-accent-ok)]"
                : "bg-[var(--color-bg)] border border-[var(--color-border)]"
            }`}
          />
        ))}
      </div>

      {rows.length === 0 && (
        <div className="mt-3 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-center text-xs text-[var(--color-text-muted)]">
          Sin sesiones de CrossFit aún.
        </div>
      )}
    </div>
  );
}
