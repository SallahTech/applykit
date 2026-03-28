# ApplyKit CV Tailor Page — Design Spec

## Overview

Single-page two-step flow at `/tailor` for tailoring a CV to a job description. Step 1: input form (paste URL or job description). Step 2: side-by-side original vs tailored CV result. Frontend-only build with all data mocked.

### Deferred Features (documented PRD deviations)
- **Inline CV editing** (PRD 2.2 Step 6: "User can edit any section before downloading"): Deferred to the backend-connected phase. For this frontend-only build, the tailored CV is read-only.
- **Auto-add to tracker** (PRD 2.2 Step 7: "application automatically added to tracker board"): Deferred. "Apply & Track" button shows a coming soon toast. PDF download does not auto-add to any board.
- **Education section**: Omitted from mock CV data for brevity. The type and mock data should be extended when the full CV parsing pipeline is built.

### Data Reuse
Reuses existing constants from `src/lib/mock-data.ts`: `SAMPLE_JOB_DESCRIPTION`, `ORIGINAL_CV`, `TAILORED_CV`, `KEYWORDS`, `DEMO_RESULTS`. New mock data added: `EXTRACTED_JOB`.

## Visual System

Inherits the landing page visual system entirely — dark theme, glassmorphism, blue-to-purple gradients, DM Sans font, same color palette. See the landing page spec for details.

## Tech Stack

Same as landing page: Next.js 14 App Router, Tailwind CSS v4, shadcn/ui, Framer Motion, Lucide React. Additionally:
- **PDF Generation:** `@react-pdf/renderer` for generating downloadable tailored CV PDFs
- **Toast notifications:** shadcn `Sonner` (or shadcn `Toast`) for "Coming soon" messages

## Page Route

`/tailor` — single page using client-side state to manage steps.

## Navigation

Reuses the existing `Navbar` component from `src/components/landing/navbar.tsx` with modifications:
- Nav links change to: "Board", "CV Manager", "Settings" (matching the PRD mockup navigation)
- "Board" and "Settings" links show a coming soon toast on click
- "CV Manager" links to `/tailor`
- Keep logo linking to `/` (landing page)
- Keep "Get Started Free" and "Sign In" buttons

**Implementation note:** Rather than modifying the landing navbar, create a separate `AppNavbar` component for in-app pages. The landing navbar is marketing-focused (anchor links to sections); the app navbar is product-focused (page navigation).

## Step 1: New Application Form

### Layout
- Centered on page, `max-w-[640px] mx-auto`, `py-20 px-4`
- `pt-24` to clear fixed navbar

### Components (top to bottom)

**Logo + Tagline (centered above card):**
- ApplyKit logo (same as navbar logo)
- Tagline: "Tailor your CV. Track your application. Land the job." — `text-sm text-[#7c8db5] text-center mb-8`

**Main Card** (`glass-card p-8`):

1. **Title:** `<h1 className="text-xl font-bold text-white mb-1">New Application</h1>`
2. **Subtitle:** `<p className="text-sm text-[#94a3b8] mb-5">Paste a job URL or description and we'll tailor your CV in seconds.</p>`

3. **CV Status Bar:**
   - Green-tinted container: `bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3 mb-5`
   - Green checkmark icon (Check from lucide-react, `text-emerald-400`)
   - Text: "Using base CV: **alex-chen-resume-2026.pdf**" with a "Change" link (blue, visual only — no action)

