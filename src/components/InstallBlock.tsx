import { useEffect, useState, type ComponentType } from "react";
import { Check, Copy, FileCode2, Download } from "lucide-react";
import { AppleIcon, LinuxIcon, WindowsIcon, DockerIcon } from "./icons";

type TabId = "script" | "powershell" | "docker" | "binary";

type Tab = {
  id: TabId;
  label: string;
  icons: ComponentType<{ className?: string }>[];
  command: string;
  /** Shown under the command. The inspectable-script link lives here. */
  note?: { text: string; href: string; linkText: string };
};

const TABS: Tab[] = [
  {
    id: "script",
    label: "Linux / macOS",
    icons: [LinuxIcon, AppleIcon],
    command: "curl -fsSL https://rookery.sh/install.sh | sh",
    note: {
      text: "Read it first — it's short:",
      href: "https://rookery.sh/install.sh",
      linkText: "install.sh",
    },
  },
  {
    id: "powershell",
    label: "Windows",
    icons: [WindowsIcon],
    command: "irm https://rookery.sh/install.ps1 | iex",
    note: {
      text: "Read it first — it's short:",
      href: "https://rookery.sh/install.ps1",
      linkText: "install.ps1",
    },
  },
  {
    id: "docker",
    label: "Docker",
    icons: [DockerIcon],
    command:
      "docker run -d --name rookery -p 8080:8080 -v rookery-data:/data ghcr.io/ilijad1/rookery:latest",
  },
  {
    id: "binary",
    label: "Binary",
    icons: [Download],
    command:
      "# Linux · macOS · Windows — amd64 and arm64\n# .tar.gz and .zip archives, plus .deb and .rpm packages",
    note: {
      text: "Checksummed and signed —",
      href: "https://github.com/ilijad1/rookery/releases/latest",
      linkText: "download for your platform",
    },
  },
];

/**
 * Detection picks the DEFAULT TAB only — never what is available. Every tab is
 * rendered and reachable regardless, and the server-rendered default is the
 * script tab, so a visitor with JavaScript disabled still gets a working
 * command rather than an empty box.
 */
function detectDefault(): TabId {
  if (typeof navigator === "undefined") return "script";
  const ua = navigator.userAgent;
  if (/Windows|Win32|Win64/i.test(ua)) return "powershell";
  return "script";
}

export default function InstallBlock() {
  const [active, setActive] = useState<TabId>("script");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    setActive(detectDefault());
  }, []);

  const tab = TABS.find((t) => t.id === active) ?? TABS[0];

  async function copy() {
    setCopyFailed(false);
    // navigator.clipboard exists ONLY in a secure context. The site is https so
    // this normally works, but the guard costs nothing and the silent-failure
    // mode is exactly what made this bug invisible in the product.
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(tab.command);
      } else {
        const ta = document.createElement("textarea");
        ta.value = tab.command;
        // Off-screen, NOT display:none — a hidden node is unselectable and
        // copies nothing.
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) throw new Error("execCommand failed");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 2500);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div
        role="tablist"
        aria-label="Installation method"
        className="flex flex-wrap gap-1"
      >
        {TABS.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.id)}
              className={[
                "flex items-center gap-2.5 rounded-t-lg px-5 py-3 text-[15px] font-medium transition-colors",
                selected
                  ? "bg-bark text-bone"
                  : "text-stone hover:bg-bark/5 hover:text-bark",
              ].join(" ")}
            >
              <span className="flex items-center gap-1">
                {t.icons.map((Icon, i) => (
                  <Icon key={i} className="size-[18px]" />
                ))}
              </span>
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl rounded-tl-none bg-bark text-bone shadow-[0_14px_40px_-18px_rgba(70,64,90,0.6)]">
        <div className="flex items-start gap-3 px-5 py-5 sm:px-6">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-[14.5px] leading-relaxed text-bone/95">
            {tab.command}
          </code>
          <button
            onClick={copy}
            aria-label="Copy command"
            className="shrink-0 rounded p-1.5 text-bone/60 transition-colors hover:bg-bone/10 hover:text-bone"
          >
            {copied ? (
              <Check className="size-[18px] text-[#8fce9f]" />
            ) : (
              <Copy className="size-[18px]" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 min-h-5 text-[13px] text-stone">
        {copyFailed ? (
          <span className="text-ember">Copy failed — select the command above.</span>
        ) : tab.note ? (
          <span className="inline-flex items-center gap-1.5">
            <FileCode2 className="size-3.5 shrink-0" aria-hidden="true" />
            {tab.note.text}{" "}
            <a
              href={tab.note.href}
              className="font-medium text-ember underline decoration-ember/30 underline-offset-2 hover:decoration-ember"
            >
              {tab.note.linkText}
            </a>
          </span>
        ) : null}
      </div>
    </div>
  );
}
