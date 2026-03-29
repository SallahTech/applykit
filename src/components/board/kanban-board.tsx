"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { KanbanColumn } from "@/components/board/kanban-column";
import { DragOverlayCard } from "@/components/board/drag-overlay-card";
import { QuickAddModal } from "@/components/board/quick-add-modal";
import { CardDetailModal } from "@/components/board/card-detail-modal";
import { BOARD_COLUMNS, COLUMN_ACCENTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import type { Application, ReorderUpdate } from "@/lib/supabase/db-types";

export function KanbanBoard() {
  const initialBoard: Record<string, Application[]> = {};
  BOARD_COLUMNS.forEach((col) => { initialBoard[col.id] = []; });

  const [boardData, setBoardData] = useState<Record<string, Application[]>>(initialBoard);
  const [columnNames, setColumnNames] = useState<Record<string, string>>(() =>
    Object.fromEntries(BOARD_COLUMNS.map((col) => [col.id, col.name]))
  );
  const [activeCard, setActiveCard] = useState<Application | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState("saved");
  const [detailCard, setDetailCard] = useState<Application | null>(null);

  // Use a ref to avoid stale closure issues with boardData in drag handlers
  const boardDataRef = useRef(boardData);
  boardDataRef.current = boardData;

  const abortControllerRef = useRef<AbortController | null>(null);
  const preDropSnapshotRef = useRef<Record<string, Application[]> | null>(null);

  // Fetch applications on mount
  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const res = await fetch("/api/applications");
        if (!res.ok) throw new Error();
        const { applications } = await res.json();
        // Group by status
        const grouped: Record<string, Application[]> = {};
        BOARD_COLUMNS.forEach((col) => { grouped[col.id] = []; });
        applications.forEach((app: Application) => {
          if (grouped[app.status]) grouped[app.status].push(app);
        });
        setBoardData(grouped);
      } catch {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

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

  async function saveReorder(updates: ReorderUpdate[]) {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const res = await fetch("/api/applications/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (preDropSnapshotRef.current) {
        setBoardData(preDropSnapshotRef.current);
      }
      toast.error("Failed to save. Changes reverted.");
    }
  }

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
      preDropSnapshotRef.current = JSON.parse(JSON.stringify(boardData));
      setAnnouncement(`Picked up ${card.company_name} — ${card.job_title}`);
    },
    [findColumnByCardId, boardData]
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

        let newBoardData = boardDataRef.current;

        if (oldIndex !== newIndex && newIndex >= 0) {
          const reordered = arrayMove(boardDataRef.current[activeColumn], oldIndex, newIndex);
          newBoardData = { ...boardDataRef.current, [activeColumn]: reordered };
          setBoardData(newBoardData);
        }

        // Compute updates for the column the card ended up in
        const updates: ReorderUpdate[] = newBoardData[activeColumn].map((card, index) => ({
          id: card.id,
          status: activeColumn,
          board_position: index,
        }));

        // If the card moved from a different column (handled in dragOver), include source column updates
        const sourceColumn = activeColumnId;
        if (sourceColumn && sourceColumn !== activeColumn) {
          const sourceUpdates = newBoardData[sourceColumn].map((card, index) => ({
            id: card.id,
            status: sourceColumn,
            board_position: index,
          }));
          updates.push(...sourceUpdates);
        }

        saveReorder(updates);

        setAnnouncement(
          `Dropped ${activeCard?.company_name} in ${columnNames[activeColumn]}`
        );
      }

      setActiveCard(null);
      setActiveColumnId(null);
    },
    [findColumnByCardId, activeCard, activeColumnId, columnNames]
  );

  const handleDragCancel = useCallback(() => {
    setAnnouncement("Cancelled dragging");
    setActiveCard(null);
    setActiveColumnId(null);
    setOverColumnId(null);
  }, []);

  async function handleDeleteCard(cardId: string) {
    try {
      const res = await fetch(`/api/applications/${cardId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setBoardData((prev) => {
        const next = { ...prev };
        for (const col of Object.keys(next)) {
          next[col] = next[col].filter((c) => c.id !== cardId);
        }
        return next;
      });
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete application");
    }
  }

  function handleApplicationCreated(app: Application) {
    setBoardData((prev) => ({
      ...prev,
      [app.status]: [...(prev[app.status] || []), app],
    }));
  }

  function handleCardUpdated(updated: Application) {
    setBoardData((prev) => {
      const next = { ...prev };
      for (const col of Object.keys(next)) {
        next[col] = next[col].map((c) => (c.id === updated.id ? updated : c));
      }
      return next;
    });
    setDetailCard(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

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
              onAddClick={() => { setAddModalStatus(col.id); setAddModalOpen(true); }}
              onDeleteCard={handleDeleteCard}
              onCardClick={(card) => setDetailCard(card)}
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

      {/* Quick-add modal */}
      <QuickAddModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        defaultStatus={addModalStatus}
        onApplicationCreated={handleApplicationCreated}
      />

      {/* Card detail/edit modal */}
      {detailCard && (
        <CardDetailModal
          key={detailCard.id}
          open={!!detailCard}
          onOpenChange={(open) => { if (!open) setDetailCard(null); }}
          application={detailCard}
          onUpdated={handleCardUpdated}
        />
      )}
    </DndContext>
  );
}
