# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ApplyKit** — AI-powered job application tracker with one-click CV tailoring. A web app combining a Kanban-style job application tracker with an AI engine that tailors a user's base CV to match any job description.

This repository is the **frontend-only** project. Backend is handled in a separate project.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **Drag & Drop:** dnd-kit (for Kanban board)
- **PDF Generation:** @react-pdf/renderer
- **Deployment:** Vercel

## Key Features & Views

1. **Kanban Board** — Drag-and-drop application tracker with columns: Saved, Applied, Phone Screen, Interview, Offer, Rejected, Accepted. Cards show company, title, match score, salary, location, and follow-up reminders.
2. **CV Tailor** — Side-by-side view: original CV (left) vs AI-tailored CV (right). Shows match score improvement, changes summary, keyword coverage, and enhanced bullets.
3. **New Application** — Form to paste job URL or description. Extracts company, position, location, salary, and key requirements. Triggers CV tailoring flow.
4. **Navigation:** Board, Analytics, CV Manager, Settings

## Design Reference

- HTML mockups in `mockups/` define the visual language and UI patterns
- Primary blue: `#3b82f6`, success green: `#10b981`, warning amber: `#f59e0b`
- Font: system font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`)
- Match score color coding: high (green `#d1fae5`), medium (amber `#fef3c7`), low (red `#fee2e2`)

## Data Models

Core entities (see PRD.md §3 and §4.3 for full schemas):
- **Users** — plan (free/pro/pro_plus), usage limits
- **BaseCV** — uploaded CV with parsed JSON data (contact, experience, education, skills)
- **Applications** — company, title, status, match_score, board_position
- **TailoredCVs** — tailored_data, changes_summary, before/after match scores
- **CoverLetters** — content, pdf_url
- **FollowUpReminders** — remind_at, status (pending/sent/snoozed/completed)

## Application Statuses

`saved` → `applied` → `phone_screen` → `interview` → `offer` → `accepted` (or `rejected` at any stage)

## Revenue Model

One-time payments (not subscription). Free tier: 5 active applications, 3 CV tailors/month. Pro ($19): unlimited. Pro+ ($39): + cover letters, LinkedIn optimization, interview prep.
