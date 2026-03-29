export interface Profile {
  id: string;
  full_name: string | null;
  plan: "free" | "pro" | "pro_plus";
  cv_tailors_used: number;
  cv_tailors_limit: number;
  applications_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  job_description: string | null;
  status: "saved" | "applied" | "phone-screen" | "interview" | "offer" | "rejected" | "accepted";
  match_score: number | null;
  salary_range: string | null;
  location: string | null;
  applied_date: string | null;
  follow_up_date: string | null;
  notes: string | null;
  contact_name: string | null;
  contact_email: string | null;
  board_position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationInput {
  company_name: string;
  job_title: string;
  job_url?: string;
  job_description?: string;
  status?: string;
  match_score?: number;
  salary_range?: string;
  location?: string;
  applied_date?: string;
  notes?: string;
}

export interface ReorderUpdate {
  id: string;
  status: string;
  board_position: number;
}

import type { ParsedCVData } from "@/lib/ai/provider";

export type { ParsedCVData };

export interface BaseCVRecord {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string | null;
  parsed_data: ParsedCVData;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TailoredCVRecord {
  id: string;
  application_id: string | null;
  base_cv_id: string | null;
  tailored_data: ParsedCVData;
  changes_summary: string | null;
  match_score_before: number | null;
  match_score_after: number | null;
  pdf_url: string | null;
  created_at: string;
}

export interface TailorResult {
  original: ParsedCVData;
  tailored: ParsedCVData;
  changes: string[];
  match_score_before: number;
  match_score_after: number;
  keywords_found: string[];
  keywords_missing: string[];
  enhanced_bullets: string[];
  skill_statuses: Array<{ name: string; status: "matched" | "added" | "default" }>;
  extracted_requirements: string[];
}

export interface JobMeta {
  company: string;
  position: string;
  location?: string;
  salary_range?: string;
  job_url?: string;
}
