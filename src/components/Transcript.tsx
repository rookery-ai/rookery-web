import { useEffect, useRef, useState } from "react";

/**
 * PLACEHOLDER CONTENT.
 *
 * The spec requires this to be a VERBATIM capture from a real designer build —
 * redaction is the only permitted edit — because a scripted demo on a page whose
 * whole argument is "our claims are checkable" is a demo that lies.
 *
 * What is below is scaffolding so the component can be judged. It must be
 * replaced with a real capture before launch, and re-captured whenever the
 * designer's prompts or output protocol change.
 */
type Turn = { from: "you" | "rookery"; text: string };

const TURNS: Turn[] = [
  { from: "you", text: "Every morning tell me if any of my sites went down overnight." },
  {
    from: "rookery",
    text: "Two quick things. Which sites should I watch — and should I message you every morning, or only when something is actually wrong?",
  },
  { from: "you", text: "rookery.sh and my blog. Only when something's wrong." },
  {
    from: "rookery",
    text: "Here's what I'll build:\n\n• Checks both sites every morning at 7\n• Messages you only if one is unreachable or slow\n• Writes every check into your notes under Uptime\n\nType approve when that looks right.",
  },
  { from: "you", text: "approve" },
  {
    from: "rookery",
    text: "Built it and ran it for real — both sites answered in under 400ms, so nothing was sent. Saved as “Morning uptime check”.",
  },
];

const PLAY_MS = 34;

export default function Transcript() {
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Start only when scrolled into view, so a visitor never arrives at a
  // half-finished animation they didn't see begin.
  useEffect(() => {
    if (reduced) {
      setVisible(TURNS.length);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!started || reduced) return;
    if (visible >= TURNS.length) return;
    const turn = TURNS[visible];
    const delay = turn.from === "you" ? 520 : 900 + turn.text.length * PLAY_MS * 0.1;
    const t = window.setTimeout(() => setVisible((v) => v + 1), delay);
    return () => window.clearTimeout(t);
  }, [started, visible, reduced]);

  const done = visible >= TURNS.length;

  return (
    <div ref={ref} className="mx-auto w-full max-w-2xl">
      <div className="rounded-xl border border-line bg-paper p-4 shadow-[0_24px_60px_-30px_rgba(70,64,90,0.55)] sm:p-6">
        <div className="flex flex-col gap-3">
          {TURNS.slice(0, visible).map((turn, i) => (
            <div
              key={i}
              className={turn.from === "you" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={[
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-line",
                  "motion-safe:animate-[fadeUp_260ms_ease-out]",
                  turn.from === "you"
                    ? "bg-ember text-white"
                    : "bg-bone text-bark",
                ].join(" ")}
              >
                {turn.text}
              </div>
            </div>
          ))}

          {!done && started && (
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
      </div>

      {!done && (
        <button
          onClick={() => setVisible(TURNS.length)}
          className="mt-3 text-[13px] text-stone underline decoration-stone/30 underline-offset-2 hover:text-bark"
        >
          Skip
        </button>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes blink { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
