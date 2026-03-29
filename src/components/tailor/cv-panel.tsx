import type { ParsedCVData } from "@/lib/ai/provider";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface CVPanelProps {
  variant: "original" | "tailored";
  cvData: ParsedCVData;
  matchScore: number;
  matchLabel: string;
  changes?: string[];
  keywords?: { found: string[]; missing: string[] };
  enhancedBullets?: string[];
  skillStatuses?: Array<{ name: string; status: "matched" | "added" | "default" }>;
}

export function CVPanel({
  variant,
  cvData,
  matchScore,
  matchLabel,
  changes,
  keywords,
  enhancedBullets,
  skillStatuses,
}: CVPanelProps) {
  const getSkillStatus = (name: string) =>
    skillStatuses?.find((s) => s.name === name)?.status ?? "default";

  const contactParts = [
    cvData.contact.email,
    cvData.contact.location,
    cvData.contact.linkedin,
  ].filter(Boolean);
  const contactLine = contactParts.join(" \u00B7 ");

  return (
    <div className="overflow-y-auto p-6">
      {/* Panel Header */}
      <div className="flex flex-col gap-2 mb-4">
        {/* Row 1: Label + Badge */}
        <div className="flex justify-between items-center">
          {variant === "original" ? (
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Original CV
            </span>
          ) : (
            <span className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Tailored
            </span>
          )}

          {variant === "original" ? (
            <Badge className="bg-red-500/20 text-red-400 border-0">
              {matchScore}% — {matchLabel}
            </Badge>
          ) : (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
              {matchScore}% — {matchLabel}
            </Badge>
          )}
        </div>

        {/* Row 2: Match bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={variant === "original" ? "bg-red-500 h-full rounded-full" : "bg-emerald-500 h-full rounded-full"}
            style={{ width: `${matchScore}%` }}
          />
        </div>
      </div>

      {/* AI Changes Made box */}
      {changes && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">AI Changes Made</span>
          </div>
          <ul className="space-y-1">
            {changes.map((change, i) => (
              <li key={i} className="text-xs text-amber-300/80">
                • {change}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CV Content */}
      <h3 className="text-xl font-bold text-foreground">{cvData.contact.name}</h3>
      <p className="text-xs text-muted-foreground mb-3">{contactLine}</p>

      {/* Summary */}
      {variant === "original" ? (
        <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground leading-relaxed mb-4">
          {cvData.summary}
        </div>
      ) : (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-foreground/80 leading-relaxed mb-4">
          {cvData.summary}
        </div>
      )}

      {/* Experience */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-3">
        Experience
      </p>

      {cvData.experience.map((exp, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold text-foreground">{exp.company}</span>
            <span className="text-xs text-muted-foreground">{exp.start_date} - {exp.end_date}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{exp.title}</p>
          {exp.bullets.map((bullet, j) =>
            enhancedBullets?.includes(bullet) && variant === "tailored" ? (
              <div
                key={j}
                className="bg-emerald-500/10 rounded px-2 py-1.5 text-sm text-foreground/80 mb-1"
              >
                • {bullet}
                <span className="text-xs text-emerald-400 font-semibold ml-2">Enhanced</span>
              </div>
            ) : (
              <div key={j} className="text-sm text-muted-foreground py-1">
                • {bullet}
              </div>
            )
          )}
        </div>
      ))}

      {/* Skills */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-3">
        Skills
      </p>

      <div className="flex flex-wrap gap-2">
        {cvData.skills.map((skill, i) => {
          const status = getSkillStatus(skill);
          if (status === "matched") {
            return (
              <Badge key={i} className="bg-emerald-500/20 text-emerald-400 border-0">
                {skill}
              </Badge>
            );
          } else if (status === "added") {
            return (
              <Badge
                key={i}
                className="bg-blue-500/20 text-blue-400 border border-dashed border-blue-500/40"
              >
                {skill}
              </Badge>
            );
          } else {
            return (
              <Badge key={i} className="bg-muted text-muted-foreground border-0">
                {skill}
              </Badge>
            );
          }
        })}
      </div>

      {/* Keyword Coverage */}
      {keywords && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Keyword Coverage
          </p>
          <div className="flex flex-wrap gap-2">
            {keywords.found.map((text, i) => (
              <span
                key={`found-${i}`}
                className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400"
              >
                Found: {text}
              </span>
            ))}
            {keywords.missing.map((text, i) => (
              <span
                key={`missing-${i}`}
                className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 line-through"
              >
                Missing: {text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
