# Product Requirements Document: Job Tracker + AI CV Tailor

## 1. Overview

### 1.1 Product Name
**ApplyKit** — AI-powered job application tracker with one-click CV tailoring.

### 1.2 Problem Statement
Job seekers apply to dozens of positions but lack a system to track applications, follow up at the right time, and customize their resume for each role. Most use messy spreadsheets or nothing at all. The result: missed follow-ups, generic resumes that don't pass ATS filters, and a disorganized, demoralizing job search.

The pain compounds because every job listing emphasizes different keywords, skills, and requirements — yet most people submit the same generic CV everywhere.

### 1.3 Solution
ApplyKit is a web app that combines a Kanban-style job application tracker with an AI engine that instantly tailors the user's base CV to match any job description. Paste a job URL or description → get a tailored CV in seconds → track the application through your pipeline.

### 1.4 Target Customer
- **Primary:** Active job seekers applying to 10+ jobs per month (tech, marketing, finance, design roles)
- **Secondary:** Career coaches managing multiple clients' job searches
- **Persona:** "Alex" — a mid-level software developer applying to 30+ companies. He has a strong background but his generic resume gets filtered out. He loses track of which companies he's applied to, forgets to follow up, and can't remember which version of his resume he sent where.

### 1.5 Revenue Model
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 5 active applications, 3 CV tailors/month, basic tracker |
| Pro | $19 one-time | Unlimited applications, unlimited CV tailoring, follow-up reminders, analytics |
| Pro+ | $39 one-time | Everything in Pro + cover letter generation, LinkedIn optimization, interview prep notes |

**One-time payment model** — lower friction, no subscription fatigue. Target: $500 in month 1 → 14-26 purchases.

### 1.6 Success Metrics
- Month 1: 500+ signups, 26+ paid conversions, $500+ revenue
- Month 3: 2,000+ users, 15% free-to-paid conversion rate
- AI CV match score improvement: >85% keyword match on average
- User engagement: >60% of users log in at least 2x/week during active job search

---

## 2. User Stories

### 2.1 Core User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|-----------|----------|
| US-01 | Job seeker | Upload my base CV (PDF/DOCX) | The system has my experience to work with | P0 |
| US-02 | Job seeker | Paste a job description or URL | The AI can analyze the requirements | P0 |
| US-03 | Job seeker | Get a tailored CV matching the job description | My resume passes ATS filters and highlights relevant experience | P0 |
| US-04 | Job seeker | Download the tailored CV as PDF | I can submit it to the application | P0 |
| US-05 | Job seeker | Track all my applications on a Kanban board | I see my pipeline at a glance | P0 |
| US-06 | Job seeker | Move applications through stages (Applied → Interview → Offer → etc.) | I stay organized | P0 |
| US-07 | Job seeker | Get follow-up reminders | I don't miss opportunities by not following up | P1 |
| US-08 | Job seeker | See which CV version I sent to each company | I can prepare for interviews with the right context | P1 |
| US-09 | Job seeker | See a match score between my CV and job description | I know how well my experience fits before applying | P1 |
| US-10 | Job seeker | Generate a tailored cover letter | I have a complete application package | P2 |
| US-11 | Job seeker | See analytics on my job search | I understand my funnel and can improve | P1 |
| US-12 | Job seeker | Save job descriptions for later | I can batch my applications | P1 |

### 2.2 User Flow: CV Tailoring
1. User uploads base CV (one-time, stored in profile)
2. User clicks "New Application" → pastes job URL or description
3. System extracts job requirements, keywords, and skills
4. AI generates a tailored CV emphasizing matching experience and using job-specific keywords
5. User previews the tailored CV side-by-side with original
6. User can edit any section before downloading
7. Download as PDF → application automatically added to tracker board
8. Follow-up reminder set for 7 days (configurable)

---

## 3. Feature Specifications

### 3.1 CV Upload & Parsing
**Description:** Extracts structured data from the user's uploaded CV.

**Technical Details:**
- Accept PDF and DOCX uploads (max 5MB)
- Parse with a combination of pdf-parse/mammoth.js for text extraction + AI structuring
- Extract: contact info, work experience (company, title, dates, bullets), education, skills, certifications
- Store as structured JSON for easy AI manipulation
- User can manually edit parsed data if extraction isn't perfect

**Data Model:**
```
BaseCV {
  id: UUID
  user_id: FK -> Users
  raw_file_url: string (S3/R2)
  parsed_data: JSONB {
    contact: { name, email, phone, location, linkedin }
    summary: string
    experience: [{
      company: string
      title: string
      start_date: string
      end_date: string
      bullets: string[]
    }]
    education: [{
      institution: string
      degree: string
      year: string
    }]
    skills: string[]
    certifications: string[]
  }
  created_at: datetime
  updated_at: datetime
}
```

### 3.2 Job Description Analyzer
**Description:** Extracts requirements and keywords from job postings.

