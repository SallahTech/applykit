# Kanban Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a drag-and-drop Kanban board at `/board` with 7 renameable columns, mock application cards, and full dnd-kit drag-and-drop (between columns + reorder within).

**Architecture:** Single Next.js page at `/board` with a `KanbanBoard` client component managing all DnD state via `@dnd-kit/core` and `@dnd-kit/sortable`. Board state is a `Record<string, ApplicationCard[]>` in React state. Columns are `SortableContext` wrappers, cards use `useSortable`. A `DragOverlay` renders a ghost card during drag.

**Tech Stack:** Next.js 14, Tailwind CSS v4, shadcn/ui, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, Lucide React, yarn

---

## File Structure

```
src/
  app/
    board/
      page.tsx                — Board page (AppNavbar + KanbanBoard)
  components/
    app-navbar.tsx            — (modify) Board link → /board
    board/
      kanban-board.tsx        — DndContext, state, columns container, drag overlay, a11y live region
      kanban-column.tsx       — Single column: header with rename, droppable area, empty state
      kanban-card.tsx         — Single draggable card with sortable hook
      drag-overlay-card.tsx   — Ghost card rendered in DragOverlay
  lib/
    mock-data.ts              — (modify) add BOARD_COLUMNS, BOARD_CARDS, COLUMN_ACCENTS
  types/
    index.ts                  — (modify) add ApplicationCard, BoardColumn
```

---

### Task 1: Dependencies & Types/Data

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/lib/mock-data.ts`

- [ ] **Step 1: Install dnd-kit packages**

```bash
cd /Users/sallahtech/Documents/projects/job-tracker-cv
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 2: Add new types**

Add to `src/types/index.ts`:

```typescript
export interface ApplicationCard {
  id: string;
  company: string;
  title: string;
  matchScore: number;
  location?: string;
  salary?: string;
  date: string;
  followUp?: string;
}

export interface BoardColumn {
  id: string;
  name: string;
}
```

- [ ] **Step 3: Add mock data**

Add to `src/lib/mock-data.ts`, importing `ApplicationCard` and `BoardColumn` from `@/types`:

```typescript
export const BOARD_COLUMNS: BoardColumn[] = [
  { id: "saved", name: "Saved" },
  { id: "applied", name: "Applied" },
  { id: "phone-screen", name: "Phone Screen" },
  { id: "interview", name: "Interview" },
  { id: "offer", name: "Offer" },
  { id: "rejected", name: "Rejected" },
  { id: "accepted", name: "Accepted" },
];

export const BOARD_CARDS: Record<string, ApplicationCard[]> = {
  saved: [
    { id: "1", company: "Vercel", title: "Senior Frontend Engineer", matchScore: 92, location: "Remote", date: "Saved 2 days ago" },
    { id: "2", company: "Linear", title: "Full Stack Engineer", matchScore: 87, location: "Remote", date: "Saved 3 days ago" },
    { id: "3", company: "Notion", title: "Product Engineer", matchScore: 71, salary: "$160-190k", date: "Saved 5 days ago" },
  ],
  applied: [
    { id: "4", company: "Stripe", title: "Software Engineer, Payments", matchScore: 89, salary: "$180-220k", date: "Applied Mar 18", followUp: "Follow up tomorrow" },
    { id: "5", company: "Supabase", title: "Backend Engineer", matchScore: 85, location: "Remote", date: "Applied Mar 20" },
    { id: "6", company: "Figma", title: "Frontend Developer", matchScore: 76, date: "Applied Mar 15", followUp: "Follow up overdue" },
  ],
  "phone-screen": [
    { id: "7", company: "Shopify", title: "Senior Developer", matchScore: 91, location: "Remote", date: "Screen on Mar 24" },
    { id: "8", company: "Planetscale", title: "Software Engineer", matchScore: 83, date: "Screen completed Mar 19" },
  ],
  interview: [
    { id: "9", company: "Resend", title: "Full Stack Engineer", matchScore: 88, salary: "$150-180k", date: "Technical round Mar 25" },
  ],
  offer: [
    { id: "10", company: "Railway", title: "Platform Engineer", matchScore: 0, salary: "$165k + equity", location: "Remote", date: "Offer received Mar 20" },
  ],
  rejected: [
    { id: "11", company: "Netflix", title: "Senior SWE", matchScore: 54, date: "Rejected Mar 17" },
    { id: "12", company: "Meta", title: "Production Engineer", matchScore: 62, date: "Rejected Mar 14" },
  ],
  accepted: [],
};

export const COLUMN_ACCENTS: Record<string, string> = {
  saved: "transparent",
  applied: "#3b82f6",
  "phone-screen": "#10b981",
  interview: "#10b981",
  offer: "#f59e0b",
  rejected: "#ef4444",
  accepted: "#10b981",
};
```

