"use client";

import { useState, useCallback, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { KanbanColumn } from "@/components/board/kanban-column";
import { DragOverlayCard } from "@/components/board/drag-overlay-card";
import { BOARD_COLUMNS, BOARD_CARDS, COLUMN_ACCENTS } from "@/lib/mock-data";
import type { ApplicationCard } from "@/types";

export function KanbanBoard() {
  const [boardData, setBoardData] = useState<Record<string, ApplicationCard[]>>(
    () => structuredClone(BOARD_CARDS)
  );
  const [columnNames, setColumnNames] = useState<Record<string, string>>(() =>
    Object.fromEntries(BOARD_COLUMNS.map((col) => [col.id, col.name]))
  );
  const [activeCard, setActiveCard] = useState<ApplicationCard | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  // Use a ref to avoid stale closure issues with boardData in drag handlers
  const boardDataRef = useRef(boardData);
  boardDataRef.current = boardData;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnByCardId = useCallback(
    (cardId: string): string | undefined => {
      return Object.keys(boardDataRef.current).find((colId) =>
        boardDataRef.current[colId].some((card) => card.id === cardId)
      );
    },
    []
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const cardId = event.active.id as string;
      const columnId = findColumnByCardId(cardId);
      if (!columnId) return;
      const card = boardDataRef.current[columnId].find(
        (c) => c.id === cardId
      );
      if (!card) return;
      setActiveCard(card);
      setActiveColumnId(columnId);
      setAnnouncement(`Picked up ${card.company} — ${card.title}`);
    },
    [findColumnByCardId]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeColumn = findColumnByCardId(activeId);
      let overColumn = findColumnByCardId(overId);
      if (!overColumn) {
        // overId might be a column id (when hovering over empty column or column droppable)
        if (boardDataRef.current[overId] !== undefined) {
          overColumn = overId;
        }
      }

      if (!activeColumn || !overColumn) return;

      setOverColumnId(overColumn);

      if (activeColumn !== overColumn) {
        setBoardData((prev) => {
          const activeCards = [...prev[activeColumn]];
          const overCards = [...prev[overColumn]];
          const activeIndex = activeCards.findIndex((c) => c.id === activeId);
          const [movedCard] = activeCards.splice(activeIndex, 1);

          // Find insertion index
          const overIndex = overCards.findIndex((c) => c.id === overId);
          if (overIndex >= 0) {
            overCards.splice(overIndex, 0, movedCard);
          } else {
            overCards.push(movedCard);
          }

          return {
            ...prev,
            [activeColumn]: activeCards,
            [overColumn]: overCards,
          };
        });
        setAnnouncement(`Over column ${columnNames[overColumn]}`);
      }
    },
    [findColumnByCardId, columnNames]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setOverColumnId(null);

      if (!over) {
        setActiveCard(null);
        setActiveColumnId(null);
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;
      const activeColumn = findColumnByCardId(activeId);

      if (activeColumn) {
        const oldIndex = boardDataRef.current[activeColumn].findIndex(
          (c) => c.id === activeId
        );
        const newIndex = boardDataRef.current[activeColumn].findIndex(
          (c) => c.id === overId
        );

        if (oldIndex !== newIndex && newIndex >= 0) {
          setBoardData((prev) => ({
            ...prev,
            [activeColumn]: arrayMove(prev[activeColumn], oldIndex, newIndex),
          }));
        }

        setAnnouncement(
          `Dropped ${activeCard?.company} in ${columnNames[activeColumn]}`
        );
      }

      setActiveCard(null);
      setActiveColumnId(null);
    },
    [findColumnByCardId, activeCard, columnNames]
  );

  const handleDragCancel = useCallback(() => {
    setAnnouncement("Cancelled dragging");
    setActiveCard(null);
    setActiveColumnId(null);
    setOverColumnId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Accessibility live region */}
      <div aria-live="assertive" className="sr-only">
        {announcement}
      </div>

      {/* Board container */}
      <div className="overflow-x-auto px-4 pb-4 pt-4">
        <div className="flex gap-4 min-h-[calc(100vh-140px)]">
          {BOARD_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={boardData[col.id] || []}
              accentColor={COLUMN_ACCENTS[col.id]}
              columnName={columnNames[col.id]}
              onRename={(newName) =>
                setColumnNames((prev) => ({ ...prev, [col.id]: newName }))
              }
              isOver={overColumnId === col.id}
            />
          ))}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeCard && activeColumnId && (
          <DragOverlayCard
            card={activeCard}
            accentColor={COLUMN_ACCENTS[activeColumnId]}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
