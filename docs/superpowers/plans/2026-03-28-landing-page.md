# ApplyKit Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ApplyKit landing page with a vibrant dark SaaS aesthetic, interactive CV-tailoring demo, and free-tier signup conversion flow.

**Architecture:** Next.js 14 App Router with shadcn/ui components on a dark Tailwind theme. All data is mocked in a central `mock-data.ts` file. Framer Motion handles scroll-triggered entrance animations. The page is composed of 10 self-contained section components rendered in sequence on the root `page.tsx`.

**Tech Stack:** Next.js 14, Tailwind CSS v4, shadcn/ui, Framer Motion, Lucide React, DM Sans (next/font/google), yarn

---

## File Structure

```
src/
  app/
    page.tsx              — Landing page (composes all sections)
    layout.tsx            — Root layout (font, metadata, theme)
    globals.css           — Tailwind base styles, CSS variables, custom utilities
  components/
    landing/
      navbar.tsx          — Fixed navigation bar with scroll blur
      hero.tsx            — Hero section (text column + demo container)
      hero-demo.tsx       — Interactive mini-demo widget (state machine)
      match-score-ring.tsx — Custom SVG progress ring
      trusted-by.tsx      — Company logo bar
      how-it-works.tsx    — 3-step flow with connectors
      cv-demo.tsx         — Before/after CV comparison
      features.tsx        — 6-feature grid
      testimonials.tsx    — Testimonial cards with scroll snap
      pricing.tsx         — 3-tier pricing cards
      final-cta.tsx       — Closing CTA section
      footer.tsx          — Site footer
    ui/                   — shadcn/ui components (auto-generated)
  lib/
    mock-data.ts          — All mock data constants
    utils.ts              — shadcn cn() utility (auto-generated)
  types/
    index.ts              — TypeScript interfaces
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `.gitignore`

- [ ] **Step 1: Initialize Next.js project with yarn**

```bash
cd /Users/sallahtech/Documents/projects/job-tracker-cv
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-yarn --yes
```

- [ ] **Step 2: Install core dependencies**

```bash
yarn add framer-motion lucide-react
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d
```

Select: New York style, Slate base color, CSS variables enabled.

- [ ] **Step 4: Install required shadcn components**

```bash
npx shadcn@latest add button card badge textarea tabs sheet avatar
```

- [ ] **Step 5: Configure DM Sans font in layout.tsx**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "ApplyKit — AI-Powered CV Tailoring & Job Tracker",
  description:
    "Stop sending the same resume everywhere. ApplyKit tailors your CV to every job description with AI and tracks all your applications in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Set up globals.css with dark theme variables and font binding**

Replace `src/app/globals.css` with the dark theme CSS variables from the spec: `--bg-primary: #0f172a`, `--bg-secondary: #1e293b`, `--text-primary: #f1f5f9`, `--text-secondary: #94a3b8`, `--text-muted: #7c8db5`, gradient utilities, glassmorphism card class, and `prefers-reduced-motion` media query that sets `--motion-duration: 0s`.

**Critical:** Bind DM Sans to Tailwind's font-sans utility by adding to globals.css:
```css
@theme {
  --font-sans: var(--font-dm-sans);
}
```
This connects the Next.js font CSS variable to Tailwind v4's `font-sans` class used on `<body>`.

- [ ] **Step 7: Set up placeholder page.tsx**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a]">
      <h1 className="text-4xl font-bold text-white p-8">ApplyKit</h1>
    </main>
  );
}
```

- [ ] **Step 8: Verify dev server runs**

```bash
yarn dev
```

Open http://localhost:3000 — should show "ApplyKit" in white on dark background.

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js project with shadcn, Tailwind, Framer Motion"
```

---

