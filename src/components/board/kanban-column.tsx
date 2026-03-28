"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "@/components/board/kanban-card";
import { BoardColumn, ApplicationCard } from "@/types";

interface KanbanColumnProps {
  column: BoardColumn;
  cards: ApplicationCard[];
  accentColor: string;
  columnName: string;
  onRename: (newName: string) => void;
  isOver?: boolean;
}

export function KanbanColumn({
  column,
  cards,
  accentColor,
  columnName,
  onRename,
  isOver,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  function handleSave() {
    if (editValue.trim() === "") {
      setEditing(false);
      return;
    }
    onRename(editValue.trim());
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditing(false);
    }
  }

  return (
    <div
      ref={setNodeRef}
      aria-label={`Column: ${columnName}, ${cards.length} applications`}
      className={[
        "bg-muted/30 rounded-xl w-[280px] min-w-[280px] p-3 flex flex-col transition-colors",
        isOver
          ? "border-2 border-blue-500/40 bg-blue-500/5"
          : "border-2 border-transparent",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-1 mb-3">
        {editing ? (
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            maxLength={30}
            className="bg-transparent border border-border rounded px-1.5 py-0.5 text-sm font-semibold text-foreground outline-none focus:border-blue-500 w-full"
            aria-label="Rename column"
          />
        ) : (
          <span
            onDoubleClick={() => {
              setEditing(true);
              setEditValue(columnName);
            }}
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer"
            title="Double-click to rename"
          >
            {columnName}
          </span>
        )}
        <span className="bg-accent/60 text-muted-foreground text-xs px-2 py-0.5 rounded-full font-medium">
          {cards.length}
        </span>
      </div>

      {/* Card area */}
      <div className="flex-1 space-y-3">
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.length === 0 ? (
            <div className="border border-dashed border-border rounded-lg p-4 text-center text-sm text-muted-foreground">
              No applications yet
            </div>
          ) : (
            cards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                accentColor={accentColor}
                isRejected={column.id === "rejected"}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
