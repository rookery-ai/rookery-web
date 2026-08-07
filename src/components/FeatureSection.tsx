import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  /** Small print under the body — e.g. the sandbox caveat on Workspaces. */
  footnote?: string;
  /** Poster is what a visitor sees first and keeps if the video never loads. */
  poster?: string;
  webm?: string;
  mp4?: string;
  flip?: boolean;
  children?: ReactNode;
};

/**
 * One feature, one motion showcase. The media panel is the single consistent
 * framing across all ten sections: a bordered rounded panel with a dusk-tinted
 * shadow that scales in as it enters the viewport.
 *
 * Deliberately NO fake browser chrome — the address-bar mockup is dated and
 * adds nothing for an audience that self-hosts.
 */
export default function FeatureSection({
  eyebrow,
  title,
  body,
  footnote,
  poster,
  webm,
  mp4,
  flip = false,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 sm:py-24">
      <div
        className={[
          "mx-auto grid max-w-6xl items-center gap-10 px-6 lg:gap-16",
          "lg:grid-cols-2",
        ].join(" ")}
      >
        <div className={flip ? "lg:order-2" : ""}>
          <p className="font-mono text-[12px] font-medium tracking-[0.14em] text-ember uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.03em] text-balance">
            {title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-stone">
            {body}
          </p>
          {footnote && (
            <p className="mt-4 max-w-[52ch] border-l-2 border-line pl-3 text-[13px] leading-relaxed text-stone/80">
              {footnote}
            </p>
          )}
          {children}
        </div>

        <div className={flip ? "lg:order-1" : ""}>
          <div
            className={[
              "overflow-hidden rounded-xl border border-line bg-dusk-deep",
              "shadow-[0_30px_70px_-32px_rgba(70,64,90,0.7)]",
              "transition-all duration-700 ease-out",
              shown
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-4 scale-[0.97] opacity-0",
            ].join(" ")}
          >
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
              // Placeholder until the fixture instance exists and the ten
              // captures are recorded. Sized 16:10 so the real asset drops in
              // without shifting the layout.
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-[linear-gradient(157deg,#4a4360_0%,#322c42_46%,#241f2c_100%)]">
                <span className="font-mono text-[12px] tracking-[0.12em] text-bone/40 uppercase">
                  capture pending
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