**Technical Details:**
- Accept: raw text paste OR URL (scrape with Cheerio/Puppeteer)
- AI extracts: required skills, preferred skills, years of experience, key responsibilities, company name, job title, location, salary range (if listed)
- Generate keyword list ranked by importance (based on frequency and placement in the JD)
- Calculate initial match score against user's base CV

### 3.3 AI CV Tailoring Engine
**Description:** The core value proposition — transforms a generic CV into a targeted one.

**Technical Details:**
- Use Claude Sonnet or GPT-4o for high-quality text generation
- Input: user's parsed CV data + extracted job requirements
- Process:
  1. Identify overlapping skills/experience between CV and JD
  2. Rewrite summary to target this specific role
  3. Reorder and rewrite experience bullets to emphasize relevant achievements
  4. Add missing keywords naturally into existing bullet points
  5. Adjust skills section to front-load matching skills
  6. Generate match score (% of key requirements addressed)
- Output: tailored CV as structured JSON → rendered to PDF using react-pdf or Puppeteer

**Constraints:**
- Never fabricate experience or skills the user doesn't have
- Never remove jobs or education — only reorder and rewrite bullets
- Maintain truthfulness while maximizing keyword relevance
- Include a "changes made" summary so user sees what was modified

### 3.4 Application Tracker (Kanban Board)
**Description:** Visual pipeline for managing job applications.

**Columns (default, customizable):**
1. **Saved** — Jobs bookmarked for later
2. **Applied** — Application submitted
3. **Phone Screen** — First contact/recruiter call
4. **Interview** — Technical or on-site interview
5. **Offer** — Received an offer
6. **Rejected** — Application rejected at any stage
7. **Accepted** — Offer accepted

**Card Data:**
```
Application {
  id: UUID
  user_id: FK -> Users
  company_name: string
  job_title: string
  job_url: string
  job_description: text
  status: enum (column names above)
  tailored_cv_id: FK -> TailoredCVs
  cover_letter_id: FK -> CoverLetters (nullable)
  salary_range: string (nullable)
  location: string
  applied_date: date
  follow_up_date: date
  notes: text
  contact_name: string (nullable)
  contact_email: string (nullable)
  match_score: integer (0-100)
  created_at: datetime
  updated_at: datetime
}
```

### 3.5 Follow-Up Reminder System
**Description:** Automated reminders to follow up on applications.

**Rules:**
- Default: remind 7 days after applying if no status change
- Configurable per-application or globally (3, 7, 14 days)
- Email notification with one-click snooze or "mark as contacted"
- Smart suggestions: "It's been 10 days since you applied to Stripe. Here's a follow-up email template."

### 3.6 Job Search Analytics
**Description:** Dashboard showing funnel metrics.

**Metrics:**
- Total applications by status (funnel visualization)
- Response rate (% of applications that moved past "Applied")
- Average time from Applied → first response
- Most common rejection stage
- Applications per week trend
- Top skills from job descriptions (word cloud)

---

## 4. Technical Architecture

### 4.1 Tech Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 14 + Tailwind CSS + dnd-kit | Drag-and-drop Kanban, fast SSR |
| Backend | Next.js API Routes | Simple, unified codebase |
| Database | PostgreSQL (Supabase) | Relational data, auth, storage |
| Auth | Supabase Auth (Google + email) | Quick setup, good free tier |
| AI | Claude API (Sonnet) or OpenAI GPT-4o | High quality CV rewriting |
| PDF Generation | @react-pdf/renderer | Server-side PDF from React components |
| File Storage | Supabase Storage / Cloudflare R2 | CV uploads and generated PDFs |
| Payments | Lemon Squeezy or Stripe | One-time payments, simple checkout |
| Email | Resend | Follow-up reminders |
| Hosting | Vercel | Zero-config deployment |

### 4.2 System Architecture
```
┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│  User Upload │     │              │     │   PostgreSQL     │
│  (CV PDF)    │────▶│  Next.js App │────▶│   (Supabase)     │
│              │     │  (Vercel)    │     │                  │
│  Job URL/    │────▶│              │     │  File Storage    │
│  Description │     └──────┬───────┘     │  (R2/Supabase)   │
└──────────────┘            │             └─────────────────┘
                     ┌──────┴───────┐
                     │              │
               ┌─────▼─────┐ ┌─────▼─────┐
               │  Claude /  │ │  Lemon    │
               │  OpenAI    │ │  Squeezy  │
               │  API       │ │  Payments │
               └───────────┘ └───────────┘
                     │
               ┌─────▼─────┐
               │  react-pdf │
               │  (PDF Gen) │
               └───────────┘
                     │
               ┌─────▼─────┐
               │  Resend    │
               │  (email)   │
               └───────────┘
```

