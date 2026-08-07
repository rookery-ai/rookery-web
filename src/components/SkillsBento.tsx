import {
  FileText,
  Table2,
  Globe,
  Mail,
  CalendarDays,
  GitBranch,
  ScanText,
  Bell,
  Clock,
  Wrench,
  Users,
  ShieldCheck,
} from "lucide-react";

/**
 * The bundled skills, by their real names from internal/skilllibrary/skills/.
 * A bento grid rather than another media panel, because a list of capabilities
 * is more legible as a set of tiles than as a screenshot of a list.
 */
const SKILLS = [
  { Icon: FileText, name: "PDF", note: "Read and pull text out of documents", span: "sm:col-span-2" },
  { Icon: Table2, name: "Spreadsheets", note: "csv, xlsx" },
  { Icon: Globe, name: "Web research", note: "Search, read, and cite" },
  { Icon: Mail, name: "Email triage", note: "Sort what matters from what doesn't", span: "sm:col-span-2" },
  { Icon: CalendarDays, name: "Calendar", note: "Scheduling and availability" },
  { Icon: ScanText, name: "Image OCR", note: "Text out of pictures" },
  { Icon: Bell, name: "Change detection", note: "Notice what moved" },
  { Icon: Clock, name: "Time & timezones", note: "Get 3pm right, everywhere" },
  { Icon: GitBranch, name: "Git & GitHub", note: "Repos, issues, pull requests" },
  { Icon: Users, name: "Agent collaboration", note: "One agent calling another" },
  { Icon: Wrench, name: "Tool installer", note: "Fetch what it needs" },
  { Icon: ShieldCheck, name: "Resilient runs", note: "Fail softly, retry sensibly" },
];

export default function SkillsBento() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SKILLS.map(({ Icon, name, note, span }, i) => (
        <div
          key={name}
          style={{ animationDelay: `${i * 45}ms` }}
          className={[
            span ?? "",
            "motion-safe:animate-[riseIn_500ms_ease-out_both]",
            "group relative overflow-hidden rounded-2xl border border-line bg-paper p-4",
            "transition-all duration-300 hover:-translate-y-1 hover:border-ember/35",
            "hover:shadow-[0_16px_36px_-18px_rgba(169,76,28,0.4)]",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className="absolute -top-10 -right-10 size-24 rounded-full bg-ember/0 blur-2xl transition-colors duration-300 group-hover:bg-ember/15"
          />
          <Icon className="size-5 text-ember" strokeWidth={1.75} />
          <p className="mt-3 text-[15px] leading-tight font-semibold tracking-[-0.01em]">
            {name}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-stone">{note}</p>
        </div>
      ))}

      <style>{`@keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
