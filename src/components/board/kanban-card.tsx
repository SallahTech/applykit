"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
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

interface KanbanCardProps {
  card: Application;
  accentColor: string;
  isRejected?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}

export function KanbanCard({ card, accentColor, isRejected, onDelete, onClick }: KanbanCardProps) {
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

  const followUpText = card.follow_up_date ? (() => {
    const followUpDate = new Date(card.follow_up_date);
    const now = new Date();
    const diffDays = Math.floor((followUpDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Follow up overdue";
    if (diffDays === 0) return "Follow up today";
    if (diffDays === 1) return "Follow up tomorrow";
    return `Follow up in ${diffDays} days`;
  })() : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => { if (!isDragging && onClick) onClick(); }}
      aria-label={`${card.company_name} — ${card.job_title}${matchScore > 0 ? `, ${matchScore}% match` : ""}`}
      className={[
        "group relative rounded-xl bg-card border border-border p-4 cursor-grab active:cursor-grabbing transition-shadow hover:border-border hover:shadow-lg hover:shadow-black/20",
        isDragging ? "opacity-50" : "",
        isRejected ? "opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
          aria-label="Delete application"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
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

      {followUpText && (
        <p className="text-xs text-red-400 font-medium mt-1.5">
          ⏰ {followUpText}
        </p>
      )}
    </div>
  );
}
