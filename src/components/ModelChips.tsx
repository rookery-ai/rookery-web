import { useState } from "react";
import { Cloud, HardDrive, Terminal } from "lucide-react";

/**
 * Three ways to give Rookery a model. Deliberately NO provider names and NO
 * counts: the spec fixes that the landing page states the capability while the
 * documentation carries the current list, because the list grows between
 * releases and any figure here goes stale.
 */
const MODES = [
  {
    id: "cli",
    Icon: Terminal,
    label: "A tool you have",
    blurb:
      "Already using Claude Code, Codex, OpenCode, Cursor or Gemini CLI? Point Rookery at it and it reuses that sign-in. No key to paste, nothing new to configure.",
    detail: "Claude Code · Codex · OpenCode",
  },
  {
    id: "hosted",
    Icon: Cloud,
    label: "A hosted provider",
    blurb:
      "Give it a provider, a model and a key. Rookery handles the rest in-process, with no separate tool involved.",
    detail: "Provider, model, key",
  },
  {
    id: "local",
    Icon: HardDrive,
    label: "Your own hardware",
    blurb:
      "Run the model on your own machine or network. No key, no account, and nothing — knowledge, credentials or prompts — leaves hardware you control.",
    detail: "Nothing leaves your network",
  },
] as const;

export default function ModelChips() {
  const [active, setActive] = useState<string>("local");
  const current = MODES.find((m) => m.id === active) ?? MODES[2];

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(70,64,90,0.14),transparent_70%)] blur-xl"
      />

      <div className="relative">
        <div className="flex flex-wrap gap-2">
          {MODES.map(({ id, Icon, label }) => {
            const on = id === active;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                aria-pressed={on}
                className={[
                  "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200",
                  on
                    ? "border-ember/40 bg-ember-soft text-ember shadow-[0_10px_24px_-14px_rgba(169,76,28,0.7)]"
                    : "border-line bg-paper text-stone hover:-translate-y-0.5 hover:border-ember/25 hover:text-bark",
                ].join(" ")}
              >
                <Icon className="size-4" strokeWidth={1.85} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-paper p-6 shadow-[0_24px_54px_-32px_rgba(43,38,53,0.5)]">
          <div className="flex items-center gap-2.5">
            <current.Icon className="size-4 text-ember" strokeWidth={1.9} />
            <span className="font-mono text-[11.5px] tracking-[0.12em] text-stone uppercase">
              {current.detail}
            </span>
          </div>
          <p key={current.id} className="motion-safe:animate-[fadeSwap_320ms_ease-out] mt-3 text-[15.5px] leading-[1.65] text-bark/85">
            {current.blurb}
          </p>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-stone/80">
          The current list of supported providers lives in the documentation — it grows
          between releases, so it isn't pinned here.
        </p>
      </div>

      <style>{`@keyframes fadeSwap { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
