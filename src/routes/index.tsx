import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Save,
  Send,
  CheckCircle2,
  Clock,
  FileEdit,
  Wheat,
  Ship,
  Calendar,
  Building2,
  UserRound,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Registro Web de Contratos — Intelisoft" },
      { name: "description", content: "Carga rápida de contratos de venta de granos desde el campo o la oficina." },
    ],
  }),
  component: ContractsPage,
});

type Status = "borrador" | "pendiente" | "aprobado";

const commodities = ["Soja", "Trigo", "Maíz", "Cebada", "Girasol", "Sorgo"];
const monedas = ["USD", "ARS"] as const;
const condiciones = ["Precio Fijo", "A Fijar"] as const;

const fmt = new Intl.NumberFormat("es-AR");

function ContractsPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [status, setStatus] = useState<Status>("borrador");
  const [form, setForm] = useState({
    compradorRazon: "BUNGE ARGENTINA S.A.",
    compradorCuit: "30-50675509-8",
    vendedorRazon: "ESTABLECIMIENTO LA PRIMAVERA SRL",
    vendedorCuit: "30-71045890-2",
    corredor: "A&J NARI S.A.",
    representante: "Andrés Nari",
    commodity: "Soja",
    cantidad: "1500",
    precio: "315",
    moneda: "USD" as (typeof monedas)[number],
    condicion: "Precio Fijo" as (typeof condiciones)[number],
    destino: "Puerto Rosario - Terminal 6",
    fechaEntrega: "2025-04-15",
    observaciones: "Mercadería con calidad cámara. Descuentos según norma XXIX. Entrega en 6 cuotas iguales.",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const total = useMemo(() => {
    const c = parseFloat(form.cantidad || "0");
    const p = parseFloat(form.precio || "0");
    return c * p;
  }, [form.cantidad, form.precio]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto max-w-[1400px] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:px-8 sm:py-5">
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                intelisoft · operaciones
              </p>
              <h1 className="truncate text-base sm:text-lg font-semibold tracking-tight mt-1">
                Registro Web de Contratos de Venta
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex font-mono text-[11px] px-2.5 py-1 rounded border border-border text-muted-foreground">
                Ejercicio <span className="ml-1 text-foreground">2025</span>
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gold text-gold-foreground font-mono text-xs font-semibold">
                AN
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">

            <StatusBar status={status} onChange={setStatus} />

            {/* Summary cards (dashboard-style) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                label="Commodity"
                value={form.commodity || "—"}
                hint={`${form.condicion} · ${form.moneda}`}
                icon={<Wheat className="h-4 w-4" />}
              />
              <SummaryCard
                label="Cantidad"
                value={
                  <>
                    {fmt.format(parseFloat(form.cantidad || "0"))}
                    <span className="ml-1.5 text-base font-normal text-muted-foreground">Tn</span>
                  </>
                }
                hint="Tonelaje contratado"
              />
              <SummaryCard
                label={`Precio / Tn (${form.moneda})`}
                value={
                  <>
                    <span className="text-muted-foreground mr-1.5">{form.moneda}</span>
                    {fmt.format(parseFloat(form.precio || "0"))}
                  </>
                }
                hint={form.condicion}
                accent
              />
              <SummaryCard
                label={`Valor total (${form.moneda})`}
                value={
                  <>
                    <span className="text-muted-foreground mr-1.5">{form.moneda}</span>
                    {fmt.format(Math.round(total))}
                  </>
                }
                hint={`${form.commodity} · ${fmt.format(parseFloat(form.cantidad || "0"))} Tn`}
              />
            </section>

            {/* Form + side preview */}
            <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
              <div className="space-y-6">
                <Card title="Contraparte" subtitle="Comprador y vendedor de la operación">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Comprador — Razón Social" icon={<Building2 className="h-3.5 w-3.5" />}>
                      <input className={inputCls} value={form.compradorRazon}
                        onChange={(e) => set("compradorRazon", e.target.value)} />
                    </Field>
                    <Field label="Comprador — CUIT">
                      <input className={`${inputCls} font-mono`} value={form.compradorCuit}
                        onChange={(e) => set("compradorCuit", e.target.value)} />
                    </Field>
                    <Field label="Vendedor — Razón Social" icon={<Building2 className="h-3.5 w-3.5" />}>
                      <input className={inputCls} value={form.vendedorRazon}
                        onChange={(e) => set("vendedorRazon", e.target.value)} />
                    </Field>
                    <Field label="Vendedor — CUIT">
                      <input className={`${inputCls} font-mono`} value={form.vendedorCuit}
                        onChange={(e) => set("vendedorCuit", e.target.value)} />
                    </Field>
                    <Field label="Corredor">
                      <input className={inputCls} value={form.corredor}
                        onChange={(e) => set("corredor", e.target.value)} />
                    </Field>
                    <Field label="Representante" icon={<UserRound className="h-3.5 w-3.5" />}>
                      <input className={inputCls} value={form.representante}
                        onChange={(e) => set("representante", e.target.value)} />
                    </Field>
                  </div>
                </Card>

                <Card title="Mercadería y precio" subtitle="Condiciones comerciales del contrato">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Commodity">
                      <SegmentedSelect
                        options={commodities}
                        value={form.commodity}
                        onChange={(v) => set("commodity", v)}
                      />
                    </Field>
                    <Field label="Cantidad (Tn)">
                      <div className="relative">
                        <input type="number" className={`${inputCls} font-mono pr-12`} value={form.cantidad}
                          onChange={(e) => set("cantidad", e.target.value)} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">Tn</span>
                      </div>
                    </Field>
                    <Field label="Precio por tonelada">
                      <div className="relative">
                        <input type="number" className={`${inputCls} font-mono pl-12`} value={form.precio}
                          onChange={(e) => set("precio", e.target.value)} />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">{form.moneda}</span>
                      </div>
                    </Field>
                    <Field label="Moneda">
                      <div className="flex gap-2">
                        {monedas.map((m) => (
                          <Pill key={m} active={form.moneda === m} onClick={() => set("moneda", m)}>{m}</Pill>
                        ))}
                      </div>
                    </Field>
                    <Field label="Condición de precio">
                      <div className="flex gap-2">
                        {condiciones.map((c) => (
                          <Pill key={c} active={form.condicion === c} onClick={() => set("condicion", c)}>{c}</Pill>
                        ))}
                      </div>
                    </Field>
                    <Field label="Puerto o destino" icon={<Ship className="h-3.5 w-3.5" />}>
                      <input className={inputCls} value={form.destino}
                        onChange={(e) => set("destino", e.target.value)} />
                    </Field>
                    <Field label="Fecha de entrega" icon={<Calendar className="h-3.5 w-3.5" />}>
                      <input type="date" className={`${inputCls} font-mono`} value={form.fechaEntrega}
                        onChange={(e) => set("fechaEntrega", e.target.value)} />
                    </Field>
                  </div>
                </Card>

                <Card title="Observaciones" subtitle="Notas internas y cláusulas particulares">
                  <textarea
                    rows={4}
                    className={`${inputCls} resize-none leading-relaxed`}
                    value={form.observaciones}
                    onChange={(e) => set("observaciones", e.target.value)}
                  />
                </Card>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Acciones
                  </span>
                  <span className="hidden sm:block h-px bg-border" />
                  <button
                    onClick={() => setStatus("borrador")}
                    className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-border bg-surface text-sm font-medium hover:bg-surface-2 transition"
                  >
                    <Save className="h-4 w-4" /> Guardar borrador
                  </button>
                  <button
                    onClick={() => setStatus("pendiente")}
                    className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-gold text-gold-foreground text-sm font-semibold hover:brightness-105 transition shadow-[0_0_0_1px_rgba(0,0,0,0.15)_inset]"
                  >
                    <Send className="h-4 w-4" /> Enviar a aprobación
                  </button>
                </div>
              </div>

              {/* Right column: live preview */}
              <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
                <ContractPreview form={form} status={status} total={total} />
                <RecentList />
              </aside>
            </section>

            <footer className="pt-2 pb-8 font-mono text-[11px] text-muted-foreground">
              A&amp;J Nari S.A. · Intelisoft ERP · Cuenta y Orden
            </footer>
        </div>
      </main>
    </div>
  );
}


/* ---------------- Status bar ---------------- */

function StatusBar({ status, onChange }: { status: Status; onChange: (s: Status) => void }) {
  const steps: { key: Status; label: string; icon: React.ReactNode }[] = [
    { key: "borrador", label: "Borrador", icon: <FileEdit className="h-3.5 w-3.5" /> },
    { key: "pendiente", label: "Pendiente de aprobación", icon: <Clock className="h-3.5 w-3.5" /> },
    { key: "aprobado", label: "Aprobado", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  ];
  const activeIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="rounded-lg border border-border bg-surface px-4 sm:px-5 py-3">
      <div className="flex items-center gap-3 overflow-x-auto">
        {steps.map((s, i) => {
          const reached = i <= activeIdx;
          const isActive = i === activeIdx;
          return (
            <div key={s.key} className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onChange(s.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                  isActive
                    ? "bg-gold/10 border-gold/50 text-gold"
                    : reached
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <span className={`h-px w-8 sm:w-12 ${i < activeIdx ? "bg-primary/50" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Cards / fields ---------------- */

const inputCls =
  "w-full h-10 px-3 rounded-md bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition";

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="px-5 sm:px-6 py-4 border-b border-border">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground/80 mt-1">{subtitle}</p>}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-surface p-5 transition ${
        accent ? "border-gold/40 shadow-[inset_0_0_0_1px_rgba(217,180,90,0.08)]" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className={`mt-3 font-mono text-2xl sm:text-[28px] leading-none font-semibold tracking-tight ${
        accent ? "text-gold" : "text-foreground"
      }`}>
        {value}
      </p>
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 h-10 px-3 rounded-md border text-sm font-medium font-mono transition ${
        active
          ? "border-gold/60 bg-gold/10 text-gold"
          : "border-border bg-input text-muted-foreground hover:text-foreground hover:border-border-strong"
      }`}
    >
      {children}
    </button>
  );
}

function SegmentedSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`h-9 px-3 rounded-md border text-xs font-medium transition ${
              active
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-border bg-input text-muted-foreground hover:text-foreground"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Preview & list ---------------- */

function ContractPreview({
  form,
  status,
  total,
}: {
  form: any;
  status: Status;
  total: number;
}) {
  const statusBadge: Record<Status, { label: string; cls: string }> = {
    borrador: { label: "Borrador", cls: "bg-muted text-muted-foreground border-border" },
    pendiente: { label: "Pendiente", cls: "bg-gold/10 text-gold border-gold/40" },
    aprobado: { label: "Aprobado", cls: "bg-primary/10 text-primary border-primary/40" },
  };

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Resumen del contrato
          </p>
          <p className="font-mono text-xs text-foreground/80 mt-1">CV-2025-{String(Math.floor(Math.random()*9000)+1000)}</p>
        </div>
        <span className={`text-[11px] font-medium font-mono px-2 py-1 rounded border ${statusBadge[status].cls}`}>
          {statusBadge[status].label}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Comprador</p>
          <p className="text-sm font-medium mt-1 truncate">{form.compradorRazon}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{form.compradorCuit}</p>
        </div>
        <div className="h-px bg-border" />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Vendedor</p>
          <p className="text-sm font-medium mt-1 truncate">{form.vendedorRazon}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{form.vendedorCuit}</p>
        </div>

        <div className="h-px bg-border" />

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Row k="Commodity" v={form.commodity} />
          <Row k="Cantidad" v={`${fmt.format(parseFloat(form.cantidad||"0"))} Tn`} mono />
          <Row k="Precio" v={`${form.moneda} ${fmt.format(parseFloat(form.precio||"0"))}`} mono />
          <Row k="Condición" v={form.condicion} />
          <Row k="Destino" v={form.destino} full />
          <Row k="Entrega" v={form.fechaEntrega} mono />
          <Row k="Corredor" v={form.corredor} full />
        </dl>

        <div className="rounded-md border border-gold/40 bg-gold/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold/90">Valor total</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-gold">
            <span className="text-base text-gold/70 mr-1.5">{form.moneda}</span>
            {fmt.format(Math.round(total))}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, mono, full }: { k: string; v: string; mono?: boolean; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{k}</p>
      <p className={`mt-0.5 truncate ${mono ? "font-mono" : ""} text-foreground`}>{v}</p>
    </div>
  );
}

function RecentList() {
  const items = [
    { id: "CV-2025-1284", cliente: "Cargill S.A.", commodity: "Trigo", tn: 800, status: "aprobado" as Status },
    { id: "CV-2025-1283", cliente: "ADM Argentina", commodity: "Maíz", tn: 1200, status: "pendiente" as Status },
    { id: "CV-2025-1282", cliente: "LDC Argentina", commodity: "Soja", tn: 2400, status: "borrador" as Status },
  ];
  const dot: Record<Status, string> = {
    borrador: "bg-muted-foreground",
    pendiente: "bg-gold",
    aprobado: "bg-primary",
  };
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Contratos recientes
        </p>
        <a href="#" className="font-mono text-[11px] text-gold hover:underline">Ver todos →</a>
      </div>
      <ul className="divide-y divide-border">
        {items.map((it) => (
          <li key={it.id} className="px-5 py-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${dot[it.status]}`} />
            <div className="min-w-0">
              <p className="text-sm truncate">{it.cliente}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {it.id} · {it.commodity}
              </p>
            </div>
            <p className="font-mono text-xs text-foreground">{fmt.format(it.tn)} Tn</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