### Task 2: Types & Mock Data

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/mock-data.ts`

- [ ] **Step 1: Create TypeScript interfaces**

Create `src/types/index.ts` with interfaces for:
- `Feature` — icon name (string), title, description
- `Testimonial` — name, role, quote, initials
- `PricingTier` — name, price, priceLabel, description, features (string[]), cta, highlighted, badge?
- `CVExperience` — company, title, dateRange, bullets (array with `text` and `enhanced` boolean)
- `CVData` — name, contact, summary, experience (CVExperience[]), skills (array with `name`, `status`: "matched" | "added" | "default")
- `Keyword` — text, found (boolean)

- [ ] **Step 2: Create mock data constants**

Create `src/lib/mock-data.ts` with all data from the spec:
- `SAMPLE_JOB_DESCRIPTION` — pre-filled textarea text (Stripe Software Engineer job)
- `DEMO_RESULTS` — enhanced bullets and changes summary for the hero demo
- `FEATURES` — array of 6 Feature objects with Lucide icon names
- `TESTIMONIALS` — 3 Testimonial objects (Sarah K., Marcus T., Priya R.)
- `PRICING_TIERS` — 3 PricingTier objects (Free, Pro, Pro+) with feature lists
- `ORIGINAL_CV` — CVData for "Alex Chen" (original version)
- `TAILORED_CV` — CVData for "Alex Chen" (Stripe-tailored version)
- `KEYWORDS` — array of Keyword objects (payments, TypeScript, React, etc.)
- `SOCIAL_PROOF` — object with `cvsTailored: "12,847"`, `avgMatchScore: "89%"`, `subscriptions: "0"`
- `TRUSTED_COMPANIES` — array of company name strings

- [ ] **Step 3: Commit**

```bash
git add src/types src/lib/mock-data.ts
git commit -m "feat: add TypeScript types and mock data for landing page"
```

---

### Task 3: Navbar

**Files:**
- Create: `src/components/landing/navbar.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build navbar component**

Create `src/components/landing/navbar.tsx` as a client component (`"use client"`):
- Use `useState` for `scrolled` state, `useEffect` with scroll listener (threshold: 50px)
- Fixed position, full width, `z-50`
- Transparent by default; when scrolled: `bg-slate-900/80 backdrop-blur-lg` with 200ms transition
- Left: Logo — gradient `<div>` with "A" + "ApplyKit" wordmark
- Center (hidden on mobile): anchor links to `#features`, `#how-it-works`, `#pricing` with `scroll-smooth`
- Right (hidden on mobile): "Sign In" ghost Button + "Get Started Free" gradient Button
- Mobile: hamburger icon button that opens shadcn `Sheet` from right containing all nav links + CTAs, with a separator between nav links and action buttons

- [ ] **Step 2: Add navbar to page.tsx**

Import and render `<Navbar />` at the top of the page.

- [ ] **Step 3: Verify in browser**

Run `yarn dev`. Navbar should be visible, transparent, and gain blur on scroll. Mobile hamburger should open the Sheet.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/navbar.tsx src/app/page.tsx
git commit -m "feat: add responsive navbar with scroll blur and mobile sheet menu"
```

---

### Task 4: Hero Section (Text Column)

**Files:**
- Create: `src/components/landing/hero.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build hero component**

Create `src/components/landing/hero.tsx` as a client component:
- Two-column grid on desktop (`lg:grid-cols-2`), stacks on mobile
- Left column:
  - `<h1>` with "Your Resume Gets " + gradient-text "Filtered Out" + ". Fix That in 10 Seconds."
  - `<p>` subtext in `text-secondary` color
  - CTA row: gradient "Start Free →" Button + ghost "Watch How It Works" Button (onClick scrolls to `#how-it-works`)
  - Social proof strip with green dot separators: "12,847 CVs tailored · No credit card · One-time payment"
- Right column: placeholder `<div>` for demo (Task 5 will fill this)
- Background: absolute-positioned radial gradient glows (blue-purple, blurred)
- Wrap text elements in Framer Motion `motion.div` with `fadeInUp` variants, staggered by 100ms

- [ ] **Step 2: Add hero to page.tsx**

Import and render `<Hero />` inside `<main>` after navbar, with `pt-24` to clear fixed nav.

- [ ] **Step 3: Verify in browser**

