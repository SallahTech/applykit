# ApplyKit Settings Page — Design Spec

## Overview

Settings page at `/settings` with sidebar tab navigation and 4 sections: Profile, Preferences, Plan & Billing, Account. All data is display-only mock data except the theme toggle which is fully functional (dark/light/system mode with localStorage persistence).

### Deferred Features
- **Profile editing**: Form fields are display-only with disabled inputs. Save button shows coming soon toast.
- **Email notifications**: Toggle exists but shows coming soon toast.
- **Payment/upgrade**: Upgrade buttons show coming soon toast.
- **Account deletion/sign out**: Buttons show coming soon toast.

## Visual System

Inherits existing dark theme. Light mode support is added as part of this feature — the shadcn CSS variables already define both `:root` (light) and `.dark` (dark) color schemes in `globals.css`.

## Tech Stack

Same as existing project plus:
- **Theme context:** React context + localStorage for theme persistence
- **shadcn components:** Switch, Select (install if not present)

## Page Route

`/settings` — settings page with client-side tab navigation.

## Navigation

Update `AppNavbar`: "Settings" link changes from `toast("Coming soon!")` to `<Link href="/settings">` with active styling when `pathname === "/settings"`.

## Layout

- `AppNavbar` at top
- Content area: `pt-[4.5rem]` to clear fixed navbar
- Container: `max-w-5xl mx-auto px-4 py-8`
- **Desktop (md+):** `grid grid-cols-[240px_1fr] gap-8`
  - Left: sidebar tab navigation
  - Right: active section content
- **Mobile (< md):** sidebar becomes horizontal scrollable tabs at top, content below

## Sidebar Navigation

- Container: `bg-slate-800/30 rounded-xl p-2 h-fit sticky top-24`
- 4 tab buttons, each:
  - `w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors`
  - Default: `text-slate-400 hover:text-white hover:bg-slate-800/50`
  - Active: `bg-slate-800 text-white font-medium`
- Tabs:
  1. Profile — `User` icon from lucide-react
  2. Preferences — `Settings` icon (use `SlidersHorizontal` to avoid name conflict)
  3. Plan & Billing — `CreditCard` icon
  4. Account — `Shield` icon

- State: `activeTab: "profile" | "preferences" | "plan" | "account"` (default "profile")

### Mobile Tabs

- `<div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4">`
- Each tab as a pill button: `px-4 py-2 rounded-full text-sm whitespace-nowrap`
- Active: `bg-slate-800 text-white`, default: `bg-slate-800/30 text-slate-400`

## Section 1: Profile

### Content

- **Section header:** `<h2 className="text-lg font-semibold text-white mb-6">Profile</h2>`

- **Avatar area:** `flex items-center gap-4 mb-8`
  - Avatar circle: `w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center`
  - Initials: `text-2xl font-bold text-white` — "AC"
  - Right of avatar:
    - Name: `text-lg font-semibold text-white` — "Alex Chen"
    - "Change photo" link: `text-sm text-blue-400 hover:text-blue-300 cursor-pointer`, onClick: `toast("Coming soon!")`

- **Form fields:** `grid grid-cols-1 sm:grid-cols-2 gap-4`
  - Each field: `<label className="text-xs font-medium text-slate-400 mb-1.5 block">{label}</label>` + disabled Input (`bg-slate-800/40 border-slate-700/50 text-slate-300 disabled:opacity-70`)
  - Full Name: "Alex Chen"
  - Email: "alex@email.com"
  - Location: "San Francisco, CA"
  - LinkedIn: "linkedin.com/in/alexchen"

- **Save button:** `<Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white mt-6" onClick={() => toast("Coming soon!")}>Save Changes</Button>`

## Section 2: Preferences

### Content

- **Section header:** `<h2 className="text-lg font-semibold text-white mb-6">Preferences</h2>`

- **Follow-up Reminders** subsection:
  - Subsection label: `text-sm font-medium text-white mb-3`
  - "Default reminder interval" — label + shadcn Select with options:
    - "3 days", "7 days" (default), "14 days"
    - Actually updates local state (`reminderDays`)
    - Select styled dark: trigger has `bg-slate-800/40 border-slate-700/50 text-slate-300`
  - "Email notifications" — label + description + shadcn Switch
    - Description: `text-xs text-slate-500` — "Receive email reminders for follow-ups"
    - Switch toggles local state but also shows `toast("Coming soon! Email notifications are in development.")`

- **Theme** subsection:
  - Subsection label: `text-sm font-medium text-white mb-3` — "Theme"
  - 3-option segmented control (custom, not shadcn):
    - Container: `flex bg-slate-800/60 rounded-xl p-1 w-fit`
    - Each option: `px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer`
    - Active: `bg-slate-700 text-white shadow-sm`
    - Default: `text-slate-400 hover:text-white`
    - Options: "Dark" (Moon icon), "Light" (Sun icon), "System" (Monitor icon)
  - **Functional:** Calls `setTheme()` from ThemeProvider context. Changes apply immediately.

- **Display** subsection:
  - "Match score format" — label + segmented control ("Percentage" / "Score"). Coming soon toast on change.
  - "Default board view" — label + segmented control ("Kanban" / "List"). Coming soon toast on change.

