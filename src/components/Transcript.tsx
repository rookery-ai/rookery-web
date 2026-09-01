import { useEffect, useRef, useState } from "react";
import { Bot, Check, CircleDot, KeyRound, LogIn, PauseCircle, Play } from "lucide-react";

/**
 * PLACEHOLDER CONTENT — must be replaced with a VERBATIM capture from a real
 * designer build before launch (redaction the only permitted edit), and
 * re-captured whenever the designer's prompts change. A scripted demo on a page
 * arguing its claims are checkable would be a demo that lies.
 *
 * The frame around it is real, though: the header, the build steps and the
 * saved-agent card exist so a visitor can tell WHAT is being built. Without
 * them this read as a generic chat bubble demo.
 *
 * WHY THIS SCENARIO. The previous one checked whether two websites were up.
 * That is a fetch on a timer — a reader who already knows what cron is learns
 * nothing from it, and it is the example they use to decide whether the rest of
 * the page is worth reading.
 *
 * Paying a bill is the most compelling demo available and also the most
 * alarming, so the restraint has to be visible in the SAME frame as the
 * capability — the Allow-and-build turn and the stop before payment are the
 * point of the sequence, not a caveat attached afterwards. Shown together it
 * reads as competence; shown apart it reads as recklessness discovered later.
 *
 * The card values are secret PLACEHOLDERS, never values. That is both the only
 * safe thing to render and the more impressive shot, because it is the visible
 * evidence that the model never receives them.
 */
type Turn = { from: "you" | "rookery"; text: string };

const TURNS: Turn[] = [
  {
    from: "you",
    text: "Pay any unpaid bills on my energy account each month.",
  },
  {
    from: "rookery",
    text: "I opened the account page to see what is there. It needs a sign-in, and bills are listed per month with a Pay button.\n\nTwo questions. Which card should it use, and do you want it to pay automatically or check with you first?",
  },
  {
    from: "you",
    text: "The card in Secrets. Check with me first, every time.",
  },
  {
    from: "rookery",
    text: "Here is the agent I will build:\n\n• Signs in on the 1st of each month\n• Finds bills still unpaid for the previous month\n• Fills the card fields from Secrets\n• Stops before paying and messages you on Telegram\n\nThis agent can make a payment, which cannot be undone. Building it needs your permission.",
  },
  { from: "you", text: "Allow and build" },
];

const STEPS = [
  { Icon: CircleDot, label: "Writing the agent" },
  { Icon: Play, label: "Test run against the real site" },
  { Icon: LogIn, label: "Signed in" },
  { Icon: Check, label: "Found 1 unpaid bill for August" },
  { Icon: KeyRound, label: "Filled card fields — ${CARD_NUMBER}, ${CVV}" },
  { Icon: PauseCircle, label: "Stopped before paying. Messaged you." },
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
                    Monthly energy bill
                  </p>
                  <p className="truncate text-[12.5px] text-stone">
                    1st of the month · 09:00 · asks before paying
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