Hero text, CTAs, and social proof should render. Right column should be empty placeholder. Gradient glows visible in background.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/hero.tsx src/app/page.tsx
git commit -m "feat: add hero section with headline, CTAs, and social proof"
```

---

### Task 5: Interactive Hero Demo

**Files:**
- Create: `src/components/landing/match-score-ring.tsx`
- Create: `src/components/landing/hero-demo.tsx`
- Modify: `src/components/landing/hero.tsx`

- [ ] **Step 1: Build match score ring component**

Create `src/components/landing/match-score-ring.tsx`:
- Props: `score: number`, `maxScore: number`, `color: string`, `size?: number`
- Render SVG circle with `stroke-dasharray` and `stroke-dashoffset` calculated from score/maxScore
- Centered text showing the score percentage
- Animate `stroke-dashoffset` via CSS transition (1s ease-out)

- [ ] **Step 2: Build hero demo component**

Create `src/components/landing/hero-demo.tsx` as a client component:
- State machine with `useState<"idle" | "processing" | "result">`
- **idle state:** Glassmorphism card with shadcn `Textarea` pre-filled with `SAMPLE_JOB_DESCRIPTION` from mock data + "Tailor My CV →" gradient Button. If textarea is empty on submit, show tooltip "Paste a job description first".
- **processing state:** Textarea fades out (Framer Motion `AnimatePresence`), centered spinner with "Analyzing job description..." text for 1.5s, then auto-transition to `result`.
- **result state:** Fade in with Framer Motion:
  - `MatchScoreRing` animating from 42 to 89 (use `useEffect` with `setTimeout` to trigger the count-up)
  - "42% → 89%" text with arrow
  - 3-4 enhanced bullet points from `DEMO_RESULTS` with green left border
  - "Changes made" summary (2-3 items)
  - "Try with your own →" link button that resets state to `idle`
- `aria-live="polite"` region wrapping the result area. On transition to `result`, the region should contain hidden text: "CV match score improved from 42% to 89%".
- All transitions use Framer Motion `AnimatePresence` with `mode="wait"`

- [ ] **Step 3: Integrate demo into hero**

Replace the placeholder div in `hero.tsx` right column with `<HeroDemo />`.

- [ ] **Step 4: Verify in browser**

Click "Tailor My CV →" — should see processing spinner (1.5s) → result with animated score ring, enhanced bullets, changes summary. "Try with your own →" should reset.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/match-score-ring.tsx src/components/landing/hero-demo.tsx src/components/landing/hero.tsx
git commit -m "feat: add interactive hero demo with match score animation and state machine"
```

---

### Task 6: Trusted-By Bar

**Files:**
- Create: `src/components/landing/trusted-by.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build trusted-by component**

Create `src/components/landing/trusted-by.tsx`:
- "Trusted by job seekers who landed roles at" text in `text-muted`
- 6 placeholder company logos — render company names from `TRUSTED_COMPANIES` as styled text with a consistent monospace/bold treatment, grayscale opacity 30%. (Swap for real SVG logos later.)
- Each logo gets `aria-label="{Company} logo"`
- Framer Motion fade-in on scroll with `whileInView`
- Centered layout, flex row with even spacing, wraps on mobile

- [ ] **Step 2: Add to page.tsx**

Render `<TrustedBy />` after Hero.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/trusted-by.tsx src/app/page.tsx
git commit -m "feat: add trusted-by company logo bar"
```

---

### Task 7: How It Works

