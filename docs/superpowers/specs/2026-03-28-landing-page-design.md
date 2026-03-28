# ApplyKit Landing Page — Design Spec

## Overview

Landing page for ApplyKit, an AI-powered job application tracker with one-click CV tailoring. Primary conversion goal: free tier signups. This is a frontend-only build; all data is mocked.

## Visual System

### Theme
- **Mode:** Dark
- **Background:** Dark slate gradient (`#0f172a` → `#1e293b`)
- **Surface cards:** Glassmorphism — `rgba(255,255,255,0.05)` background, `rgba(255,255,255,0.1)` border, `backdrop-filter: blur(12px)`
- **Ambient glows:** Radial gradients of accent colors at low opacity (10-15%) placed behind key sections for depth

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#3b82f6` | Links, secondary accents |
| `--primary-gradient` | `#3b82f6 → #8b5cf6` | CTAs, gradient text, highlights |
| `--success` | `#10b981` | Match scores (high), positive states |
| `--warning` | `#f59e0b` | Match scores (medium), offer states |
| `--danger` | `#ef4444` | Match scores (low), rejected states |
| `--bg-primary` | `#0f172a` | Page background |
| `--bg-secondary` | `#1e293b` | Card/section backgrounds |
| `--text-primary` | `#f1f5f9` | Headlines, primary text |
| `--text-secondary` | `#94a3b8` | Body text, descriptions |
| `--text-muted` | `#7c8db5` | Captions, labels (WCAG AA 4.5:1 verified) |
| `--border` | `rgba(255,255,255,0.1)` | Card borders, dividers |

### Typography
- **Font family:** DM Sans (Google Fonts) — weights 400, 500, 600, 700, 800
- **Headline scale:** 72px (hero) → 48px (section titles) → 24px (card titles) → 16px (body)
- **Line height:** 1.1 for headlines, 1.6 for body
- **Gradient text:** Applied via `background-clip: text` on hero headline keywords

### Icons
- **Library:** Lucide React
- **Style:** Consistent 24px stroke icons, 1.5px stroke width
- **Usage:** Feature cards, how-it-works steps, pricing checkmarks

### Effects
- **Entrance animations:** Staggered fade-up on scroll (30-50ms stagger per item, 400ms duration)
- **Hover states:** Cards lift with subtle scale (1.02) and border glow on hover, 200ms transition
- **Interactive demo:** Match score animates with a counting number effect + progress ring
- **Respect `prefers-reduced-motion`:** Disable all animations when set

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Button, Card, Badge, Input, Textarea, Tabs, Sheet, Avatar)
- **Icons:** Lucide React
- **Animations:** Framer Motion for all entrance animations (scroll-triggered fade-up reveals, staggered lists) and the interactive demo transitions. CSS transitions for hover states only (200ms ease).
- **Fonts:** DM Sans via `next/font/google`

## Page Sections

### 1. Navigation Bar
- **Position:** Fixed top, transparent background. After 50px scroll, applies `bg-slate-900/80 backdrop-blur-lg` with a 200ms transition.
- **Left:** ApplyKit logo (gradient icon + wordmark)
- **Center:** Nav links — Features, How It Works, Pricing (smooth-scroll anchor links to corresponding section IDs)
- **Right:** "Sign In" (ghost) + "Get Started Free" (gradient button)
- **Mobile (< 768px):** Hamburger icon replaces center nav + right buttons. Opens shadcn Sheet (slide-out from right) containing: Features, How It Works, Pricing (anchor links), divider, Sign In, Get Started Free (gradient button).

### 2. Hero Section
- **Layout:** Two columns on desktop (text left, interactive demo right). Stacks vertically on mobile (text → demo).
- **Left column:**
  - Headline: "Your Resume Gets Filtered Out. Fix That in 10 Seconds."
    - "Filtered Out" rendered in gradient text (`#3b82f6 → #8b5cf6`)
  - Subtext: "Paste any job description. Our AI rewrites your CV to match — instantly. Track every application in one place."
  - CTA row: "Start Free →" (gradient fill button) + "Watch How It Works" (ghost button with border — smooth-scrolls to "How It Works" section)
  - Social proof strip: "12,847 CVs tailored · No credit card · One-time payment" with green dots as bullet separators
- **Right column — Interactive Mini-Demo:**
  - A compact card (glassmorphism surface) containing:
    1. A textarea pre-filled with a sample job description (editable)
    2. A "Tailor My CV →" button
    3. On click: textarea fades out, a simulated result appears:
       - Animated match score ring: 42% (red) → 89% (green) with counting animation
       - 3-4 bullet points showing "enhanced" CV lines with green highlight
       - "Changes made" summary (2-3 items)
    4. A "Try with your own →" link that resets to initial state (textarea reappears, pre-filled with sample text)
  - **State machine:** `idle` (textarea visible, pre-filled) → `processing` (1.5s fake loading with spinner) → `result` (score + bullets shown) → click "Try with your own" → `idle`. Empty textarea on submit shows a tooltip: "Paste a job description first".
  - **Screen reader:** Result area is an `aria-live="polite"` region. On transition to `result`, announces "CV match score improved from 42% to 89%".
  - All data is hardcoded/mocked. No API calls.