- [ ] **Step 4: Verify build**

```bash
yarn build
```

---

### Task 2: Update AppNavbar

**Files:**
- Modify: `src/components/app-navbar.tsx`

- [ ] **Step 1: Update Board link**

Read `src/components/app-navbar.tsx`. Find the "Board" button that currently shows a coming soon toast. Replace it with a `<Link href="/board">` with active styling when `pathname === "/board"` (same pattern as the "CV Manager" link). The active style: `text-white font-semibold`. Default: `text-sm text-slate-400 hover:text-white transition-colors`.

- [ ] **Step 2: Verify build**

```bash
yarn build
```

---

### Task 3: Kanban Card Component

**Files:**
- Create: `src/components/board/kanban-card.tsx`

- [ ] **Step 1: Build the card component**

Create `src/components/board/kanban-card.tsx` as a `"use client"` component:

- Props: `{ card: ApplicationCard, accentColor: string, isRejected?: boolean }`
- Uses dnd-kit `useSortable` hook with `id: card.id`
- Apply sortable attributes: `{...attributes}`, `{...listeners}`, `ref: setNodeRef`, `style` with transform/transition from useSortable
- When dragging (`isDragging` from useSortable): `opacity-50`
- Container: `rounded-xl bg-slate-900/60 border border-slate-700/40 p-4 cursor-grab active:cursor-grabbing transition-all hover:border-slate-600/60 hover:shadow-lg hover:shadow-black/20`
- Left border: `borderLeft: 3px solid {accentColor}` via inline style
- If `isRejected`: add `opacity-60` to container
- `aria-label="{company} — {title}, {matchScore}% match"` (omit score part if matchScore === 0)
- Content:
  - Company: `text-sm font-semibold text-white mb-0.5`
  - Title: `text-xs text-slate-400 mb-2`
  - Tags row: `flex flex-wrap gap-1.5 mb-2`
    - Match score badge (only if `matchScore > 0`): color based on score (emerald ≥80, amber 60-79, red <60), displays `{matchScore}% match`
    - Location badge (only if `location`): purple tint, displays location value
    - Salary badge (only if `salary`): blue tint, displays salary value
  - Footer: `text-xs text-slate-500` showing `card.date`
  - Follow-up (only if `card.followUp`): `text-xs text-red-400 font-medium mt-1.5` showing `⏰ {followUp}`

Import `Badge` from `@/components/ui/badge`, `ApplicationCard` from `@/types`, `useSortable` from `@dnd-kit/sortable`, `CSS` from `@dnd-kit/utilities`.

---

### Task 4: Drag Overlay Card

**Files:**
- Create: `src/components/board/drag-overlay-card.tsx`

- [ ] **Step 1: Build the drag overlay card**

Create `src/components/board/drag-overlay-card.tsx`:

