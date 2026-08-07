import { useEffect, useRef, useState } from "react";
import { Inbox, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import telegramSvg from "../assets/logos/telegram.svg?raw";
import slackSvg from "../assets/logos/slack.svg?raw";
import discordSvg from "../assets/logos/discord.svg?raw";
import { namespaceSvgIds } from "../lib/svg";

/**
 * Both delivery routes side by side: the durable inbox record, and the same
 * item arriving in whichever chat app you use.
 *
 * The three brand marks are the vendored ones rather than lucide glyphs — a
 * monochrome outline is much harder to recognise than the real mark. Their ids
 * are namespaced for the same reason the logo walls do it: inlined SVGs share
 * one id scope per document.
 */
const APPS = [
  { id: "telegram", label: "Telegram", svg: namespaceSvgIds(telegramSvg, "nd-tg") },
  { id: "slack", label: "Slack", svg: namespaceSvgIds(slackSvg, "nd-sl") },
  { id: "discord", label: "Discord", svg: namespaceSvgIds(discordSvg, "nd-dc") },
] as const;

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
    body: "Two invoices are past due — written into your notes.",
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

/** The commands the chat apps actually expose. */
const COMMANDS = [
  { cmd: "/run", what: "run an agent now" },
  { cmd: "/remind", what: "set a reminder" },
  { cmd: "/chat", what: "talk to your knowledge" },
  { cmd: "/agent", what: "build a new one" },
];

export default function NotificationDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [app, setApp] = useState<string>("telegram");
  const [cmdIdx, setCmdIdx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setN(ITEMS.length);
      return;
    }
    let a = 0;
    let b = 0;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          a = window.setInterval(() => setN((v) => (v >= ITEMS.length ? 0 : v + 1)), 1400);
          b = window.setInterval(() => setCmdIdx((v) => (v + 1) % COMMANDS.length), 2200);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(a);
      window.clearInterval(b);
    };
  }, []);

  const command = COMMANDS[cmdIdx];

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(169,76,28,0.15),transparent_70%)] blur-xl"
      />

      <div className="relative grid gap-4 lg:grid-cols-[1.15fr_1fr]">
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

        {/* Chat app, with a tab each */}
        <div className="overflow-hidden rounded-2xl border border-line bg-[#17140f] shadow-[0_28px_60px_-32px_rgba(43,38,53,0.7)]">
          <div
            role="tablist"
            aria-label="Chat app"
            className="flex gap-1 border-b border-white/8 bg-white/[0.03] p-1.5"
          >
            {APPS.map((a) => {
              const on = a.id === app;
              return (
                <button
                  key={a.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setApp(a.id)}
                  className={[
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium transition-all",
                    on ? "bg-white/12 text-bone" : "text-bone/45 hover:bg-white/8 hover:text-bone/80",
                  ].join(" ")}
                >
                  {/* The vendored marks carry their own brand colours, so an
                      inactive tab is desaturated rather than recoloured. */}
                  <span
                    className={[
                      "[&>svg]:size-[15px] transition-all duration-200",
                      on ? "grayscale-0 opacity-100" : "opacity-70 grayscale",
                    ].join(" ")}
                    dangerouslySetInnerHTML={{ __html: a.svg }}
                  />
                  {a.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5 p-4">
            {/* Incoming notification */}
            <div
              key={`${app}-msg`}
              className={[
                "motion-safe:animate-[msgIn_400ms_ease-out] rounded-2xl rounded-tl-sm bg-white/8 px-3.5 py-2.5",
                n >= 2 ? "opacity-100" : "opacity-40",
              ].join(" ")}
            >
              <p className="text-[12.5px] leading-snug text-bone/90">
                Two invoices are past due. I've written the details into your notes under
                Finance.
              </p>
              <p className="mt-1.5 font-mono text-[10px] text-bone/35">09:14</p>
            </div>

            {/* Slash commands — you can talk back */}
            <div className="mt-1 rounded-xl border border-white/8 bg-white/[0.03] p-2.5">
              <p className="mb-2 font-mono text-[9.5px] tracking-[0.14em] text-bone/30 uppercase">
                and you can reply
              </p>
              <div className="flex flex-wrap gap-1">
                {COMMANDS.map((c, i) => (
                  <button
                    key={c.cmd}
                    onClick={() => setCmdIdx(i)}
                    className={[
                      "rounded-md px-1.5 py-0.5 font-mono text-[11px] transition-colors",
                      i === cmdIdx ? "bg-ember/20 text-ember" : "text-bone/40 hover:text-bone/70",
                    ].join(" ")}
                  >
                    {c.cmd}
                  </button>
                ))}
              </div>
              <p
                key={command.cmd}
                className="motion-safe:animate-[msgIn_300ms_ease-out] mt-2 text-[12px] text-bone/60"
              >
                <span className="font-mono text-ember/90">{command.cmd}</span> — {command.what}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes msgIn { from { opacity:0; transform: translateY(5px) } to { opacity:1; transform:none } }`}</style>
    </div>
  );
}