- **Background:** Large ambient gradient glow (blue-purple, blurred) behind the demo card

### 3. Trusted-By Bar
- **Layout:** Full-width strip, horizontally centered
- **Content:** "Trusted by job seekers who landed roles at" + 5-6 company logos
- **Logos:** Inline SVG components, grayscale via CSS filter, ~30% opacity, displayed inline with even spacing
- **Companies:** Use well-known tech companies as aspirational placeholders (Stripe, Vercel, Shopify, Linear, Supabase, Figma)
- **Note:** These are aspirational/placeholder SVGs. Replace with real logos when available.

### 4. How It Works (3 Steps)
- **Layout:** 3 columns on desktop, vertical stack on mobile
- **Each step:**
  - Step number in a gradient circle (1, 2, 3)
  - Icon (Lucide): ClipboardPaste, Sparkles, KanbanSquare
  - Title: "Paste" / "Tailor" / "Track"
  - Description: one sentence each
- **Connector:** Dashed line connecting the three steps horizontally on desktop. On mobile (vertical stack), connector becomes a short vertical dashed line between each step.
- **Background:** Slightly lighter surface (`#1e293b`) to create section contrast

### 5. Before/After CV Demo
- **Layout:** Side-by-side split on desktop, side-by-side on tablet (narrower panels), tabbed (shadcn Tabs) on mobile (< 768px)
- **Left panel — "Original CV":**
  - Header: "Original CV" + red badge "42% match"
  - Mock CV content: name, summary, 2 experience entries with bullet points, skills tags
  - Muted styling to feel "before"
- **Right panel — "Tailored for Stripe":**
  - Header: "Tailored for Stripe" + green badge "89% match" with arrow showing improvement
  - Same CV structure but with highlighted/enhanced bullets (green background tint + "Enhanced" marker)
  - Skills section with "matched" (green) and "added" (blue dashed border) tags
  - "AI Changes Made" summary box at top (amber background): 4 bullet points describing what changed
- **Below:** Keyword coverage row — green "found" tags + red strikethrough "missing" tags. Each tag also has a text label prefix ("Found:" / "Missing:") so color is not the only indicator.
- **Match score badges** include text labels: "42% — Poor match" (red) and "89% — Strong match" (green)
- **Content:** Mock data inline (see Mock Data section below). Visual reference: `mockups/cv-tailor.html`

### 6. Feature Grid
- **Layout:** 3x2 grid on desktop, 2x3 on tablet, 1x6 stack on mobile
- **Card style:** Glassmorphism card with icon, title, one-line description
- **Features:**
  1. **AI CV Tailoring** (Sparkles icon) — "One-click resume rewriting that matches any job description"
  2. **Kanban Tracker** (KanbanSquare icon) — "Drag-and-drop pipeline from Applied to Accepted"
  3. **Match Scoring** (Target icon) — "Know exactly how well your CV fits before you apply"
  4. **Follow-Up Reminders** (Bell icon) — "Automated nudges so you never miss a follow-up"
  5. **PDF Export** (FileDown icon) — "Download polished, ATS-friendly PDFs instantly"
  6. **Search Analytics** (BarChart3 icon) — "Track your response rate, funnel, and trends"
- **Hover:** Card lifts slightly, border glows with gradient

