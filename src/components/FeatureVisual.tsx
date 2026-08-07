import { useEffect, useRef, useState } from "react";
import {
  Lock,
  Check,
  FileText,
  CornerDownLeft,
  Layers,
  ArrowRight,
  CalendarClock,
} from "lucide-react";

/**
 * Built visuals for the features that have no capture yet.
 *
 * These replace "capture pending" panels. They are HTML rather than video on
 * purpose: they stay crisp, weigh nothing, theme with the site, and — unlike a
 * recording — cannot drift out of date when the UI moves, because they show a
 * CONCEPT rather than claiming to be a screenshot.
 */

const shell =
  "relative overflow-hidden rounded-2xl border border-line bg-[#17140f] shadow-[0_40px_90px_-40px_rgba(43,38,53,0.9)]";
const bloom =
  "absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(169,76,28,0.16),transparent_70%)] blur-xl";

function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (e) => e[0]?.isIntersecting && (setSeen(true), io.disconnect()),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

/* ── Workspaces: three sealed stacks, one active ───────────────────────────── */
export function WorkspacesVisual() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const spaces = [
    { name: "Personal", items: ["Notes", "Bills", "Health"] },
    { name: "Studio", items: ["Clients", "Invoices", "Briefs"] },
    { name: "Homelab", items: ["Uptime", "Backups", "Media"] },
  ];

  useEffect(() => {
    if (!seen) return;
    const iv = window.setInterval(() => setActive((a) => (a + 1) % spaces.length), 2600);
    return () => window.clearInterval(iv);
  }, [seen, spaces.length]);

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className={bloom} />
      <div className={shell}>
        <div className="flex gap-1 border-b border-white/8 bg-white/[0.03] p-2">
          {spaces.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              className={[
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-all",
                i === active
                  ? "bg-ember text-white"
                  : "text-bone/50 hover:bg-white/8 hover:text-bone",
              ].join(" ")}
            >
              <Layers className="size-3.5" strokeWidth={1.9} />
              {s.name}
            </button>
          ))}
        </div>
        <div className="grid min-h-[190px] grid-cols-3 gap-3 p-5">
          {spaces[active].items.map((it, i) => (
            <div
              key={it}
              style={{ animationDelay: `${i * 70}ms` }}
              className="motion-safe:animate-[cardIn_360ms_ease-out_both] rounded-xl border border-white/8 bg-white/[0.04] p-3"
            >
              <FileText className="size-4 text-ember/80" strokeWidth={1.8} />
              <p className="mt-2 text-[12.5px] text-bone/80">{it}</p>
            </div>
          ))}
        </div>
        <p className="border-t border-white/8 px-5 py-3 font-mono text-[10.5px] tracking-[0.1em] text-bone/30 uppercase">
          nothing crosses between them
        </p>
      </div>
      <style>{`@keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}

/* ── Agents: what you end up with, running ────────────────────────────────── */
export function AgentsVisual() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const agents = [
    { name: "Morning uptime check", when: "Mon–Sun · 07:00", state: "ok" },
    { name: "Invoice watcher", when: "Weekdays · 09:00", state: "run" },
    { name: "Inbox triage", when: "Every 30 min", state: "ok" },
    { name: "Weekly reading digest", when: "Sun · 18:00", state: "idle" },
  ];

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className={bloom} />
      <div className={shell}>
        <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
          <span className="text-[12.5px] font-medium text-bone/80">Agents</span>
          <span className="ml-auto font-mono text-[10.5px] tracking-[0.1em] text-bone/30 uppercase">
            4 running
          </span>
        </div>
        <div className="flex flex-col">
          {agents.map((a, i) => (
            <div
              key={a.name}
              style={{ transitionDelay: `${i * 90}ms` }}
              className={[
                "flex items-center gap-3 border-b border-white/6 px-4 py-3.5 transition-all duration-500 last:border-0",
                seen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
              ].join(" ")}
            >
              <span
                className={[
                  "size-1.5 shrink-0 rounded-full",
                  a.state === "run"
                    ? "bg-ember motion-safe:animate-[pulse_1.6s_ease-in-out_infinite]"
                    : a.state === "ok"
                      ? "bg-[#6fbf8f]"
                      : "bg-bone/25",
                ].join(" ")}
              />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] text-bone/90">{a.name}</p>
                <p className="truncate font-mono text-[11px] text-bone/35">{a.when}</p>
              </div>
              {a.state === "run" && (
                <span className="ml-auto shrink-0 rounded-full bg-ember/15 px-2 py-0.5 font-mono text-[10px] tracking-wide text-ember">
                  RUNNING
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Secrets: a credential being sealed ───────────────────────────────────── */
export function SecretsVisual() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const [sealed, setSealed] = useState(false);

  useEffect(() => {
    if (!seen) return;
    const iv = window.setInterval(() => setSealed((s) => !s), 2400);
    return () => window.clearInterval(iv);
  }, [seen]);

  const rows = [
    { k: "STRIPE_KEY", v: "sk_live_51QxT8mKp9wRt2Nv" },
    { k: "GMAIL_TOKEN", v: "ya29.a0AfB_byDk3mQx7Lp" },
  ];

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className={bloom} />
      <div className={shell}>
        <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
          <Lock className="size-3.5 text-ember" strokeWidth={2} />
          <span className="text-[12.5px] font-medium text-bone/80">Secrets</span>
          <span
            className={[
              "ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide transition-colors",
              sealed ? "bg-[#1e3328] text-[#6fbf8f]" : "bg-white/8 text-bone/40",
            ].join(" ")}
          >
            {sealed && <Check className="size-2.5" strokeWidth={3} />}
            {sealed ? "ENCRYPTED AT REST" : "IN MEMORY"}
          </span>
        </div>
        <div className="flex min-h-[190px] flex-col justify-center gap-3 p-5">
          {rows.map((r) => (
            <div key={r.k} className="rounded-xl border border-white/8 bg-white/[0.04] p-3">
              <p className="font-mono text-[10.5px] tracking-[0.1em] text-bone/35">{r.k}</p>
              <p
                className={[
                  "mt-1.5 font-mono text-[13px] transition-all duration-500",
                  sealed ? "text-bone/30 blur-[3px] select-none" : "text-ember/90 blur-0",
                ].join(" ")}
              >
                {r.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Chat: a question answered from the knowledge base ────────────────────── */
export function ChatVisual() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!seen) return;
    const iv = window.setInterval(() => setStep((s) => (s >= 3 ? 0 : s + 1)), 1500);
    return () => window.clearInterval(iv);
  }, [seen]);

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className={bloom} />
      <div className={shell}>
        <div className="flex min-h-[240px] flex-col gap-3 p-5">
          <div
            className={`flex justify-end transition-all duration-500 ${step >= 1 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-ember px-3.5 py-2.5 text-[13.5px] text-white">
              What did I decide about the pricing tiers?
            </p>
          </div>

          <div
            className={`flex items-center gap-2 transition-all duration-500 ${step >= 2 ? "opacity-100" : "opacity-0"}`}
          >
            <FileText className="size-3.5 text-ember/70" strokeWidth={1.9} />
            <span className="font-mono text-[10.5px] tracking-[0.08em] text-bone/40">
              read notes/pricing.md · notes/meetings/2026-07.md
            </span>
          </div>

          <div
            className={`flex justify-start transition-all duration-500 ${step >= 3 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-bone/90">
              You settled on three tiers and agreed to keep self-hosting free forever. The
              open question was whether the middle tier includes priority support.
            </p>
          </div>
        </div>
        <p className="flex items-center gap-1.5 border-t border-white/8 px-5 py-3 font-mono text-[10.5px] tracking-[0.1em] text-bone/30 uppercase">
          <CornerDownLeft className="size-3" /> answered from your own notes
        </p>
      </div>
    </div>
  );
}

/* ── Scheduling: plain words becoming a schedule ──────────────────────────── */
export function ScheduleVisual() {
  const { ref, seen } = useInView<HTMLDivElement>();
  const [i, setI] = useState(0);
  const lines = [
    { said: "every weekday at eight and again at ten", got: "Mon–Fri · 08:00, 10:00" },
    { said: "first Monday of the month", got: "Monthly · 1st Mon · 09:00" },
    { said: "every 20 minutes during work hours", got: "Mon–Fri · 09:00–17:00 · /20m" },
    { said: "only when I ask", got: "Manual · no schedule" },
  ];

  useEffect(() => {
    if (!seen) return;
    const iv = window.setInterval(() => setI((v) => (v + 1) % lines.length), 2600);
    return () => window.clearInterval(iv);
  }, [seen, lines.length]);

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className={bloom} />
      <div className={shell}>
        <div className="flex min-h-[240px] flex-col justify-center gap-5 p-6">
          <div>
            <p className="font-mono text-[10.5px] tracking-[0.12em] text-bone/30 uppercase">
              you say
            </p>
            <p
              key={`s${i}`}
              className="motion-safe:animate-[swap_400ms_ease-out] mt-2 text-[17px] leading-snug text-bone/90"
            >
              “{lines[i].said}”
            </p>
          </div>

          <ArrowRight className="size-4 rotate-90 text-ember/60" strokeWidth={2} />

          <div>
            <p className="font-mono text-[10.5px] tracking-[0.12em] text-bone/30 uppercase">
              it runs
            </p>
            <p
              key={`g${i}`}
              className="motion-safe:animate-[swap_400ms_ease-out_120ms_both] mt-2 flex items-center gap-2 font-mono text-[14px] text-ember"
            >
              <CalendarClock className="size-4" strokeWidth={1.9} />
              {lines[i].got}
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes swap { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}
