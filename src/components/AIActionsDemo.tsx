import { useEffect, useRef, useState } from "react";
import { Sparkles, SpellCheck, Lightbulb, WandSparkles, MousePointer2 } from "lucide-react";

/**
 * The knowledge base's AI selection actions, staged as a scripted interaction:
 * a pointer travels to a paragraph, drags a selection across it, the toolbar
 * pops up at the selection, the pointer picks an action, and the sentence is
 * rewritten in place.
 *
 * The four actions and their icons match the product exactly
 * (web/ui/src/pages/kb/AIActions.tsx): Improve, Proofread, Explain, Reformat.
 *
 * Built rather than filmed: it stays crisp at any size, weighs nothing, themes
 * with the site, and a visitor can take it over at any point by clicking an
 * action themselves.
 */
const ACTIONS = [
  { id: "improve", label: "Improve", Icon: Sparkles },
  { id: "proofread", label: "Proofread", Icon: SpellCheck },
  { id: "explain", label: "Explain", Icon: Lightbulb },
  { id: "reformat", label: "Reformat", Icon: WandSparkles },
] as const;

type ActionId = (typeof ACTIONS)[number]["id"];

const BEFORE =
  "the deploy went fine but there was a issue with the db migration that we had to rollback and then re-run it manually";

const AFTER: Record<ActionId, string> = {
  improve:
    "The deploy succeeded, but a database migration failed and had to be rolled back and re-run by hand.",
  proofread:
    "The deploy went fine, but there was an issue with the database migration that we had to roll back and then re-run manually.",
  explain:
    "A note about a deployment: it completed, but one database change did not apply cleanly and needed manual intervention.",
  reformat: "**Deploy** — succeeded\n**Migration** — failed, rolled back\n**Fix** — re-run manually",
};

/** idle → moving to text → selecting → toolbar shown → moving to action → working → done */
type Phase = "idle" | "move" | "select" | "toolbar" | "reach" | "working" | "done";

export default function AIActionsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [action, setAction] = useState<ActionId>("improve");
  const [taken, setTaken] = useState(false);
  const [cursor, setCursor] = useState({ x: 8, y: 88 });
  const [loop, setLoop] = useState(0);

  const clear = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => () => clear(), []);

  // Start when scrolled into view; honour reduced motion by showing the end state.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    const io = new IntersectionObserver(
      (e) => e[0]?.isIntersecting && (setLoop(1), io.disconnect()),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The scripted run. Percentages are relative to the panel, so it survives
  // any width without measuring anything.
  useEffect(() => {
    if (!loop || taken) return;
    clear();
    const next = ACTIONS[(loop - 1) % ACTIONS.length].id;
    setAction(next);
    setPhase("idle");
    setCursor({ x: 8, y: 88 });

    at(300, () => {
      setPhase("move");
      setCursor({ x: 14, y: 56 });
    });
    at(1150, () => {
      setPhase("select");
      setCursor({ x: 86, y: 64 });
    });
    at(2050, () => setPhase("toolbar"));
    at(2500, () => {
      setPhase("reach");
      const i = ACTIONS.findIndex((a) => a.id === next);
      setCursor({ x: 17 + i * 21, y: 40 });
    });
    at(3400, () => setPhase("working"));
    at(3950, () => setPhase("done"));
    at(7000, () => setLoop((l) => l + 1));
    return clear;
  }, [loop, taken]);

  function pick(id: ActionId) {
    setTaken(true);
    clear();
    setAction(id);
    setPhase("working");
    at(520, () => setPhase("done"));
  }

  const selecting = phase === "select";
  const selected = ["toolbar", "reach", "working", "done"].includes(phase);
  const showToolbar = ["toolbar", "reach", "working", "done"].includes(phase) || taken;
  const rewritten = phase === "done";
  const showCursor = !taken && ["move", "select", "toolbar", "reach"].includes(phase);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(169,76,28,0.18),transparent_70%)] blur-xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#17140f] shadow-[0_40px_90px_-40px_rgba(43,38,53,0.9)]">
        {/* Note chrome */}
        <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-5 py-3">
          <span className="font-mono text-[10.5px] tracking-[0.14em] text-bone/30 uppercase">
            notes / standup.md
          </span>
        </div>

        <div className="relative px-6 py-6">
          {/* A real-looking page, so the selection has context */}
          <h4 className="text-[15px] font-semibold text-bone/90">Tuesday standup</h4>
          <p className="mt-3 text-[13.5px] leading-[1.75] text-bone/45">
            Shipped the new connector settings screen. Reviewed two pull requests and
            cleared the backlog on the release checklist.
          </p>

          <p className="mt-3 text-[14px] leading-[1.8]">
            <span
              className={[
                "box-decoration-clone rounded px-0.5 transition-all duration-500",
                selecting
                  ? "bg-ember/20 text-bone/70"
                  : selected
                    ? "bg-ember/25 text-bone/95"
                    : "text-bone/55",
                phase === "working" ? "opacity-30 blur-[1.5px]" : "blur-0",
              ].join(" ")}
              style={
                selecting
                  ? { clipPath: "inset(0 0 0 0)", transition: "background-color 700ms" }
                  : undefined
              }
            >
              {rewritten ? AFTER[action] : BEFORE}
            </span>
          </p>

          <p className="mt-3 text-[13.5px] leading-[1.75] text-bone/45">
            Tomorrow: finish the migration guard and pair on the onboarding copy.
          </p>

          {/* Toolbar — pops up over the selection, as it does in the app */}
          <div
            className={[
              "absolute left-1/2 z-20 -translate-x-1/2 transition-all duration-300",
              showToolbar
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none translate-y-2 opacity-0",
            ].join(" ")}
            style={{ top: "34%" }}
          >
            <div className="flex gap-0.5 rounded-xl border border-white/12 bg-[#241f1a] p-1 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]">
              {ACTIONS.map(({ id, label, Icon }) => {
                const on = action === id && ["working", "done"].includes(phase);
                return (
                  <button
                    key={id}
                    onClick={() => pick(id)}
                    className={[
                      "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-all",
                      on
                        ? "bg-ember text-white shadow-[0_0_18px_-4px_rgba(169,76,28,0.9)]"
                        : "text-bone/65 hover:bg-white/10 hover:text-bone",
                    ].join(" ")}
                  >
                    <Icon className="size-3.5" strokeWidth={1.9} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* The pointer */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute z-30 transition-all ease-in-out",
              showCursor ? "opacity-100" : "opacity-0",
              phase === "select" ? "duration-[900ms]" : "duration-[850ms]",
            ].join(" ")}
            style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
          >
            <MousePointer2
              className="size-5 fill-white text-bark drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-white/8 px-5 py-3">
          <span className="font-mono text-[10.5px] tracking-[0.1em] text-bone/25 uppercase">
            {taken
              ? "your turn — pick another"
              : rewritten
                ? `${action} · rewritten in place`
                : "select any text"}
          </span>
        </div>
      </div>
    </div>
  );
}
