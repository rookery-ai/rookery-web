import { useEffect, useRef, useState } from "react";
import { Sparkles, SpellCheck, Lightbulb, WandSparkles } from "lucide-react";

/**
 * The knowledge base's AI selection actions, recreated in HTML rather than
 * captured. The four actions and their icons match the product exactly
 * (web/ui/src/pages/kb/AIActions.tsx): Improve, Proofread, Explain, Reformat.
 *
 * Built rather than filmed because it stays crisp at any size, weighs nothing,
 * and themes with the site. The real video capture still replaces the other
 * feature panels.
 */
const ACTIONS = [
  { id: "improve", label: "Improve", Icon: Sparkles },
  { id: "proofread", label: "Proofread", Icon: SpellCheck },
  { id: "explain", label: "Explain", Icon: Lightbulb },
  { id: "reformat", label: "Reformat", Icon: WandSparkles },
] as const;

const BEFORE =
  "the deploy went fine but there was a issue with the db migration that we had to rollback and then re-run it manually";

const AFTER: Record<string, string> = {
  improve:
    "The deploy succeeded, but a database migration failed and had to be rolled back and re-run by hand.",
  proofread:
    "The deploy went fine, but there was an issue with the database migration that we had to roll back and then re-run manually.",
  explain:
    "A note about a deployment: it completed, but one database change did not apply cleanly and needed manual intervention.",
  reformat:
    "**Deploy** — succeeded\n**Migration** — failed, rolled back\n**Fix** — re-run manually",
};

export default function AIActionsDemo() {
  const [active, setActive] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // Cycle the actions on its own so the section is alive before anyone
  // interacts, but stop the moment a visitor takes over.
  const [autoIdx, setAutoIdx] = useState(0);
  const [taken, setTaken] = useState(false);

  useEffect(() => {
    if (taken) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setActive("improve");
      return;
    }
    const el = ref.current;
    if (!el) return;
    let iv = 0;
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          iv = window.setInterval(() => setAutoIdx((i) => (i + 1) % ACTIONS.length), 3200);
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
  }, [taken]);

  useEffect(() => {
    if (taken) return;
    run(ACTIONS[autoIdx].id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoIdx, taken]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function run(id: string, auto = false) {
    if (!auto) setTaken(true);
    timers.current.forEach((t) => window.clearTimeout(t));
    setWorking(true);
    setActive(null);
    timers.current = [
      window.setTimeout(() => {
        setActive(id);
        setWorking(false);
      }, 520),
    ];
  }

  const text = active ? AFTER[active] : BEFORE;

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(169,76,28,0.18),transparent_70%)] blur-xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-line bg-[#17140f] shadow-[0_40px_90px_-40px_rgba(43,38,53,0.9)]">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 border-b border-white/8 bg-white/[0.03] p-2">
          {ACTIONS.map(({ id, label, Icon }) => {
            const on = active === id;
            return (
              <button
                key={id}
                onClick={() => run(id)}
                className={[
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-all",
                  on
                    ? "bg-ember text-white shadow-[0_0_20px_-4px_rgba(169,76,28,0.8)]"
                    : "text-bone/55 hover:bg-white/8 hover:text-bone",
                ].join(" ")}
              >
                <Icon className="size-3.5" strokeWidth={1.9} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Note body */}
        <div className="min-h-[190px] px-5 py-5 sm:px-6">
          <p className="mb-3 font-mono text-[10.5px] tracking-[0.14em] text-bone/25 uppercase">
            notes / standup.md
          </p>
          <p
            className={[
              "text-[15px] leading-[1.7] whitespace-pre-line transition-all duration-300",
              working ? "opacity-30 blur-[1.5px]" : "opacity-100 blur-0",
              active ? "text-bone/95" : "text-bone/60",
            ].join(" ")}
          >
            {active ? (
              text
            ) : (
              <span className="rounded bg-ember/25 box-decoration-clone px-0.5 py-0.5">
                {text}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
