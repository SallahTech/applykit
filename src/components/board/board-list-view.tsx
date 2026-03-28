"use client";

import { Badge } from "@/components/ui/badge";
import { BOARD_COLUMNS, BOARD_CARDS, COLUMN_ACCENTS } from "@/lib/mock-data";
import type { ApplicationCard } from "@/types";

function getScoreClasses(score: number): string {
  if (score >= 80) return "bg-emerald-500/15 text-emerald-400";
  if (score >= 60) return "bg-amber-500/15 text-amber-400";
  return "bg-red-500/15 text-red-400";
}

export function BoardListView() {
  return (
    <div className="px-4 py-4 max-w-5xl mx-auto">
      {BOARD_COLUMNS.map((col) => {
        const cards = BOARD_CARDS[col.id] || [];
        if (cards.length === 0) return null;

        return (
          <div key={col.id} className="mb-8">
            {/* Column header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLUMN_ACCENTS[col.id] === "transparent" ? "#64748b" : COLUMN_ACCENTS[col.id] }}
              />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {col.name}
              </h2>
              <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                {cards.length}
              </span>
            </div>

            {/* Cards as rows */}
            <div className="space-y-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-colors"
                  style={{ borderLeft: `3px solid ${COLUMN_ACCENTS[col.id]}` }}
                >
                  {/* Company + Title */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{card.company}</p>
                    <p className="text-xs text-muted-foreground truncate">{card.title}</p>
                  </div>

                  {/* Tags */}
                  <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                    {card.matchScore > 0 && (
                      <Badge className={`${getScoreClasses(card.matchScore)} border-0 text-[10px]`}>
                        {card.matchScore}% match
                      </Badge>
                    )}
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

                  {/* Date */}
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                    {card.date}
                  </span>

                  {/* Follow-up */}
                  {card.followUp && (
                    <span className="text-xs text-red-400 font-medium whitespace-nowrap flex-shrink-0">
                      ⏰ {card.followUp}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
