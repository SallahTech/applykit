# ApplyKit Kanban Board — Design Spec

## Overview

Display-only drag-and-drop Kanban board at `/board` with 7 renameable columns and pre-populated mock application cards. Full dnd-kit drag-and-drop: cards draggable between columns (status change) and reorderable within columns (priority). Frontend-only build — all data lives in React state, no persistence.

### Deferred Features
- **Adding/editing cards**: Deferred. Board is display-only with mock data. The "+ Add job" affordance from the mockup is omitted.
- **Column add/remove**: Deferred. 7 fixed columns, rename only.
- **Data persistence**: State resets on page reload. No localStorage or backend. The PRD's `board_position`, `job_url`, `job_description`, `notes`, `contact_name`, `contact_email` fields are deferred to the backend-connected phase.
- **Filtering/search**: Not in scope for this build.

### Mockup Reference Note
The mockup at `mockups/kanban-board.html` uses a **light theme** and is a **structural/layout reference only** — not a visual fidelity target. The spec implements the dark theme consistent with the rest of the app. The mockup also shows approximate card counts in column badges (e.g., "4" in Saved but only 3 cards rendered) — the spec's mock data is the source of truth.

## Visual System

Uses the existing dark theme (colors, typography, DM Sans font). Card and column styling uses opaque-ish dark backgrounds (`bg-slate-900/60`, `bg-slate-800/30`) rather than glassmorphism `backdrop-blur` — intentional for a dense data view where blur on every element would hurt readability.

## Tech Stack

Same as existing project plus:
- **Drag-and-drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

## Page Route

`/board` — Kanban board page.

## Navigation

Reuses existing `AppNavbar` from `src/components/app-navbar.tsx`. Modifications:
- "Board" link changes from `toast("Coming soon!")` to `<Link href="/board">` with active styling when `pathname === "/board"`
- "+ New Application" button links to `/tailor`

## Board Header Bar

- Full-width below navbar: `bg-[#1e293b] border-b border-slate-700/50 px-4 py-3 pt-[4.5rem]` (clears fixed navbar)
- `max-w-full` (no max-width — board is full bleed)
- Flex row, `justify-between items-center`
- **Left:** `<h1 className="text-xl font-bold text-white">Application Board</h1>`
- **Right:** flex gap-3
  - "Import Jobs" — outline Button, onClick: `toast("Coming soon!")`
  - "+ New Application" — gradient Button (from-blue-500 to-purple-500), wrapped in `<Link href="/tailor">`

## Board Container

- `overflow-x-auto px-4 pb-4 pt-4`
- `flex gap-4` — columns laid out horizontally
- `min-h-[calc(100vh-140px)]` — fills remaining viewport
- Horizontal scroll when columns exceed viewport width
- Scrollbar styled: thin, slate-colored (via CSS or Tailwind `scrollbar-thin` if available, otherwise custom CSS)

## Columns

### Structure

7 default columns in order:

| Column | Default Name | Cards | Left Border Accent |
|--------|-------------|-------|-------------------|
| 1 | Saved | 3 | transparent |
| 2 | Applied | 3 | `#3b82f6` (blue) |
| 3 | Phone Screen | 2 | `#10b981` (green) |
| 4 | Interview | 1 | `#10b981` (green) |
| 5 | Offer | 1 | `#f59e0b` (amber) |
| 6 | Rejected | 2 | `#ef4444` (red) |
| 7 | Accepted | 0 | `#10b981` (green) |

### Column Component

- Container: `bg-slate-800/30 rounded-xl w-[280px] min-w-[280px] p-3 flex flex-col`
- **Header:** `flex justify-between items-center px-1 mb-3`
  - Column name: rendered as a `<span>` by default. On double-click, transforms to an inline `<input>`:
    - Auto-focused, pre-filled with current name
    - `bg-transparent border border-slate-600 rounded px-1.5 py-0.5 text-sm font-semibold text-white outline-none focus:border-blue-500`
    - Enter or blur: save new name to state
    - Escape: cancel, revert
  - Default display: `text-sm font-semibold text-slate-400 uppercase tracking-wider cursor-pointer` with hover tooltip "Double-click to rename"
  - Card count badge: `bg-slate-700/60 text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium`
- **Droppable area:** flex-1, `space-y-3`, receives dropped cards
- **Drop indicator:** when a card is dragged over this column, the column container gets `border-2 border-blue-500/40 bg-blue-500/5` styling
- **Empty state** (when column has 0 cards): `border border-dashed border-slate-700/50 rounded-lg p-4 text-center text-sm text-slate-500` — "No applications yet"

### Column Rename

- State: `columnNames: Record<string, string>` — maps column ID to display name
- Double-click triggers `editingColumnId` state
- Inline input with controlled value
- On save: if input is empty or whitespace-only, revert to previous name (treat as cancel). Otherwise update `columnNames[id]`. Max length: 30 characters (enforced via `maxLength` attribute on input).
- On escape: clear `editingColumnId` without saving
- No persistence — resets on reload

## Application Cards

### Card Component

- dnd-kit `useSortable` wrapper
- Container: `rounded-xl bg-slate-900/60 border border-slate-700/40 p-4 cursor-grab active:cursor-grabbing transition-all`
- Left border accent (3px): color based on column status (see table above)
- Hover: `hover:border-slate-600/60 hover:shadow-lg hover:shadow-black/20`
- While dragging (via dnd-kit transform): `opacity-50`

### Card Content

