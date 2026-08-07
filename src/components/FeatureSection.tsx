import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Layers,
  BookText,
  Bot,
  MessagesSquare,
  KeyRound,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

/**
 * Astro can only pass SERIALISABLE props to a hydrated island, so the icon
 * arrives as a name and is resolved here. Passing the component itself throws
 * at build time, which is easy to miss until you try it.
 */
const ICONS: Record<string, LucideIcon> = {
  Layers,
  BookText,
  Bot,
  MessagesSquare,
  KeyRound,
  CalendarClock,
};

type Props = {
  index: number;
  icon: keyof typeof ICONS | string;
  eyebrow: string;
  title: string;
  body: string;
  footnote?: string;
  poster?: string;
  webm?: string;
  mp4?: string;
  flip?: boolean;
  /** Replaces the media panel entirely — used by the live demo sections. */
  media?: ReactNode;
  children?: ReactNode;
};

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

export default function FeatureSection({
  index,
  icon,
  eyebrow,
  title,
  body,
  footnote,
  poster,
  webm,
  mp4,
  flip = false,
  media,
  children,
}: Props) {
  const { ref, shown } = useReveal<HTMLElement>();
  const Icon = ICONS[icon] ?? Layers;

  return (
    <section ref={ref} className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        {/* Copy */}
        <div
          className={[
            flip ? "lg:order-2" : "",
            "transition-all duration-700 ease-out",
            shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-ember-soft text-ember ring-1 ring-ember/15">
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <span className="font-mono text-[12px] font-medium tracking-[0.16em] text-stone uppercase">
              {eyebrow}
            </span>
          </div>

          <h2 className="mt-6 text-[clamp(2.3rem,5.4vw,3.7rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance">
            {title}
          </h2>

          <p className="mt-5 max-w-[46ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.65] text-stone">
            {body}
          </p>

          {footnote && (
            <p className="mt-6 max-w-[46ch] rounded-lg border border-line/80 bg-paper/70 px-4 py-3 text-[13.5px] leading-relaxed text-stone/90">
              {footnote}
            </p>
          )}

          {children}
        </div>

        {/* Media */}
        <div
          className={[
            flip ? "lg:order-1" : "",
            "transition-all duration-[900ms] ease-out",
            shown
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-8 scale-[0.96] opacity-0",
          ].join(" ")}
        >
          {media ?? (
            <div className="group relative">
              {/* Ember bloom behind the panel — the one place the accent glows. */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(169,76,28,0.16),transparent_70%)] blur-xl"
              />
              <div className="relative overflow-hidden rounded-2xl border border-line bg-dusk-deep shadow-[0_40px_90px_-40px_rgba(43,38,53,0.85)] transition-transform duration-500 group-hover:-translate-y-1">
                {webm || mp4 ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster={poster}
                    className="block w-full"
                  >
                    {webm && <source src={webm} type="video/webm" />}
                    {mp4 && <source src={mp4} type="video/mp4" />}
                  </video>
                ) : (
                  <div className="flex aspect-[16/10] w-full items-center justify-center bg-[linear-gradient(157deg,#4a4360_0%,#322c42_46%,#241f2c_100%)]">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-bone/35 uppercase">
                      capture pending
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