- Props: `{ card: ApplicationCard, accentColor: string }`
- Same visual structure as KanbanCard but WITHOUT dnd-kit hooks (this is a static visual clone)
- Additional styling: `rotate-[3deg] scale-105 opacity-90 shadow-2xl shadow-black/40`
- No hover effects, no cursor styles
- `prefers-reduced-motion`: use a CSS class that removes rotate and scale (can rely on the existing globals.css media query zeroing out transitions, but rotation is a `transform` not an animation — add a specific class or inline check)

---

### Task 5: Kanban Column Component

**Files:**
- Create: `src/components/board/kanban-column.tsx`

- [ ] **Step 1: Build the column component**

Create `src/components/board/kanban-column.tsx` as a `"use client"` component:

- Props: `{ column: BoardColumn, cards: ApplicationCard[], accentColor: string, columnName: string, onRename: (newName: string) => void, isOver?: boolean }`
- Uses dnd-kit `useDroppable` with `id: column.id`
- Uses dnd-kit `SortableContext` with `items: cards.map(c => c.id)` and `strategy: verticalListSortingStrategy`

- **Container:** `bg-slate-800/30 rounded-xl w-[280px] min-w-[280px] p-3 flex flex-col transition-colors` + if `isOver`: add `border-2 border-blue-500/40 bg-blue-500/5` else `border-2 border-transparent`
- `aria-label="Column: {columnName}, {cards.length} applications"`

- **Header:** `flex justify-between items-center px-1 mb-3`
  - Column name: state `editing: boolean`, `editValue: string`
    - Default: `<span onDoubleClick={startEdit} className="text-sm font-semibold text-slate-400 uppercase tracking-wider cursor-pointer" title="Double-click to rename">{columnName}</span>`
    - Editing: `<input value={editValue} onChange={...} onKeyDown={handleKeyDown} onBlur={handleSave} autoFocus maxLength={30} className="bg-transparent border border-slate-600 rounded px-1.5 py-0.5 text-sm font-semibold text-white outline-none focus:border-blue-500 w-full" aria-label="Rename column" />`
    - `handleSave`: if `editValue.trim()` is empty, revert. Otherwise call `onRename(editValue.trim())`.
    - `handleKeyDown`: Enter → save, Escape → revert and stop editing
  - Card count: `<span className="bg-slate-700/60 text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">{cards.length}</span>`

- **Card area:** `flex-1 space-y-3`
  - Map `cards` to `<KanbanCard card={card} accentColor={accentColor} isRejected={column.id === "rejected"} />`
  - If `cards.length === 0`: empty state div with dashed border and "No applications yet" text

---

### Task 6: Kanban Board (DnD Orchestrator)

**Files:**
- Create: `src/components/board/kanban-board.tsx`

- [ ] **Step 1: Build the board component**

Create `src/components/board/kanban-board.tsx` as a `"use client"` component. This is the most complex component — it manages all DnD state.

- State:
  - `boardData: Record<string, ApplicationCard[]>` — initialized from `BOARD_CARDS`
  - `columnNames: Record<string, string>` — initialized from `BOARD_COLUMNS` as `{ [col.id]: col.name }`
  - `activeCard: ApplicationCard | null` — currently dragged card
  - `activeColumnId: string | null` — column the active card came from
  - `announcement: string` — for aria-live region

- **Sensors:**
  ```tsx
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  ```

- **Helper:** `findColumnByCardId(cardId: string): string | undefined` — searches `boardData` to find which column contains a card

- **onDragStart(event):**
  - Find the card and its column
  - Set `activeCard` and `activeColumnId`
  - Set announcement: "Picked up {company} — {title}"

- **onDragOver(event):**
  - Get `active.id` and `over.id`
  - Find source and target columns
  - If card is over a different column: move card from source to target column in `boardData`
  - Set announcement: "Over column {columnName}"

- **onDragEnd(event):**
  - Handle reordering within same column (using `arrayMove` from `@dnd-kit/sortable`)
  - Clear `activeCard` and `activeColumnId`
  - Set announcement: "Dropped {company} in {columnName}"