4. **Tabbed Input:** shadcn `Tabs` with two triggers: "Paste URL" | "Paste Job Description"

   **URL Tab (default active):**
   - Tip box: `bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-2 mb-4`
     - Lightbulb icon (Lightbulb from lucide-react, `text-blue-400 w-4 h-4 flex-shrink-0 mt-0.5`)
     - Text: "Paste a link from LinkedIn, Indeed, Greenhouse, Lever, or any job board. We'll extract the job description automatically." — `text-xs text-blue-400`
   - URL input row: shadcn `Input` (full width, dark styled: `bg-slate-800/50 border-slate-700 text-slate-300`) + "Extract →" Button (gradient, fixed width)
     - Input has placeholder: "https://company.com/careers/job-id"
     - Pre-filled with: "https://stripe.com/jobs/listing/software-engineer-payments"
   - On mobile (< md), the URL input row stacks vertically: input full width above, Extract button full width below
   - On "Extract →" click: 1s simulated loading (button shows spinner), then reveals extracted details below:
     - "EXTRACTED JOB DETAILS" divider label
     - 2x2 grid of disabled inputs, each with a visible label (`<label className="text-xs font-semibold text-slate-400 mb-1">`):
       - "Company" → "Stripe"
       - "Position" → "Software Engineer, Payments"
       - "Location" → "San Francisco / Remote"
       - "Salary Range" → "$180,000 - $220,000"
     - "Key Requirements (extracted)" label + flex-wrap tag badges: TypeScript, Payment Systems, API Design, React, Distributed Systems, 5+ years (blue badges), Ruby (amber "nice to have" badge)
     - All data is hardcoded mock data
   - State: `extracted: boolean` — toggles visibility of extracted details

   **Text Tab:**
   - shadcn `Textarea` (rows=8, dark styled, `min-h-[200px]`)
   - Pre-filled with `SAMPLE_JOB_DESCRIPTION` from mock data
   - Placeholder: "Paste the full job description here..."

5. **CTA Button:** "Tailor My CV for This Job" — full width, gradient bg, large padding (`py-4 text-base font-semibold`). Sparkles icon from lucide-react before text.
   - On click: validates input (URL tab requires extracted state OR text tab requires non-empty textarea)
   - If valid: transitions to processing state then Step 2
   - If invalid: shows red error text below button

6. **Secondary Button:** "Save for Later" — full width, outline variant, `mt-2`. Shows coming soon toast on click.

### Entrance Animation
- Card fades in with Framer Motion: `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0.5 }}`

## Processing Transition

Between Step 1 and Step 2:
- Step 1 card fades out (Framer Motion AnimatePresence, `exit={{ opacity: 0, y: -20 }}`)
- Centered processing state appears: large spinner (Loader2 from lucide-react, `animate-spin w-8 h-8 text-blue-400`) + "Tailoring your CV for Stripe..." text + progress bar (fake, animates from 0% to 100% over 2s using CSS/Framer Motion width animation)
- After 2s, processing state fades out, Step 2 fades in

## Step 2: Side-by-Side Result View

### Top Bar
- Full-width bar below the navbar: `bg-[#1e293b] border-b border-slate-700/50 px-4 py-3`
- Flex row, justify-between, items-center
- **Left:** Breadcrumb — `text-sm text-[#7c8db5]`: "← Back" link (returns to Step 1) + separator + "Stripe — Software Engineer" + separator + "**CV Tailor**" (white, bold)
  - **Back navigation:** Step transitions use conditional rendering (not route changes). The form component stays mounted but hidden when Step 2 is shown, so form state is preserved in React state naturally. Do not unmount the form component on step change.
- **Right:** Action buttons row with gap-3:
  - "Regenerate" — outline Button with RefreshCw icon (from lucide-react). On click: re-runs the processing animation (1.5s spinner overlay), then re-reveals the result with a fresh entrance animation.
  - "Download PDF" — green Button (`bg-emerald-500 hover:bg-emerald-600 text-white`) with FileDown icon. On click: generates a PDF using `@react-pdf/renderer` with `TAILORED_CV` data and triggers browser download as "alex-chen-stripe-tailored.pdf".
  - "Apply & Track" — gradient Button (from-blue-500 to-purple-500) with Check icon. On click: shows shadcn toast "Coming soon! The Kanban board is on its way."
- **Mobile (< md):** Action buttons stack or become an overflow menu. Breadcrumb truncates.

### Content Area
- Full viewport height minus navbar and top bar: `h-[calc(100vh-120px)]`
- Two-panel split: `grid grid-cols-1 md:grid-cols-2` with no gap (panels share a border)

### Left Panel — Original CV
- `overflow-y-auto p-6 bg-[#0f172a]` (slightly darker for "before" feel)
- **Panel Header:** flex justify-between items-center mb-4
  - Label: "Original CV" — `text-sm font-semibold text-[#7c8db5] uppercase tracking-wider`
  - Badge: `bg-red-500/20 text-red-400 border-0` — "42% — Poor match"
  - Match bar: thin progress bar (6px height, rounded, `bg-slate-800` track, `bg-red-500` fill at 42% width)

