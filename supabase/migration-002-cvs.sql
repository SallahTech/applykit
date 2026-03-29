-- ============================================
-- ApplyKit Migration 002: Base CVs & Tailored CVs
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Base CVs table
CREATE TABLE IF NOT EXISTS base_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  parsed_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_base_cvs_user_id ON base_cvs(user_id);

-- Tailored CVs table
CREATE TABLE IF NOT EXISTS tailored_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  base_cv_id UUID REFERENCES base_cvs(id),
  tailored_data JSONB NOT NULL,
  changes_summary TEXT,
  match_score_before INTEGER,
  match_score_after INTEGER,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tailored_cvs_application_id ON tailored_cvs(application_id);

-- Add new columns to applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS extracted_requirements JSONB;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tailored_cv_id UUID REFERENCES tailored_cvs(id);

-- RLS Policies for base_cvs
ALTER TABLE base_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own base CVs" ON base_cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own base CVs" ON base_cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own base CVs" ON base_cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own base CVs" ON base_cvs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tailored_cvs
ALTER TABLE tailored_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tailored CVs"
  ON tailored_cvs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM applications WHERE applications.id = tailored_cvs.application_id AND applications.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own tailored CVs"
  ON tailored_cvs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM applications WHERE applications.id = application_id AND applications.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own tailored CVs"
  ON tailored_cvs FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM applications WHERE applications.id = tailored_cvs.application_id AND applications.user_id = auth.uid()
  ));