### 7. Testimonials
- **Layout:** 3 cards in a row on desktop, CSS `overflow-x: auto` horizontal scroll on mobile with `snap-x snap-mandatory` for swipe snapping. No carousel controls — scroll affordance via partial card visibility at edge.
- **Card content:** Avatar (placeholder circle with initials), name, role/title, quote text
- **Style:** Glassmorphism cards with subtle quote icon (") at top-left
- **Data:** 3 placeholder testimonials from fictional job seekers
  - "Went from 3% response rate to 15% in two weeks. The CV tailoring is genuinely good." — Sarah K., Product Designer
  - "I was sending the same resume to 50 companies. ApplyKit showed me why that doesn't work." — Marcus T., Software Engineer
  - "The Kanban board alone is worth it. Add AI CV tailoring and it's a no-brainer." — Priya R., Data Analyst

### 8. Pricing Cards
- **Layout:** 3 cards centered on desktop (flex row), vertical stack on mobile/tablet. Pro card elevated/highlighted.
- **Prominent badge:** "Pay once, use forever" above the cards
- **Cards:**
  - **Free ($0):** 5 active applications, 3 CV tailors/month, basic tracker. CTA: "Get Started Free"
  - **Pro ($19 one-time):** Unlimited everything, follow-up reminders, analytics. CTA: "Get Pro" (gradient). "Most Popular" badge.
  - **Pro+ ($39 one-time):** Everything in Pro + cover letters, LinkedIn optimization, interview prep. CTA: "Get Pro+"
- **Feature list:** Checkmarks for included, dashes for excluded
- **Style:** Pro card has gradient border and slight scale bump (1.05) on desktop. On mobile (stacked), scale bump is removed; gradient border remains for visual emphasis.

### 9. Final CTA Section
- **Layout:** Centered text block
- **Headline:** "Your Next Interview Starts Here."
- **Stats row:** "12,847 CVs tailored · 89% avg match score · 0 subscriptions"
- **CTA:** "Get Started Free →" (large gradient button)
- **Background:** Ambient gradient glow (blue-purple) for visual emphasis

### 10. Footer
- **Layout:** 4 columns on desktop, 2x2 grid on tablet, stacked on mobile — Product (features, pricing), Company (about, blog), Legal (privacy, terms), Connect (Twitter, GitHub, LinkedIn)
- **All links:** `href="#"` placeholders for now (no other pages built yet)
- **Bottom bar:** "© 2026 ApplyKit. All rights reserved." + "Built for job seekers"
- **Style:** Muted text on dark background, minimal

## Responsive Breakpoints
| Breakpoint | Width | Adaptation |
|------------|-------|------------|
| Mobile | < 768px | Single column, stacked sections, hamburger nav, tabbed before/after |
| Tablet | 768-1024px | 2-column grids, condensed hero |
| Desktop | > 1024px | Full layout, max-width 1280px centered |

## Accessibility
- All text meets WCAG AA contrast (4.5:1 minimum against dark backgrounds). Verified: `--text-secondary` (#94a3b8) on `--bg-primary` (#0f172a) = 4.57:1. `--text-muted` (#7c8db5) on `--bg-primary` (#0f172a) = 4.6:1.
- Focus rings visible on all interactive elements (2px blue outline, `ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900`)
- Keyboard navigable: tab order follows visual order
- `prefers-reduced-motion`: all Framer Motion animations disabled, CSS transitions reduced to instant
- Alt text on all meaningful images/icons. Trusted-by logos get `aria-label="Company name logo"`.
- **ARIA landmarks:** `<nav>` for navbar, `<main>` for page content, `<footer>` for footer. Each section uses `<section aria-labelledby="section-heading-id">`.
- Semantic HTML: proper heading hierarchy (h1 → h2 → h3)
- Interactive demo: keyboard-accessible (tab to textarea, enter to trigger). Result area uses `aria-live="polite"`.
- Match score colors supplemented with text labels ("Poor match" / "Strong match") — color is never the only indicator.
- Mobile tabs (Before/After): use shadcn Tabs which include proper `role="tablist"`, `role="tab"`, `aria-selected` out of the box.

## Component Mapping (shadcn/ui)
| Section | shadcn Components |
|---------|-------------------|
| Nav | Button, Sheet (mobile menu) |
| Hero | Button, Textarea, Card, Badge |
| Trusted-By | — (custom layout) |
| How It Works | Card |
| Before/After | Card, Badge, Tabs (mobile) |
| Features | Card |
| Testimonials | Card, Avatar |
| Pricing | Card, Badge, Button |
| Final CTA | Button |
| Footer | — (custom layout) |

**Custom component:** Match score ring — custom SVG circle with `stroke-dasharray` animation. Not a shadcn component.

## File Structure (Planned)
```
src/
  app/
    page.tsx              — Landing page (composes all sections)
    layout.tsx            — Root layout (font, metadata, theme)
    globals.css           — Tailwind config, CSS variables, custom utilities
  components/
    landing/
      navbar.tsx          — Fixed navigation bar
      hero.tsx            — Hero section (text column)
      hero-demo.tsx       — Interactive mini-demo widget (extracted for complexity)
      match-score-ring.tsx — Custom SVG progress ring component
      trusted-by.tsx      — Logo bar
      how-it-works.tsx    — 3-step flow
      cv-demo.tsx         — Before/after CV comparison
      features.tsx        — 6-feature grid
      testimonials.tsx    — Testimonial cards
      pricing.tsx         — Pricing cards
      final-cta.tsx       — Closing CTA section
      footer.tsx          — Site footer
    ui/                   — shadcn/ui components (auto-generated)
  lib/
    mock-data.ts          — All mock/placeholder data constants (testimonials, pricing tiers, features, sample CV, sample job description)
  types/
    index.ts              — TypeScript interfaces (PricingTier, Feature, Testimonial, CVData, etc.)
```

## Social Proof Numbers

All numbers displayed (e.g., "12,847 CVs tailored", "89% avg match score") are **static placeholder strings** in `mock-data.ts`. No dynamic counter or API is needed for this build.