- **CV Content** (renders `ORIGINAL_CV` from mock data):
  - Name: `text-xl font-bold text-white`
  - Contact: `text-xs text-[#7c8db5] mb-3`
  - Summary: `p-3 bg-slate-800/50 rounded-lg text-sm text-slate-400 leading-relaxed mb-4`
  - "EXPERIENCE" section label
  - Each experience entry:
    - Company + date range header row
    - Title
    - Bullet points (prefixed with "•"), `text-sm text-slate-400`
  - "SKILLS" section label
  - Skills as inline badges: all `bg-slate-800 text-slate-400`

### Right Panel — Tailored CV
- `overflow-y-auto p-6 bg-[#0f172a] border-l border-slate-700/50`
- **Panel Header:** flex justify-between items-center mb-4
  - Label: "Tailored for Stripe" — `text-sm font-semibold text-white uppercase tracking-wider`
  - Score improvement: "42%" (red, strikethrough) + "→" arrow + Badge `bg-emerald-500/20 text-emerald-400` — "89% — Strong match"
  - Match bar: `bg-emerald-500` fill at 89% width

- **AI Changes Made box** (top of panel, before CV content):
  - `bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4`
  - Title: "AI Changes Made" — `text-sm font-semibold text-amber-400 mb-2` with Sparkles icon
  - 4 bullet items (inline, not cross-referenced) — `text-xs text-amber-300/80`:
    1. "Summary rewritten to emphasize payments and fintech experience"
    2. "Payment processing bullet enhanced with metrics and Stripe-relevant keywords"
    3. "Added 'payment systems' and 'financial APIs' to skills"
    4. "Reordered experience bullets to lead with most relevant achievements"
  - Source: `CV_CHANGES` constant from `mock-data.ts` (see New Mock Data section)

- **CV Content** (renders `TAILORED_CV` from mock data):
  - Name + contact: same styling as left panel
  - Summary: `p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-slate-300 leading-relaxed mb-4` (green tint = improved)
  - Experience entries: same structure but enhanced bullets get:
    - `bg-emerald-500/10 rounded px-2 py-1` background
    - "Enhanced" marker: `text-xs text-emerald-400 font-semibold ml-2`
  - Skills badges:
    - `matched`: `bg-emerald-500/20 text-emerald-400`
    - `added`: `bg-blue-500/20 text-blue-400 border border-dashed border-blue-500/40`
    - `default`: `bg-slate-800 text-slate-400`

- **Keyword Coverage** (below skills):
  - "KEYWORD COVERAGE" section label
  - Flex-wrap tags:
    - Found: `bg-emerald-500/20 text-emerald-400` with "Found:" prefix
    - Missing: `bg-red-500/20 text-red-400 line-through` with "Missing:" prefix

### Mobile Layout (< md)
- Panels stack vertically instead of side-by-side
- Alternatively, use shadcn Tabs ("Original" / "Tailored") — same approach as the landing page cv-demo component
- Top bar action buttons: show as icon-only buttons to save space, or put in an overflow dropdown

### Entrance Animation (Step 2)
- Top bar slides in from top: `initial={{ y: -20, opacity: 0 }}`, `animate={{ y: 0, opacity: 1 }}`
- Left panel fades in: `initial={{ opacity: 0, x: -20 }}`, `animate={{ opacity: 1, x: 0 }}`, delay 0.2
- Right panel fades in: `initial={{ opacity: 0, x: 20 }}`, `animate={{ opacity: 1, x: 0 }}`, delay 0.4

### Regenerate Behavior
- On click: overlay the content area with a semi-transparent processing state (spinner + "Re-tailoring your CV...")
- After 1.5s: remove overlay, re-trigger entrance animations on the right panel only (left panel stays)

## PDF Generation

### Library
`@react-pdf/renderer` — generates PDFs from React components server-side or client-side.

### PDF Template
- Clean, professional single-page layout
- Header: name (large, bold), contact info below
- Summary section with subtle background
- Experience section: company/title/dates + bullet points
- Skills section: comma-separated list
- Uses the `TAILORED_CV` data
- Color scheme: minimal — black text on white, blue accent for name/section headers
- Font: Helvetica (built into react-pdf, no custom font loading needed)