## Section 3: Plan & Billing

### Content

- **Section header:** `<h2 className="text-lg font-semibold text-white mb-6">Plan & Billing</h2>`

- **Current plan card:** `rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 mb-6`
  - Header row: "Free Plan" badge (`bg-slate-700/60 text-slate-300 text-xs px-3 py-1 rounded-full`) + "Current" label
  - Usage stats:
    - "Active applications" — `text-sm text-slate-300 mb-1` — "3 of 5 used"
      - Progress bar: `h-2 bg-slate-800 rounded-full` track, `bg-blue-500 rounded-full` fill at 60% width
    - "CV tailors this month" — "1 of 3 used"
      - Progress bar fill at 33% width
  - Small text: `text-xs text-slate-500 mt-3` — "Resets on the 1st of each month"

- **Upgrade cards:** `grid grid-cols-1 sm:grid-cols-2 gap-4`
  - **Pro card:** `rounded-xl border border-blue-500/30 bg-blue-500/5 p-6`
    - "Pro" — `text-lg font-bold text-white`
    - "$19" — `text-3xl font-extrabold text-white` + "one-time" label
    - Feature list (3-4 items): check icon + text
    - "Upgrade to Pro" gradient button → `toast("Coming soon!")`
  - **Pro+ card:** `rounded-xl border border-purple-500/30 bg-purple-500/5 p-6`
    - Same structure, "$39", "Upgrade to Pro+"
    - Additional features: cover letters, LinkedIn optimization, interview prep

## Section 4: Account

### Content

- **Section header:** `<h2 className="text-lg font-semibold text-white mb-6">Account</h2>`

- **Sign out:** `<Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => toast("Coming soon!")}>Sign Out</Button>`

- **Danger zone:** `mt-8 rounded-xl border border-red-500/20 bg-red-500/5 p-6`
  - Title: `text-sm font-semibold text-red-400 mb-2` — "Danger Zone"
  - Warning: `text-xs text-slate-400 mb-4` — "Once you delete your account, there is no going back. Please be certain."
  - "Delete Account" button: `<Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => toast("Coming soon!")}>Delete Account</Button>`

## Theme Implementation

### ThemeProvider

Create `src/components/theme-provider.tsx`:

- React context providing `{ theme: "dark" | "light" | "system", setTheme: (theme) => void }`
- On mount: read from `localStorage.getItem("applykit-theme")`, default to `"dark"`
- When theme changes:
  - Store in `localStorage`
  - If `"system"`: check `window.matchMedia("(prefers-color-scheme: dark)")` and apply accordingly. Listen for changes.
  - If `"dark"`: add `dark` class to `document.documentElement`
  - If `"light"`: remove `dark` class from `document.documentElement`
- Export `useTheme()` hook for consuming the context

### Root Layout Integration

Wrap `{children}` in `<ThemeProvider>` in `src/app/layout.tsx`. The `<html>` element already has `className="dark"` — the ThemeProvider will manage this class dynamically.

### Light Mode CSS

The existing `globals.css` already has `:root` (light) and `.dark` (dark) CSS variable definitions from shadcn. When the `dark` class is removed, the light theme activates automatically.

Additional light mode adjustments needed in `globals.css`:
- Body background: light mode should use `--background` variable instead of hardcoded `#0f172a`
- Update the `@layer base` body rule to use CSS variables instead of hardcoded dark colors

## Accessibility

- Sidebar tabs: proper button roles, aria-selected on active tab
- Form inputs: visible labels
- Switch: shadcn Switch has built-in accessibility
- Theme segmented control: radio group semantics with `role="radiogroup"` and `role="radio"` + `aria-checked`
- Focus rings on all interactive elements
- Color contrast meets WCAG AA in both themes

## Responsive Breakpoints

| Breakpoint | Adaptation |
|------------|------------|
| Mobile (< 768px) | Horizontal pill tabs at top, single column form fields, stacked upgrade cards |
| Desktop (≥ 768px) | Sidebar + main panel layout, 2-column form grid |

## Component Mapping (shadcn/ui)

| Area | shadcn Components |
|------|-------------------|
| Sidebar | — (custom buttons) |
| Profile | Input, Button, Avatar |
| Preferences | Select, Switch, Button |
| Plan | Button, Badge |
| Account | Button |

## File Structure

```
src/
  app/
    layout.tsx              — (modify) wrap in ThemeProvider
    settings/
      page.tsx              — Settings page orchestrator
  components/
    app-navbar.tsx          — (modify) Settings link → /settings
    theme-provider.tsx      — ThemeProvider context + useTheme hook
    settings/
      settings-sidebar.tsx  — Sidebar tab navigation
      profile-section.tsx   — Profile form
      preferences-section.tsx — Preferences with theme toggle
      plan-section.tsx      — Plan & billing with upgrade CTAs
      account-section.tsx   — Sign out + danger zone
  app/
    globals.css             — (modify) update body styles for theme support
```

## New shadcn Components Needed

```bash
npx shadcn@latest add switch select
```
