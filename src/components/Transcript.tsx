import { useEffect, useRef, useState } from "react";
import { Bot, Check, CircleDot, Play, Save } from "lucide-react";

/**
 * PLACEHOLDER CONTENT — must be replaced with a VERBATIM capture from a real
 * designer build before launch (redaction the only permitted edit), and
 * re-captured whenever the designer's prompts change. A scripted demo on a page
 * arguing its claims are checkable would be a demo that lies.
 *
 * The frame around it is real, though: the header, the build steps and the
 * saved-agent card exist so a visitor can tell WHAT is being built. Without
 * them this read as a generic chat bubble demo.
 */
type Turn = { from: "you" | "rookery"; text: string };

const TURNS: Turn[] = [
  {
    from: "you",
    text: "Every morning, tell me if any of my sites went down overnight.",
  },
  {
    from: "rookery",
    text: "Two quick questions. Which sites should I watch, and should I message you every morning or only when something is actually wrong?",
  },
  { from: "you", text: "rookery.sh and my blog. Only when something is wrong." },
  {
    from: "rookery",
    text: "Here is the agent I will build:\n\n• Checks both sites every morning at 7am\n• Messages you only if one is unreachable or slow\n• Writes every check into your notes, under Uptime\n\nType approve and I will build it and test it for real.",
  },
  { from: "you", text: "approve" },
];

const STEPS = [
  { Icon: CircleDot, label: "Writing the agent" },
  { Icon: Play, label: "Running it for real" },
  { Icon: Check, label: "Both sites answered in 380ms" },
  { Icon: Save, label: "Saved" },
];

export default function Transcript() {
  const [visible, setVisible] = useState(0);
  const [step, setStep] = useState(-1);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) {
      setVisible(TURNS.length);
      setStep(STEPS.length);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => e[0]?.isIntersecting && (setStarted(true), io.disconnect()),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!started || reduced) return;
    if (visible >= TURNS.length) return;
    const t = TURNS[visible];
    const delay = t.from === "you" ? 620 : 1000 + t.text.length * 3.6;
    const id = window.setTimeout(() => setVisible((v) => v + 1), delay);
    return () => window.clearTimeout(id);
  }, [started, visible, reduced]);

  // Build steps begin only once the conversation is done.
  useEffect(() => {
    if (reduced || visible < TURNS.length) return;
    if (step >= STEPS.length) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), step < 0 ? 400 : 900);
    return () => window.clearTimeout(id);
  }, [visible, step, reduced]);

  const done = step >= STEPS.length;

  return (
    <div ref={ref} className="mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_30px_70px_-34px_rgba(43,38,53,0.5)]">
        {/* Header — this is what makes it read as "building an agent" */}
        <div className="flex items-center gap-2.5 border-b border-line/70 px-5 py-3.5">
          <span className="grid size-7 place-items-center rounded-lg bg-ember-soft text-ember">
            <Bot className="size-4" strokeWidth={1.9} />
          </span>
          <span className="text-[13.5px] font-semibold">New agent</span>
          <span className="ml-auto font-mono text-[11px] tracking-[0.1em] text-stone uppercase">
            {done ? "ready" : "designing"}
          </span>
        </div>

        <div className="flex flex-col gap-3 p-5">
          {TURNS.slice(0, visible).map((turn, i) => (
            <div
              key={i}
              className={turn.from === "you" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={[
                  "motion-safe:animate-[fadeUp_260ms_ease-out] max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-line",
                  turn.from === "you"
                    ? "rounded-br-sm bg-ember text-white"
                    : "rounded-bl-sm bg-bone text-bark",
                ].join(" ")}
              >
                {turn.text}
              </div>
            </div>
          ))}

          {started && visible < TURNS.length && (
            <div className="flex justify-start" aria-hidden="true">
              <div className="rounded-2xl bg-bone px-4 py-3">
                <span className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="size-1.5 rounded-full bg-stone/50 motion-safe:animate-[blink_1.2s_ease-in-out_infinite]"
                      style={{ animationDelay: `${d * 0.18}s` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Build steps */}
        {visible >= TURNS.length && (
          <div className="border-t border-line/70 bg-bone/50 px-5 py-4">
            <div className="flex flex-col gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s.label}
                  className={[
                    "flex items-center gap-2.5 text-[13px] transition-all duration-500",
                    i <= step ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
                    i === STEPS.length - 1 ? "font-medium text-bark" : "text-stone",
                  ].join(" ")}
                >
                  <s.Icon
                    className={i <= step ? "size-3.5 text-ember" : "size-3.5"}
                    strokeWidth={2}
                  />
                  {s.label}
                </div>
              ))}
            </div>

            {done && (
              <div className="motion-safe:animate-[fadeUp_320ms_ease-out] mt-4 flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3">
                <span className="grid size-8 place-items-center rounded-lg bg-ember text-white">
                  <Bot className="size-4" strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold">
                    Morning uptime check
                  </p>
                  <p className="truncate text-[12.5px] text-stone">
                    Mon–Sun · 07:00 · notifies only on failure
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes blink { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