### Download Flow
1. User clicks "Download PDF"
2. Button shows loading spinner (brief, ~500ms for PDF generation)
3. PDF blob is created using `@react-pdf/renderer`'s `pdf()` function
4. Triggers browser download via `URL.createObjectURL()` + anchor click
5. Filename: "alex-chen-stripe-tailored.pdf"
6. On PDF generation failure: show error toast "PDF generation failed. Please try again."

## Toast Notifications

Use shadcn Sonner (toast) component. Install with `npx shadcn@latest add sonner`.

- **Apply & Track:** "Coming soon! The Kanban board is on its way." (info style)
- **Save for Later:** "Coming soon! Save feature is in development." (info style)
- **Nav links (Board, Settings):** "Coming soon!" (info style)
- **Download success:** "PDF downloaded successfully!" (success style)

Add `<Toaster />` to the root layout or the tailor page layout.

## Accessibility

- Same standards as landing page spec (WCAG AA contrast, focus rings, reduced motion, ARIA landmarks)
- Step 1 form: visible labels on all inputs, error messages below fields, keyboard-navigable tabs
- Step 2 panels: each panel is a `<section>` with `aria-labelledby`
- PDF download: button announces loading state via `aria-busy`
- Tabs (mobile Step 2): shadcn Tabs with built-in ARIA roles
- Processing states: `aria-live="polite"` region announcing "Tailoring your CV..." and "CV tailored successfully"

## Responsive Breakpoints

| Breakpoint | Width | Adaptation |
|------------|-------|------------|
| Mobile | < 768px | Step 1: full width card. Step 2: tabbed panels (not side-by-side), icon-only action buttons |
| Tablet | 768-1024px | Step 1: centered card. Step 2: side-by-side (narrower panels) |
| Desktop | > 1024px | Full layout |

## Component Mapping (shadcn/ui)

| Area | shadcn Components |
|------|-------------------|
| App Navbar | Button, Sheet |
| Step 1 Form | Tabs, Input, Textarea, Button, Badge |
| Step 2 Top Bar | Button, Badge |
| Step 2 Panels | Badge, Tabs (mobile) |
| Toast | Sonner |
| PDF | — (react-pdf, not shadcn) |

## File Structure

```
src/
  app/
    tailor/
      page.tsx              — CV Tailor page (orchestrates steps)
  components/
    app-navbar.tsx           — In-app navigation bar (separate from landing navbar)
    tailor/
      application-form.tsx   — Step 1: new application form with tabbed input
      url-extractor.tsx      — URL input with extract simulation
      processing-view.tsx    — Processing/loading transition state
      cv-result-view.tsx     — Step 2: top bar + side-by-side panels orchestrator
      cv-panel.tsx           — Single CV panel (props: { variant: "original" | "tailored", cvData: CVData, matchScore: number, matchLabel: string, changes?: string[], keywords?: Keyword[] })
      cv-pdf-template.tsx    — react-pdf Document template for PDF generation
  lib/
    mock-data.ts             — (existing) add any new mock constants if needed
  types/
    index.ts                 — (existing) add ExtractedJob type if needed
```

## New Types

```typescript
interface ExtractedJob {
  company: string;
  position: string;
  location: string;
  salaryRange: string;
  requirements: { text: string; type: "required" | "nice-to-have" }[];
}
```

## New Mock Data

```typescript
export const CV_CHANGES: string[] = [
  "Summary rewritten to emphasize payments and fintech experience",
  "Payment processing bullet enhanced with metrics and Stripe-relevant keywords",
  "Added \"payment systems\" and \"financial APIs\" to skills",
  "Reordered experience bullets to lead with most relevant achievements",
];

export const EXTRACTED_JOB: ExtractedJob = {
  company: "Stripe",
  position: "Software Engineer, Payments",
  location: "San Francisco / Remote",
  salaryRange: "$180,000 - $220,000",
  requirements: [
    { text: "TypeScript", type: "required" },
    { text: "Payment Systems", type: "required" },
    { text: "API Design", type: "required" },
    { text: "React", type: "required" },
    { text: "Distributed Systems", type: "required" },
    { text: "5+ years", type: "required" },
    { text: "Ruby", type: "nice-to-have" },
  ],
};
```
