"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { ApplicationCard } from "@/types";

interface KanbanCardProps {
  card: ApplicationCard;
  accentColor: string;
  isRejected?: boolean;
}

export function KanbanCard({ card, accentColor, isRejected }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeft: `3px solid ${accentColor}`,
  };

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
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-label={`${card.company} — ${card.title}${matchScore > 0 ? `, ${matchScore}% match` : ""}`}
      className={[
        "rounded-xl bg-card border border-border p-4 cursor-grab active:cursor-grabbing transition-shadow hover:border-border hover:shadow-lg hover:shadow-black/20",
        isDragging ? "opacity-50" : "",
        isRejected ? "opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
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