### 4.3 Database Schema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  plan VARCHAR(20) DEFAULT 'free', -- free, pro, pro_plus
  payment_id VARCHAR(255), -- Lemon Squeezy order ID
  cv_tailors_used INTEGER DEFAULT 0,
  cv_tailors_limit INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE base_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  parsed_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_url TEXT,
  job_description TEXT,
  extracted_requirements JSONB, -- parsed job requirements
  status VARCHAR(30) DEFAULT 'saved',
  match_score INTEGER,
  salary_range VARCHAR(100),
  location VARCHAR(255),
  applied_date DATE,
  follow_up_date DATE,
  notes TEXT,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  board_position INTEGER DEFAULT 0, -- ordering within column
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tailored_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  base_cv_id UUID REFERENCES base_cvs(id),
  tailored_data JSONB NOT NULL,
  changes_summary TEXT, -- what was modified
  match_score_before INTEGER,
  match_score_after INTEGER,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE follow_up_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, snoozed, completed
  snoozed_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.4 API Endpoints
```
POST   /api/auth/signup                — Register with email or Google
POST   /api/cv/upload                  — Upload base CV (PDF/DOCX)
GET    /api/cv/parsed                  — Get parsed CV data
PUT    /api/cv/parsed                  — Edit parsed CV data manually

POST   /api/applications               — Create new application (with JD)
GET    /api/applications               — List all applications (grouped by status)
PATCH  /api/applications/:id           — Update application (status, notes, etc.)
DELETE /api/applications/:id           — Delete application

POST   /api/applications/:id/tailor    — Generate tailored CV for this application
GET    /api/applications/:id/cv        — Get tailored CV data
GET    /api/applications/:id/cv/pdf    — Download tailored CV as PDF

POST   /api/applications/:id/cover-letter  — Generate cover letter
GET    /api/stats                      — Job search analytics

POST   /api/webhooks/lemonsqueezy      — Payment webhook
```

---

## 5. Go-to-Market Strategy

### 5.1 Distribution Channels
- **Reddit:** Post in r/jobs, r/cscareerquestions, r/resumes — show before/after CV comparisons, share the free tier
- **LinkedIn:** Create content about job search tips, link to tool. Target "open to work" users
- **Product Hunt:** Launch day push for initial traction
- **Twitter/X:** Build in public thread documenting the build process
- **Job seeker Discord servers:** Share free tier, provide genuine value
- **University career centers:** Offer free access for students

### 5.2 Content Marketing
- Blog: "How to Pass ATS Filters in 2026" → link to tool
- Free resource: "50 Power Verbs for Tech Resumes" (PDF lead magnet)
- YouTube: "I Applied to 50 Jobs with an AI-Tailored Resume — Here's What Happened"

### 5.3 Conversion Strategy
- Generous free tier (5 applications, 3 tailors) lets users experience the value
- Show match score improvement: "Your CV went from 42% match to 89% match" → triggers upgrade
- One-time payment removes subscription objection ("I'm only job searching for 2 months")
- Social proof: display counter of CVs tailored ("12,847 CVs tailored this month")

---

## 6. Development Milestones

### Phase 1: MVP (Week 1-2) — Target: Launch free tier
- [ ] Auth setup (Supabase, Google OAuth)
- [ ] CV upload + parsing pipeline
- [ ] Job description paste + analysis
- [ ] AI CV tailoring (core engine)
- [ ] PDF preview and download
- [ ] Basic application tracker (list view)
- [ ] Landing page with demo

### Phase 2: Full Product (Week 3-4) — Target: Paid conversions
- [ ] Kanban board with drag-and-drop
- [ ] Match score visualization
- [ ] Follow-up reminder system
- [ ] Payment integration (Lemon Squeezy)
- [ ] Side-by-side CV comparison view
- [ ] Job search analytics dashboard
- [ ] Product Hunt launch

### Phase 3: Growth (Month 2-3)
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization suggestions
- [ ] Interview prep notes (based on JD + your experience)
- [ ] Chrome extension: "Tailor CV" button on job listing sites
- [ ] Career coach multi-client dashboard
- [ ] Browser extension for one-click job saving from LinkedIn/Indeed

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI generates inaccurate CV content | Medium | High | Always show "changes made" diff; user reviews before download |
| Job URL scraping blocked by sites | High | Medium | Fallback to manual paste; most users are fine pasting JD text |
| Low conversion from free to paid | Medium | High | Limit free tier enough to demonstrate value but create friction |
| PDF formatting issues | Medium | Medium | Use react-pdf with tested templates; offer multiple formats |
| Competition from LinkedIn's AI features | Low | Medium | Focus on cross-platform tracking and superior CV quality |

---

## 8. UI Reference

See the `mockups/` folder for visual references:
- `mockups/kanban-board.html` — Application tracker with drag-and-drop columns
- `mockups/cv-tailor.html` — Side-by-side CV tailoring view with match score
- `mockups/new-application.html` — New application flow with job description input