- **onDragCancel():**
  - Clear `activeCard`
  - Set announcement: "Cancelled dragging"

- **Render:**
  ```tsx
  <DndContext sensors={sensors} onDragStart={...} onDragOver={...} onDragEnd={...} onDragCancel={...} collisionDetection={closestCorners}>
    {/* Aria live region */}
    <div aria-live="assertive" className="sr-only">{announcement}</div>

    {/* Board container */}
    <div className="overflow-x-auto px-4 pb-4 pt-4">
      <div className="flex gap-4 min-h-[calc(100vh-140px)]">
        {BOARD_COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            column={col}
            cards={boardData[col.id] || []}
            accentColor={COLUMN_ACCENTS[col.id]}
            columnName={columnNames[col.id]}
            onRename={(newName) => setColumnNames(prev => ({ ...prev, [col.id]: newName }))}
            isOver={...determine if this column is the current drop target...}
          />
        ))}
      </div>
    </div>

    {/* Drag overlay */}
    <DragOverlay>
      {activeCard && (
        <DragOverlayCard card={activeCard} accentColor={COLUMN_ACCENTS[activeColumnId || "saved"]} />
      )}
    </DragOverlay>
  </DndContext>
  ```

- **Determining `isOver` for columns:** Use the `over` value from DndContext or track it in state during `onDragOver`. The simplest approach: store `overColumnId` in state, set it in `onDragOver`, clear it in `onDragEnd`/`onDragCancel`.

Imports:
- `@dnd-kit/core` — DndContext, DragOverlay, closestCorners, PointerSensor, KeyboardSensor, useSensor, useSensors
- `@dnd-kit/sortable` — arrayMove, sortableKeyboardCoordinates
- `@/components/board/kanban-column` — KanbanColumn
- `@/components/board/drag-overlay-card` — DragOverlayCard
- `@/lib/mock-data` — BOARD_COLUMNS, BOARD_CARDS, COLUMN_ACCENTS
- `@/types` — ApplicationCard

---

### Task 7: Board Page

**Files:**
- Create: `src/app/board/page.tsx`

- [ ] **Step 1: Build the board page**

Create `src/app/board/page.tsx` as a `"use client"` component:

```tsx
"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "@/components/app-navbar";
import { KanbanBoard } from "@/components/board/kanban-board";

export default function BoardPage() {
  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-[#0f172a]">
        {/* Board Header */}
        <div className="bg-[#1e293b] border-b border-slate-700/50 px-4 py-3 pt-[4.5rem]">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Application Board</h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => toast("Coming soon!")}
              >
                Import Jobs
              </Button>
              <Link href="/tailor">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                >
                  + New Application
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Board */}
        <KanbanBoard />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
yarn build
```

---

### Task 8: Polish & Build Verification

**Files:**
- Modify: multiple files as needed

- [ ] **Step 1: Verify DnD works**

Start dev server, open http://localhost:3000/board:
1. Cards render in 7 columns with correct data
2. Drag a card between columns — card moves to new column
3. Reorder cards within a column — card position changes
4. Drag overlay shows ghost card with rotation
5. Column highlights when dragged over
6. Empty column shows "No applications yet"
7. Double-click column name → rename → enter saves, escape cancels
8. Empty rename reverts to previous name

- [ ] **Step 2: Verify navigation**

1. AppNavbar "Board" link navigates to `/board` with active styling
2. "+ New Application" navigates to `/tailor`
3. "Import Jobs" shows coming soon toast
4. Logo links to `/` (landing page)

- [ ] **Step 3: Verify accessibility**

- Tab through the page — focus rings visible
- Keyboard DnD: focus a card, Space to pick up, arrow keys to move
- aria-live announcements on drag events
- Column aria-labels correct

- [ ] **Step 4: Run production build**

```bash
yarn build
```

Expected: passes with no errors, `/board` route in output.
