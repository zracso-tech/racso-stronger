import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignOutButton() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setHasSession(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!hasSession) return null;

  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }}
      className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
    >
      Salir
    </button>
  );
}
