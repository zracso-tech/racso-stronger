import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Props {
  children?: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const [status, setStatus] = useState<"checking" | "ok" | "anon">("checking");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setStatus("ok");
      } else {
        const back = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?next=${back}`;
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session) {
        const back = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?next=${back}`;
      } else {
        setStatus("ok");
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (status === "checking") {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-6 text-center text-xs text-[var(--color-text-muted)]">
        Comprobando sesión…
      </div>
    );
  }

  if (status === "anon") return null;

  return <>{children}</>;
}