**Files:**
- Create: `src/components/landing/how-it-works.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build how-it-works component**

Create `src/components/landing/how-it-works.tsx`:
- Section with `id="how-it-works"` and `aria-labelledby` heading
- `bg-[#1e293b]` background for section contrast
- Section title: "How It Works" (h2)
- 3-column grid on desktop, vertical stack on mobile
- Each step:
  - Gradient circle with step number (1/2/3)
  - Lucide icon (ClipboardPaste, Sparkles, KanbanSquare)
  - Title: "Paste" / "Tailor" / "Track"
  - One-sentence description
- Connector: horizontal dashed line between steps on desktop (using `border-dashed` pseudo-elements or a connecting div). Vertical dashed line on mobile.
- Framer Motion staggered fade-in (50ms delay per step) with `whileInView`

- [ ] **Step 2: Add to page.tsx**

Render `<HowItWorks />` after TrustedBy.

- [ ] **Step 3: Verify in browser**

Three steps should display with icons, connectors, and staggered animation on scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/how-it-works.tsx src/app/page.tsx
git commit -m "feat: add how-it-works 3-step section with connectors"
```

---

### Task 8: Before/After CV Demo

**Files:**
- Create: `src/components/landing/cv-demo.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build CV demo component**

Create `src/components/landing/cv-demo.tsx` as a client component:
- Section title: "See the Difference" (h2)
- Desktop/tablet: side-by-side split using CSS grid `grid-cols-2`
- Mobile (< 768px): shadcn `Tabs` with "Original" and "Tailored" tabs
- **Left panel (Original CV):**
  - Card with header: "Original CV" + Badge "42% — Poor match" (red variant)
  - Render `ORIGINAL_CV` data: name, contact, summary (muted bg), experience entries with bullets, skills tags (default gray)
- **Right panel (Tailored for Stripe):**
  - Card with header: "Tailored for Stripe" + Badge "89% — Strong match" (green) + arrow
  - "AI Changes Made" summary box at top: amber/warning background, 4 bullet items from mock data
  - Render `TAILORED_CV` data: enhanced bullets get green tint background + "Enhanced" marker span
  - Skills: "matched" skills get green bg, "added" skills get blue dashed border
- **Below both panels:** Keyword coverage row — map `KEYWORDS` array to tag badges: green "Found: {text}" or red strikethrough "Missing: {text}"
- Framer Motion `whileInView` fade-in for the whole section

- [ ] **Step 2: Add to page.tsx**

Render `<CVDemo />` after HowItWorks.

- [ ] **Step 3: Verify in browser**

Side-by-side CV comparison on desktop, tabs on mobile. Enhanced bullets highlighted, keyword tags visible.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/cv-demo.tsx src/app/page.tsx
git commit -m "feat: add before/after CV demo with keyword coverage"
```

---

### Task 9: Feature Grid

**Files:**
- Create: `src/components/landing/features.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build features component**

Create `src/components/landing/features.tsx`:
- Section with `id="features"` and `aria-labelledby` heading
- Section title: "Everything You Need to Land the Job" (h2)
- CSS grid: `grid-cols-3` on desktop, `grid-cols-2` on tablet, `grid-cols-1` on mobile
- Map `FEATURES` array to glassmorphism Cards:
  - Dynamically render Lucide icon by name (use a small icon map object)
  - Title (h3), description (p)
  - Hover: `hover:scale-[1.02] hover:border-blue-500/30` with 200ms transition
- Framer Motion staggered fade-in (40ms delay per card) with `whileInView`

- [ ] **Step 2: Add to page.tsx**

Render `<Features />` after CVDemo.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/features.tsx src/app/page.tsx
git commit -m "feat: add 6-feature grid with glassmorphism cards"
```

---

### Task 10: Testimonials

**Files:**
- Create: `src/components/landing/testimonials.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build testimonials component**

Create `src/components/landing/testimonials.tsx`:
- Section title: "What Job Seekers Are Saying" (h2)
- Desktop: 3 cards in flex row with gap
- Mobile: `overflow-x-auto snap-x snap-mandatory` horizontal scroll, each card `snap-center min-w-[85vw]`
- Each card (glassmorphism):
  - Large quote mark " in gradient text (top-left, decorative `aria-hidden="true"`)
  - Quote text
  - Bottom: Avatar (initials circle using shadcn Avatar with fallback) + name + role
- Map `TESTIMONIALS` array
- Framer Motion staggered fade-in with `whileInView`

- [ ] **Step 2: Add to page.tsx**

Render `<Testimonials />` after Features.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/testimonials.tsx src/app/page.tsx
git commit -m "feat: add testimonial cards with mobile scroll snap"
```

---

### Task 11: Pricing Cards

**Files:**
- Create: `src/components/landing/pricing.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build pricing component**

Create `src/components/landing/pricing.tsx`:
- Section with `id="pricing"` and `aria-labelledby` heading
- Section title: "Simple, One-Time Pricing" (h2)
- "Pay once, use forever" Badge centered above cards
- Desktop: 3 cards in flex row, centered. Mobile/tablet: vertical stack.
- Map `PRICING_TIERS` array to Cards:
  - Plan name, price (large), price label ("one-time" or "forever free")
  - Description
  - Feature list: checkmark (Lucide Check, green) for included, dash (Lucide Minus, muted) for excluded
  - CTA Button: gradient fill for highlighted tier, outline for others
  - Highlighted (Pro) card: gradient border (using a wrapper div with gradient bg + inner div with bg-secondary), `lg:scale-105`, "Most Popular" Badge
  - On mobile: remove `scale-105`, keep gradient border
- Framer Motion fade-in with `whileInView`

- [ ] **Step 2: Add to page.tsx**

Render `<Pricing />` after Testimonials.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/pricing.tsx src/app/page.tsx
git commit -m "feat: add 3-tier pricing cards with gradient highlight"
```

---

### Task 12: Final CTA & Footer

**Files:**
- Create: `src/components/landing/final-cta.tsx`
- Create: `src/components/landing/footer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build final CTA component**

Create `src/components/landing/final-cta.tsx`:
- Centered text block with ambient gradient glow background (absolute-positioned radial gradient)
- "Your Next Interview Starts Here." (h2, large)
- Stats row: "12,847 CVs tailored · 89% avg match score · 0 subscriptions" from `SOCIAL_PROOF`
- Large gradient "Get Started Free →" Button
- Framer Motion fade-in with `whileInView`

- [ ] **Step 2: Build footer component**

Create `src/components/landing/footer.tsx`:
- 4-column grid on desktop, 2x2 on tablet, stacked on mobile
- Columns: Product (Features, Pricing), Company (About, Blog), Legal (Privacy, Terms), Connect (Twitter, GitHub, LinkedIn)
- All links `href="#"` with `text-muted` color, `hover:text-white` transition
- Bottom bar with border-top separator: "© 2026 ApplyKit. All rights reserved." + "Built for job seekers"
- `<footer>` semantic element

- [ ] **Step 3: Add both to page.tsx**

Render `<FinalCTA />` after Pricing, then `<Footer />` at the end, outside `<main>`.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/final-cta.tsx src/components/landing/footer.tsx src/app/page.tsx
git commit -m "feat: add final CTA section and footer"
```

---

### Task 13: Polish & Accessibility Pass

**Files:**
- Modify: `src/app/globals.css`
- Modify: multiple component files

- [ ] **Step 1: Add prefers-reduced-motion support**

In `globals.css`, add:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

In components using Framer Motion, wrap motion props in a check:
```tsx
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;
```

Pass empty variants when reduced motion is preferred.

- [ ] **Step 2: Verify heading hierarchy and ARIA landmarks**

Ensure: one `h1` (hero headline), `h2` for each section title, `h3` for card titles only. No skipped levels. Verify every `<section>` element has `aria-labelledby` pointing to its heading's `id`.

- [ ] **Step 3: Verify focus rings**

Tab through the entire page. Every interactive element (buttons, links, textarea) should show `ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900` focus style. Add to `globals.css` if not inherited from shadcn.

- [ ] **Step 4: Verify responsive layouts**

Check at 375px (mobile), 768px (tablet), 1280px (desktop):
- Navbar: hamburger on mobile, full nav on desktop
- Hero: stacked on mobile, 2-col on desktop
- CV Demo: tabs on mobile, side-by-side on desktop
- Features: 1-col mobile, 2-col tablet, 3-col desktop
- Pricing: stacked on mobile/tablet, row on desktop
- Footer: stacked mobile, 2x2 tablet, 4-col desktop

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: accessibility pass — reduced motion, focus rings, heading hierarchy"
```

---

### Task 14: Build Verification

- [ ] **Step 1: Run production build**

```bash
yarn build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run production preview**

```bash
yarn start
```

Open http://localhost:3000 — verify all sections render, animations play, interactive demo works, mobile responsive.

- [ ] **Step 3: Commit any build fixes**

If the build revealed issues, fix and commit:

```bash
git add .
git commit -m "fix: resolve build issues"
```
