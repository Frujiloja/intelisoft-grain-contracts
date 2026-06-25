import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { unlockSite } from "@/lib/gate.functions";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Acceso restringido — Intelisoft" },
      { name: "description", content: "Acceso privado al módulo de contratos." },
    ],
  }),
  component: UnlockPage,
});

function UnlockPage() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const { ok } = await unlock({ data: { password } });
      if (ok) {
        await router.navigate({ to: "/" });
        await router.invalidate();
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid place-items-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <p className="font-mono text-base font-semibold tracking-tight">intelisoft</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-1">
            Cuenta y Orden
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-gold/10 border border-gold/40 text-gold">
              <Lock className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Acceso restringido
              </p>
              <p className="text-sm font-semibold mt-0.5 truncate">
                Registro Web de Contratos de Venta
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-5">
            <label className="block space-y-1.5">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                Clave de acceso
              </span>
              <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    autoFocus
    autoComplete="current-password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••••••"
    className="w-full h-11 px-3 pr-10 rounded-md bg-input border border-border text-sm font-mono tracking-wider focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
  />
  <button
    type="button"
    onClick={() => setShowPassword((v) => !v)}
    className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
    aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
  >
    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
</div>
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Clave incorrecta. Verificá e intentá nuevamente.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || password.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md bg-gold text-gold-foreground text-sm font-semibold hover:brightness-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : (
                <>
                  Ingresar al módulo <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground pt-1">
              Acceso autorizado · representantes comerciales
            </p>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-muted-foreground">
          A&amp;J Nari S.A. · Intelisoft ERP · Ejercicio 2026
        </p>
      </div>
    </div>
  );
}
