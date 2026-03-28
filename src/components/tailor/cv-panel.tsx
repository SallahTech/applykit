import { CVData, Keyword } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface CVPanelProps {
  variant: "original" | "tailored";
  cvData: CVData;
  matchScore: number;
  matchLabel: string;
  changes?: string[];
  keywords?: Keyword[];
}

export function CVPanel({
  variant,
  cvData,
  matchScore,
  matchLabel,
  changes,
  keywords,
}: CVPanelProps) {
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
              Tailored for Stripe
            </span>
          )}

          {variant === "original" ? (
            <Badge className="bg-red-500/20 text-red-400 border-0">
              {matchScore}% — {matchLabel}
            </Badge>
          ) : (
            <div className="flex items-center">
              <span className="text-red-400 line-through text-xs">42%</span>
              <span className="text-muted-foreground mx-1">→</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                {matchScore}% — {matchLabel}
              </Badge>
            </div>
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
      <h3 className="text-xl font-bold text-foreground">{cvData.name}</h3>
      <p className="text-xs text-muted-foreground mb-3">{cvData.contact}</p>

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
            <span className="text-xs text-muted-foreground">{exp.dateRange}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{exp.title}</p>
          {exp.bullets.map((bullet, j) =>
            bullet.enhanced && variant === "tailored" ? (
              <div
                key={j}
                className="bg-emerald-500/10 rounded px-2 py-1.5 text-sm text-foreground/80 mb-1"
              >
                • {bullet.text}
                <span className="text-xs text-emerald-400 font-semibold ml-2">Enhanced</span>
              </div>
            ) : (
              <div key={j} className="text-sm text-muted-foreground py-1">
                • {bullet.text}
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
          if (skill.status === "matched") {
            return (
              <Badge key={i} className="bg-emerald-500/20 text-emerald-400 border-0">
                {skill.name}
              </Badge>
            );
          } else if (skill.status === "added") {
            return (
              <Badge
                key={i}
                className="bg-blue-500/20 text-blue-400 border border-dashed border-blue-500/40"
              >
                {skill.name}
              </Badge>
            );
          } else {
            return (
              <Badge key={i} className="bg-muted text-muted-foreground border-0">
                {skill.name}
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
            {keywords.map((kw, i) => (
              <span
                key={i}
                className={
                  kw.found
                    ? "px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400"
                    : "px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 line-through"
                }
              >
                {kw.found ? "Found: " : "Missing: "}
                {kw.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
