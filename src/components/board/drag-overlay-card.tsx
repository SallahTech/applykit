import { Badge } from "@/components/ui/badge";
import { ApplicationCard } from "@/types";

interface DragOverlayCardProps {
  card: ApplicationCard;
  accentColor: string;
}

export function DragOverlayCard({ card, accentColor }: DragOverlayCardProps) {
  const matchScore = card.matchScore;

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
      <p className="text-sm font-semibold text-foreground mb-0.5">{card.company}</p>
      <p className="text-xs text-muted-foreground mb-2">{card.title}</p>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {matchBadge}
        {card.location && (
          <Badge className="bg-purple-500/15 text-purple-400 border-0 text-[10px]">
            {card.location}
          </Badge>
        )}
        {card.salary && (
          <Badge className="bg-blue-500/15 text-blue-400 border-0 text-[10px]">
            {card.salary}
          </Badge>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{card.date}</p>

      {card.followUp && (
        <p className="text-xs text-red-400 font-medium mt-1.5">
          ⏰ {card.followUp}
        </p>
      )}
    </div>
  );
}