- **Company name:** `text-sm font-semibold text-white mb-0.5`
- **Job title:** `text-xs text-slate-400 mb-2`
- **Tags row:** `flex flex-wrap gap-1.5 mb-2`
  - Match score: `<Badge>` with color based on score. **If `matchScore === 0`, do not render the badge** (score is irrelevant at offer/accepted stage).
    - ≥ 80%: `bg-emerald-500/15 text-emerald-400`
    - 60-79%: `bg-amber-500/15 text-amber-400`
    - < 60% (and > 0): `bg-red-500/15 text-red-400`
  - Location "Remote": `bg-purple-500/15 text-purple-400`
  - Salary: `bg-blue-500/15 text-blue-400`
- **Footer:** `text-xs text-slate-500` — "Saved 2 days ago" / "Applied Mar 18" etc.
- **Follow-up reminder** (optional, only on some Applied cards):
  - `text-xs text-red-400 font-medium mt-1.5`
  - "⏰ Follow up tomorrow" or "⏰ Follow up overdue"

### Card Data Interface

```typescript
interface ApplicationCard {
  id: string;
  company: string;
  title: string;
  matchScore: number;
  location?: string;
  salary?: string;
  date: string;
  followUp?: string;
}
```

## Drag-and-Drop Implementation

### Libraries

```bash
yarn add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Architecture

- **DndContext** wraps the entire board
- Each column is a **SortableContext** with `verticalListSortingStrategy`
- Each card uses **useSortable** hook
- **DragOverlay** renders a styled ghost card during drag

### State

```typescript
type BoardState = Record<string, ApplicationCard[]>;
// e.g., { "saved": [...cards], "applied": [...cards], ... }
```

`useState<BoardState>` initialized with mock data.

### Event Handlers

**onDragStart:** Set `activeCard` state (for DragOverlay rendering).

**onDragOver:** Handle card moving between columns during drag. When a card hovers over a different column, move it from the source column's array to the target column's array in state.

**onDragEnd:** Finalize the card's position. Handle reordering within the same column. Clear `activeCard` state.

### Sensors

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
);
```

- PointerSensor with 5px distance prevents accidental drags on click
- KeyboardSensor enables keyboard-based drag-and-drop (accessibility)

### DragOverlay

- Renders the active card with modified styling: `opacity-90 rotate-[3deg] shadow-2xl shadow-black/40 scale-105`
- Uses `createPortal` to render above everything
- `prefers-reduced-motion`: disable `rotate` and `scale` transforms; use only opacity change

### Drop Indicators

- **Column highlight:** when a card is dragged over a column, the column container gets `border-2 border-blue-500/40 bg-blue-500/5 transition-colors`
- **Insertion indicator between cards:** dnd-kit's `SortableContext` with `verticalListSortingStrategy` automatically creates a gap/space at the insertion point by adjusting transforms on surrounding items. No custom indicator needed — the natural gap created by dnd-kit's sorting is sufficient visual feedback.

### Card Accent Color on Drag

Card left-border accent color updates **after drop** (when state settles into the new column), not during drag. The DragOverlay ghost card retains the original column's accent color while being dragged.

### Reduced Motion

When `prefers-reduced-motion` is set:
- DragOverlay: no rotation or scale, just opacity
- Column drop highlight: no transition, instant color change
- Card hover effects: disabled

## Mock Data

13 cards distributed across columns. Add to `src/lib/mock-data.ts`:

```typescript
import type { ApplicationCard } from "@/types";

export const BOARD_COLUMNS = [
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
```

Note: Railway's `matchScore: 0` means no score displayed (offer stage — score is irrelevant).

## Column Accent Colors

Map column ID to left-border accent color for cards:

```typescript
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

Cards in the rejected column render at `opacity-60` to visually de-emphasize them.

## Responsive Breakpoints

| Breakpoint | Width | Adaptation |
|------------|-------|------------|
| Mobile | < 768px | Columns 260px wide, horizontal scroll, touch drag via PointerSensor |
| Tablet | 768-1024px | Columns 270px wide, horizontal scroll |
| Desktop | > 1024px | Columns 280px wide, full layout |

Board always scrolls horizontally — no stacking. This is the standard Kanban pattern.

## Accessibility

- **Keyboard DnD:** dnd-kit's KeyboardSensor provides Space to pick up, Arrow keys to move, Space to drop, Escape to cancel
- **Live region:** `aria-live="assertive"` div announcing:
  - "Picked up {company} — {title}"
  - "Over column {column name}"
  - "Dropped {company} in {column name}"
  - "Cancelled dragging {company}"
- **Card aria-label:** "{company} — {title}, {matchScore}% match"
- **Column aria-label:** "Column: {name}, {count} applications"
- **Rename input:** `aria-label="Rename column"`
- Focus rings on all interactive elements

## Component Mapping (shadcn/ui)

| Area | shadcn Components |
|------|-------------------|
| Board Header | Button, Badge |
| Column | Badge |
| Card | Badge |
| Rename Input | — (plain input) |
| DnD | — (@dnd-kit, not shadcn) |

## File Structure

```
src/
  app/
    board/
      page.tsx                — Board page (wraps AppNavbar + KanbanBoard)
  components/
    app-navbar.tsx            — (modify) update Board link to /board
    board/
      kanban-board.tsx        — DndContext + columns container + drag overlay + state management
      kanban-column.tsx       — Single column with droppable area + header + rename
      kanban-card.tsx         — Single draggable card
      drag-overlay-card.tsx   — Styled ghost card for DragOverlay
  lib/
    mock-data.ts              — (modify) add BOARD_COLUMNS, BOARD_CARDS, COLUMN_ACCENTS
  types/
    index.ts                  — (modify) add ApplicationCard, BoardColumn types
```

## New Types

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
