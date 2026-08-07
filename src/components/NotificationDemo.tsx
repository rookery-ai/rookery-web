import { useEffect, useRef, useState } from "react";
import { Inbox, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { TelegramIcon } from "./icons";

/**
 * Both delivery routes side by side: the durable inbox record, and the same
 * item arriving on a phone. Built rather than captured — a real capture of two
 * surfaces at once is awkward, and this stays crisp.
 */
const ITEMS = [
  {
    Icon: CheckCircle2,
    tone: "ok" as const,
    title: "Morning uptime check",
    body: "Both sites answered in under 400ms.",
    when: "07:00",
  },
  {
    Icon: AlertTriangle,
    tone: "warn" as const,
    title: "Invoice watcher",
    body: "Two invoices are past due — moved to your notes.",
    when: "09:14",
  },
  {
    Icon: Clock,
    tone: "plain" as const,
    title: "Reminder",
    body: "Call the dentist.",
    when: "11:30",
  },
];

const TONE = {
  ok: "text-[#3b7154] bg-[#dbeddb]",
  warn: "text-[#85610f] bg-[#fdecc8]",
  plain: "text-stone bg-bone",
};

export default function NotificationDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setN(ITEMS.length);
      return;
    }
    let iv = 0;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          iv = window.setInterval(
            () => setN((v) => (v >= ITEMS.length ? 0 : v + 1)),
            1400,
          );
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(iv);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(169,76,28,0.15),transparent_70%)] blur-xl"
      />

      <div className="relative grid gap-4 sm:grid-cols-[1.35fr_1fr]">
        {/* Inbox */}
        <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_28px_60px_-32px_rgba(43,38,53,0.6)]">
          <div className="flex items-center gap-2 border-b border-line/70 px-4 py-3">
            <Inbox className="size-4 text-ember" strokeWidth={1.9} />
            <span className="text-[13px] font-semibold">Inbox</span>
            <span className="ml-auto font-mono text-[11px] text-stone">Today</span>
          </div>
          <div className="flex flex-col">
            {ITEMS.map((it, i) => (
              <div
                key={it.title}
                className={[
                  "flex gap-3 border-b border-line/50 px-4 py-3 transition-all duration-500 last:border-0",
                  i < n ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
                ].join(" ")}
              >
                <span
                  className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg ${TONE[it.tone]}`}
                >
                  <it.Icon className="size-3.5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium">{it.title}</p>
                  <p className="truncate text-[12.5px] text-stone">{it.body}</p>
                </div>
                <span className="ml-auto shrink-0 font-mono text-[11px] text-stone/70">
                  {it.when}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-[#17140f] p-4 shadow-[0_28px_60px_-32px_rgba(43,38,53,0.7)]">
          <div className="mb-3 flex items-center gap-2">
            <TelegramIcon className="size-4 text-[#5aa9dc]" />
            <span className="text-[12.5px] font-medium text-bone/80">Telegram</span>
          </div>
          <div
            className={[
              "rounded-2xl rounded-tl-sm bg-white/8 px-3.5 py-2.5 transition-all duration-500",
              n >= 2 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            ].join(" ")}
          >
            <p className="text-[13px] leading-snug text-bone/90">
              Two invoices are past due. I've written the details into your notes under
              Finance.
            </p>
            <p className="mt-1.5 font-mono text-[10.5px] text-bone/35">09:14</p>
          </div>
        </div>
      </div>
    </div>
  );
}
