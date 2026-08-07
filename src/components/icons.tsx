import { siApple, siLinux, siDocker, siGithub, siTelegram, siDiscord } from "simple-icons";

// simple-icons v16 no longer ships siSlack or siWindows — both marks were
// removed on trademark grounds. Anything needed from that set is drawn here
// instead, or taken from the vendored provider logos in src/assets/logos/.

/**
 * Brand marks come from simple-icons as raw path data, drawn in currentColor.
 * lucide has no vendor marks, and a monochrome Apple or Docker is instantly
 * recognisable in a way a generic "laptop" glyph is not.
 */
function Mark({ path, title, className }: { path: string; title: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title} fill="currentColor">
      <path d={path} />
    </svg>
  );
}

export const AppleIcon = (p: { className?: string }) => (
  <Mark path={siApple.path} title="Apple" {...p} />
);
export const LinuxIcon = (p: { className?: string }) => (
  <Mark path={siLinux.path} title="Linux" {...p} />
);
export const DockerIcon = (p: { className?: string }) => (
  <Mark path={siDocker.path} title="Docker" {...p} />
);
export const GithubIcon = (p: { className?: string }) => (
  <Mark path={siGithub.path} title="GitHub" {...p} />
);
export const TelegramIcon = (p: { className?: string }) => (
  <Mark path={siTelegram.path} title="Telegram" {...p} />
);
export const DiscordIcon = (p: { className?: string }) => (
  <Mark path={siDiscord.path} title="Discord" {...p} />
);
/** Drawn here: simple-icons dropped the Windows mark. */
export const WindowsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Windows" fill="currentColor">
    <path d="M0 3.449 9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
  </svg>
);

/** The Weave — the Rookery mark. Stroked, not filled. */
export const RookeryMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Rookery">
    <path
      d="M11 8.5h10M7.5 14h17M4.5 19.5C4.5 26 9.5 29 16 29S27.5 26 27.5 19.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.1"
      strokeLinecap="round"
    />
  </svg>
);
