import { Badge } from "@/components/ui/badge";
import type { Application } from "@/lib/supabase/db-types";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface DragOverlayCardProps {
  card: Application;
  accentColor: string;
}

export function DragOverlayCard({ card, accentColor }: DragOverlayCardProps) {
  const matchScore = card.match_score ?? 0;

  const matchBadge =
    matchScore > 0 ? (
      matchScore >= 80 ? (
        <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-[10px]">
          {matchScore}% match
        </Badge>
      ) : matchScore >= 60 ? (
        <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px]">
          {matchScore}% match
        </Badge>
      ) : (
        <Badge className="bg-red-500/15 text-red-400 border-0 text-[10px]">
          {matchScore}% match
        </Badge>
      )
    ) : null;

  return (
    <div
      style={{ borderLeft: `3px solid ${accentColor}` }}
      className="rounded-xl bg-card border border-border p-4 rotate-[3deg] scale-105 opacity-90 shadow-2xl shadow-black/40"
    >
      <p className="text-sm font-semibold text-foreground mb-0.5">{card.company_name}</p>
      <p className="text-xs text-muted-foreground mb-2">{card.job_title}</p>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {matchBadge}
        {card.location && (
          <Badge className="bg-purple-500/15 text-purple-400 border-0 text-[10px]">
            {card.location}
          </Badge>
        )}
        {card.salary_range && (
          <Badge className="bg-blue-500/15 text-blue-400 border-0 text-[10px]">
            {card.salary_range}
          </Badge>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{formatDate(card.applied_date || card.created_at)}</p>
    </div>
  );
}
